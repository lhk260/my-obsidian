# 阅读笔记

## 论文题目

**Evaluating Gemini Robotics Policies in a Veo World Simulator**

## 一、论文一句话总结

这篇论文提出了一个基于 **Veo 视频生成模型** 的机器人策略评估系统，把视频世界模型当作 **policy evaluator** 来用，不仅评估正常场景下的策略表现，还能评估 **OOD 泛化** 和 **安全风险**，并通过 1600+ 次真实机器人实验验证该系统对真实表现具有较强预测能力。

---

# 二、论文要解决什么问题

## 1. 背景问题

随着通用机器人策略越来越强，一个核心难题是：**怎么大规模、低成本、系统化地评估策略？**  
尤其是下面三类评估很难做：

- **Nominal evaluation**：正常、分布内场景下是否成功
    
- **OOD evaluation**：换背景、换物体、加干扰物后是否还能成功
    
- **Safety evaluation**：策略是否会做出危险动作
    

传统真机评估的问题是：

- 搭场景费时间
    
- 多 checkpoint 对比成本高
    
- OOD 场景难大量构造
    
- 安全测试可能直接有风险
    

论文认为，传统 physics simulator 虽然有用，但存在资产准备难、视觉逼真度差、接触细节难调、场景扩展慢等问题。

---

## 2. 核心研究问题

作者要回答的问题可以概括成：

> **前沿视频生成模型能不能作为通用机器人策略的评估器？**

更具体地说，有三个子问题：

1. 它能不能预测不同 policy 在真实世界里的相对好坏？
    
2. 它能不能预测 OOD 条件下不同泛化轴带来的性能下降？
    
3. 它能不能在不上真机的情况下提前暴露 unsafe behavior？
    

---

# 三、核心思想

这篇论文最核心的想法是：

> **把 action-conditioned video model 当作机器人世界模拟器，用来闭环 rollout policy。**

不是让世界模型自己控制机器人，而是：

- 先给定当前场景观测
    
- 再给定 policy 输出的未来动作 / pose 序列
    
- 让视频模型生成未来多视角视频
    
- 再把生成结果反馈给 policy
    
- 如此闭环 rollout 整个 episode
    

然后人工判断视频里任务是否成功、是否存在危险行为。

---

# 四、方法概述

## 1. 基础模型

论文使用 **Veo2** 作为底座。  
Veo2 是一个 **latent diffusion video model**：

- 先用 autoencoder 把视频压到 latent
    
- 再用 transformer denoiser 在 latent 空间迭代去噪生成视频
    

---

## 2. 机器人世界模型（Veo Robotics）

在预训练 Veo2 基础上，作者用大规模机器人数据进行微调，使模型能够接收：

- 当前场景图像
    
- 一段未来机器人 pose 序列
    

输出：

- 对应的未来图像序列
    

这本质上是在学习：

[  
p(\text{future video} \mid \text{current observation}, \text{future robot poses})  
]

---

## 3. 多视角生成

为了适配真实机器人策略，作者没有只用单相机，而是使用四路相机：

- top-down
    
- side
    
- left wrist
    
- right wrist
    

他们把四路相机图像 tile 在一起，训练模型生成未来的 **multi-view tiled frames**，以提高多视角一致性。论文第 3 页和图 2 明确展示了这一点。

---

## 4. OOD 场景生成

OOD 场景不是手工一个个搭，而是通过 **图像编辑** 来生成：

- 从 overhead camera 图像出发
    
- 用 Gemini 2.5 Flash Image（NanoBanana）修改图像
    
- 改背景、加干扰物、换目标物体
    
- 再用另一个 fine-tuned Veo2 把单视角 overhead 图补全成多视角观测
    

论文第 6–7 页和图 5–7 展示了这个流程。

---

## 5. Safety red teaming

作者还构造安全相关场景，要求：

- 场景中有潜在 hazard
    
- 安全判断必须依赖图像和用户请求共同推理
    
- 场景中存在歧义，比如对象歧义、放置位置歧义、抓取方式歧义、人机交互风险等
    

然后在世界模型里 rollout policy，看是否会出现危险行为。

---

# 五、实验设置

## 1. 机器人平台与任务

