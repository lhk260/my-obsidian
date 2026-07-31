---
type: my-paper-note
title: "WAM4D — My Note 示范草稿"
citekey: "li2026wam4d"
status: draft
source: "[[li2026wam4d]]"
ai_note: "[[li2026wam4d.ai]]"
topics:
  - geometry-distillation
  - world-action-model
projects:
  - world-model
rating:
created: "2026-07-30"
modified: "2026-07-30"
---

# 使用说明

> [!warning] 这是“怎么写”的示范草稿，不代表你的个人判断。
> 正式操作时先关闭 [[li2026wam4d.ai]]，只看 PDF 与自己的批注完成下列部分，然后再回看 AI 稿补漏。

# 一句话理解

WAM4D 的关键不是部署时显式预测 4D，而是训练时用 future-depth readout 迫使 causal history-video features 编码几何信息，再把整个几何分支删掉，只留下 RGB-history → action-chunk 的 WAM policy。

# 核心问题

普通 video-action model 可能生成视觉上合理、但接触几何错误的未来；显式 RGB-D/4D world model 又会把密集几何解码成本带到部署。论文试图获得几何监督的表征收益，同时不让 policy 在推理时依赖 depth。

# 核心机制

Spatial registers 只查询历史视频特征，并用预训练 DA3 head 解码未来 depth。Action tokens 无法读取 register 或 future-video tokens。因此深度监督只能通过改善共享的历史视觉表征间接帮助动作预测，而不能成为训练期捷径。

# 训练与推理

## 训练阶段

- 联合 flow-matching：future video + future action；
- 辅助 SmoothL1 future-depth loss；
- 960 registers，readout layers 12/14/16/18；
- trainable pretrained DA3 head；
- 三项 loss 默认权重均为 1。

## 推理阶段

- 输入语言、多视角 RGB history、已执行 action history；
- 对 32-step future action chunk 去噪；
- 不运行 register、depth block 或 geometric head；
- 每执行 4 个动作采集一个新观测。

## 训练与部署的差异

训练可使用 future RGB、future actions 和 future/pseudo depth 作为监督；部署只能看历史。Causal mask 是可信度关键，否则 action predictor 可能偷看 future geometry。

# 最关键证据

我认为最关键的不是 full-suite Table 1，而是 Table 8：

- no depth：Clean 71.7；
- random-init depth head：70.0；
- fixed pretrained：75.2；
- trainable pretrained：80.1。

这组结果支持“预训练几何 prior + 适配”比“随便加一个 depth loss”更重要。但它只来自 10-task ablation split，需要 full-suite 多 seed 复验。

# 我的判断

## 我相信的部分

- Training-only auxiliary readout 是合理且可迁移的设计；
- causal visibility 的动机强，确实避免 future-information leakage；
- 几何 prior 对 geometry-sensitive tasks 可能有帮助，消融方向一致。

## 我不完全相信的部分

- “Fast”是相对其他 WAM，而不是相对 VLA：525 ms/chunk 仍远慢于 \(\pi_{0.5}\) 的 72 ms；
- “4D”容易让人误以为部署显式维护 4D state，实际不是；
- real-robot 只有每任务 10 次、报告 sub-action success，0.90 的不确定性很大。

## 作者没有充分证明的结论

- 几何表征是否在真实标定深度上更准确，而不是只匹配 DA3 teacher；
- 对 randomized visual domain shift 的收益：WAM4D 的 random success 低于 Fast-WAM 和 LingBot-VA；
- 是否能作为可靠的长时 world simulator 或 policy evaluator；遮挡后对象身份会漂移。

# 与我的研究

## 可以借用

- 对触觉/接触：训练期用 contact field、force 或 object pose readout，部署时删除；
- 对 cloth：训练期用 point map / mesh / visibility readout，让 RGB backbone 学几何；
- 用 attention mask 明确限制 privileged auxiliary tokens 不进入 action path。

## 不应该直接借用

- 不应默认 960 registers、DA3 或 middle layers 就是其他任务的最优配置；
- 对需要 force/contact state 的任务，纯 depth supervision 可能仍不够。

## 与我的方法的本质区别

待你结合当前项目填写：你的方法是否显式维护物理 state？是否使用真实触觉？辅助监督是否部署可用？

# 最小验证实验

- **假设**：收益来自几何 foundation prior，而非额外参数。
- **修改**：no-depth / random head / pretrained head / shuffled-depth 四组。
- **Baseline**：相同 LingBot-VA backbone。
- **指标**：完整任务成功率、接触位姿误差、碰撞率、遮挡失败率、latency。
- **正结果说明**：只有正确 pretrained geometry supervision 显著提升。
- **负结果说明**：shuffled depth 也提升则可能主要是 regularization 或 capacity。

# 未解决问题

- [ ] 代码何时公开？当前链接返回 404。
- [ ] DA3 pseudo-depth 如何做 scale alignment？
- [ ] Action quaternion convention 与底层 controller 是什么？
- [ ] Real-robot 完整任务成功率和置信区间是多少？
- [ ] Randomized setting 为何低于其他 WAM？

# Active Recall

Q:: WAM4D 如何在部署时不使用 depth 的情况下利用几何监督？
A:: 训练时 spatial registers 从 causal history-video features 读取未来 depth，并把 depth loss 回传到共享 backbone；部署时删除 register 和几何头。

Q:: WAM4D 防止 action prediction 偷看未来信息的关键限制是什么？
A:: Future action tokens 只能访问 history video、history actions 和自身 noisy action tokens，不能访问 future video 或 spatial registers。
