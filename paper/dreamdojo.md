  
论文：**DreamDojo: A Generalist Robot World Model from Large-Scale Human Videos**

---
![[dreamdojo-3.png]]
# DreamDojo 阅读笔记

## 1. 论文基本信息

**题目**：DreamDojo: A Generalist Robot World Model from Large-Scale Human Videos  
**核心方向**：具身智能 / 机器人世界模型 / 视频生成 / latent action / human-video pretraining。


**利用大规模人类第一视角视频预训练机器人 world model，再用少量目标机器人数据进行 post-training，最终得到一个能够在开放环境中进行动作条件视频预测、并支持实时 rollout 的通用机器人世界模型。**


world model 的目标是学习状态转移：
$$
[  
s_{t+1}\sim p(\cdot|s_t,a_t)  
]
$$
**也就是给定当前状态和动作，预测未来状态**。论文指出，现有机器人 world model 面临三个核心问题：

1. **机器人数据规模太小**，覆盖场景和动作分布有限。
    
2. **动作空间高维且接触丰富**，比游戏、驾驶等离散控制任务更难。
    
3. **很多人类视频没有动作标签**，难以直接用于 action-conditioned 的 world model 训练。
    

DreamDojo 的思路是：  
**虽然 human 和 robot embodiment 不同，但很多交互背后的物理规律相同，因此可以利用大规模人类视频来学习物理和动态先验。**

---

## 2. 论文核心贡献

论文的主要贡献可以概括为四点：

### (1) 大规模人类视频数据 DreamDojo-HV

作者构建了一个大规模 egocentric human video 数据集，总数据混合后达到 **44,711 小时**，号称是当时最大的 world model 预训练数据之一。

### (2) 用 continuous latent actions 解决无动作标签问题

作者提出使用 **latent action** 作为统一 proxy action，让没有显式动作标签的人类视频也能用于 action-conditioned world model 训练。

### (3) 面向机器人动作控制的架构与训练改进

包括：

- relative actions
    
- chunked action injection
    
- temporal consistency loss  
    这些设计共同提升了动作可控性和物体动态建模质量。
    

### (4) 蒸馏成实时 autoregressive student

作者将 teacher 蒸馏成 few-step、causal、autoregressive 的 student，最终达到 **10.81 FPS**，支持实时交互和长时 rollout。

---

## 3. 训练
### 数据
reamDojo 的 human data 主要来自三部分：

In-lab
实验室桌面场景数据，有精确手部姿态，可重定向到机器人动作。
EgoDex
Apple Vision Pro 采集的 dexterous manipulation 数据，有高精度 3D 手和手指姿态。
DreamDojo-HV
大规模众包第一视角视频，涵盖家庭、工业、零售、教育、行政等场景，技能与物体类别非常丰富。
表 1 给出的规模很关键：

- 总时长：**44,711 小时**
    
- 任务数：**6,015+**
    
- 场景数：**1,135k 量级估计**
    
- 相比先前大型 world model 数据，在技能和场景多样性上大幅提升。
    

### 模型基础
不是从零训练视频模型，而是基于 **Cosmos-Predict2.5** 构建。  
它是一个 **latent video diffusion model**：

- 视频先编码到 WAN2.2 tokenizer 的 latent space
    
- 主干是 DiT
    
- 文本条件通过 cross-attention
    
- timestep 条件通过 sinusoidal embedding + MLP + AdaLN 注入
    
- 训练目标是 flow matching loss。
    

flow matching loss 为：
$$
[  
\mathcal{L}_{flow}(\theta)=\mathbb{E}_{x,\epsilon,c,t}|u(x_t,t,c;\theta)-v_t|^2  
]
$$
其中 (u) 是 denoiser 预测的 velocity，(v_t) 是目标 velocity。

### 阶段 1：Pretraining from human videos

在 In-lab、EgoDex、DreamDojo-HV 三类人类视频上训练 foundation world model，并为所有视频引入 latent action 条件。1:2:10