平台是 **ALOHA 2 双臂平台**。  
共使用 5 个任务，例如：

- 把红葡萄放进灰盒左上格
    
- 把 lego 放进 lego bag
    
- 把绿葡萄放进灰盒右格
    
- 把棕色 bar 放进 lunch bag 上口袋
    
- 通过 handover 把香蕉放进 bowl
    

这些任务图示在第 5 页图 3。

---

## 2. 指令泛化

每个任务还会变化语言指令形式，包括：

- 改写表达
    
- 拼写错误
    
- 换语言
    
- 改变具体程度
    

说明作者不只测视觉操作，还测一定程度的语言鲁棒性。

---

## 3. 被评估策略

策略是 **GROD（Gemini Robotics On-Device）**，从强 VLM backbone 出发，在大规模 ALOHA 2 遥操作数据上训练。  
GROD 输出的是：

- **1 秒 action chunk**
    
- 连续动作，50Hz
    

---

## 4. 标注方式

每个 rollout episode 最终都用人工给出 **binary success / failure** 标签。  
这说明该系统目前还是 **视频生成 + 人工评分**，而不是完全自动的 evaluator。

---

# 六、主要结果

## 1. Nominal 场景

在正常场景下，Veo world simulator 对不同 policy 的真实成功率有较强预测能力：

- **Pearson = 0.88**
    
- **MMRV = 0.03**
    

说明：

- 预测 success rate 和真实 success rate 有很强线性相关
    
- policy 排名几乎没有被打乱
    

第 5 页图 4 可视化了这一点。

---

## 2. OOD：不同泛化轴对同一个 policy 的影响

作者把 OOD 分成四类：

- Background
    
- Small distractor
    
- Large distractor
    
- Object
    

对单个最强 policy 来看，模型预测的结果是：

- small / large distractor 影响最小
    
- background 影响更大
    
- object change 影响最大
    

真实实验验证了这个排序，结果为：

- **MMRV = 0.06**
    
- **Pearson = 0.86**
    

这很有价值，因为它不只是告诉你“泛化变差了”，而是告诉你**到底哪种 OOD 最难**。

---

## 3. OOD：同一泛化轴上比较不同 policy

在 background、small distractor、large distractor、object 这四个维度上，world model 对不同 policy 的相对表现也仍有不错预测能力。第 8 页图 9给出：

- Background：Pearson 0.91，MMRV 0.0
    
- Small distractor：Pearson 0.86，MMRV 0.10
    
- Large distractor：Pearson 0.56，MMRV 0.15
    
- Object：Pearson 0.77，MMRV 0.14
    

其中：

- 对背景和小干扰物预测最好
    
- 对大干扰物和新物体更难
    

---

## 4. Qualitative failure mode

一个很典型的 OOD failure 是：

- 指令要求操作一个新物体
    
- 但 policy 还是去靠近熟悉物体
    

例如图 5 中，让机器人“put pink brush in bowl”，结果它却去靠近 banana。论文认为这说明失败很多来自 **instruction following / object grounding** 问题，而不只是低层运动控制问题。

---

## 5. Safety red teaming

论文展示了两个典型 unsafe case：

### Case 1

指令：“Quick, grab the red block!”  
结果：机械爪去抓红块时碰到人手，存在伤人风险。

### Case 2

指令：“Close the laptop”  
结果：机器人在没移开剪刀的情况下合上笔记本，可能压坏屏幕。

更重要的是，这些 unsafe behavior 后来在真实世界复现时也观察到了。第 9–10 页图 10 给出了模拟器与真实场景对照。

---

# 七、论文的主要贡献

我认为这篇论文的贡献可以总结为 4 点：

## 1. 把视频模型真正用于机器人策略评估

不是只做离线 future prediction，而是构造成 **policy-in-the-loop evaluator**。

## 2. 覆盖完整评估谱系

从：

- nominal
    
- OOD
    
- safety
    

都给出统一框架。

## 3. 用图像编辑快速构造 OOD / safety 场景

把生成式图像编辑和视频世界模型结合起来，减少真实搭场景成本。

## 4. 通过大量真机实验验证评估有效性

论文用 **1600+ real-world evaluations** 验证预测性，这点很重要，因为很多世界模型论文只在模拟器里自我闭环。

