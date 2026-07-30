---
type: ai-explanation
title: "Fast-WAM: Do World Action Models Need Test-time Future Imagination?"
citekey: "yuanFastWAMWorldAction2026"
source: "[[yuanFastWAMWorldAction2026]]"
my_note: "[[yuanFastWAMWorldAction2026.my]]"
verified: false
my_note_done: false
created: 2026-07-30
tags:
  - paper/ai-explanation
---

# 使用说明

> [!tip] 已复制讲解提示词并打开 ChatGPT
> 在 ChatGPT 按 `Ctrl+V` 发送；完成后复制完整 Markdown，回到这里覆盖“等待粘贴”以下内容。

## 在线全文

- 摘要：https://arxiv.org/abs/2603.16666
- HTML 全文：https://arxiv.org/html/2603.16666
- PDF 全文：https://arxiv.org/pdf/2603.16666


# 论文定位

- **论文标题**：Fast-WAM: Do World Action Models Need Test-time Future Imagination?
    
- **citekey**： `yuanFastWAMWorldAction2026`
    
- **arXiv 版本**：arXiv: 2603.16666v2
    
- **版本日期**：2026 年 3 月 23 日
    
- **PDF 总页数**：13 页
    
- **第 2 节标题**： `2 Related Work`
    
- **第 3 节标题**： `3 Method`
    
- **作者**：Tianyuan Yuan、Zibin Dong、Yicheng Liu、Hang Zhao
    
- **主要实验平台**：LIBERO、RoboTwin 2.0、Galaxea R1 Lite 真机毛巾折叠
    
- **主要 backbone**：Wan2.2-TI2V-5B 视频生成模型 + 约 1B 参数 Action DiT
    

**一句话概括：**

Fast-WAM 认为，World Action Model 的主要收益可能并不来自测试时真正生成未来视频，而是来自训练时通过未来视频预测任务学习更好的视觉—动力学表示。因此，它在训练时同时学习未来视频和动作，在推理时删除未来视频生成过程，只保留当前图像编码和动作生成。

更准确地说，论文试图区分两个因素：

1. **训练时的视频预测监督是否有用；**
    
2. **测试时是否必须显式生成未来视频。**
    

论文的核心实验结论是：

> 在本文的 action chunk、闭环重规划和模仿学习 setting 下，训练期视频预测监督非常重要，而测试期显式未来视频生成带来的平均收益较小，却显著增加推理延迟。

需要注意，这并不等价于“机器人永远不需要想象未来”，也不等价于“Fast-WAM 已经学到了完整的动作因果世界模型”。

# 问题设定

## 标准视觉语言动作策略

设：

- 当前视觉观测为 $o$ ；
    
- 当前机器人本体状态为 $s$ ；
    
- 语言任务指令为 $l$ ；
    
- 未来长度为 $H$ 的动作块为 $a_{1:H}$ 。
    

普通 VLA 策略直接学习：

$$  
p_\theta  
\left(  
a_{1:H}  
\mid  
o,l  
\right).  
$$

结合官方代码中的 proprioception 输入，更准确的形式应当是：

$$  
p_\theta  
\left(  
a_{1:H}  
\mid  
o,s,l  
\right).  
$$

这种策略不显式构造未来世界状态，而是直接从当前观测预测接下来的一段动作。

## 典型 World Action Model

典型的 imagine-then-execute WAM 引入未来视觉序列 $v_{1:T}$ 作为中间变量：

 $$  
p  
\left(  
a_{1:H}  
\mid  
o,l  
\right)

\int  
p  
\left(  
v_{1:T}  
\mid  
o,l  
\right)  
p  
\left(  
a_{1:H}  
\mid  
o,l,v_{1:T}  
\right)  
,dv_{1:T}.  
$$

实际模型通常不会精确计算积分，而是先采样一个未来视频：

$$  
\hat v_{1:T}  
\sim  
p  
\left(  
v_{1:T}  
\mid  
o,l  
\right),  
$$

然后根据该未来视频预测动作：

$$  
\hat a_{1:H}  
\sim  
p  
\left(  
a_{1:H}  
\mid  
o,l,\hat v_{1:T}  
\right).  
$$

这类方法的直觉是：

1. 先想象任务会如何发展；
    
2. 再根据想象出的未来决定当前动作。
    

但它也带来非常高的计算开销，因为测试时需要反复运行大型视频生成模型。

## 作者认为现有 WAM 混淆了两个因素

现有 WAM 一般同时包含：

- 训练时预测未来视频；
    
- 测试时生成未来视频；
    
- 动作模型读取生成出的未来视频。
    

因此，当 WAM 比普通策略更好时，很难判断性能提升究竟来自：

### 假设 A：表示学习收益

训练时的视频预测任务迫使模型学习：

- 物体运动；
    
- 场景变化；
    
- 时间一致性；
    
- 接触前后的视觉后果；
    
- 任务相关的动态结构。
    

即使推理时不生成未来，这些训练期学到的表示仍然可能提升动作预测。

### 假设 B：测试时 foresight 收益

模型必须在测试时显式生成未来，动作模块读取未来视觉后，才能获得额外的规划和预见能力。

Fast-WAM 的目标，就是通过受控实验将这两种收益分离。

## 论文真正回答的问题范围

本文并没有证明所有形式的长期规划都不需要未来想象。

论文主要研究的是：

- 每次输出一个长度为 32 的 action chunk；
    
- 执行其中前若干步；
    
- 获取新的真实观测；
    
- 再次闭环重规划。
    

因此，论文更准确地回答：

> 在频繁闭环重规划的 action-chunk 控制中，是否必须在每次动作生成时显式生成一段未来视频？

而不是回答：

> 在长时程、稀疏奖励、开放世界或多分支决策中，机器人是否完全不需要内部未来预测？

# 方法总览

## 四个核心实验模型

论文构造了四种结构相近的模型：

|模型|训练时视频预测|测试时生成未来视频|动作是否读取未来视频|作用|
|---|--:|--:|--:|---|
|Fast-WAM|是|否|否|论文主方法|
|Fast-WAM-Joint|是|是|是，视频和动作联合去噪|模拟联合生成式 WAM|
|Fast-WAM-IDM|是|是|是，先视频后动作|模拟 imagine-then-act|
|Fast-WAM w.o. video co-train|否|否|否|检验视频辅助监督|

这组对照的核心逻辑是：

- Fast-WAM 与 no-video-co-train 的差异，反映**训练期未来视频监督**的作用；
    
- Fast-WAM 与 Joint/IDM 的差异，反映**测试期显式未来想象**的作用。
    

## Fast-WAM 的训练数据流

训练样本包含：

- 一段多相机 RGB 视频；
    
- 当前 proprioceptive state；
    
- 语言任务指令；
    
- 对应的动作序列。
    

整体数据流为：

$$  
\begin{aligned}  
&\text{多相机 RGB 序列}  
\xrightarrow{\text{Resize + Concat}}  
x_{0:T}  
\xrightarrow{E_{\mathrm{VAE}}}  
z_{0:T},  
\  
&\text{语言指令}  
\xrightarrow{E_{\mathrm{T5}}}  
c_l,  
\  
&\text{当前 proprioception}  
\xrightarrow{W_s}  
c_s,  
\  
&z_{1:T}\text{ 加噪},  
\qquad  
a_{1:H}\text{ 加噪},  
\  
&\left(  
z_{0:T}^{\mathrm{noise}},  
a_{1:H}^{\mathrm{noise}},  
c_l,  
c_s  
\right)  
\xrightarrow{\text{Video DiT + Action DiT + MoT}}  
\left(  
\hat u_v,  
\hat u_a  
\right),  
\  
&\left(  
\hat u_v,  
\hat u_a  
\right)  
\xrightarrow{\text{Flow Matching Loss}}  
\mathcal L_{\mathrm{video}}  
+  
\lambda_a  
\mathcal L_{\mathrm{action}}.  
\end{aligned}  
$$

其中：

- 当前帧 latent $z_0$ 保持干净；
    
- 未来视频 latent $z_{1:T}$ 被加噪；
    
- 动作序列 $a_{1:H}$ 被独立加噪；
    
- Video DiT 学习未来视频 velocity field；
    
- Action DiT 学习动作 velocity field。
    

## Fast-WAM 的推理数据流

推理时完全不生成未来视频：

$$  
\begin{aligned}  
&\text{当前多相机 RGB}  
\xrightarrow{E_{\mathrm{VAE}}}  
z_0,  
\  
&\text{语言与 proprioception}  
\xrightarrow{}  
c,  
\  
&(z_0,c)  
\xrightarrow{\text{Video DiT，仅运行一次}}  
\mathcal C_{\mathrm{video}},  
\  
&\epsilon_a  
\sim  
\mathcal N(0,I),  
\  
&\epsilon_a  
\xrightarrow[\text{读取视觉 KV cache}]{\text{Action Flow Denoising}}  
\hat a_{1:H}.  
\end{aligned}  
$$

这里的 $\mathcal C_{\mathrm{video}}$ 表示 Video DiT 为当前帧生成的分层 KV cache。

