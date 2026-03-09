---
author: 王慎之
tags:
  - LLM
---

# 基础知识速览

- 梯度下降
	- 初始位置
	- 最小值点
	- 学习率

# 大模型训练概览

- Pre-training
- Supervised Fine-tuning(SFT)
- Reinforcement Learning from Human Feedback(RLHF)
- Insights
	- 同时利用大量无标注数据做预训练，相对少量的有标注数据做微调/后训练
	- 数据质量>>数据规模
	- RLHFL:告诉模型什么是对的，exploration，on-policy learning
	- scaling is all you need

	>Richaed Sutton(强化学习之父):  
	>	If you want to learn something that works, try to learn something simple. Don't try to learn something fancy

# Transformer结构

- 成功之因：Scalability
- jalammar.github.io/illustrated-transformer

# 大模型发展历程

- BERT(**Bidirectional** Encoder Representation from Transformers)
- T5(Text-to-Text Transfer Transformer)
