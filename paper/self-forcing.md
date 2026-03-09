## Self Forcing: Bridging the Train-Test Gap in Autoregressive Video Diffusion

---

## 一、论文基本信息

**论文题目**：Self Forcing: Bridging the Train-Test Gap in Autoregressive Video Diffusion  
**研究方向**：视频生成 / 自回归视频扩散模型 / 实时视频生成 / 世界模型  
**核心关键词**：autoregressive video diffusion，exposure bias，train-test gap，self-rollout，KV cache，video-level distribution matching

---

## 二、这篇论文在解决什么问题

这篇文章关注的是 **自回归视频生成（autoregressive video generation）**。

视频生成模型里，常见有两类路线：

一类是 **双向视频扩散模型**，通常整段视频一起生成，质量很高，但不满足严格因果，不适合低延迟、实时交互、流式生成这类任务。  
另一类是 **自回归视频模型**，逐帧生成，更符合真实时间顺序，更适合实时生成、游戏模拟、机器人世界模型等场景。

但是自回归视频扩散模型有一个核心问题：

> **训练时看到的上下文，和测试时看到的上下文不一样。**

训练时，模型通常条件在前面的 **真实帧** 上。  
测试时，模型只能条件在自己前面 **生成出来的帧** 上。  
这样就会产生经典的 **exposure bias（暴露偏差）**，也就是 train-test gap。

结果就是：  
模型前面哪怕只生成错一点，后面也会不断在错误历史上继续生成，误差层层累积，导致视频后半段质量下降、时间一致性变差、闪烁、过饱和等问题。

---

## 三、旧方法是怎么做的

论文主要对比了两类旧训练范式：

### 1. Teacher Forcing（TF）

训练第 iii 帧时：

- 当前帧加噪
    
- 前面帧使用真实干净帧作为上下文
    
- 模型学习把当前 noisy frame 去噪
    

它的优点是训练简单、稳定，但问题也最明显：

- 训练时上下文过于理想
    
- 测试时上下文却是模型自己生成的，质量不完美
    

所以 TF 的 train-test gap 很大。

---

### 2. Diffusion Forcing（DF）

DF 比 TF 更进一步：

- 当前帧加噪
    
- 前面的上下文帧也带不同程度噪声
    
- 试图让训练分布更接近测试时的情况
    

它确实比 TF 更贴近推理过程，但论文指出：  
**DF 的上下文依然主要来自真实数据分布，而不是模型推理时真实 rollout 出来的分布。**

也就是说，它仍然没有真正让模型在训练时面对“自己生成出来的历史”。

---

## 四、论文的核心思想

这篇论文提出的方法叫 **Self Forcing**。

它的核心思想非常直接：

> **训练时就让模型像测试时一样，自己一帧一帧往前生成。**

也就是：

- 先生成第 1 帧
    
- 再用自己刚生成的第 1 帧作为上下文生成第 2 帧
    
- 再用自己生成的前两帧作为上下文生成第 3 帧
    
- 整个训练过程中显式做 autoregressive self-rollout
    

这样模型训练时看到的历史上下文，不再是 ground-truth，而是 **model-generated history**。

这个思想的意义在于：

- 缩小训练和测试分布差距
    
- 让模型真正学会在自己的预测误差上继续生成
    
- 减少误差累积
    

---

## 五、数学建模

对于视频序列

x1:N=(x1,x2,…,xN)x^{1:N} = (x^1, x^2, \dots, x^N)x1:N=(x1,x2,…,xN)

论文将其分解成自回归形式：

p(x1:N)=∏i=1Np(xi∣x<i)p(x^{1:N}) = \prod_{i=1}^{N} p(x^i \mid x^{<i})p(x1:N)=i=1∏N​p(xi∣x<i)

其中 x<ix^{<i}x<i 表示前面已经生成的历史帧。

这说明模型是在做两层生成：

### 1. 时间维上的自回归

先生成前面帧，再生成后面帧。

### 2. 单帧内部的 diffusion 去噪

每一帧不是直接生成，而是先从噪声出发，再一步步去噪恢复。

所以这是一个典型的 **AR + diffusion** 结合的模型。

---

## 六、Self Forcing 的训练流程

这篇论文最核心的是它的 Algorithm 1。  
可以概括成下面几个步骤。

### 1. 初始化

- 初始化当前 rollout 的输出视频序列 XθX_\thetaXθ​
    
- 初始化历史 KV cache
    

### 2. 随机采样一个 denoising step sss

论文没有对每个 diffusion step 都反传梯度，而是随机采一个 sss，只在这一步开梯度。  
这样做是为了降低显存与计算开销。

