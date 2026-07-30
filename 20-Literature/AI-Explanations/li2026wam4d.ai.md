---
type: ai-explanation
title: "WAM4D: Fast 4D World Action Model via Spatial Register Tokens"
citekey: li2026wam4d
source: "[[li2026wam4d]]"
my_note: "[[li2026wam4d.my.demo]]"
project: world-model
verified: false
my_note_done: false
created: 2026-07-30
tags:
  - paper/ai-explanation
---

# 论文定位

WAM4D 的核心不是在部署时显式生成完整 4D 场景，而是把未来深度预测变成一个**训练期辅助 readout**：spatial register tokens 从 causal history-video features 中读取足以预测未来深度的信息，深度损失再反向塑造共享 video-action backbone。部署时整个几何分支被移除。

因此，更精确的定位是：

> 一个通过训练期未来深度蒸馏增强空间表征、但部署接口仍是 RGB history → action chunk 的 causal World Action Model。

这一点由方法描述和训练/推理图明确支持：register、depth blocks、geometric head 只在训练路径存在，默认部署只生成动作。[[li2026wam4d.pdf#page=2|PDF p.2]] [[li2026wam4d.pdf#page=6|PDF p.6]]

# 问题设定

## 作者认为现有方法缺什么

普通 WAM 在 2D RGB 或 latent 空间中生成未来视频并预测动作。视觉上“像真的”并不保证：

- 物体几何尺度正确；
- 遮挡表面与自由空间正确；
- gripper—object 接触关系正确；
- 多视角下的几何一致；
- 长时 rollout 保持对象身份。

显式 4D 方法虽然预测 depth、point map 或 point cloud，但会把几何解码成本带到部署阶段。WAM4D 试图保留几何监督的收益，同时删除推理期几何开销。

## 模型输入与输出

在决策时刻 \(t\)，causal context 为：

$$
C_t = \{l,\ O_t^{hist},\ a_{t-L_a:t-1}\},
$$

其中：

- \(l\)：语言指令；
- \(O_t^{hist}\)：多视角 RGB 历史 mosaic；
- \(a_{t-L_a:t-1}\)：已执行动作历史。

部署输出是未来 action chunk \(a_{t:t+H_a-1}\)。

训练还使用：

- clean future RGB \(O_t^{fut}\)；
- clean future actions；
- future depth targets。

这些是监督目标或 flow-matching state，不是部署时额外输入。

# 方法总览

```text
language + history RGB + history actions
                 │
                 ▼
       causal video-action MoT backbone
          │                    │
          │                    └── future action flow → action chunk
          ├── future video flow → future RGB latent
          │
          └── selected history features
                        │
              spatial registers query history
                        │
               pretrained DA3 depth head
                        │
                 future depth loss

部署：删除 spatial registers、depth blocks 和 geometric head。
```

# 输入、输出与张量

## 论文明确给出的尺寸

| 项目 | 尺寸 / 数量 | 依据 |
|---|---:|---|
| Action vector | 16 维 | 双臂各 \(3\)D position + quaternion \(4\)D + gripper \(1\)D |
| Action chunk | 32 steps | 默认 action chunk size |
| 视频采样 | 最多 17 帧 | history 为 1/5/9 帧，future target 为 8 帧 |
| Main camera | \(256\times320\) | 实现细节 |
| 每个 wrist camera | \(128\times160\) | 实现细节 |
| Register cell | \(32\times32\) input pixels | VAE stride 16 × transformer 2×2 grouping |
| Register grid / future frame | \(12\times10\) | main \(8\times10\) + 两个 wrist 各 \(4\times5\) |
| Future depth frames | 8 | 与 future video target 对齐 |
| Register tokens | \(12\times10\times8=960\) | 论文明确给出 |
| Register readout layers | 12, 14, 16, 18 | 默认 middle-layer placement |

## 合理推断

- 三视角 mosaic 的总体像素布局可由 \(12\times10\) 个 \(32\times32\) cell 推得约为 \(384\times320\)，但具体拼接方向应以预处理代码确认。
- Transformer hidden width、attention heads、VAE latent channel 数未在正文给出，应检查 LingBot-VA 配置与代码。
- Figure 2 显示 30 个 VA blocks，但精确配置、参数共享方式仍需代码确认。

# Backbone：联合视频—动作 Flow Matching

视频 VAE 将历史与未来 RGB 编码为：

$$
[Z_t^{hist}, Z_t^{fut}] = E_{vae}([O_t^{hist}, O_t^{fut}]).
$$

训练时喂给 backbone 的 future-video tokens 是加噪状态 \(\tilde Z_t^{fut}\)，不是 clean future。动作同理：

$$
A_t^{hist}=E_a(a_{t-L_a:t-1}),\quad
\tilde A_t^{fut}=E_a(\tilde a_{t:t+H_a-1}).
$$

联合 token sequence：

$$
X_t^{(0)}=[Z_t^{hist},\tilde Z_t^{fut},A_t^{hist},\tilde A_t^{fut}].
$$

视频头和动作头分别预测对应的 conditional-flow targets。

# Spatial Register Distillation

共享 register grid \(R^\star\) 会复制到每个未来深度时间步：

$$
R_t^0=\operatorname{Repeat}_{\tau\in T_t}(R^\star).
$$

在选定层 \(\ell\in\{12,14,16,18\}\)，register 是 query，key/value 由 register 自身与该层有效的 history-video tokens 组成：

$$
R_t^{\ell+1}
=\operatorname{DepthBlock}_\ell
\left(
Q=R_t^\ell,\;
K,V=[R_t^\ell,Z_t^{hist,\ell}]
\right).
$$

随后把多层 register features 投影到预训练 DA3-GIANT-1.1 DualDPT head：

$$
G_t=P_g(\{R_t^{\ell+1}\}_{\ell\in L_r}),\qquad
\hat D_t^{fut}=G_\phi(G_t).
$$

直观上，register 是“未来空间位置的问题”，它们只能查看历史图像特征，必须从 causal history 中提取足以预测未来 depth 的信息。深度损失因此迫使共享历史特征携带对动作有用的空间结构。

# Causal Mixture Attention

动作预测的关键可见性：

| Query | 可见 Key/Value |
|---|---|
| Future action noise | history video、history action、future action noise |
| Register | register、history video |
| Future video noise | history video、future video noise |
| History video | history video |
| History action | history action |

最关键的隔离是：

- future action 看不到 future video；
- future action 看不到 registers；
- registers 看不到 future video、action tokens；
- 几何监督只能通过共享 history-video representation 间接影响动作路径。

这避免模型在训练时偷看未来 RGB 或未来 depth 来预测动作。

# 训练目标

Future depth 使用 SmoothL1：

$$
\mathcal L_{depth}
=
\frac{1}{\sum_{\tau\in T_t}|\Omega_\tau|}
\sum_{\tau\in T_t}\sum_{p\in\Omega_\tau}
\operatorname{SmoothL1}(\hat D_{\tau,p},D_{\tau,p}).
$$

总目标：

$$
\mathcal L
=
\mathcal L_{video}
+\lambda_{act}\mathcal L_{action}
+\lambda_{depth}\mathcal L_{depth},
$$

默认 \(\lambda_{act}=\lambda_{depth}=1\)。

深度损失更新 backbone、registers、depth blocks、projection 和 geometric head。最终模型使用可训练的预训练 DA3 head，而不是固定 head。

# 推理流程

部署时：

1. 维护 observation queue 和已执行 action history；
2. VAE 编码 observation queue；
3. 更新 video KV cache；
4. action history 写入 action KV cache；
5. 对 future-action tokens 去噪，得到 32-step action chunk；
6. 执行动作；每 4 个动作采一帧新观测；
7. 循环。

部署不计算 future depth，也不需要 depth sensor；但 WAM4D 仍然是大型生成式 policy，推理明显慢于 \(\pi_0/\pi_{0.5}\)。

# 数据与实验设置

## RoboTwin 2.0

- 50 个任务；
- 每任务 50 条 clean trajectories；
- 每任务 500 条 randomized trajectories；
- randomized 包含 clutter、光照、背景、桌高、物体位置和语言变化；
- 三视角输入：1 个 head camera + 2 个 wrist cameras。

## Real robot

- AstriBot S1；
- 4 个场景：plate、bottle、LEGO sorting、pen cap removal；
- 每任务 100 demonstrations，共 400；
- 每方法每任务 10 次 physical rollouts；
- depth supervision 来自离线 Depth Anything 3 pseudo-depth。

# 实验与 Claim—Evidence

| Claim | 证据 | 严格解释 |
|---|---|---|
| 几何监督能改善控制 | 10-task ablation 中 trainable pretrained DA3：Clean 80.1%，no-depth 71.7% | 支持，但只在 10-task ablation split 上 |
| Pretrained geometry prior 很重要 | random-init head Clean 70.0%，trainable pretrained 80.1% | 强于“普通 depth auxiliary loss”解释 |
| Middle registers 平衡最好 | fixed-head 条件下 middle Clean 75.2%，geometry metrics 最好或接近最好 | Bidirectional 控制 76.6% 更高，但更复杂且几何指标更差 |
| Full-suite 控制有竞争力 | RoboTwin avg 91.8% | 与 Fast-WAM 91.8% 相同，低于 LingBot-VA 92.3%，不能称 overall best |
| Real-robot 更强 | sub-action avg 0.90，其他为 0.74/0.84/0.80 | 数值最好，但每任务仅 10 次，且是 sub-action metric |
| 推理更轻 | geometry branch 完全移除，9.71 GiB | 相对 LingBot-VA 更快更省显存；仍慢于 Fast-WAM 和 VLA |

# 批判性分析

## 1. “4D”主要存在于训练监督和分析路径

默认部署不输出 depth 或 point cloud；显式 RGB-D rollout 是保留辅助分支后的 qualitative analysis。把它称为 4D WAM 有合理性，但读者不应误解为实时 policy 必须生成 4D scene。

## 2. Full-suite 结果不是全面领先

WAM4D：

- Clean 93.8%，表中最好；
- Randomized 89.9%，低于 LingBot-VA 91.6 和 Fast-WAM 91.8；
- Avg 91.8%，与 Fast-WAM 相同，低于 LingBot-VA 92.3。

因此最准确的结论是“在保持较低推理成本时具有竞争力”，不是“全面 SOTA”。

## 3. Real-robot 证据有价值但统计较弱

每任务只有 10 次 rollout，且论文报告 intermediate sub-action success。顺序任务中前一步失败会使后续步骤记为 0，这比独立子动作评测严格，但仍不能等同于完整任务成功率。论文没有置信区间或多随机种子。

## 4. Depth target 与 geometric head 的同源性

Real-world depth targets 由 DA3 产生，readout head 也从 DA3 预训练权重初始化。这可视作 teacher-prior distillation，但可能把 DA3 的系统偏差同时带入监督和 readout。是否提升真实 metric geometry，需要独立传感器深度验证。

## 5. Point-cloud metric 的物理含义有限

论文使用固定的 dataset-level camera intrinsic 将 depth 反投影为点云。该协议对方法间比较一致，但如果不同视角或相机参数并不完全相同，Chamfer/F-score 不应被解释成严格标定下的绝对 3D 精度。

## 6. 长时对象身份仍然失败

模型没有显式长期记忆。遮挡后对象可能被补全为另一个物体。作者认为这不影响其 control evaluation，因为 policy 持续接收新观测；但对于把 WAM 当作长期 simulator、规划器或离线 policy evaluator 的目标，这仍是核心限制。

# 与我的研究的关系

最值得借用的不是 960 个 register 的具体实现，而是：

> 用只在训练期存在的 privileged/auxiliary readout，让主干学到部署时不可直接获得的结构信息，同时通过 attention mask 阻止辅助信息成为捷径。

这可以迁移到：

- 触觉：训练时用 contact map / force field readout，部署只用视觉或低成本触觉；
- cloth manipulation：训练时用 mesh/point-map/visibility readout，部署只保留 RGB policy；
- VLA：把几何、接触或可达性变成 auxiliary query tokens，而不是直接拼到 action tokens；
- world model：验证“生成质量更好”是否真的转化为 action success。

# 最小验证实验

## 假设

提升来自 geometry prior 对 causal history features 的正则化，而不是额外参数或普通 depth loss。

## 最小设计

在 3–5 个 geometry-sensitive RoboTwin 任务上，共用同一 backbone 与训练预算：

1. No depth；
2. Random-init depth head；
3. Pretrained DA3 head + registers；
4. Pretrained DA3 head + shuffled depth targets；
5. Pretrained DA3 head，但允许 action tokens 读取 registers（测试 shortcut）。

## 指标

- 完整任务 success；
- 接触前末端位姿误差；
- 碰撞率；
- 遮挡区失败率；
- geometry metrics；
- 推理 latency。

若 3 明显优于 2，说明 foundation prior 有用；若 4 仍提升，可能只是额外正则/参数效应；若 5 训练好但部署崩溃，说明 causal isolation 是必要的。

# 可信度边界

## 论文明确事实

- Register branch 只在训练使用，默认部署完全移除。
- Future action tokens 看不到 future video 和 register tokens。
- 默认 action 为双臂 16 维绝对末端位姿，chunk size 32。
- 默认有 960 spatial register tokens，插入层为 12/14/16/18。
- RoboTwin full-suite avg 为 91.8%，real-robot sub-action avg 为 0.90。
- real-world depth supervision 使用 DA3 pseudo-depth。

## ChatGPT 合理推断

- 主要收益更像 representation distillation，而不是显式 4D reasoning at inference。
- 固定 intrinsics 与 DA3 同源监督限制了 geometry metric 的独立性。
- Clean 提升而 randomized 相对落后，可能说明几何监督尚未解决更广泛的视觉域变化。

## 必须查看代码才能确认

- 三视角 mosaic 的精确拼接、mask 与 augmentation；
- Transformer hidden width、head 数、noise schedule 和 sampler；
- action quaternion 的 convention、IK/controller 与 action chunk 执行细节；
- DA3 pseudo-depth 的尺度对齐、归一化、无效像素 mask；
- full-suite 与 ablation 的 seed、checkpoint selection 和评估脚本；
- register branch 移除后参数/缓存的精确处理；
- 论文给出的代码 URL 在 2026-07-30 返回 404，当前无法核验上述细节。

> [!warning] 这份 AI Explanation 是中间材料。请不要直接把措辞复制进 My Note。
