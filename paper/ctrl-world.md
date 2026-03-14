  

> **用生成世界模型替代真实机器人实验，用 imagination rollout 来评估和改进机器人策略。**
> 
> ctrl-world
![[ctrl-world.png]]
---

# 一、Ctrl-World 想解决什么问题

 评估策略非常贵, 慢

有**世界模型**：

$$o_{t+1:t+H}=W(o_{t},a_{t+1:t+H})
$$
那么机器人可以在 **想象世界中 roll out**，policy → action  
world model → next observation  
policy → action  
# 二、Ctrl-World整体框架

论文核心系统如下（论文 Figure1）：

                instruction  
                      │  
                      ▼  
             Generalist Policy  
                      │  
              action chunk (H)  
                      │  
                      ▼  
                 World Model  
                      │  
         predicted multi-view video  
                      │  
                      ▼  
            next observation → policy

不断循环：

π → action  
W → next state  
π → action  
W → next state

生成：
synthetic trajectory然后用于：
1️⃣ **policy evaluation**  
2️⃣ **policy improvement**

---

# 三、问题：为什么之前world model不行

之前方法的问题：
单视角。
没有精细action控制

	很多 video model 只输入：text  image
	而机器人需要：每个时间步 action
长时序不稳定

    

---

# 四、Ctrl-World 核心贡献

1. Multi-View Joint Prediction

	输入多相机：3 cameras
	模型同时预测所有视角。

论文做法：
把所有图像token拼接：
tokens = concat(view1_tokens, view2_tokens, view3_tokens)
Transformer同时建模。

好处： (1) 减少遮挡，保证多视角一致
2. Frame-level Action Conditioning
对每个frame加入action embedding：
$$
[a'_{t+1},...,a'_{t+H}]
$$
并通过 **frame-wise cross attention** 注入。
结构：
visual tokens  ← cross attention → pose embedding
其中 pose 来自：
action → forward kinematics → end-effector pose
这样每一帧都对应：
robot pose
3. Pose-Conditioned Memory Retrieval

长序列会 drift。

论文加入：**memory retrieval**输入不只是当前帧：history frames, 用stride sampling $o_{t-6}, o_{t-4}, o_{t-2}, o_t$
context 不会太长,同时加入：pose embedding用于检索类似状态。当前 pose 接近：t=0模型会 attend 到：t=0 frame

---

# 五、Ctrl-World模型结构

Ctrl-World 基于：

**Stable Video Diffusion (SVD)**

结构：

Spatial Transformer  
Temporal Transformer

token维度：

P = N × H × W

其中：

N = camera views  
H = latent height  
W = latent width

整体结构：

history frames  
future noisy frames  
action poses  
CLIP text tokens

全部一起输入 diffusion transformer。

论文结构图在 **Figure 2**。

ctrl-world

---

# 六、训练方法

训练目标：

预测未来视频：

x0=ot+1:t+Hx_0 = o_{t+1:t+H}x0​=ot+1:t+H​

diffusion training：

xt′=αt′x0+1−αt′ϵx_{t'} = \sqrt{\alpha_{t'}}x_0 + \sqrt{1-\alpha_{t'}}\epsilonxt′​=αt′​​x0​+1−αt′​​ϵ

模型学习：

x^0=f(xt′,t′,c)\hat x_0 = f(x_{t'},t',c)x^0​=f(xt′​,t′,c)

loss：

L=∣∣x^0−x0∣∣2L = ||\hat x_0 - x_0||^2L=∣∣x^0​−x0​∣∣2

其中条件：

c = [  
 history frames  
 robot poses  
 action chunk  
]

---

# 七、Policy-in-the-loop rollout

论文核心算法（Algorithm 1）：![[ctrl-world-1.png]]### Step1 初始化

τ = [o0]

---

### Step2 policy生成action

at+1:t+H=π(ot,l)a_{t+1:t+H} = π(o_t,l)at+1:t+H​=π(ot​,l)

---

### Step3 world model预测

ot+1:t+H=W(ot,at+1:t+H)o_{t+1:t+H} = W(o_t,a_{t+1:t+H})ot+1:t+H​=W(ot​,at+1:t+H​)

---

### Step4 更新状态

τ ← τ ∪ predicted frames

---

### Step5 重复

直到 horizon。

---

# 八、Policy Improvement 方法

world model 不只是评估。

还可以生成 **synthetic data**。

论文做法：

### 1 生成很多rollout

但 policy 行为通常 deterministic。

例如：

一直抓同一个物体

---

### 2 增加探索

两种方式：

#### (1) instruction paraphrase

例如：

put glove in box  
→ pick cloth and place in box

---

#### (2) reset robot pose

随机初始位置。

---

### 3 人类筛选成功轨迹

保留：

25-50 trajectories

---

### 4 用这些数据 finetune policy

训练目标：

L=∣∣π(o,l)−a∣∣2L = ||\pi(o,l) - a||^2L=∣∣π(o,l)−a∣∣2

即 imitation learning。

---

# 九、实验

## 数据集

使用：

**DROID dataset**

规模：

95,599 trajectories  
564 scenes

机器人：

Franka Panda  
Robotiq gripper

三相机：

1 wrist camera  
2 external cameras

---

# 十、实验结果

### 1 生成质量

指标：

PSNR  
SSIM  
LPIPS  
FID  
FVD

Ctrl-World 明显优于：

WPE  
IRASim

原因：

- multi-view
    
- frame-level action conditioning
    

---

### 2 world model controllability

论文展示：

不同action：

X +6 cm  
X -6 cm  
rotate 15°

生成视频精确变化。

---

### 3 policy evaluation

在world model中测试 policy：

与真实世界 correlation：

instruction following: 0.87  
success rate: 0.81

说明：

world model可以替代真实测试。

---

### 4 policy improvement

使用 synthetic data 微调：

成功率：

38.7% → 83.4%

提升：

**+44.7%**

---

# 十一、Ctrl-World的核心意义

这篇论文提出一个非常重要的 paradigm：

机器人未来训练流程可能变成：

real data  
    ↓  
world model  
    ↓  
imagination rollouts  
    ↓  
policy improvement

而不是：

robot rollout → collect data

---

# 十二、和 DreamDojo / Gemini simulator 的区别

|方法|本质|
|---|---|
|DreamDojo|video world model + latent action|
|Gemini simulator|multi-level world model|
|Ctrl-World|controllable multi-view world model|

核心区别：

### DreamDojo

learn latent action

---

### Gemini

text + pose → video

偏 simulation。

---

### Ctrl-World

重点是：

policy-in-the-loop

即：

policy ↔ world model

闭环交互。

---

# 十三、和 Dreamer / world model 的关系

经典 world model：

state space

例如：

Dreamer

Ctrl-World：

video space

也就是：

**pixel world model**

---

# 十四、这篇论文最大的技术贡献

总结三个：

### 1 controllable video world model

支持：

action → video dynamics

---

### 2 multi-view simulation

支持：

wrist camera

这是 manipulation 非常关键的。

---

### 3 policy evaluation & improvement

可以：

simulate → filter → train

---

# 十五、一个非常重要的理解

Ctrl-World本质是在做：

robotics version of game engine

只是：

learned simulator

而不是：

physics engine

---

如果你愿意，我可以再给你讲 **一个更深的部分**（很多人没看懂）：

1️⃣ **Ctrl-World 的 diffusion transformer 具体结构**  
2️⃣ **frame-level action conditioning 数学实现**  
3️⃣ **为什么 multi-view 能减少 hallucination**  
4️⃣ **为什么 DreamDojo 和 Ctrl-World 本质完全不同**（这个其实非常关键）