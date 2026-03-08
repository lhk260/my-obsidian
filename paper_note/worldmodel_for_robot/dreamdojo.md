1️⃣ 论文要解决什么问题  
2️⃣ DreamDojo核心思想  
3️⃣ 数据（非常关键）  
4️⃣ 模型结构  
5️⃣ Latent Action（论文最大创新）  
6️⃣ 训练流程（3阶段）  
7️⃣ 蒸馏实时推理  
8️⃣ 实验结果  
9️⃣ 能解决什么实际问题  
🔟 和当前具身智能路线的关系（对你做ManiFlow非常重要）

---

# 一、论文解决什么问题

核心问题其实只有一句话：

**机器人缺少世界模型（World Model）**

即：

st+1∼p(st,at)s_{t+1} \sim p(s_t, a_t)st+1​∼p(st​,at​)

也就是

**给定当前状态 + 动作 → 预测未来世界**

论文第3页明确写了 world model 的定义：

st+1∼p(⋅∣st,at)s_{t+1} \sim p(\cdot | s_t, a_t)st+1​∼p(⋅∣st​,at​)

dreamdojo

---

## 为什么需要 world model

world model 可以：

1️⃣ **预测未来环境**

比如：

机器人推杯子  
可以预测：

杯子会滑动还是倒下

---

2️⃣ **做 planning**

类似人类：

> “如果我这样做会发生什么？”

---

3️⃣ **做 policy evaluation**

不用真的跑机器人  
就能测试策略好不好

---

## 现有world model问题

论文指出三个大问题：

### 1 数据太少

机器人数据：

- expensive
    
- teleoperation
    
- 几千小时
    

但真实世界：

- 无穷环境
    
- 无穷物体
    

---

### 2 动作空间太复杂

机器人动作：

- 关节
    
- 力
    
- 接触
    
- 轨迹
    

远比

游戏 / 自动驾驶

复杂

---

### 3 数据分布太窄

机器人数据：

几种任务

但现实：

无穷任务

---

## DreamDojo的核心思想

一句话：

**用人类视频训练机器人世界模型**

论文核心观点：

> 人和机器人虽然结构不同  
> 但物理世界是一样的

比如：

- 推
    
- 拿
    
- 拉
    
- 放
    

物理规律是一样的

---

# 二、DreamDojo核心框架

论文整体结构如下（page3图1）

流程：

human videos  
      ↓  
latent actions  
      ↓  
world model pretraining  
      ↓  
robot post training  
      ↓  
distillation  
      ↓  
real-time simulation

主要三步：

1️⃣ 人类视频预训练  
2️⃣ 机器人微调  
3️⃣ 蒸馏加速

---

# 三、DreamDojo数据（非常关键）

DreamDojo最大的贡献之一：

**44k小时 human videos**

论文第5页表格显示：

|dataset|hours|
|---|---|
|robot datasets|<3000|
|DreamDojo|**44711 hours**|

dreamdojo

---

数据来源：

### 1 In-lab

实验室数据

带：

- VR tracker
    
- 手部姿态
    

---

### 2 EgoDex

Apple Vision Pro

记录：

- 手
    
- 手指
    
- 操作
    

---

### 3 DreamDojo-HV

众包数据

场景：

- 家庭
    
- 商店
    
- 工厂
    
- 学校
    

论文统计：

- **6000+ skills**
    
- **43000 objects**
    
- **9869 scenes**
    

dreamdojo

---

这个规模远大于所有机器人数据。

---

# 四、DreamDojo模型结构

DreamDojo是一个

**video diffusion world model**

基础模型：

Cosmos-Predict2.5

---

结构：

video frames  
     ↓  
video tokenizer  
     ↓  
latent video  
     ↓  
DiT transformer  
     ↓  
diffusion prediction

核心是：

**DiT (Diffusion Transformer)**

---

### 训练目标

flow matching loss：

Lflow=∣∣u(xt,t,c)−vt∣∣2L_{flow} = ||u(x_t,t,c) - v_t||^2Lflow​=∣∣u(xt​,t,c)−vt​∣∣2