### 3. 对视频中的每一帧依次生成

对于第 iii 帧：

- 从纯高斯噪声开始
    
- 进行 few-step diffusion
    
- 在每个噪声层都利用历史 KV cache 作为上下文
    
- 逐步 refinement 当前帧
    

### 4. 每一层的推进方式

如果当前噪声层是 tjt_jtj​，模型会先预测当前帧对应的干净估计：

x^0i=Gθ(xtji,tj,KV)\hat{x}_0^i = G_\theta(x_{t_j}^i, t_j, KV)x^0i​=Gθ​(xtj​i​,tj​,KV)

然后再采样高斯噪声 ϵ\epsilonϵ，把这个 x^0i\hat{x}_0^ix^0i​ 重新加到较低噪声层 tj−1t_{j-1}tj−1​：

xtj−1i=Ψ(x^0i,ϵ,tj−1)x_{t_{j-1}}^i = \Psi(\hat{x}_0^i, \epsilon, t_{j-1})xtj−1​i​=Ψ(x^0i​,ϵ,tj−1​)

也就是说：

- 先估计 clean frame
    
- 再把它放到下一层噪声级别
    
- 再继续 refinement
    

这不是“做完又弄脏”，而是 few-step diffusion 中典型的逐层细化过程。

### 5. 到达第 sss 步时保留梯度

对于 j>sj > sj>s 的步骤，只是无梯度 rollout。  
真正可导的是 j=sj = sj=s 那一步。

### 6. 当前帧生成后写入 KV cache

当前帧的表示会被提取成 KV embedding，放入 cache，供后续帧读取。

### 7. 整段视频 rollout 完后计算 loss

这篇论文不是单纯对当前帧做逐帧 MSE。  
而是对整段 self-generated video 施加一个 **video-level distribution matching loss**。

---

## 七、为什么要“先预测 x0x_0x0​，再加噪”

这是这篇论文里很关键、也很容易困惑的一点。

在某个噪声层 tjt_jtj​，模型不是直接学

xtj→xtj−1x_{t_j} \rightarrow x_{t_{j-1}}xtj​​→xtj−1​​

而是学：

xtj→x^0→xtj−1x_{t_j} \rightarrow \hat{x}_0 \rightarrow x_{t_{j-1}}xtj​​→x^0​→xtj−1​​

原因主要有三点：

### 1. 这是 few-step diffusion 的标准形式

模型先恢复 clean estimate，再放到下一噪声层，符合扩散模型的建模习惯。

### 2. 模型最自然擅长的是“从 noisy 恢复 clean”

diffusion 的核心能力本来就是估计 x0x_0x0​、噪声 ϵ\epsilonϵ 或 score。

### 3. 这样能保证下一步输入仍然落在正确的噪声分布上

如果直接学 xtj→xtj−1x_{t_j} \to x_{t_{j-1}}xtj​​→xtj−1​​，输出不一定真的符合 tj−1t_{j-1}tj−1​ 那一层应该有的统计分布。  
而通过 forward noising 重新构造：

xtj−1=αtj−1x^0+σtj−1ϵx_{t_{j-1}} = \alpha_{t_{j-1}} \hat{x}_0 + \sigma_{t_{j-1}} \epsilonxtj−1​​=αtj−1​​x^0​+σtj−1​​ϵ

就能显式保证下一步输入仍在正确的噪声层上。

---

## 八、监督到底发生在哪里

这是和旧方法很不一样的地方。

### 在 j>sj > sj>s 时

- 不算梯度
    
- 不做监督
    
- 只是把当前帧逐步 rollout 到更低噪声层
    

### 在 j=sj = sj=s 时

- 才允许梯度进入
    
- 当前帧的输出会被纳入最终生成视频
    

但即使在 j=sj=sj=s，这篇文章也不是简单做“当前帧和真实干净帧的逐帧 MSE”。

更准确地说：

> 当前帧在 j=sj=sj=s 这一步成为可导输出，随后进入整段视频序列；最后真正优化的是整段视频的整体分布匹配目标。

所以 Self Forcing 的监督是 **video-level / sequence-level** 的，而不是简单的 frame-wise MSE。

---

## 九、KV cache 是什么，有什么作用

KV cache 是 Transformer 里的 key/value 缓存。  
在这篇论文里，它起了非常重要的作用。

### 1. 保存历史帧的信息

当前帧生成时，需要依赖前面帧的信息。  
这些历史信息不是每次重新编码，而是以 KV 形式缓存下来。

### 2. 降低计算量