## “Fast”的真正来源

Fast-WAM 的加速不是因为动作生成变成了一次前向传播。

它仍然需要多步动作 flow matching。

真正被删除的是：

- 未来视频高斯噪声初始化；
    
- 未来视频多步去噪；
    
- 未来视频 VAE 解码；
    
- 动作模型再次读取完整未来视频。
    

因此，其准确描述是：

> 当前世界表征只编码一次，之后的多个动作去噪步重复使用同一份视觉 KV cache。

# 输入、输出与张量

## 论文层面的变量

|变量|含义|训练时|推理时|
|---|---|--:|--:|
| $o_t$ |当前视觉观测|输入|输入|
| $s_t$ |当前 proprioceptive state|输入|输入|
| $l$ |语言任务指令|输入|输入|
| $a_{1:H}$ |GT 动作块|监督目标|模型输出|
| $v_{1:T}$ |未来 RGB 视频|视频监督来源|Fast-WAM 不生成|
| $z_{1:T}$ |未来 RGB 的 VAE latent|视频 flow target|Fast-WAM 不生成|
| $\epsilon_v$ |视频高斯噪声|输入|Fast-WAM 不使用|
| $\epsilon_a$ |动作高斯噪声|输入|动作初始化|
| $\hat u_v$ |预测的视频 velocity|输出|不输出|
| $\hat u_a$ |预测的动作 velocity|输出|每个去噪步输出|
| $\hat a_{1:H}$ |最终动作块|可用于训练评估|部署输出|

## LIBERO 输入形状

官方配置使用两个相机：

- 主视角图像： $[3,224,224]$ ；
    
- 腕部图像： $[3,224,224]$ ；
    
- 水平拼接后： $[3,224,448]$ 。
    

训练样本的主要形状为：

|张量|形状|
|---|---|
|RGB 视频| $[B,3,33,224,448]$ |
|Action| $[B,32,7]$ |
|State| $[B,T_s,8]$ |
|文本 context| $[B,L,4096]$ |
|Proprioception token| $[B,1,4096]$ |
|输出动作块| $[B,32,7]$ |

动作维度 7 的含义为：

- EEF position / orientation：6 维；
    
- gripper：1 维。
    

状态维度 8 的含义为：

- EEF position：3 维；
    
- EEF orientation 的 axis-angle：3 维；
    
- gripper qpos：2 维。
    

虽然数据接口提供状态序列，但官方模型只取第一个时刻：

 $$  
s_{\mathrm{input}}

s_{[:,0,:]}.  
$$

即 Fast-WAM 推理时使用当前 proprioception，而不是完整状态历史。

## 视频时间长度

LIBERO 配置中：

- 原始图像时间长度为 33；
    
- 动作长度为 32；
    
- action-video frequency ratio 为 4。
    

经过 Wan 视频 VAE 时间压缩后，33 帧对应 9 个 latent 时间步：

#$$  
T_{\mathrm{latent}}

# \frac{33-1}{4}  
+  
1

$$

其中：

- 第 1 个 latent 时间步对应当前帧；
    
- 后续 8 个 latent 时间步对应未来视频。
    

## LIBERO 视频 latent 的合理推断

Wan VAE 的 latent 通道数为 48，空间压缩倍数约为 16，因此可推断：

$$  
z_{\mathrm{LIBERO}}  
\in  
\mathbb R^{  
B  
\times  
48  
\times  
9  
\times  
14  
\times  
28  
}.  
$$

Video DiT 使用的 patch size 为：

$$  
(1,2,2).  
$$

因此每个 latent 时间步产生的视频 token 数约为：

# $$  
N_{\mathrm{frame}}

# \frac{14}{2}  
\times  
\frac{28}{2}

$$

9 个 latent 时间步总共约为：

# $$  
N_{\mathrm{video}}

# 9  
\times  
98

$$

其中当前帧约包含 98 个 token，未来视频约包含 784 个 token。

这部分形状是根据官方配置和 Wan VAE 压缩方式推断，不是论文正文直接列出的数字。

## RoboTwin 输入形状

RoboTwin 使用三个相机：

- 高位相机；
    
- 左腕相机；
    
- 右腕相机。
    

单相机预处理大小为：

$$  
[3,240,320].  
$$

最终组合图像大小为：

$$  
[3,384,320].  
$$

主要张量为：

|张量|形状|
|---|---|
|RGB 视频| $[B,3,33,384,320]$ |
|Action| $[B,32,14]$ |
|State| $[B,T_s,14]$ |
|输出动作块| $[B,32,14]$ |

合理推断其 VAE latent 形状约为：

$$  
z_{\mathrm{RoboTwin}}  
\in  
\mathbb R^{  
B  
\times  
48  
\times  
9  
\times  
24  
\times  
20  
}.  
$$

经过 $2\times2$ 空间 patch 后，每个 latent 时间步的视频 token 数约为：

# $$  
N_{\mathrm{frame}}

# \frac{24}{2}  
\times  
\frac{20}{2}

$$

总视频 token 数约为：

# $$  
N_{\mathrm{video}}

# 9  
\times  
120

$$

RoboTwin 三相机在 $384\times320$ 画布中的具体排列需要检查代码中的 `concat_multi_camera="robotwin"` 实现。

# 模块逐一讲解

## T5 语言编码器

语言任务指令 $l$ 由 Wan2.2 使用的 T5 编码器转换为语言 context：

# $$  
c_l

E_{\mathrm{T5}}(l).  
$$

其形状约为：

$$  
c_l  
\in  
\mathbb R^{B\times L\times4096}.  
$$

Video DiT 和 Action DiT 都能够通过 cross-attention 读取语言信息。

训练机器人策略时，T5 embedding 可以提前缓存，因此 T5 不一定在每个训练 iteration 中重复运行。

## Proprioception encoder

当前 state 经过一个线性层：

# $$  
c_s

W_s s_t+b_s.  
$$

其中：

$$  
s_t  
\in  
\mathbb R^{D_s},  
\qquad  
c_s  
\in  
\mathbb R^{4096}.  
$$

随后，proprioception token 被拼接到语言 context 后：

# $$  
c

[c_l;c_s].  
$$

因此从 Transformer 的角度看：

- 语言是长度为 $L$ 的 context token；
    
- 当前 proprioception 是额外的 1 个 context token。
    

这种设计非常简单，但也存在限制：

1. 没有显式使用 proprioception 历史；
    
2. 没有将视觉状态和机器人状态构造为统一的时序 state token；
    
3. 连续控制状态与语言 token 共用相同的 context 通道。
    

## 视频 VAE

输入视频经过预训练视频 VAE：

# $$  
z_{0:T}

E_{\mathrm{VAE}}  
\left(  
x_{0:T}  
\right).  
$$

视频 VAE 的主要作用是：

1. 压缩 RGB 空间；
    
2. 降低视频生成成本；
    
3. 使用 Wan2.2 预训练模型熟悉的 latent 表示；
    
4. 将未来预测从像素级生成转为 latent flow matching。
    

需要注意：

> Fast-WAM 虽然不是直接在 RGB 像素上计算损失，但其视频监督仍然来自未来 RGB 帧。

因此，它仍然属于视觉视频预测，只是预测空间变成了 VAE latent。

## Video DiT

Video DiT 来自 Wan2.2-TI2V-5B。

官方配置中的主要参数为：

- hidden dimension：3072；
    
- FFN dimension：14336；
    
- Transformer layers：30；
    
- attention heads：24；
    
- head dimension：128；
    
- latent input/output channels：48。
    

训练时，Video DiT 接收：

- 当前帧干净 latent；
    
- 被加噪的未来 latent；
    
- 语言 context；
    
- proprioception context。
    

其目标是预测未来视频 latent 对应的 velocity field。

推理时，Fast-WAM 不再向 Video DiT 输入未来 latent，只输入当前帧：

# $$  
h_0

E_{\mathrm{video}}  
\left(  
z_0,c  
\right).  
$$

此时 Video DiT 的角色从：

> 未来视频生成器

变为：

> 当前世界状态编码器。

## Action DiT

Action DiT 是约 1B 参数的动作生成模型。

主要配置为：

- hidden dimension：1024；
    
- FFN dimension：4096；
    
- Transformer layers：30；
    
- attention heads：24；
    
- head dimension：128。
    

动作序列被表示为：

$$  
a  
\in  
\mathbb R^{B\times H\times D_a}.  
$$

每一个时间步对应一个 action token。

动作加噪后得到：

$$  
a_t  
\in  
\mathbb R^{B\times H\times D_a}.  
$$

Action DiT 输出相同形状的 velocity：

$$  
\hat u_a  
\in  
\mathbb R^{B\times H\times D_a}.  
$$

与自回归动作 token 不同，Action DiT 会联合生成整个 action chunk，而不是依次生成：

$$  
a_1  
\rightarrow  
a_2  
\rightarrow  
\cdots  
\rightarrow  
a_H.  
$$

## Mixture-of-Transformer

Video DiT 和 Action DiT 的 hidden dimension 不同：

