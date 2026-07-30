---
type: workflow-demo
paper: "[[li2026wam4d]]"
ai_explanation: "[[li2026wam4d.ai]]"
my_note: "[[li2026wam4d.my.demo]]"
created: 2026-07-30
tags:
  - tutorial
  - paper-workflow
---

# WAM4D 三层笔记操作演示

本页演示一篇论文从 PDF 到个人知识的完整操作。

## 0. 本次已经生成的文件

- PDF：[[li2026wam4d.pdf]]
- Source Note：[[li2026wam4d]]
- AI Explanation：[[li2026wam4d.ai]]
- My Note 示范草稿：[[li2026wam4d.my.demo]]

## 1. 正常情况下先进入 Zotero

1. 打开 [arXiv 摘要页](https://arxiv.org/abs/2606.14048)。
2. 点击 Zotero Connector，确保父条目、作者、年份和 PDF 都保存成功。
3. 在 Zotero 中至少做三类批注：
   - 黄色：核心机制；
   - 红色：证据弱点或疑问；
   - 绿色：可迁移到自己研究的机制。
4. Obsidian 中按 `Ctrl+P`，运行 **Zotero Integration: Import Notes**。
5. 选择 **论文 Source Note**。

本次为了完整示范，[[li2026wam4d]] 已手工模拟了导入后的结果。

## 2. 上传 ChatGPT 前先写问题

不要把空白 PDF 直接丢给 ChatGPT。先在 Source Note 写 3–6 个问题。本例写了：

- 这是真正的 4D model，还是 depth auxiliary loss？
- 有没有 future leakage？
- 几何改善是否真的转化为 control success？
- real-robot 的 0.90 到底是什么指标？

这些问题决定 AI Explanation 的重点。

## 3. 在 ChatGPT Project 中操作

1. 打开与你研究方向对应的 Project，例如 `VLA & World Models`。
2. 把 [[ChatGPT Project Instructions]] 放入 Project Instructions。
3. 建立新聊天：`[li2026wam4d] WAM4D`。
4. 上传 `li2026wam4d.pdf`。
5. 打开 [[Paper AI Explanation Prompt]]，填写：

```text
citekey：li2026wam4d
研究项目：world-model
我当前最关心的问题：
1. training-time geometry supervision 如何影响 action path？
2. causal mask 是否完全阻止 future leakage？
3. 实验是否证明 geometry improvement 转化为 control improvement？
```

6. 把 Source Note 的红色、绿色批注一并粘贴。
7. 生成后保存为 `20-Literature/AI-Explanations/li2026wam4d.ai.md`。
8. Source Note 设置 `ai_explanation_done: true`。

本次生成结果见 [[li2026wam4d.ai]]。

## 4. 如何核查 AI Explanation

逐条核对：

- 架构：PDF Figure 2；
- Action 与 register 尺寸：PDF §3.5；
- 推理循环：Algorithm 1；
- Full-suite：Table 1；
- Real robot：Table 2；
- Register ablation：Table 7；
- Geometric head：Table 8；
- 失败案例：Figure 7。

本例中必须纠正的常见 AI 过度总结：

| 不严谨说法 | 应改为 |
|---|---|
| WAM4D 在 RoboTwin 上取得最佳结果 | Clean 最好；Avg 与 Fast-WAM 相同，低于 LingBot-VA |
| 0.90 是 real-robot 完整任务成功率 | 它是每任务 10 次 rollout 的 sub-action 平均成功率 |
| WAM4D 推理没有额外成本 | 几何分支没有额外成本，但整体仍为 525 ms/chunk |
| 模型部署时预测 4D | 默认部署只预测 action；RGB-D/point cloud 是保留辅助分支的分析路径 |

## 5. 关闭 AI 稿，写 My Note

现在关闭 [[li2026wam4d.ai]]，只保留 PDF、Source Note 和空白 `My Paper Note.md`。

先独立写五部分：

1. 一句话理解；
2. 核心问题；
3. 核心机制；
4. 训练与推理差异；
5. 最关键证据。

然后才打开 AI Explanation 补漏。[[li2026wam4d.my.demo]] 展示了合理长度和判断密度，但正式笔记必须改成你的语言。

## 6. 对照核验怎么做

把 PDF、AI Explanation 和 My Note 放回同一聊天，复制 [[Paper Verification Prompt]]。

本例应期待 ChatGPT 至少指出：

1. 若 My Note 写“full-suite SOTA”，这是事实错误；
2. 若写“推理免费”，应改成“无几何分支开销，但 WAM 仍慢”；
3. Real-robot 结论需注明 10 rollouts/task 和 sub-action metric；
4. DA3 target 与 DA3-initialized head 的同源偏差仍未排除；
5. Code URL 当前 404，预处理、controller、scale alignment 无法核验。

你只修改 My Note，不保存一整篇新的 review。确认后：

```yaml
summary_done: true
verified: true
```

同时把 AI Explanation 的 `verified` 改成 `true`，表示已人工核查。

## 7. 最后提炼什么

这篇最值得拆成 Concept Note 的不是“WAM4D”名称，而是：

- Training-only auxiliary readout；
- Privileged supervision without deployment dependency；
- Causal modality visibility / anti-leakage mask；
- Geometry metric 与 control metric 的 Claim—Evidence 对齐。

若没有产生概念、实验或项目判断，这篇论文仍只是“读过”，没有进入永久知识。