如果每一帧都重新把所有历史帧过一遍网络，代价会非常高。  
KV cache 可以直接复用历史计算结果。

### 3. 让训练过程更像推理过程

以前很多方法只在推理时用 KV cache。  
这篇论文在训练时也使用 KV cache，使训练执行图和推理执行图更一致。

---

## 十、Rolling KV Cache

如果视频越来越长，历史帧越来越多，不可能无限缓存。  
所以论文又提出了 **rolling KV cache**：

- 只保留固定窗口长度的 KV
    
- 新帧加入时，最旧的 KV 被移出
    
- 从而支持更长时间的视频外推
    

这本质上是一个滑动记忆窗口。

论文还指出，直接做 naive rolling KV cache 会带来 flickering，因为最开始的条件图像 latent 和后续帧统计不同。为了解决这个问题，训练中也专门模拟了“最初图像 eventually 看不见”的情况。

---

## 十一、训练目标

旧方法大多是逐帧 denoising loss。  
这篇文章则强调 **holistic video-level loss**。

也就是：  
训练时先真正 self-rollout 出一整段视频，再把整段生成视频与真实视频做分布匹配。

论文测试了几类不同目标：

- DMD
    
- SiD
    
- GAN 风格目标
    

它们的共同点不是具体损失形式，而是：

> **都施加在 self-generated 整段视频上。**

这比“只优化当前帧”更直接地对抗 exposure bias。

---

## 十二、实验结果

这篇论文的实验结果很强，尤其是在“实时性 + 质量”这两个维度同时兼顾。

### 1. 速度方面

Self Forcing 的 chunk-wise 版本达到实时级别的 FPS，同时有较低首帧延迟。  
frame-wise 版本首帧延迟更低，更适合极低时延场景。

### 2. 质量方面

它在 VBench 和用户偏好实验中都优于多个基线，包括 CausVid 等方法。

### 3. 说明的问题

实验表明：

- 真正有效的不是某个特定损失
    
- 而是“训练时显式 self-rollout”这个范式本身
    

---

## 十三、这篇论文的主要贡献

我认为它的贡献可以概括为以下几点：

### 1. 抓住了 AR 视频扩散的核心矛盾

问题不是模型不够大，而是 train-test gap。

### 2. 提出了 Self Forcing 训练范式

训练时显式使用 model-generated history，而不是 ground-truth history。

### 3. 将训练过程改得更接近推理过程

包括：

- autoregressive rollout
    
- 训练时使用 KV cache
    
- rolling KV cache
    

### 4. 提出 video-level holistic loss

不是只做单帧监督，而是做整段视频的分布匹配。

### 5. 在实时性与质量上都取得了强结果

这使得它不只是一个“思想很漂亮”的方法，而是一个真正有效的系统方案。

---

## 十四、论文的优点

### 1. 思想很自然，但非常有力

“训练就按推理来”这个想法直觉上很朴素，但落到视频扩散上其实并不容易，论文把它系统化了。

### 2. 理论和工程结合得很好

不仅指出 exposure bias，还给出了完整可跑通的训练框架。

### 3. 很适合实时视频和世界模型场景

相比双向视频扩散，它更符合因果生成需求。

### 4. 实验维度完整

既有速度、延迟，也有视频质量和人类偏好。

---

## 十五、论文的局限

### 1. 超长视频依然会退化

虽然训练长度内效果很好，但远超训练长度时，质量仍然会下降。

### 2. 梯度截断会牺牲一部分长程依赖学习

为了节省显存，只在随机某一步开梯度，可能限制对非常长链条依赖的学习。

### 3. 更像一种 post-training / finetuning 范式

它不是从零开始重写整个视频扩散预训练体系，而更像是在强 backbone 上做顺序式后训练。

---

## 十六、我的理解与启发

我觉得这篇文章最重要的启发不只是视频生成，而是一个更一般的训练原则：

> **如果测试时模型必须在自己的输出上继续工作，那么训练时也应该尽量暴露这种情况。**

这个思想对于下面这些方向都很重要：

- 视频世界模型
    
- 机器人 rollout
    
- 长时序预测
    
- 具身智能中的闭环生成
    

尤其对世界模型来说，这篇论文的价值很大。  
因为世界模型在 rollout 时本来就要不断基于自己预测的未来状态继续往后预测，所以 train-test mismatch 会更加严重。

---

## 十七、一句话总结

**这篇论文的核心贡献，是把自回归视频扩散模型的训练方式从“条件在真实历史上”改成“条件在自己生成的历史上”，并通过整段视频级别的分布匹配来缓解 exposure bias，从而在实时生成和高质量之间取得了很好的平衡。**