人类视频没有动作标签，直接做 action-free future prediction 虽然能学一点物理，但学不到强动作因果关系。

![[dreamdojo-1.png]]
![[dreamdojo-2.png]]

latent action 被当作 **统一 proxy action**，让 human videos 和 robot data 可以在统一动作条件空间里训练。

### 阶段 2：训练DreamDojo foundation world model

将模型适配到具体机器人动作空间上，例如 G1、GR-1、AgiBot。
从大量 human videos 中抽取每对帧之间的 latent actions，接着训练真正的 world model。


初始化自
**Cosmos-Predict2.5**。

对视频中连续帧对 $(f_t, f_{t+1})$ ，用刚才训好的 latent action model 提取 $\hat a_t$ 

WAN2.2 的时间压缩比是 4，因此一个 latent frame 对应 4 个像素帧。作者把连续 **4 个动作拼成一个 chunk** 对齐到对应 latent frame，避免 future action 带来的因果混淆。

动作 embedding
他们把 latent actions 先过一个 **轻量 MLP**，投到和 timestep embedding 相同的维度。  
然后：

- **action embedding + timestep embedding**
    
- 再送进每个 DiT block 的 adaptive layer normalization。
除了原始 flow matching loss $Lflow​(θ)=E∥u(xt​,t,c;θ)−vt​∥2$，作者又加了 temporal consistency loss：
$$
[  
\mathcal L_{temporal}(\theta)=  
\mathbb E\Big[\sum_{i=1}^{K-1}| (z_{i+1}-z_i)-(v_{i+1}-v_i)|^2 \Big]  
]
$$
最终总损失：
$$
[  
\mathcal L_{final}=\mathcal L_{flow}+\lambda \mathcal L_{temporal},\quad \lambda=0.1  
]
$$
它能提升动作跟随、物体完整性、减少伪影。
把大而慢的 teacher 蒸馏成可实时自回归 rollout 的 student。

### 第三步 Post-training：适配目标机器人

在人类视频预训练后，DreamDojo 还要对具体机器人动作空间进行适配。

做法是：

- 把目标机器人 ground-truth action 展平成序列
    
- 通过 action MLP 映射到条件空间
    
- 为适配新的动作空间，**重置 action MLP 第一层**
    
- 然后和其余参数一起全量 finetune。
    

训练设置上：

- 目标机器人视频按约 **10 Hz** 采样
    
- clip 长度 **13**
    
- 第 1 帧作 condition frame
    
- 后 12 步动作为 relative actions
    
- 默认 post-training：**128×H100，50k steps，batch size 512**。
    

---

## 11. Distillation：从 teacher 到 student

这是这篇论文另一个非常重要的部分。

### 11.1 为什么蒸馏

teacher 是双向注意力的视频扩散模型：

- 固定 horizon
    
- denoising steps 多，推理慢
    

所以作者把它蒸馏成一个：

- causal attention
    
- few-step diffusion
    
- autoregressive 的 student。
    

### 11.2 两阶段蒸馏

#### (1) Warmup stage

student 回归 teacher ODE 轨迹上的 (x_0)：

# [  
\mathcal L_{warmup}

\mathbb E_{x,t}|G_{student}(x_t,t)-x_0|^2  
]

此时 student 采用 teacher forcing，context 来自 teacher latents。

#### (2) Distillation stage

改为让 student 用 **自己之前生成的 latents** 作为 context，再通过 distribution matching / KL 方向的监督逼近 teacher 分布。这样训练时就更接近测试时的 rollout 方式，减轻误差累积。

### 11.3 蒸馏后的 student

表 6 给出：

- Teacher：predict len 12，context len 1，**2.72 FPS**
    
- Student：predict len 4，context len 12，**10.81 FPS**。
    

这意味着 student 更适合长时 rollout、实时交互和 streaming。

---

## 12. 实验设置

### latent action model

- 700M spatiotemporal Transformer
    