# $$  
d_{\mathrm{video}}

3072,  
$$

# $$  
d_{\mathrm{action}}

$$

但两者具有相同的：

- 层数；
    
- attention head 数；
    
- 单个 head dimension。
    

因此它们可以在每一层中形成 mixed attention。

可以抽象地写成：

$$  
\begin{aligned}  
H_v^{\ell+1}  
&=  
\operatorname{VideoBlock}_{\ell}  
\left(  
H_v^\ell,  
H_a^\ell,  
c,  
M  
\right),  
\  
H_a^{\ell+1}  
&=  
\operatorname{ActionBlock}_{\ell}  
\left(  
H_a^\ell,  
H_v^\ell,  
c,  
M  
\right).  
\end{aligned}  
$$

其中：

- $H_v^\ell$ 是第 $\ell$ 层视频 token；
    
- $H_a^\ell$ 是第 $\ell$ 层动作 token；
    
- $M$ 是结构化 attention mask；
    
- $c$ 是语言和 proprioception context。
    

## 结构化注意力掩码

将 token 分为：

- $F_0$ ：当前帧视频 token；
    
- $F_+$ ：未来视频 token；
    
- $A$ ：动作 token。
    

Fast-WAM 的信息可见关系为：

|Query / Key| $F_0$ | $F_+$ | $A$ |
|---|--:|--:|--:|
| $F_0$ |可见|不可见|不可见|
| $F_+$ |可见|可见|不可见|
| $A$ |可见|不可见|可见|

最关键的约束是：

$$  
A  
\not\rightarrow  
F_+.  
$$

即动作 token 不能读取未来视频 token。

动作 token 只能读取：

- 当前帧视频 token；
    
- 其他动作 token；
    
- 语言和 proprioception context。
    

可形式化为：

# $$  
H_A^{\ell+1}

\operatorname{ActionBlock}_{\ell}  
\left(  
Q=H_A^\ell,;  
K,V=  
[H_A^\ell,H_{F_0}^\ell]  
\right).  
$$

而不能写成：

# $$  
H_A^{\ell+1}

\operatorname{ActionBlock}_{\ell}  
\left(  
Q=H_A^\ell,;  
K,V=  
[H_A^\ell,H_{F_0}^\ell,H_{F_+}^\ell]  
\right).  
$$

这一设计的目的，是保证：

> Fast-WAM 的动作预测在训练时也不能直接使用 GT 未来视频，因此部署时删除未来视频不会破坏动作的信息通路。

## 当前帧的因果隔离

当前帧 token 本身也不能读取未来帧 token：

$$  
F_0  
\not\rightarrow  
F_+.  
$$

否则可能出现间接泄漏：

1. 当前帧 token 读取未来 token；
    
2. 动作 token 再读取被未来信息污染的当前帧 token；
    
3. 未来信息通过两跳路径泄漏给动作。
    

因此，Fast-WAM 同时阻止：

$$  
A  
\rightarrow  
F_+,  
$$

以及：

$$  
F_0  
\rightarrow  
F_+.  
$$

## KV cache

推理时，当前图像和语言不会在每个动作去噪步中变化。

因此可以先运行一次 Video DiT，缓存每一层的 key 和 value：

# $$  
\mathcal C_v

\left{  
K_v^1,V_v^1,  
K_v^2,V_v^2,  
\ldots,  
K_v^L,V_v^L  
\right}.  
$$

第 $k$ 个动作去噪步只需要重新计算动作 query、key 和 value，并读取缓存的视频信息：

# $$  
H_A^{\ell+1,k}

\operatorname{ActionBlock}_{\ell}  
\left(  
Q=H_A^{\ell,k},;  
K,V=  
[  
H_A^{\ell,k},  
\mathcal C_v^\ell  
]  
\right).  
$$

这使得 Video DiT 只运行一次，而不是在每个动作 flow step 中重复运行。

## Fast-WAM 的世界模型是否 action-conditioned

官方基础配置中：

- Video DiT 的 `action_conditioned=false` 。
    

因此视频分支更接近学习：

$$  
p  
\left(  
z_{1:T}  
\mid  
z_0,l,s_0  
\right),  
$$

而不是严格的动作条件动力学：

$$  
p  
\left(  
z_{1:T}  
\mid  
z_0,a_{1:H},l,s_0  
\right).  
$$

这一区别非常重要。

前者学习的是：

> 在当前任务和示范策略下，场景通常会如何发展。

后者学习的是：

> 给定不同动作，世界分别会如何变化。

因此 Fast-WAM 基础模型并没有显式建模反事实动作因果。

# 训练流程

## 第一步：采样演示窗口

从机器人 demonstration 中采样：

- 多相机 RGB 序列；
    
- 当前及后续 state；
    
- 长度为 32 的动作序列；
    
- 语言任务描述；
    
- padding mask。
    

对于 LIBERO，官方数据目录使用了 `no_noops` 版本，说明数据预处理中可能删除了部分无动作帧。

这一数据清洗细节正文没有充分展开。

## 第二步：多相机图像预处理

每个相机分别进行 resize：

# $$  
\tilde x_t^c

\operatorname{Resize}  
\left(  
x_t^c  
\right).  
$$

随后多相机图像进行拼接：

# $$  
x_t

\operatorname{Concat}  
\left(  
\tilde x_t^1,  
\tilde x_t^2,  
\ldots,  
\tilde x_t^C  
\right).  
$$

LIBERO 使用水平拼接：

$$  
x_t  
\in  
\mathbb R^{3\times224\times448}.  
$$

## 第三步：VAE 编码

将整段视频编码为 latent：

# $$  
z_{0:T}

E_{\mathrm{VAE}}  
\left(  
x_{0:T}  
\right).  
$$

VAE 参数冻结，不参与机器人数据微调。

## 第四步：构造语言和 state context

语言编码：

# $$  
c_l

E_{\mathrm{T5}}(l).  
$$

当前 state 编码：

# $$  
c_s

W_s s_0+b_s.  
$$

组合 context：

# $$  
c

[c_l;c_s].  
$$

## 第五步：分别采样视频和动作噪声

视频噪声：

$$  
\epsilon_v  
\sim  
\mathcal N(0,I).  
$$

动作噪声：

$$  
\epsilon_a  
\sim  
\mathcal N(0,I).  
$$

视频与动作分别采样 flow timestep：

$$  
t_v  
\sim  
p(t),  
$$

$$  
t_a  
\sim  
p(t).  
$$

代码中 $t_v$ 和 $t_a$ 可以不同，不要求共享同一噪声强度。

## 第六步：构造视频 flow 输入

对于完整视频 latent：

# $$  
z_{t_v}

(1-t_v)z  
+  
t_v\epsilon_v.  
$$

但 Fast-WAM 会将当前帧重新替换为干净 latent：

# $$  
z_{t_v}^{[:, :, 0:1]}

z_0.  
$$

因此实际输入可以理解为：

# $$  
\tilde z_{t_v}

[  
z_0,  
z_{1:T,t_v}  
].  
$$

其中：

- 当前帧完全干净；
    
- 未来 latent 按 flow timestep 加噪。
    

## 第七步：构造动作 flow 输入

动作序列加噪：

# $$  
a_{t_a}

(1-t_a)a  
+  
t_a\epsilon_a.  
$$

动作模型接收整个动作块：

$$  
a_{t_a}  
\in  
\mathbb R^{B\times32\times D_a}.  
$$

## 第八步：Video DiT 和 Action DiT 前向传播

视频分支：

# $$  
H_v^0

\operatorname{VideoPreDiT}  
\left(  
\tilde z_{t_v},  
t_v,  
c  
\right).  
$$

动作分支：

# $$  
H_a^0

\operatorname{ActionPreDiT}  
\left(  
a_{t_a},  
t_a,  
c  
\right).  
$$

随后通过多层 MoT：

# $$  
\left(  
H_v^L,H_a^L  
\right)

\operatorname{MoT}  
\left(  
H_v^0,  
H_a^0,  
M,  
c  
\right).  
$$

## 第九步：输出视频和动作 velocity

视频输出：

# $$  
\hat u_v

\operatorname{VideoPostDiT}  
\left(  
H_v^L  
\right).  
$$

动作输出：

# $$  
\hat u_a

\operatorname{ActionPostDiT}  
\left(  
H_a^L  
\right).  
$$

## 第十步：计算 flow matching target

对于任意数据 $y$ ，线性 flow path 为：

# $$  
y_t

(1-t)y+t\epsilon.  
$$

对 $t$ 求导：

# $$  
\frac{dy_t}{dt}

\epsilon-y.  
$$

因此目标 velocity 为：

# $$  
u^\star

\epsilon-y.  
$$

视频目标：

# $$  
u_v^\star

\epsilon_v-z.  
$$

动作目标：

# $$  
u_a^\star

\epsilon_a-a.  
$$

## 第十一步：视频损失

视频损失为：

# $$  
\mathcal L_{\mathrm{video}}

\mathbb E  
\left[  
\left|  
\hat u_v-u_v^\star  
\right|_2^2  
\right].  
$$

