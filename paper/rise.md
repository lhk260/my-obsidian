# RISE 论文阅读笔记
1. 
![[rise.png]]
## 1. 论文基本信息

**题目**：**RISE: Self-Improving Robot Policy with Compositional World Model**

**核心关键词**：  
机器人策略学习、世界模型、想象中的强化学习、动作条件视频预测、价值建模、advantage-conditioned policy、自我提升。

---

## 2. 论文想解决什么问题

这篇论文要解决的是：

**机器人策略怎样在不大量依赖真实世界在线试错的情况下继续自我提升。**

现有机器人策略，尤其是 VLA 或 imitation learning 方法，通常有几个明显问题：

1. **高度依赖离线示范数据**  
    学到的大多是“模仿数据里出现过的行为”，一旦真实执行偏离训练分布，就容易失败。
    
2. **真实世界在线 RL 成本太高**  
    机器人交互慢、reset 麻烦、人工参与多，而且真实试错有安全和硬件磨损风险。
    
3. **长时程、接触丰富任务很难**  
    比如装包、拉拉链、盖盒子这种任务，不只是视觉理解问题，更是动作时序和接触反馈问题。
    

所以作者提出一个核心思路：

**不要让机器人只在真实世界里学习，而是让它在训练阶段先进入“想象中的世界”里做 rollout 和试错。**

---

## 3. 论文核心思想

RISE 的核心是构造一个 **Compositional World Model（组合式世界模型）**，把世界模型拆成两个模块：

- **Dynamics Model**：预测未来会发生什么
    
- **Value Model**：判断未来好不好
    

然后用这两个模块生成 imagined rollout，再把 imagined rollout 转化为对策略有用的 advantage learning signal。

一句话概括：

**策略提出动作 → dynamics model 想象动作后果 → value model 给未来打分 → 得到 advantage → 再反过来训练策略。**

---

## 4. 方法总览

### 4.1 状态、动作和语言输入

论文考虑的是多视角机器人操作任务。给定：

- 当前观测 oto_tot​
    
$$
- 历史观测窗口 Ot={ot−N,...,ot}O_t=\{o_{t-N},...,o_t\}Ot​={ot−N​,...,ot​}
$$
    
- 动作块 $at=[at,…,at+H−1]a_t=[a_t,\dots,a_{t+H-1}]at​=[at​,…,at+H−1​]$
    
- 指令 ℓ\ellℓ
    

世界模型被定义为两个部分。

---

## 5. Dynamics Model

### 5.1 功能

Dynamics model 学习下面这个映射：

o^t+1,...,o^t+H=D(Ot,at)\hat o_{t+1},...,\hat o_{t+H}=D(O_t,a_t)o^t+1​,...,o^t+H​=D(Ot​,at​)

也就是：

**输入历史多视角图像和一个候选动作 chunk，预测未来 HHH 步多视角观测。**

### 5.2 直观理解

它相当于一个“未来视频模拟器”：

- 给它当前机器人看到的场景
    
- 再给它接下来想执行的一串动作
    
- 它输出：如果真这么做，画面大概率会怎么变
    

### 5.3 作用

它的主要用途不是部署时直接做控制，而是在训练期：

- 扩展策略能看到的状态分布
    
- 模拟离线数据里没出现过的状态
    
- 让策略可以“在想象中试错”
    

---

## 6. Value Model

### 6.1 功能

Value model 学习一个状态价值函数：

V(ot,ℓ)V(o_t,\ell)V(ot​,ℓ)

输入是当前观测和语言指令，输出是一个标量 value。它表示：

- 当前状态离成功有多近
    
- 任务推进程度如何
    
- 当前状态是在朝成功走还是在朝失败走。
    

### 6.2 Advantage 的定义

论文把一个动作 chunk 的优势定义为：

A(ot,at,ℓ)=1H∑k=1HV(o^t+k,ℓ)−V(ot,ℓ)A(o_t,a_t,\ell)=\frac{1}{H}\sum_{k=1}^{H}V(\hat o_{t+k},\ell)-V(o_t,\ell)A(ot​,at​,ℓ)=H1​k=1∑H​V(o^t+k​,ℓ)−V(ot​,ℓ)

含义是：

**如果执行这个动作后，未来平均 value 高于现在，那这个动作就是有利动作。**

### 6.3 为什么这样定义好

它不要求世界模型模拟完整个任务，只看一个 chunk 内的平均改善。  
这样有两个好处：

- 降低长时 rollout 误差累积的影响
    
- 让世界模型只需关注局部可用的策略改进信号。
    

---

## 7. 策略更新方式

RISE 不是经典 PPO 那种直接 policy gradient，而是采用 **advantage-conditioned policy learning**。

也就是说，策略不只是学“给定状态输出动作”，而是学：

**给定状态 + advantage 条件，输出与该 advantage 对应的动作。**

直观理解：

- 高 advantage 条件下，策略应该输出更优动作
    