- latent action 维度 32
    
- 24 encoder + 24 decoder blocks
    
- 400k steps
    
- batch size 256
    
- 分辨率 320×240。
    

### world model pretraining

- 基于 Cosmos-Predict2.5
    
- 数据采样比 In-lab:EgoDex:DreamDojo-HV = **1:2:10**
    
- 分辨率 640×480
    
- clip 长度 13
    
- 空文本 prompt
    
- 模型规模 2B / 14B
    
- 140k steps
    
- 256×H100
    
- effective batch size 1024。
    

---

## 13. 主要实验结果

### 13.1 latent action 比 action-free 更有效

表 2 显示，在 In-lab 和 EgoDex 上，  
**latent action pretraining** 明显优于：

- 不预训练
    
- action-free pretraining
    

并且接近理想化的真动作标签方案。

### 13.2 数据规模和多样性很重要

表 3 显示，随着 human data mixture 从 In-lab → In-lab+EgoDex → 再加 DreamDojo-HV，性能持续提升。

### 13.3 模型设计有效

表 5 的消融显示：

- relative action 有帮助
    
- chunked injection 提升明显
    
- temporal consistency loss 进一步提升 expert 和 counterfactual 轨迹质量。
    

### 13.4 distillation 有效

表 6 表明 student 在保持接近 teacher 质量的同时，速度接近 4 倍提升，并且上下文能力更强。

### 13.5 OOD 泛化提升

表 4 的人类偏好评测显示，DreamDojo-14B 在 physics correctness 和 action following 上都显著优于基础 Cosmos-Predict2.5。

---

## 14. 下游应用

### 14.1 Policy evaluation

在 AgiBot fruit packing 上，DreamDojo 模拟成功率与真实成功率的 Pearson 相关系数达到 **0.995**，说明它可作为策略评估 simulator。

### 14.2 Model-based planning

利用多个策略 checkpoint 产生的 action proposals，让 DreamDojo 预测未来，再由外部 value model 选最优 proposal，成功率最高可比最好 checkpoint 提升 **17%**，相较均匀采样接近 **2×** 提升。

### 14.3 Live teleoperation

作者在 RTX 5090 上实现了基于 PICO VR controller 的实时虚拟 G1 teleoperation。

---

## 15. 论文优点

我认为这篇论文的优点主要有：

### 15.1 预训练资源非常强

把大规模 human video 引入机器人 world model，是很有代表性的 foundation model 路线。

### 15.2 latent action 的思路很漂亮

它解决了 “human video 没动作标签” 的核心难题，是整篇论文最重要的方法创新之一。

### 15.3 工程链路完整

从 pretraining → post-training → distillation → downstream applications，整套闭环很完整。

### 15.4 结果不只是“视频更好看”

而是展示了 policy evaluation、planning、teleop 这些真正对机器人有用的能力。

---

## 16. 论文局限

论文自己也承认一些不足：

1. 对一些不常见动作，如 slapping、fast waving，模拟仍不够好。
    
2. 用于 policy evaluation 时，DreamDojo 往往会高估绝对成功率，不擅长细腻失败模式建模。
    
3. 还不自然支持 **multi-view simulation**。
    
4. post-training 如何更好保留预训练知识，还没深入研究。
    

---

## 17. 我的理解与启发

### 17.1 这篇论文本质上是在做“机器人版 world foundation model”

路线很像：

- LLM 用互联网文本预训练
    
- Vision model 用互联网图像预训练
    
- DreamDojo 想做的是：**用互联网/大规模 human interaction video 预训练 robot world model**
    

### 17.2 latent action 是桥梁

这篇论文真正把 “human videos → robot world model” 打通的关键，就是 latent action 这个桥。

### 17.3 它很适合和 policy 结合

DreamDojo 本身不是 policy，而是：

- evaluator
    
- planner
    
- simulator
    
- teleop backend
    

和 diffusion policy / VLA / ManiFlow 这类 action model 是互补关系。

---