当前帧不参与未来视频 loss，padding latent 也会通过 mask 被忽略。

## 第十二步：动作损失

动作损失为：

# $$  
\mathcal L_{\mathrm{action}}

\mathbb E  
\left[  
\left|  
\hat u_a-u_a^\star  
\right|_2^2  
\right].  
$$

padding action timestep 会被 `action_is_pad` mask 忽略。

## 第十三步：总损失

总目标为：

# $$  
\mathcal L

\lambda_v  
\mathcal L_{\mathrm{video}}  
+  
\lambda_a  
\mathcal L_{\mathrm{action}}.  
$$

论文正文主要写成：

# $$  
\mathcal L

\mathcal L_{\mathrm{action}}  
+  
\lambda  
\mathcal L_{\mathrm{video}}.  
$$

当前官方代码的默认配置中，两项权重均为 1：

# $$  
\lambda_v

1,  
$$

# $$  
\lambda_a

$$

但论文对应的确切训练配置仍应以论文发布 checkpoint 的配置快照为准。

## 第十四步：参数更新

当前官方训练代码采用：

- 冻结视频 VAE；
    
- 冻结 T5；
    
- 训练整个 MoT；
    
- 训练 Video DiT；
    
- 训练 Action DiT；
    
- 训练 proprioception linear encoder。
    

因此，视频损失会直接更新用于当前帧编码的 Video DiT。

这意味着视频 loss 并不是只训练一个独立预测头，而是在真实地改变动作策略所读取的视觉表示。

# 推理流程

## 第一步：读取当前观测

在重规划时刻 $t$ ，机器人读取：

$$  
(o_t,s_t,l).  
$$

其中：

- $o_t$ 为当前多相机 RGB；
    
- $s_t$ 为当前 proprioception；
    
- $l$ 为任务语言。
    

Fast-WAM 不输入过去多帧历史，也不输入真实未来。

## 第二步：编码当前图像

当前图像经过 VAE：

# $$  
z_0

E_{\mathrm{VAE}}  
\left(  
o_t  
\right).  
$$

此时不创建未来视频噪声张量。

## 第三步：编码语言和 state

# $$  
c_l

E_{\mathrm{T5}}(l),  
$$

# $$  
c_s

W_s s_t+b_s,  
$$

# $$  
c

[c_l;c_s].  
$$

## 第四步：运行一次 Video DiT

将当前帧的 video timestep 设置为 0：

# $$  
t_v

$$

运行 Video DiT：

# $$  
H_v

E_{\mathrm{video}}  
\left(  
z_0,t_v=0,c  
\right).  
$$

随后缓存所有层的视频 KV：

# $$  
\mathcal C_v

\operatorname{KVCache}  
\left(  
H_v  
\right).  
$$

这是 Fast-WAM 所说的 single forward pass。

它指的是：

> Video DiT 对当前世界只编码一次。

并不表示整个动作策略只运行一次网络。

## 第五步：初始化动作噪声

$$  
a^{(K)}  
\sim  
\mathcal N  
\left(  
0,  
I_{H\times D_a}  
\right).  
$$

代码中：

# $$  
H

$$

LIBERO 中：

$$  
a^{(K)}  
\in  
\mathbb R^{1\times32\times7}.  
$$

RoboTwin 中：

$$  
a^{(K)}  
\in  
\mathbb R^{1\times32\times14}.  
$$

## 第六步：动作 flow 去噪

对于第 $k$ 个去噪步：

# $$  
\hat u_a^{(k)}

f_{\theta_a}  
\left(  
a^{(k)},  
t_k,  
c,  
\mathcal C_v  
\right).  
$$

然后按照 scheduler 更新：

# $$  
a^{(k-1)}

a^{(k)}  
+  
\Delta t_k  
\hat u_a^{(k)}.  
$$

实验中使用 10 个动作去噪步：

# $$  
K

$$

最终得到：

# $$  
\hat a_{1:32}

a^{(0)}.  
$$

## 第七步：动作反归一化

模型输出处于归一化动作空间：

$$  
\hat a^{\mathrm{norm}}  
\longrightarrow  
\hat a^{\mathrm{robot}}.  
$$

LIBERO 还需要处理：

- gripper sign 翻转；
    
- gripper action invert；
    
- 可选的 gripper binarization。
    

## 第八步：闭环执行

模型预测 32 步，但只执行前 $R$ 步：

$$  
\hat a_{1:R}.  
$$

然后获取新观测并重新规划：

$$  
(o_{t+R},s_{t+R})  
\longrightarrow  
\hat a_{t+R:t+R+H}.  
$$

官方发布的 LIBERO 评估配置使用：

# $$  
R

$$

因此其部署行为是：

> 预测 32 步，执行 10 步，重新观察，再预测新的 32 步。

## Fast-WAM 删除了什么

Fast-WAM 推理时删除：

- 未来视频 latent 初始化；
    
- 未来视频 flow denoising；
    
- 视频 VAE decode；
    
- 动作模型读取生成未来；
    
- 视频和动作联合迭代生成。
    

但它仍然保留：

- 当前图像 VAE encode；
    
- 当前图像 Video DiT encode；
    
- 动作 flow matching；
    
- 多步动作去噪；
    
- action chunk；
    
- 闭环重规划。
    

因此更准确的归类是：

> training-time generative world modeling + test-time latent action policy。

# 公式讲解

## 直接动作策略

普通策略直接建模：

$$  
p_\theta  
\left(  
a_{1:H}  
\mid  
o,l  
\right).  
$$

代码级更完整形式为：

$$  
p_\theta  
\left(  
a_{1:H}  
\mid  
o,s,l  
\right).  
$$

这里不显式引入未来视觉变量。

## Imagine-then-execute WAM

# $$  
p  
\left(  
a_{1:H}  
\mid  
o,l  
\right)

\int  
p  
\left(  
v_{1:T}  
\mid  
o,l  
\right)  
p  
\left(  
a_{1:H}  
\mid  
o,l,v_{1:T}  
\right)  
,dv_{1:T}.  
$$

其含义是：

1. 当前观测可能对应多个未来；
    
2. 对所有未来下的动作分布进行边缘化；
    
3. 实际实现通常使用少数未来样本近似。
    

## Fast-WAM 的 latent world representation

Fast-WAM 将当前世界压缩成表示：

# $$  
z

E_{\mathrm{world}}  
\left(  
o,l  
\right).  
$$

代码级应写为：

# $$  
z

E_{\mathrm{world}}  
\left(  
o,s,l  
\right).  
$$

动作分布为：

# $$  
p_\theta  
\left(  
a_{1:H}  
\mid  
o,s,l  
\right)

p_\theta  
\left(  
a_{1:H}  
\mid  
z  
\right).  
$$

这里的 $z$ 并不是测试时生成的未来轨迹，而是当前观测经过视频预测训练塑造后的世界表示。

## Flow matching 的线性路径

给定真实样本 $y$ 和高斯噪声 $\epsilon$ ：

# $$  
y_t

(1-t)y+t\epsilon,  
\qquad  
t\in[0,1].  
$$

当 $t=0$ 时：

# $$  
y_0

y.  
$$

当 $t=1$ 时：

# $$  
y_1

\epsilon.  
$$

其导数为：

# $$  
\frac{dy_t}{dt}

\epsilon-y.  
$$

因此真实 velocity field 为：

# $$  
u^\star  
\left(  
y_t,t  
\right)

\epsilon-y.  
$$

## Flow matching 损失

# $$  
\mathcal L_{\mathrm{FM}}

## \mathbb E_{y,\epsilon,t}  
\left[  
\left|  
f_\theta  
\left(  
y_t,t,\text{condition}  
\right)

(\epsilon-y)  
\right|_2^2  
\right].  
$$

模型不是直接预测干净数据，而是预测当前 noisy sample 沿概率路径应当移动的方向。

## 动作 flow loss

令：

# $$  
y

a_{1:H}.  
$$

则：

# $$  
a_t

(1-t)a+t\epsilon_a.  
$$

动作 velocity target 为：

# $$  
u_a^\star

\epsilon_a-a.  
$$

动作损失为：

# $$  
\mathcal L_{\mathrm{action}}

## \mathbb E  
\left[  
\left|  
f_{\theta_a}  
\left(  
a_t,t,o,s,l  
\right)

(\epsilon_a-a)  
\right|_2^2  
\right].  
$$

## 视频 flow loss

令：

# $$  
y

z_{1:T}.  
$$

其中：

# $$  
z_{1:T}

E_{\mathrm{VAE}}  
\left(  
v_{1:T}  
\right).  
$$

未来视频 noisy latent 为：

# $$  
z_t

(1-t)z+t\epsilon_v.  
$$

视频 velocity target 为：

# $$  
u_v^\star

\epsilon_v-z.  
$$

视频损失为：

# $$  
\mathcal L_{\mathrm{video}}

## \mathbb E  
\left[  
\left|  
f_{\theta_v}  
\left(  
z_t,t,z_0,s,l  
\right)

(\epsilon_v-z)  
\right|_2^2  
\right].  
$$