- 低 advantage 条件下，策略也能理解“哪些动作差”
    

因此，它比普通 BC 更能区分动作质量差异。

---

# 8. 两个模型是怎么训练的

## 8.1 Dynamics Model 训练

### 初始化

Dynamics model 从预训练 **Genie Envisioner (GE-base)** 初始化，因为它推理很快，适合放入 RL imagination loop。论文提到 GE 比 Cosmos 快约 300 倍。

rise

### 训练数据

使用大规模带动作标签的机器人数据，包括：

- Agibot World
    
- Galaxea。
    
    rise
    

### 改造

作者做了几件事：

- 加入 **light-weight action encoder**
    
- 对 context frames 加更强噪声，提高对模糊和伪影的鲁棒性
    
- 使用 **Task-Centric Batching**，强调同一任务中不同动作导致的差异。
    
    rise
    

### 训练分两阶段

- 大规模机器人数据预训练
    
- 目标任务数据微调。
    
    rise
    

### 个人理解

Dynamics model 训练的重点不是“视频生成得多好看”，而是：

**未来预测必须真的跟动作一致。**

---

## 8.2 Value Model 训练

### 初始化

Value model 从预训练 **π0.5** 初始化，因为它已经具备机器人相关的多视角视觉理解能力。

rise

### 第一阶段：Progress Loss

先让 value model 预测当前时间步在任务中的相对进度 t/Tt/Tt/T：

Lprog=E(V(ot,ℓ)−t/T)2L_{\text{prog}}=\mathbb{E}(V(o_t,\ell)-t/T)^2Lprog​=E(V(ot​,ℓ)−t/T)2

这样模型先学会任务的粗略时间结构。

rise

### 第二阶段：TD Loss

再加入 TD 学习：

LTD=E(V(ot,ℓ)−yt)2,yt=rt+γV(ot+1,ℓ)L_{\text{TD}}=\mathbb{E}(V(o_t,\ell)-y_t)^2,\quad y_t=r_t+\gamma V(o_{t+1},\ell)LTD​=E(V(ot​,ℓ)−yt​)2,yt​=rt​+γV(ot+1​,ℓ)

奖励设计：

- 中间步 0
    
- 成功结束 +1
    
- 失败结束 -1。
    
    rise
    

### 最终 loss

LV=Lprog+LTDL_V=L_{\text{prog}}+L_{\text{TD}}LV​=Lprog​+LTD​

### 个人理解

只用 progress loss，模型只能知道“做到第几步了”；  
加入 TD 后，它才能知道“虽然看起来到这一步了，但其实是不是快失败了”。

所以 value model 的关键不是“进度估计”，而是：

**对失败敏感的进度价值建模。**

rise

---

# 9. 训练好后怎么用

这是整篇论文最重要的流程。

## 9.1 Rollout Stage

从一个初始状态 oto_tot​ 出发：

1. rollout policy 先生成动作 chunk
    
2. dynamics model 预测未来 imagined states
    
3. value model 对 imagined states 打分
    
4. 得到 evaluated advantage。
    

这里有一个细节：

rollout policy 会被喂一个“最优 advantage = 1”的条件，让它倾向于提更好的动作；但真正动作好不好，要靠 dynamics + value 来评估。

## 9.2 Training Stage

把 rollout 产生的数据：

⟨o,a^,A^⟩\langle o,\hat a,\hat A\rangle⟨o,a^,A^⟩

存进 buffer，再继续训练 behavior policy。

也就是说：

**world model 负责生成学习信号，policy 负责把这些信号消化成真实可执行的行为。**

## 9.3 部署时是否还需要这两个模型

不需要。

论文明确说，world model 只在训练阶段参与，部署时只保留最终 policy，所以不会增加真实执行时的推理负担。

---

# 10. 实验设置

论文在三个真实机器人任务上验证方法：

1. **Dynamic Brick Sorting**  
    传送带上动态抓取并分类积木
    
2. **Backpack Packing**  
    双臂打开背包、放入衣物、提包、拉拉链
    
3. **Box Closing**  
    双臂折叠盒盖并精确插入卡扣完成封盒。
    

这些任务共同特点是：

- 长时程
    
- 动作精细
    
- 接触丰富
    
- 对鲁棒性要求高
    

---

# 11. 实验结果

论文将 RISE 与多种 baseline 对比，包括：

- π0.5
    
- π0.5 + DAgger
    
- π0.5 + PPO
    
- π0.5 + DSRL
    
- RECAP。
    

RISE 在三个任务上都取得最高成功率：

- Brick Sorting：85%
    
- Backpack Packing：85%
    
- Box Closing：95%。
    

### 结果说明

这说明：

- 单纯 imitation learning 不够
    
- 真实世界直接在线 RL 很不稳定
    
- world-model-based self-improvement 更适合这种机器人操作场景
    

---

# 12. 消融实验结论

