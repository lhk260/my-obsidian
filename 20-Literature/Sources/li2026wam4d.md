---
type: source-note
title: "WAM4D: Fast 4D World Action Model via Spatial Register Tokens"
citekey: li2026wam4d
authors:
  - Ying Li
  - Xiaobao Wei
  - Jiajun Cao
  - Hao Wang
  - Xiaowei Chi
  - Chengyu Bai
  - Qianpu Sun
  - Jiajun Li
  - Xiaojie Zhang
  - Jian Tang
  - Sirui Han
  - Shanghang Zhang
year: 2026
arxiv: "2606.14048"
url: "https://arxiv.org/abs/2606.14048"
pdf: "[[li2026wam4d.pdf]]"
code: "https://github.com/myendless1/wam4d"
projects:
  - world-model
topics:
  - world-action-model
  - 4D-world-model
  - robot-manipulation
  - geometry-distillation
ai_explanation_done: true
my_note_done: false
imported: 2026-07-30
tags:
  - paper/source
---

# WAM4D: Fast 4D World Action Model via Spatial Register Tokens

> [!info]- Source metadata
> - **Authors**: Ying Li, Xiaobao Wei, Jiajun Cao, Hao Wang, Xiaowei Chi, Chengyu Bai, Qianpu Sun, Jiajun Li, Xiaojie Zhang, Jian Tang, Sirui Han, Shanghang Zhang
> - **Date**: 2026-06-15（PDF 首页；arXiv v1 提交于 2026-06-12）
> - **arXiv**: [2606.14048](https://arxiv.org/abs/2606.14048)
> - **PDF**: [[li2026wam4d.pdf]]
> - **Code**: [myendless1/wam4d](https://github.com/myendless1/wam4d)（2026-07-30 检查时返回 404，代码尚无法核验）

## Abstract（忠实转述）

现有 World Action Model 通常在二维视频或 latent 空间里同时预测未来观测与动作，但视觉上合理的 rollout 可能缺少精确操作所需的三维约束、遮挡表面和接触几何。WAM4D 在训练阶段加入 spatial register tokens，从历史视频特征中读取未来深度，并通过预训练几何头施加深度监督；部署时移除 register、depth blocks 和几何头，只保留轻量的观测到动作路径。作者还设计了 causal mixture attention，阻止未来视频和辅助几何信息泄漏给动作预测器。

## Questions before ChatGPT

1. 它究竟是“4D world model”，还是一个带训练期深度辅助损失的 2D WAM policy？
2. Spatial register 为什么比直接从 future video latent 解码 depth 更有效？
3. Action predictor 能看到哪些 token？有没有 future-information leakage？
4. 几何监督是否真的提升控制，而不仅是提升 RGB-D 重建？
5. real-robot 的 0.90 是完整任务成功率还是 sub-action 成功率？统计可信度如何？
6. 训练用 DA3 伪深度、几何头也初始化自 DA3 时，是否存在 teacher-target 同源偏差？

## Evidence and annotations

> [!quote|yellow]+ 核心机制 — [[li2026wam4d.pdf#page=2|PDF p.2]]
> Geometry 被当作 training-time readout target，而不是部署时输入或输出。深度损失通过 spatial registers 回传到动作预测所依赖的历史视频特征。

> [!quote|yellow]+ 因果隔离 — [[li2026wam4d.pdf#page=5|PDF p.5]]
> Future action tokens 只能看到 history video、history action 和自身的 noisy future-action tokens；不能看到 future video 或 spatial registers。

> [!quote|green]+ 可借用机制 — [[li2026wam4d.pdf#page=5|PDF p.5]]
> 辅助模态可以只在训练期作为 readout supervision，部署时完全移除。这比把深度作为 policy 输入更不依赖传感器。

> [!quote|red]+ 主结果需要谨慎 — [[li2026wam4d.pdf#page=8|PDF p.8, Table 1]]
> WAM4D 的 RoboTwin 平均成功率为 91.8%，与 Fast-WAM 相同，低于 LingBot-VA 的 92.3%；它不是 full-suite overall best。

> [!quote|red]+ real-robot 样本量 — [[li2026wam4d.pdf#page=8|PDF p.8, Table 2]]
> 0.90 是每任务 10 次 rollout 下的 sub-action 平均成功率，不是严格的整任务成功率；论文未给置信区间。

> [!quote|red]+ rollout 失败 — [[li2026wam4d.pdf#page=13|PDF pp.13–14]]
> 模型没有显式长期记忆，物体遮挡后可能被续写成另一个外观合理但身份不同的物体。

## Pipeline links

- AI explanation: [[li2026wam4d.ai]]
- My note: [[li2026wam4d.my.demo]]
- Walkthrough: [[WAM4D 三层笔记操作演示]]