## 总训练目标

# $$  
\mathcal L

\mathcal L_{\mathrm{action}}  
+  
\lambda  
\mathcal L_{\mathrm{video}}.  
$$

这一目标验证的是：

> 未来视频生成监督能否改善用于动作生成的共享表示。

但它不能自动证明：

- 表示一定编码物理参数；
    
- 模型一定理解动作因果；
    
- 视频预测越准确，动作一定越好；
    
- 表示可以支持反事实规划。
    

# 实验与 Claim—Evidence

## 实验设置

### LIBERO

论文使用四个 suite：

- LIBERO-Spatial；
    
- LIBERO-Object；
    
- LIBERO-Goal；
    
- LIBERO-Long。
    

每个 suite 包含 10 个任务，每个 suite 使用 500 条 demonstrations。

总任务数为：

# $$  
4  
\times  
10

$$

每个任务评估 50 次，因此总评估 episode 数为：

# $$  
40  
\times  
50

$$

训练步数为：

$$  
20{,}000.  
$$

### RoboTwin 2.0

论文使用：

- 50 余个任务；
    
- 2500 条 clean demonstrations；
    
- 25,000 条 domain-randomized demonstrations；
    
- clean 和 randomized 两种测试环境；
    
- 每个任务每种 setting 评估 100 次。
    

训练步数为：

$$  
30{,}000.  
$$

### 真机毛巾折叠

真机实验使用：

- Galaxea R1 Lite；
    
- 60 小时 teleoperation 数据；
    
- 毛巾折叠任务；
    
- success rate；
    
- average completion time；
    
- 单次推理 latency。
    

推理延迟在 NVIDIA RTX 5090D V2 32GB 上测量。

## RoboTwin 结果

论文表 1，PDF 第 7 页：

|模型|Clean|Randomized|平均|
|---|--:|--:|--:|
| $\pi_0$ |65.92|58.40|62.2|
| $\pi_{0.5}$ |82.74|76.76|79.8|
|Motus|88.66|87.02|87.8|
|LingBot-VA|92.90|91.50|92.2|
|Fast-WAM|91.88|91.78|91.8|
|Fast-WAM-Joint|90.84|90.32|90.6|
|Fast-WAM-IDM|91.16|91.34|91.3|
|Fast-WAM w.o. video co-train|82.76|84.80|83.8|

删除视频 co-training 后平均下降：

# $$  
91.8-83.8

8.0.  
$$

而显式未来想象模型与 Fast-WAM 的差异为：

# $$  
91.8-91.3

0.5,  
$$

以及：

# $$  
91.8-90.6

1.2.  
$$

因此，在 RoboTwin 平均指标上：

- 视频 co-training 带来约 8 个百分点；
    
- 测试时显式未来想象没有带来平均提升。
    

## LIBERO 结果

论文表 2，PDF 第 8 页：

|模型|Spatial|Object|Goal|Long|平均|
|---|--:|--:|--:|--:|--:|
| $\pi_{0.5}$ |98.8|98.2|98.0|92.4|96.9|
|LingBot-VA|98.5|99.6|97.2|98.5|98.5|
|Motus|96.8|99.8|96.6|97.6|97.7|
|Fast-WAM|98.2|100.0|97.0|95.2|97.6|
|Fast-WAM-Joint|99.0|100.0|98.2|96.8|98.5|
|Fast-WAM-IDM|98.8|99.8|97.4|96.0|98.0|
|Fast-WAM w.o. video co-train|94.2|100.0|96.8|83.2|93.5|

删除视频 co-training 后平均下降：

# $$  
97.6-93.5

4.1.  
$$

主要下降来自：

- Spatial；
    
- Long-horizon tasks。
    

显式想象带来的平均提升为：

# $$  
98.5-97.6

0.9  
$$

和：

# $$  
98.0-97.6

0.4.  
$$

因此 LIBERO 上显式未来生成存在小幅平均提升，但远小于视频 co-training 被删除时的下降。

## 真机结果

论文图 4，PDF 第 9 页报告：

- Fast-WAM latency：190 ms；
    
- Fast-WAM-IDM latency：810 ms；
    
- 无视频 co-training 的 Fast-WAM 成功率仅为 10%；
    
- Fast-WAM-IDM 在 Fast-WAM family 中成功率最高；
    
- Fast-WAM 的平均任务完成时间更短；
    
- 带视频 co-training 的模型明显优于没有机器人预训练的 $\pi_{0.5}$ 。
    

IDM 相对 Fast-WAM 的延迟倍率为：

$$  
\frac{810}{190}  
\approx  
4.26.  
$$

因此论文“超过 $4\times$ 加速”的主要依据是：

> Fast-WAM 相对于先生成视频再预测动作的 IDM 结构，将延迟从 810 ms 降至 190 ms。

## Claim—Evidence 对应

|Claim|Evidence|支持程度|证据边界|
|---|---|---|---|
|测试时不生成未来也能取得强性能|表 1、表 2 中 Fast-WAM 接近 Joint 和 IDM|较强|仅适用于本文任务和闭环 action-chunk setting|
|视频 co-training 非常重要|删除后 RoboTwin 降 8.0，LIBERO 降 4.1，真机降至 10%|较强|不能区分动力学学习与普通辅助正则化|
|测试时显式想象平均收益有限|Fast-WAM 与 Joint/IDM 的平均差距较小|较强|部分单任务差异很大|
|Fast-WAM 推理更快|190 ms 对比 IDM 810 ms|较强|Fast-WAM 仍需多步动作 flow|
|视频 loss 学到了 world-grounded representation|带视频 loss 的控制成功率更高|间接|缺少 representation probe|
|不需要机器人 embodied pretraining 也能取得高性能|Fast-WAM 未使用额外大规模机器人动作预训练|较强|仍依赖大规模 Wan 视频生成预训练|
|显式未来想象普遍没有价值|平均指标收益小|证据不足|未覆盖强 OOD、多分支规划和稀疏奖励任务|

## 单任务结果并不完全支持统一结论

论文附录表 3，PDF 第 13 页显示，部分任务上模型差异很大。

例如：

### Open Microwave

- Fast-WAM：62 / 45；
    
- Joint：3 / 14；
    
- IDM：54 / 53；
    
- Motus：95 / 91。
    

### Place Can Basket

- Fast-WAM：71 / 69；
    
- Joint：50 / 23；
    
- IDM：37 / 28；
    
- 无 video co-train：72 / 72。
    

### Press Stapler

- Fast-WAM：90 / 97；
    
- Joint：52 / 50；
    
- IDM：50 / 57。
    

### Open Laptop

无 video co-train 甚至达到：

- 100 / 98。
    

这些结果说明：

1. 显式未来想象并非总是有益；
    
2. Joint 或 IDM 有时会显著降低性能；
    
3. 视频 co-training 也并非每个任务都能提升；
    
4. 平均值掩盖了很强的任务异质性；
    
5. “是否需要未来想象”可能取决于具体任务结构。
    

# 批判性分析

## 信息泄漏检查

### Fast-WAM 是否直接使用 GT 未来视频预测动作

从论文结构上看，没有。

动作 token 被禁止读取未来视频 token：

$$  
A  
\not\rightarrow  
F_+.  
$$

当前帧 token 也不能读取未来 token：

$$  
F_0  
\not\rightarrow  
F_+.  
$$

因此不存在以下路径：

$$  
F_+  
\rightarrow  
F_0  
\rightarrow  
A.  
$$

这是一项较严格的防 privileged-information 设计。

### 视频损失更新共享参数算不算泄漏

不算测试样本级信息泄漏。

视频 loss 确实会更新共享表示：

## $$  
\theta  
\leftarrow  
\theta

\eta  
\nabla_\theta  
\mathcal L_{\mathrm{video}}.  
$$

但这属于训练数据形成的参数先验，与普通监督学习类似。

区别是：

- 不允许动作模块在预测当前训练样本时直接读取该样本未来；
    
- 允许模型通过大量训练样本的未来监督学习更好的参数。
    

Fast-WAM 属于后者。

### 代码中仍存在需要确认的细节

官方训练函数调用 Video DiT 时仍传入了 GT action 参数，但配置中：

- `action_conditioned=false` 。
    

理论上，Video DiT 应完全忽略 action。

但要严格排除隐藏数据路径，仍应进行以下测试：

1. 将 action 随机置换；
    
2. 保持视频、语言和 state 不变；
    
3. 比较 Video DiT 输出；
    
4. 检查 action 对视频输出的梯度。
    

如果：

# $$  
\frac{\partial \hat u_v}{\partial a}

0,  
$$

才可以严格确认基础 Fast-WAM 视频分支不使用 GT action。

## Baseline 公平性

### 内部对照相对公平

以下四个模型属于同一 family：

- Fast-WAM；
    
- Fast-WAM-Joint；
    
- Fast-WAM-IDM；
    
- no-video-co-train。
    

它们共享：

- Wan backbone；
    
- Action DiT；
    
- 数据；
    