## 12.1 offline / online 数据比例重要

如果 imagined data 比例太高，容易偏离真实数据分布；  
如果 imagined data 太少，又不能充分发挥 self-improving 优势。论文中合适的 offline ratio 效果最好。

## 12.2 只扩动作不够，还要扩状态

只加入 online action 提升有限；同时加入 imagined state 才有明显收益。

## 12.3 dynamics / value 的设计都有效

- dynamics 的 pretrain 很重要
    
- task-centric batching 很重要
    
- value 的 progress loss 和 TD loss 都重要。
    

---

# 13. 论文优点

## 13.1 现实意义强

它不是只在模拟器里做 imagination，而是在真实机器人任务中验证，说明方法有很强工程价值。

## 13.2 把世界模型拆开很合理

dynamics 和 value 分开训练，比一个大一统模型更清晰，也更符合“预测未来”和“评价未来”本身是两个不同问题。

## 13.3 对真实机器人 RL 很有启发

它给出了一条折中路径：

- 不完全依赖真实在线 RL
    
- 也不局限于纯离线 imitation
    
- 而是通过 imagination 做中间桥梁。
    

## 13.4 训练期用 world model，测试期不用

这点很好，避免了部署时高延迟问题。

---

# 14. 论文局限

## 14.1 仍然依赖高质量世界模型

如果 dynamics model 预测不准，imagined rollout 质量就会下降。

## 14.2 误差累积依然存在

论文也因此把 imagination rollout 限制为最多两次，说明当前视频世界模型还不足以支撑超长链式规划。

## 14.3 训练成本高

dynamics model 和 value model 都依赖大模型初始化和多卡训练，现实中门槛不低。

rise

## 14.4 更像 self-improving policy learning，不是经典 actor-critic

它并不是 Dreamer 那种完全 latent-space model-based RL，而是更偏 advantage-conditioned imitation / policy improvement 风格。

---

# 15. 和传统方法的关系

## 与 imitation learning 的关系

RISE 先做 warm-up，仍然需要离线示范作为锚点；所以它不是抛弃 imitation，而是在 imitation 基础上继续自我提升。

## 与传统 RL 的关系

它确实有 RL 味道，因为它在 imagined world 中做 on-policy rollout 并利用 advantage 更新策略；但它不是直接在真实环境中做 actor-critic。

## 与 world model RL 的关系

它借鉴了“在想象中学习”的思想，但采用的是：

- 动作条件视频世界模型
    
- 独立的 value estimator
    
- advantage-conditioned policy update
    

这和 Dreamer 类 latent dynamics 框架不同。

---

# 16. 我的理解与思考

## 16.1 这篇论文最重要的贡献

我认为不是单纯“用了 world model”，而是：

**把机器人世界模型真正变成了策略改进工具，而不仅仅是一个预测器。**

也就是说，作者不是为了“预测视频”而预测视频，而是为了得到可用的 policy improvement signal。

## 16.2 它最聪明的设计

我觉得有两个：

第一，**chunk-level advantage**  
它避免要求世界模型做超长 horizon 精准预测。

第二，**progress + TD 的 value 训练**  
一个负责平稳，一个负责对失败敏感，这个组合很实用。

rise

## 16.3 对机器人学习的启发

这篇论文说明：

未来机器人 learning 可能不会只靠一种范式，而是会越来越像一种混合系统：

- 先有大规模预训练策略
    
- 再有 world model 扩展状态和动作分布
    
- 再通过 imagined rollout 做 self-improvement
    

换句话说，**world model 不一定取代 policy model，但很可能成为 policy 持续进化的“训练期引擎”。**

---

# 17. 适合组会汇报的总结版

可以直接这样讲：

> RISE 提出了一种基于组合式世界模型的机器人策略自我提升框架。它将世界模型拆分为 dynamics model 和 value model：前者负责基于当前多视角观测和动作 chunk 预测未来观测，后者负责评估未来状态的价值，并由此构造 advantage。策略在 imagined rollouts 中获得新的带 advantage 标注的数据，从而实现不依赖大规模真实在线试错的自我提升。实验表明，RISE 在多个真实机器人长时程操作任务上显著优于 imitation learning、DAgger、PPO、DSRL 和 RECAP 等基线。

---

# 18. 可以继续深挖的问题

读完这篇后，值得继续思考的几个问题是：

1. dynamics model 的内部视频生成结构到底是什么，action encoder 是怎么注入的
    
2. value model 的 readout 和 π0.5 主干是怎么耦合的
    
3. 这种方法和 DreamDojo、Ctrl-World、Gemini Robotics simulator 的区别是什么
    
4. 如果把 RISE 思想迁移到点云策略、触觉策略或 ManiFlow 框架里，应该怎么改
    

---

如果你想，我下一条可以继续帮你把这份笔记整理成 **“更像课堂汇报的精简版”**，或者直接改成 **“PPT 大纲版阅读笔记”**。

来源