dreamdojo

意思：

模型预测

**噪声变化速度**

---

# 五、论文最大创新：Latent Action

这是这篇论文最关键的点。

---

## 为什么需要 latent action

human video：

没有 action label

只有：

frame_t  
frame_t+1

但 world model 需要：

state + action → next state

---

## DreamDojo解决方法

从视频中 **反推动作**

方法：

训练一个 VAE

输入：

frame_t  
frame_t+1

输出：

latent action

论文结构：

frame_t  
frame_t+1  
     ↓  
latent action encoder  
     ↓  
a_hat  
     ↓  
decoder  
     ↓  
predict frame_t+1

dreamdojo

---

### latent action训练目标

VAE loss：

L=logp(ft+1∣a,ft)−βKLL = log p(f_{t+1}|a,f_t) - \beta KLL=logp(ft+1​∣a,ft​)−βKL

dreamdojo

含义：

latent action必须：

- 能复原未来
    
- 维度小
    

因此只包含：

**关键动作信息**

---

### latent action作用

它成为：

**统一动作空间**

不同 embodiment：

human  
robot  
VR

都映射到：

latent action

---

# 六、三个训练阶段

DreamDojo训练流程：

### Stage1

human video pretraining

video  
latent action

训练 world model

---

### Stage2

robot post training

替换 action space

latent action  
→ robot action

---

### Stage3

distillation

提高推理速度

---

# 七、两个关键模型设计

论文提出两个关键设计：

---

## 1 Relative Action

不用绝对关节

而是：

at=poset−poset−1a_t = pose_t - pose_{t-1}at​=poset​−poset−1​

原因：

更容易学习

---

## 2 Action chunking

tokenizer压缩：

4帧 → 1 latent

所以动作也：

4 actions → 1 chunk

避免因果混乱。

---

# 八、新损失函数

除了 diffusion loss

论文增加：

temporal consistency loss

Ltemporal=∣∣(zi+1−zi)−(vi+1−vi)∣∣2L_{temporal} = ||(z_{i+1}-z_i)-(v_{i+1}-v_i)||^2Ltemporal​=∣∣(zi+1​−zi​)−(vi+1​−vi​)∣∣2

dreamdojo

意义：

学习：

**连续物理变化**

---

# 九、蒸馏（Distillation）

原模型：

50 diffusion steps

太慢

---

蒸馏后：

4 steps

速度：

**10.81 FPS**

dreamdojo

---

蒸馏流程：

teacher → student

训练两阶段：

1️⃣ teacher forcing  
2️⃣ self generation

---

# 十、实验结果

实验验证：

### 1 latent action有效

比无action更好

---

### 2 human data很重要

加入human数据：

性能明显提升

---

### 3 更大模型更好

DreamDojo-14B > 2B

---

### 4 world model可以预测策略好坏

实验：

fruit packing

真实成功率 vs 模拟成功率

Pearson：

0.995

几乎完全一致。

dreamdojo

---

# 十一、三个实际应用

DreamDojo可以做：

---

## 1 Policy evaluation

不用真实机器人

直接模拟。

---

## 2 Model-based planning

类似：

sample actions  
simulate futures  
choose best

成功率提高 **2倍**

---

## 3 VR teleoperation

VR控制器 → 模拟机器人

实时。

---

# 十二、这篇论文真正的意义

DreamDojo的意义其实非常大：

它提出一个新范式：

human video  
→ robot world model

类似：

ImageNet → vision  
Internet text → LLM

DreamDojo试图做：

Internet video → robot world model

---

# 十三、和你现在做的ManiFlow关系

非常重要。

DreamDojo：

predict environment

ManiFlow：

predict action

结合就是：

world model + policy

典型结构：

world model  
     ↓  
planning  
     ↓  
policy

未来具身智能可能是：

VLA  
 + world model  
 + diffusion policy

---

# 十四、这篇论文最大的三个创新

我总结为：

### 1

**44k小时人类视频预训练 world model**

---

### 2

**latent action**

解决：

human video 没动作

---

### 3

**实时world model**

10 FPS simulation