- flow-matching 框架；
    
- action horizon；
    
- 训练平台。
    

因此内部消融是论文最可信的部分。

### 外部 baseline 不完全公平

Fast-WAM 与 $\pi_0$ 、 $\pi_{0.5}$ 、Motus、LingBot-VA 之间可能存在：

- 参数规模不同；
    
- 图像分辨率不同；
    
- action representation 不同；
    
- 数据清洗不同；
    
- embodied pretraining 数据不同；
    
- instruction protocol 不同；
    
- action chunk execution 不同；
    
- action ensemble 配置不同；
    
- checkpoint selection 不同。
    

因此不能只根据表格数字断言 Fast-WAM 结构本身优于所有其他方法。

### Seen instruction 与 unseen instruction

官方仓库说明：

- Fast-WAM 的 RoboTwin 评估遵循 Motus，使用 unseen instructions；
    
- LingBot-VA 使用 seen instructions。
    

作者估计 seen instructions 可能带来约 1–2 个百分点提升。

这意味着 LingBot-VA 与 Fast-WAM 的评估协议不是完全一致的。

## “无 embodied pretraining”的表述边界

Fast-WAM 没有使用额外的大规模机器人动作数据预训练，但它使用了 Wan2.2-5B 视频生成预训练。

因此准确说法是：

> Fast-WAM 不依赖额外机器人 embodied action pretraining。

不能说：

> Fast-WAM 没有大规模预训练。

因为其视觉 backbone 已经吸收了大规模视频和文本知识。

## No-video-co-training 仍然拥有视频模型先验

无视频 co-training 的模型仍然初始化自 Wan2.2。

因此该消融测试的是：

$$  
\text{是否在机器人 demonstration 上继续使用未来视频 loss},  
$$

而不是：

$$  
\text{是否使用任何视频世界模型预训练}.  
$$

所以实验支持：

> 在机器人数据上加入未来视频辅助监督很有价值。

但不能直接支持：

> 所有提升都来自视频世界模型，而非预训练视觉 backbone。

## 训练—部署不一致

Fast-WAM 训练时输入：

- 当前帧；
    
- 未来视频 noisy token；
    
- 动作 noisy token。
    

部署时只输入：

- 当前帧；
    
- 动作 noisy token。
    

表面上 sequence 长度不同。

但结构化 mask 保证：

- 当前帧不读取未来；
    
- 动作不读取未来。
    

因此与普通“训练时使用 GT 未来、部署时删除未来”的模型相比，Fast-WAM 已显著减少 train-test mismatch。

仍然存在的差异包括：

1. 训练时 MoT 中存在未来视频 token；
    
2. 部署时这些 token 完全不存在；
    
3. 训练时共享参数同时接收视频 loss 和动作 loss；
    
4. 部署时只运行动作生成；
    
5. 训练数据来自 expert demonstration；
    
6. 部署过程中会进入自身策略诱导的状态分布。
    

其中第 5–6 项仍然是标准模仿学习中的 covariate shift。

## “Single forward pass”容易引起误解

论文所说的 single forward pass 仅指：

# $$  
\text{Video DiT forward count}

$$

完整动作生成仍包括：

# $$  
\text{Action DiT forward count}

$$

因此其推理流程不是单次网络回归，而是：

$$  
1  
\times  
\text{Video DiT}  
+  
10  
\times  
\text{Action DiT}.  
$$

190 ms 对应理论串行重规划频率：

# $$  
f

\frac{1}{0.19}  
\approx  
5.26\ \mathrm{Hz}.  
$$

实际机器人底层控制可以在 action chunk 内以更高频率执行，但高层策略重规划频率大约受到该延迟约束。

## “学到物理世界表示”的证据不足

论文主要根据控制成功率提升，推断视频 co-training 学到了 world-grounded representation。

但它没有直接测量表示中是否包含：

- 物体姿态；
    
- 物体速度；
    
- 接触状态；
    
- 抓取稳定性；
    
- 摩擦或质量；
    
- 任务进度；
    
- 失败风险；
    
- 动作后果；
    
- 不确定性。
    

因此还存在其他解释：

### 解释一：普通多任务正则化

$$  
\mathcal L_{\mathrm{video}}  
$$

可能仅仅增加了监督信号，减少过拟合。

### 解释二：视觉语义强化

视频任务可能改善了物体、场景和动作阶段识别，但未必学到动力学。

### 解释三：优化稳定性

视频 loss 可能为大型 Video DiT 提供更稳定梯度，使动作训练更容易。

### 解释四：任务进度预测

模型可能主要学习：

> 某个任务在 demonstration policy 下通常进行到哪一步。

这与真正的 action-conditioned dynamics 不完全相同。

## Fast-WAM 基础模型缺乏动作因果

严格的动作因果模型应学习：

$$  
p  
\left (  
z_{t+\Delta}  
\mid  
z_t, a_{t:t+\Delta}  
\right).  
$$

这样才能比较：

$$  
a  
\neq  
a'  
$$

时：

$$  
p  
\left (  
z_{t+\Delta}  
\mid  
z_t, a  
\right)  
\neq  
p  
\left (  
z_{t+\Delta}  
\mid  
z_t, a'  
\right).  
$$

但 Fast-WAM 基础视频分支更接近：

$$  
p  
\left (  
z_{t+\Delta}  
\mid  
z_t, l  
\right).  
$$

因此它无法直接回答：

> 如果机器人采取另一个动作，世界会发生什么？

它更像任务条件的未来先验，而不是可用于反事实规划的动力学模型。

## 为什么显式未来想象可能没有明显提升

可能原因包括：

### 原因一：闭环重规划已经提供真实反馈

机器人只执行 action chunk 的前几步，然后重新观测真实世界。

因此模型无需一次准确预测很远的未来。

### 原因二：生成未来存在误差

若视频预测包含：

- 物体位置漂移；
    
- 接触错误；
    
- 手臂形态错误；
    
- 多模态平均；
    
- 不符合实际动力学的细节；
    

动作模块读取这些错误未来可能反而受干扰。

### 原因三：动作已经可以直接读取当前世界表示

视频 co-training 已将动态信息压入当前帧表示，因此显式视频可能提供的信息增量很小。

### 原因四：本文任务多为短程操作技能

LIBERO 和 RoboTwin 中的许多任务，当前视觉和任务语言已能较强决定下一段动作。

## 哪些场景可能仍需要测试时未来想象

Fast-WAM 的结论可能无法扩展到：

- 同一状态有多个合理未来；
    
- 需要比较多个候选动作；
    
- 长时程稀疏奖励；
    
- 延迟后果；
    
- 严格安全约束；
    
- 碰撞预测；
    
- 强遮挡；
    
- 动力学 OOD；
    
- 失败恢复；
    
- action chunk 之外的任务规划；
    
- 不可逆动作。
    

在这些任务中，测试时可能需要显式评估：

$$  
a^{(1)},  
a^{(2)},  
\ldots,  
a^{(N)}  
$$

分别导致的未来：

$$  
z_{t+\Delta}^{(1)},  
z_{t+\Delta}^{(2)},  
\ldots,  
z_{t+\Delta}^{(N)}.  
$$

而 Fast-WAM 基础模型不具备这一反事实能力。

## 统计报告不足

论文没有充分报告：

- 多训练随机种子均值和方差；
    
- 置信区间；
    
- 真机 episode 数；
    
- 真机成功率置信区间；
    
- latency 标准差；
    
- 不同模型训练 FLOPs；
    
- checkpoint selection 规则；
    
- 单任务差异是否统计显著。
    

因此部分小幅差异，例如：

$$  
0.4%  
$$

或：

$$  
0.9%  
$$

未必具有统计显著性。

# 与我的研究的关系

## 支持“训练时学世界，部署时不生成像素”

这篇论文与你不希望使用测试时像素级视频生成作为 world model backbone 的想法高度一致。

Fast-WAM 说明可以采用：

$$  
\text{训练期未来建模}  
+  
\text{部署期 latent policy},  
$$

而不必采用：

$$  
\text{部署期生成 RGB 未来}  
+  
\text{基于 RGB 未来规划}.  
$$

可以写成：

# $$  
h_t

E_{\mathrm{world}}  
\left (  
o_t, s_t, l  
\right),  
$$

$$  
a_{1: H}  
\sim  
\pi  
\left (  
a_{1: H}  
\mid  
h_t  
\right).  
$$

训练时增加：

$$  
\mathcal L_{\mathrm{world}},  
$$

部署时只保留：

$$  
h_t.  
$$

## 可以进一步替换视频预测目标

Fast-WAM 的监督目标仍然来自未来视频 latent。

你的研究可以进一步验证：

> 是否可以用更接近物理交互的 target 替代未来 RGB？

例如定义未来物理效果：

# $$  
e_{t+\Delta}

\left[  
p_{\mathrm{object}},  
R_{\mathrm{object}},  
c_{\mathrm{contact}},  
g_{\mathrm{grasp}},  
s_{\mathrm{slip}},  
d_{\mathrm{deformation}},  
q_{\mathrm{progress}}  
\right].  
$$