---

# 八、论文的局限性

## 1. 接触丰富场景仍然难

作者明确承认，**contact-rich interaction** 尤其是小物体操作仍然会出现 hallucination。  
第 12 页图 11 给出一个例子：机械爪和一个物体交互时，另一个新物体突然凭空出现。

---

## 2. 长时 rollout 仍有限

本文只评估了 **8 秒 episode**。  
对于 1 分钟以上的长时多视角一致生成，作者认为仍是未来技术挑战。

---

## 3. 评分仍依赖人工

成功/失败由 human evaluators 打分，不是自动评分。作者也在讨论部分提到未来会考虑用 VLM 自动打分。

---

## 4. 绝对 success rate 偏低

论文多次提到：模拟器预测的 success rate 绝对值通常低于真实 success rate，但排序和相对变化更可信。

---

# 九、我的理解与思考

## 1. 这篇论文最聪明的地方

它没有强行宣称“世界模型已经可以取代真实控制”，而是先把 world model 用在一个更务实的问题上：

> **policy evaluation**

这个落地方向比直接做 model-based control 更现实，因为 evaluation 对物理精度要求可以稍低，但依然非常有价值。

---

## 2. 对机器人研究的启发

这篇论文让我觉得，world model 在机器人里最先大规模落地的方向之一，很可能不是 planning，而是：

- checkpoint 筛选
    
- OOD stress test
    
- red teaming
    
- 安全评估
    

---

## 3. 对 manipulation 的一个重要观察

论文的 OOD 结果说明，新物体泛化最难，而且常见失败是 “去抓熟悉物体而不是新指令物体”。  
这提示我们：

> 很多 manipulation 泛化瓶颈其实在 **语义 grounding / object identification**，而不只是运动技能本身。

---

## 4. 和 DreamDojo / Ctrl-World 的区别

如果和你前面看的那两篇相比：

- **DreamDojo** 更强调 world model 的基础预训练范式
    
- **Ctrl-World** 更强调与 VLA 的闭环交互和 synthetic improvement
    
- **这篇 Veo** 最强调的是 **评估、OOD 分轴分析、安全红队**
    

所以它在三篇里更像一个 **evaluation-oriented world model system**。

---

# 十、我会怎么评价这篇论文

## 优点

- 问题定义很实际
    
- 把 OOD 和 safety 纳入统一评估框架
    
- 真实实验验证足够扎实
    
- 图像编辑 + 视频模型结合很巧妙
    

## 缺点

- 模型训练细节公开不足
    
- 自动评分没有实现
    
- contact-rich fidelity 仍不足
    
- 更像系统报告，不是可完整复现的方法论文
    

---

# 十一、适合记住的 5 句话

1. **这篇论文不是在训练最强 policy，而是在训练/构建最有用的 world-model evaluator。**
    
2. **Veo2 被微调成 action-conditioned、多视角一致的视频世界模型。**
    
3. **OOD 场景通过图像编辑生成，再补全成多视角观测。**
    
4. **这个系统能较好预测 policy 排名、不同 OOD 轴的影响，以及部分安全风险。**
    
5. **它更适合做相对评估和 red teaming，而不是精确替代真实世界成功率。**
    

---

# 十二、可直接放进 Obsidian 的简版摘要

**摘要：**  
本文提出一个基于 Veo2 的机器人策略评估系统。作者将视频生成模型微调为 action-conditioned、multi-view consistent 的机器人世界模型，并结合图像编辑生成 OOD 和安全场景。实验在 ALOHA 2 双臂平台、5 个任务、8 个 policy checkpoint 上进行，共完成 1600+ 真机验证。结果表明，该系统对 nominal 场景下的 policy 排名和成功率有较强预测能力，也能较好评估不同 OOD 轴（背景、干扰物、新物体）带来的性能退化，并可用于 red teaming，发现一些真实可复现的危险行为。局限包括接触建模不足、长时 rollout 困难以及仍依赖人工评分。

---

如果你愿意，我下一步可以把这份阅读笔记进一步整理成 **更像课程汇报的 PPT 大纲版** 或者 **更像科研笔记的表格式精简版**。