其中：

- $p_{\mathrm{object}}$：物体位置；
    
- $R_{\mathrm{object}}$：物体姿态；
    
- $c_{\mathrm{contact}}$：接触状态；
    
- $g_{\mathrm{grasp}}$：抓取状态；
    
- $s_{\mathrm{slip}}$：滑移状态；
    
- $d_{\mathrm{deformation}}$：形变；
    
- $q_{\mathrm{progress}}$：任务进度。
    

训练一个 effect predictor：

# $$  
\hat e_{t+\Delta}

g_\phi  
\left (  
h_t, a_{t:t+H}  
\right).  
$$

辅助损失为：

# $$  
\mathcal L_{\mathrm{effect}}

## \left|  
\hat e_{t+\Delta}

e_{t+\Delta}  
\right|_2^2.  
$$

总损失为：

# $$  
\mathcal L

\mathcal L_{\mathrm{action}}  
+  
\lambda_e  
\mathcal L_{\mathrm{effect}}.  
$$

推理时依然不必显式输出或解码未来。

## 与动作因果表征的关系

Fast-WAM 的核心缺陷是视频分支不显式 action-conditioned。

你的动作因果表征可以直接学习：

$$  
g_\phi  
\left (  
h_t, a_{t:t+H}  
\right)  
\rightarrow  
\Delta e_{t:t+H}.  
$$

同一 EEF 轨迹在不同接触状态下，应产生不同效果表示：

$$  
g_\phi  
\left (  
h_t^{\mathrm{contact}},  
a  
\right)  
\neq  
g_\phi  
\left (  
h_t^{\mathrm{no\ contact}},  
a  
\right).  
$$

不同低层轨迹若导致相同对象效果，应产生相近表示：

$$  
g_\phi  
\left (  
h_t, a  
\right)  
\approx  
g_\phi  
\left (  
h_t, a'  
\right),  
$$

前提是：

$$  
\Delta e (a)  
\approx  
\Delta e (a').  
$$

这比 Fast-WAM 的任务条件未来视频预测更明确地建模：

> 动作在当前物理条件下造成了什么。

## 与成功—失败反思的关系

Fast-WAM 只使用 demonstration 中的未来视频和动作，没有显式建模：

- 哪个动作造成成功；
    
- 哪个动作造成失败；
    
- 失败是否可恢复；
    
- 哪个交互阶段出现问题。
    

你的反思模块可以建模：

$$  
p  
\left (  
e_{t+\Delta},  
r_{t+\Delta},  
f_{t+\Delta}  
\mid  
h_t, a_{t:t+H}  
\right),  
$$

其中：

- $e_{t+\Delta}$：物理效果；
    
- $r_{t+\Delta}$：结果或 value；
    
- $f_{t+\Delta}$：失败原因。
    

然后比较成功与失败：

# $$  
\Delta e_{\mathrm{diff}}

## \Delta e_{\mathrm{success}}

\Delta e_{\mathrm{failure}}.  
$$

这样得到的反思不是抽象地说：

> 这个动作不好。

而是具体地说：

> 该动作在当前接触状态下导致把手向错误方向滑移，因此没有形成有效旋转。

## 与动作“从模糊到精确”的关系

Fast-WAM 使用 flow matching，从噪声逐渐得到精确动作：

$$  
a^{(K)}  
\rightarrow  
a^{(K-1)}  
\rightarrow  
\cdots  
\rightarrow  
a^{(0)}.  
$$

但这不自动表示语义上的“从粗到细”。

早期 flow 状态可能只是噪声较大，并不一定包含：

- 粗略目标区域；
    
- 动作意图；
    
- 接触阶段；
    
- 运动流形。
    

你的方案可以显式拆分为：

$$  
a^{\mathrm{coarse}}  
\sim  
p  
\left (  
a_{\mathrm{region}},  
a_{\mathrm{phase}},  
a_{\mathrm{effect}}  
\mid  
h_t, l  
\right),  
$$

再生成精细动作：

$$  
a_{1: H}^{\mathrm{fine}}  
\sim  
p  
\left (  
a_{1: H}  
\mid  
a^{\mathrm{coarse}},  
h_t,  
\text{feedback}  
\right).  
$$

可以进一步约束不同 flow time 的监督：

# $$  
\mathcal L

\mathcal L_{\mathrm{coarse}}  
+  
\mathcal L_{\mathrm{fine}}  
+  
\mathcal L_{\mathrm{effect}}.  
$$

这样才能真正证明动作生成具有“从意图到精确控制”的层级结构。

## 与 REVAMP 的关系

Fast-WAM 可以自然地融入你的 REVAMP 路线。

训练阶段：

# $$  
\mathcal L

\mathcal L_{\mathrm{action}}  
+  
\lambda_w  
\mathcal L_{\mathrm{world}}  
+  
\lambda_Q  
\mathcal L_Q.  
$$

当前世界表示：

# $$  
h_t

E_{\mathrm{world}}  
\left (  
o_t, s_t, l  
\right).  
$$

策略生成动作：

$$  
a_{1: H}  
\sim  
\pi_\theta  
\left (  
a_{1: H}  
\mid  
h_t  
\right).  
$$

价值模型评分：

$$  
Q_\psi  
\left (  
h_t, a_{1: H}  
\right).  
$$

动作筛选或微调：

# $$  
a^\star

\arg\max_{a^{(i)}}  
Q_\psi  
\left (  
h_t, a^{(i)}  
\right).  
$$

部署时不需要生成未来 RGB，只需要保证 $h_t$ 对以下量具有可解码性：

- 任务进度；
    
- 接触状态；
    
- 失败风险；
    
- 动作后果；
    
- value。
    

## 与衣物操作的关系

真机毛巾折叠结果表明，视频 co-training 对可变形物体任务可能特别有价值。

但未来视频 latent 可能过度关注：

- 纹理；
    
- 光照；
    
- 背景；
    
- 机械臂外观；
    
- 像素级细节。
    

你的衣物任务可以使用更直接的物理目标：

# $$  
e_t

\left[  
\text{cloth area},  
\text{coverage},  
\text{principal axes},  
\text{support ratio},  
\text{lifted state},  
\text{contact heatmap},  
\text{grasp relation},  
\text{deformation energy}  
\right].  
$$

动作条件效果模型为：

# $$  
\hat e_{t+\Delta}

g_\phi  
\left (  
h_t,  
a_{t:t+H}  
\right).  
$$

若该目标能够达到或超过视频 latent co-training，则可以证明：

> 真正有用的不是像素未来本身，而是训练期对物理后果的监督。

# 最小验证实验

## 实验目标

同时验证两个命题：

### 命题一：Fast-WAM 命题

训练期未来预测比测试期显式想象更重要。

### 命题二：你的扩展命题

非像素、动作条件的物理效果预测，可以替代甚至超过视频 latent 预测。

## 最低成本数据

直接使用已有 RoboCasa `TurnOnSinkFaucet` 数据：

- 100–300 条 demonstrations；
    
- 3 个相机；
    
- 当前 state；
    
- action horizon 32；
    
- 成功和失败轨迹；
    
- 已有的 EEF noise failure 数据。
    

固定：

- 相同视觉 backbone；
    
- 相同 Action DiT；
    
- 相同 action normalization；
    
- 相同训练步数；
    
- 相同随机种子；
    
- 相同动作 flow steps；
    
- 相同 replan interval。
    

为了降低成本，可以：

- 冻结 VAE；
    
- 冻结大部分视觉 backbone；
    
- 只训练 LoRA；
    
- 训练 Action DiT；
    
- 训练辅助 effect head。
    

## 实验组 A：Action-only

# $$  
\mathcal L_A

\mathcal L_{\mathrm{action}}.  
$$

该组不使用任何未来辅助监督。

## 实验组 B：Fast-WAM 风格视频 co-training

# $$  
\mathcal L_B

\mathcal L_{\mathrm{action}}  
+  
\lambda_v  
\mathcal L_{\mathrm{video\ latent}}.  
$$

训练时预测未来视频 latent，推理时不生成未来视频。

## 实验组 C：动作条件物理效果 co-training

定义未来效果：

# $$  
e_{t+\Delta}

\left[  
\theta_{\mathrm{faucet}},  
d_{\mathrm{eef-handle}},  
c_{\mathrm{contact}},  
g_{\mathrm{gripper}},  
q_{\mathrm{progress}}  
\right].  
$$

其中：

- $\theta_{\mathrm{faucet}}$：水龙头角度；
    
- $d_{\mathrm{eef-handle}}$：EEF 到把手距离；
    
- $c_{\mathrm{contact}}$：接触状态；
    
- $g_{\mathrm{gripper}}$：夹爪状态；
    
- $q_{\mathrm{progress}}$：任务进度。
    

效果预测：

# $$  
\hat e_{t+\Delta}

g_\phi  
\left (  
h_t, a_{t:t+H}  
\right).  
$$

效果损失：

# $$  
\mathcal L_{\mathrm{effect}}

## \left|  
\hat e_{t+\Delta}

e_{t+\Delta}  
\right|_2^2.  
$$

总损失：

# $$  
\mathcal L_C

\mathcal L_{\mathrm{action}}  
+  
\lambda_e  
\mathcal L_{\mathrm{effect}}.  
$$

推理时不需要显式输出效果，只保留其对表示的训练作用。

## 实验组 D：显式 test-time imagination

训练时与 B 相同：

# $$  
\mathcal L_D

\mathcal L_{\mathrm{action}}  
+  
\lambda_v  
\mathcal L_{\mathrm{video\ latent}}.  
$$

但推理时：

1. 生成未来视频 latent；
    
2. 让动作分支读取生成未来；
    
3. 再输出动作。
    

用于检验显式想象是否在扰动恢复或 OOD 中有额外价值。

## 主评估指标

### Clean success rate

# $$  
\operatorname{SR}_{\mathrm{clean}}

\frac{  
N_{\mathrm{success}}  
}{  
N_{\mathrm{total}}  
}.  
$$

### OOD success rate

改变：

- faucet 初始角度；
    
- 水龙头位置；
    
- 相机视角；
    
- 物体纹理；
    
- 光照。
    

计算：

$$  
\operatorname{SR}_{\mathrm{OOD}}.  
$$

### Recovery success rate

在动作执行中加入 EEF 扰动，评估：

$$  
\operatorname{SR}_{\mathrm{recovery}}.  
$$

### 推理延迟

# $$  
\tau_{\mathrm{policy}}

## t_{\mathrm{output}}

t_{\mathrm{input}}.  
$$

## 表征评估

冻结 encoder，训练小型 probe。

### Faucet angle probe

# $$  
\hat\theta

g_\theta (h_t).  
$$

评估：

$$  
R^2_{\mathrm{angle}}.  
$$

### Contact probe

# $$  
\hat c

g_c (h_t).  
$$

评估 contact classification accuracy。

### Task progress probe

# $$  
\hat q

g_q (h_t).  
$$

评估：

# $$  
\operatorname{MSE}_{\mathrm{progress}}

\left|  
\hat q-q  
\right|_2^2.  
$$

### Failure prediction

# $$  
\hat p_{\mathrm{fail}}

g_f  
\left (  
h_t, a_{t:t+H}  
\right).  
$$

评估 AUROC。

## 动作因果评估

固定同一个观测 $h_t$，构造两个候选动作：

$$  
a^+,  
\qquad  
a^-.  
$$

其中：

- $a^+$ 可以正确转动水龙头；
    
- $a^-$ 会滑过把手或向错误方向移动。
    

模型预测：

# $$  
\hat e^+

g_\phi  
\left (  
h_t, a^+  
\right),  
$$

# $$  
\hat e^-

g_\phi  
\left (  
h_t, a^-  
\right).  
$$

若模型具有动作因果能力，应满足：

$$  
\hat e^+  
\neq  
\hat e^-.  
$$

具体地，应预测：

$$  
\Delta\theta_{\mathrm{faucet}}^+

\Delta\theta_{\mathrm{faucet}}^-.  
$$

## 可证伪预测

### 支持 Fast-WAM

如果：

$$  
\operatorname{SR}_B

\operatorname{SR}_A,  
$$

且：

## $$  
\operatorname{SR}_D

\operatorname{SR}_B  
\leq  
2%,  
$$

同时：

$$  
\tau_D  
\gg  
\tau_B,  
$$

则支持：

> 训练期未来监督重要，测试时显式想象收益有限。

### 支持非像素效果模型

如果：

$$  
\operatorname{SR}_C  
\geq  
\operatorname{SR}_B,  
$$

并且：

$$  
\operatorname{SR}_{C,\mathrm{OOD}}

\operatorname{SR}_{B,\mathrm{OOD}},  
$$

或：

$$  
\operatorname{SR}_{C,\mathrm{recovery}}

\operatorname{SR}_{B,\mathrm{recovery}},  
$$

则支持：

> 动作条件物理效果监督比视频 latent 监督更适合控制。

### 否定 Fast-WAM 的广泛结论

如果：

## $$  
\operatorname{SR}_{D,\mathrm{OOD}}

\operatorname{SR}_{B,\mathrm{OOD}}

5%,  
$$

或者：

## $$  
\operatorname{SR}_{D,\mathrm{recovery}}

\operatorname{SR}_{B,\mathrm{recovery}}

5%,  
$$

且结果跨多个随机种子稳定，则说明：

> 测试时显式未来想象在强 OOD 或失败恢复场景中仍具有重要价值。

### 否定“视频 loss 学到了世界模型”

如果：

$$  
\operatorname{SR}_B

\operatorname{SR}_A,  
$$

但：

- angle probe 没有提高；
    
- contact probe 没有提高；
    
- progress probe 没有提高；
    
- action-effect discrimination 没有提高；
    

同时任意高维辅助重建任务也能得到相同提升，则更可能说明：

> 视频 co-training 的收益主要来自普通多任务正则化，而不是物理世界建模。

# 可信度边界

## 论文明确事实

1. 论文为 arXiv: 2603.16666v2，PDF 共 13 页。
    
2. 第 2 节标题为 `Related Work`。
    
3. 第 3 节标题为 `Method`。
    
4. Fast-WAM 使用 Wan2.2-5B Video DiT、视频 VAE、T5 和约 1B Action DiT。
    
5. 训练时同时进行视频 latent flow matching 和动作 flow matching。
    
6. Fast-WAM 的动作 token 不能读取未来视频 token。
    
7. Fast-WAM 推理时不生成未来视频。
    
8. Fast-WAM 推理时首先编码一次当前图像，并复用视频 KV cache。
    
9. 动作 horizon 为 32。
    
10. 论文实验使用 10 个动作去噪步。
    
11. RoboTwin 平均成功率为 91.8%。
    
12. LIBERO 平均成功率为 97.6%。
    
13. 删除视频 co-training 后，RoboTwin 降到 83.8%。
    
14. 删除视频 co-training 后，LIBERO 降到 93.5%。
    
15. 真机中无视频 co-training 的模型成功率仅为 10%。
    
16. Fast-WAM 延迟为 190 ms。
    
17. Fast-WAM-IDM 延迟为 810 ms。
    
18. 论文没有提供系统性的表示 probe、置信区间和多训练随机种子方差。
    

## ChatGPT 合理推断

1. Fast-WAM 的主要证据更直接支持“视频预测是有效辅助任务”，而不是严格证明学到了完整物理世界模型。
    
2. 基础 Fast-WAM 更接近 task-conditioned future model，而不是 action-conditioned causal dynamics model。
    
3. 视频 co-training 的收益可能同时来自：
    
    - 动力学信息；
        
    - 视觉语义；
        
    - 多任务正则化；
        
    - 优化稳定性。
        
4. 显式未来想象在 action chunk 加频繁闭环重规划中收益较小，但在强 OOD、失败恢复和反事实规划中可能更重要。
    
5. LIBERO 和 RoboTwin 的具体 VAE latent 形状是根据配置和压缩比例推断。
    
6. 190 ms 对应约 5.3 Hz 的高层串行重规划上限。
    
7. 无视频 co-training 模型仍然继承 Wan2.2 视频预训练，因此不能视为完全没有世界模型先验。
    
8. 单任务结果的高度异质性说明，平均指标不能证明所有任务均不需要未来想象。
    
9. Fast-WAM 的视频预测可能主要学习 demonstration policy 下的典型未来，而不是不同候选动作的反事实结果。
    
10. 对你的研究而言，动作条件物理效果预测可能比未来 RGB 预测更适合作为 world supervision。
    

## 必须查看代码确认

1. No-video-co-training 的精确实现：
    
    - 是否只是令视频 loss 权重为 0；
        
    - 是否冻结了部分 Video DiT；
        
    - 是否改变了数据输入。
        
2. 传入 Video DiT 的 GT action 是否在 `action_conditioned=false` 时完全不参与计算。
    
3. Fast-WAM-Joint 的具体 cross-modal attention mask。
    
4. Fast-WAM-IDM 中 GT video 加噪概率 $p=0.5$ 的确切实现。
    
5. RoboTwin 三相机的具体拼接布局。
    
6. RoboTwin 14 维 action 和 state 每一维的物理语义。
    
7. 真机 action chunk 的实际执行步数和重规划间隔。
    
8. 真机实验的 episode 数。
    
9. 真机成功率的置信区间。
    
10. 所有外部 baseline 是否使用统一数据和统一评估代码重新运行。
    
11. 各模型是否使用相同 checkpoint selection 标准。
    
12. 论文实验所对应的具体 Git commit 和配置文件。
    
13. 不同模型的实际显存、FLOPs 和每个 action chunk 的网络 forward 次数。
    
14. Video DiT 的 action 输入在基础 Fast-WAM 中是否满足：
    

# $$  
\frac{\partial \hat u_v}{\partial a}

$$

15. 训练时未来视频 token 的存在是否会通过 LayerNorm、序列长度或共享算子，对当前帧表示产生 mask 之外的实现级影响。