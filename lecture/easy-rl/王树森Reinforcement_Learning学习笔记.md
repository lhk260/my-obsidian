---
title: 王树森Reinforcement_Learning学习笔记
tags:
  - RL
date: " 2025-02-22T18:54:32+08:00 "
modify: " 2025-02-22T18:54:32+08:00 "
share: false
cdate: " 2025-02-22 "
mdate: " 2025-02-22 "
---

## 【课程目录】  

**P1 强化学习基础（Reinforcement Learning）：** 学习强化学习相关的基本概念

**P2 价值学习（Value-based learning）：** 学习DQN，以及DQN的训练方法——时序差分方法

**P3 策略学习（Policy-based learning）：** 学习策略网络、策略梯度以及如何更新策略网络相关知识

**P4 运动员-裁判算法（Actor-critic method）：** 学习最优动作价值函数近似方法**——**Actor-Critic 算法

**P5 AlphaGo：** 学习AlphaGo的训练与决策方法

**P6 蒙特卡罗方法：** 学习蒙特卡罗方法

**P7 随机排列与Fisher-Yates算法：**

 **P8 Sarsa算法：** 学习TD算法中的Sarsa算法

 **P9 Q-Learning算法：** 学习TD算法中的Q-Learning算法

 **P10 Multi-Step TD Target：**

 **P11 经验回放 Experience Replay ：**

 **P12 高估问题、Target Network、Double D：**

---

## P1 强化学习基础  

### 一、名词（Terminologies）  

**1.智能体(Agent)：** 强化学习的主体

**2.环境(Environment)：** 与智能体进行交互的对象，可以抽象地理解为交互过程中的规则或机制。

**3.状态(State)/观测(Observation)：** 在每个时刻，环境有一个状态 (state)，状态(State) 有时也被称为观测(Observation)。（因为有时智能体并不能观测到环境改变后的全部，只能观测到部分）

**4.状态空间(State Space)：** 所有可能存在状态的集合，记作花体字母 $\mathcal{S}$ 。

> 注意：状态空间可以是离散的，也可以是连续的。状态空间可以是有限集合，也可以是无限可数集合。

**5.动作(Action)：** 动作 (action) 是智能体基于当前状态所做出的决策。

**6.动作空间(Action Apace)：** 指所有可能动作的集合，记作花体字母 $\mathcal{A}$ 。

**7.奖励 (reward)：** 是指在智能体执行一个动作之后，环境返回给智能体的一个数值。

**8.策略 (policy) ：** 根据观测到的状态，如何做出决策，即如何从动作空间中选取一个动作。

> 注意：  
> （1）强化学习的目标就是得到一个**策略函数 (policy function)**，也叫$\pi$ 函数 ( $\pi$ function) ，在每个时刻根据观测到的状态做出决策。  
> （2）$\pi$函数输入的是状态，输出的是动作的概率，例如下面up的概率为0.7。

![v2-51699d11055e5f0d34b6a6ee33890ba6_1440w.jpg](https://raw.githubusercontent.com/Tendourisu/images/master/v2-51699d11055e5f0d34b6a6ee33890ba6_1440w.jpg)

**10.状态转移概率函数：** 描述状态转移的函数，有如下2两种表达式： 

$$
P_{ss'}^{a} \color{default}=P[S_{t+1} = s'|S_{t}=s,A_{t} =a]
$$

$$
p_t(s' \mid s, a) = P(S_{t+1} = s' \mid S_t = s, A_t = a)
$$

> 解释：当前状态 $s$ ，当前智能体执行动作 $a$，在 $t+1 $ 时刻环境状态变成 $s'$ 的概率是多少。（P表示概率）

**11.马尔可夫决策过程 (Markov decision process, MDP)：** 强化学习的数学基础和建模工具。一个 MDP 通常由状态空间、动作空间、状态转移函数、奖励函数、折扣因子等组成，其可用元组 $<S,A,P,R,γ>$ 进行表示。各部分含义如下：

- $S$：有限数量的状态集
- **$A$ ：有限数量的动作集**
- $P $ ：是态转移概率矩阵 $P_{ss'}^{a} \color{default}=P[S_{t+1} = s'|S_{t}=s,A_{t} =a]$
- $R$ ：奖励函数 $ R_{s}^a = E[R_{t+1} | S_{t} = s,A_{t} =a] $
- $\gamma$：折扣因子，$\gamma\in$$\gamma\in$ [0, 1]

> 注意：  
> （1）马尔可夫**奖励过程**的状态转移概率和奖励函数**仅取决于当前状态。**  
> （2）马尔可夫**决策过程**的状态转移概率和奖励函数**不仅取决于智能体当前状体，还取决于智能体选取的动作**。

例子：学生马尔可夫决策过程

> 解释：黄色字体表示学生采取的动作，框图表示MRP的状态名（避免混淆隐去），R表示奖励函数，其与学生所采取的动作有关。  
> 注意：当学生选择“去查阅文献pub”这个动作时，则将进入一个临时状态（图中用黑色小实点表示），随后被环境按照其动力学分配到另外三个MRP状态（class1、class2、class3），也就是说此时Agent**没有选择权**决定去哪一个状态。

![v2-d5f797be692be95e48476449b2fde93f_1440w.jpg](https://raw.githubusercontent.com/Tendourisu/images/master/v2-d5f797be692be95e48476449b2fde93f_1440w.jpg)

参考资料

[李建平：第二讲 马尔可夫决策过程](https://zhuanlan.zhihu.com/p/494755866)

> 以下为课外补充

**12.强化学习（reinforcement learning）：** 其是一种实现序贯决策的机器学习方法，定义如下：**机器通过与环境进行交互，不断尝试，从错误中学习，做出正确决策从而实现目标的方法。**

> 注意：机器学习分为有监督学习方法、无监督学习方法、强化学习，三者并列。

**13.强化学习分类：**

**（1）根据agent学习方式分：** 基于价值的强化学习Value based RL（P2）、基于策略的强化学习Policy based RL（P3） 、以及Actor-Critic方法（P4）。

**（2）按agent有无学习环境的模型分：** model-based（通过学习状态转移概率 $P ( s , s ′ )$ 采取行动）与model-free（通过学习价值函数 $V π ( s )$ 与策略函数进行决策）

![v2-ba993ffb12b83fd73b2a5f8ee757afae_1440w.jpg](https://raw.githubusercontent.com/Tendourisu/images/master/v2-ba993ffb12b83fd73b2a5f8ee757afae_1440w.jpg)

**（3）根据如何使用已有的数据进行学习和决策分：** 在线策略（on-policy）和离线策略（off-policy）。

- 在线策略（on-policy）算法表示**行为策略和目标策略是同一个策略**，agent根据当前的策略来选择动作，并且学习的目标是优化当前正在执行的策略
- 离线策略（off-policy）算法表示行为**策略和目标策略不是同一个策略**，学习算法可以利用从其他策略生成的数据来进行学习，而不局限于当前执行的策略

> 相比于在线策略，离线策略学习往往能够更好地利用历史数据，并具有更小的样本复杂度

**（4）根据更新方式分：** 回合更新（Monte-Carlo update）与单步更新（Temporal-DIfference update）。

- 回合更新：游戏有开始和结束，回合更新只有等待一局游戏从开始到结束，然后才能更新行为准则
- 单步更新：在游戏过程中，每一步都可以更新，不用等待游戏的结束，边玩边学习，学习效率更好

**14.Rollout** 在强化学习中，rollout指的是在训练过程中，智能体根据当前的策略在环境中进行一系列的**模拟交互步骤，模拟并收集样本数据的过程。**

> 理解：仿真器（webots、mujoco）是提供虚拟环境和交互的**工具**，而 rollout 是在该环境中进行交互并收集样本数据的**过程**。

**15.回合（episode）：** 一个完整的任务执行过程被称为一个回合或一个episode，强调任务从开始到终止的全部过程。

**16.转移（transition）：** 在强化学习中，一个状态到另一个状态的变化被称为转移。转移通常由三元组（也可以包括奖励信号）表示(state, action, next\_state)

**17.轨迹（trajectory）：** 轨迹是一连串的**状态-动作对**，描述了智能体是如何在环境中移动并与环境互动的。**在一个回合中，可以包含多个轨迹，而一个轨迹可以包含一系列转移组成。**

参考资料：

[【强化学习】强化学习基础教程：基本概念、强化学习的定义，要素，方法分类 以及 Rollout、episode回合、transition转移、trajectory轨迹的概念](https://blog.csdn.net/Ever\_\_\_\_\_/article/details/133362585?ops\_request\_misc=%7B%22request%5Fid%22%3A%22abfc536d828c6cb4ad3004cf9dcc7559%22%2C%22scm%22%3A%2220140713.130102334.pc%5Fall.%22%7D&request\_id=abfc536d828c6cb4ad3004cf9dcc7559&biz\_id=0&utm\_medium=distribute.pc\_search\_result.none-task-blog-2~all~first\_rank\_ecpm\_v1~rank\_v31\_ecpm-26-133362585-null-null.142^v100^pc\_search\_result\_base1&utm\_term=Rollout&spm=1018.2226.3001.4187)

### 二、Return and Value  

**1.回报(Return，也叫累计奖励)** 顾名思义，从当前时刻开始到本回合结束的所有奖励的总和。计 $t$ 时刻的回报为**随机变量** $U_{t}$ ： $U_{t} = R_{t} + R_{t+1} + R_{t+2} + R_{t+3} + \ldots + R_{n}$

> 注意：强化学习的目标就是寻找一个策略，使得回报的期望最大化，这个策略称为最优策略 (optimum policy)。

**2.折扣回报(Discounted Return)** 在 MDP 中，通常使用折扣回报，即给未来的奖励做折扣。折扣回报的定义如下:

$$
U_t = R_t + \gamma R_{t+1} + \gamma ^2R_{t+2} + \gamma ^3R_{t+3} + ...
$$

> 注意：对待越久远的未来，折扣因子的幂越大，给奖励打的折扣越大。

**3.动作价值函数(Action-value function)：** 动作价值函数通常表示为 $ Q_π(s_t,a_t)$ ，它用于评估在给定状态 $s_t$ 下采取某个动作 $a_t $ 后，按照策略 $π$ 所能获得的期望回报。

> 含义解释：动作价值函数像是评估你目前走的这步棋的得分，它考虑了你走这步棋后，按照你的策略继续下棋所能获得的期望得分。通过评估和比较当前不同动作的Q值，来决定走哪步棋。

$$
Q_{\pi}(S_t, A_t) = E_{S_{t+1}, A_{t+1}, \ldots, S_n, A_n} \left[ U_t \mid S_t = s_t, A_t = a_t \right]
$$

> 注意：  
> （1）动作价值函数只依赖于当前状态 $s_t,$动作 $a_t $ ​，而不依赖于之后的状态和动作。  
> （2）在强化学习中，动作价值函数用于评估不同动作的优劣，并指导智能体做出决策。智能体通常会选择那些能够最大化Q的动作。  
> （3）不论未来采取什么样的策略$\pi$ ，回报$U_t$ 的期望不可能超过某个动作价值函数 $Q^\star$，这个动作价值函数则称为**最优动作价值函数(Optimal action-value function)**。

$$
Q^\star(s_t,a_t) = max_\pi{Q_\pi(s_t,a_t)}
$$

**4.状态价值函数(State-value function)：** 状态价值函数通常表示为 $V_π​(s_t​)$ ，它用于评估在给定状态状态 $s_t$ 下，按照策略 $π$ 所能获得的期望回报。

> 含义解释：与动作价值函数不同状态价值函数不关心在特定状态下采取的具体动作，而是关心在该状态下遵循策略所能获得的平均回报。

$$
V_{\pi}(s_{t}) = \mathbb{E}_{A_{t} \sim \pi(.|s_{t})} \left[ Q_{\pi}(s_{t}, A_{t}) \right] = \sum_{a \in \mathcal{A}} \pi(a \mid s_{t}) Q_{\pi}(s_{t}, a)
$$

> 注意：  
> （1）状态价值函数依赖于策略，这意味着它反映了在特定策略下，从某个状态开始所能获得的期望回报。  
> （2）状态价值函数可以用来衡量策略 与状态的好坏。状态价值越大，意味着在该状态下遵循策略所能获得的期望回报越高，策略越好。  
> （3）上述是离散的写法（连加），如果是连续的需要换成定积分。  
> （3） **${\pi}$ 与 $Q_{\pi}$ 实际上我们并不知道，**只能用近似的方式获得。例如P4介绍的Actor-Critic方法中，就使用了两个神经网络去近似，然后用Actor-Critic方法同时学习者两个神经网络。

![v2-f54d9ed2330d82ca8314fffa057379a2_1440w.jpg](https://raw.githubusercontent.com/Tendourisu/images/master/v2-f54d9ed2330d82ca8314fffa057379a2_1440w.jpg)

[codingpath：王树森老师 DRL 课程笔记 P1-强化学习 (Reinforcement Learning) 基本概念](https://zhuanlan.zhihu.com/p/588047970)

---

## P2 价值学习 (Value-Based Reinforcement Learning)  

### 一、Deep Q-Network(DQN)  

在前面的学习我们知道，不论未来采取什么样的策略$\pi$ ，回报$U_t$ 的期望不可能超过最优动作价值函数$Q^\star$。那么我就可以根据根据 $Q^\star$的值选择最优动作，然后最大化未来的累计奖励。但事实上我们并不知道$Q^\star$ 的函数表达式，只能近似学习 $Q^\star$。一种常见的办法就是使用**Deep Q Network(DQN，神经网络)。**

$$
s_t\rightarrow{}Q(s,a;w)\rightarrow{}Q^*
$$

> 注意：$w$为神经网络中的参数。在训练DQN时，我首先需要随机初始化它，然后使用时间差分算法等算法逐步去更新它。

![v2-9059fc19d74d4dc361bd8f8290291183_1440w.jpg](https://raw.githubusercontent.com/Tendourisu/images/master/v2-9059fc19d74d4dc361bd8f8290291183_1440w.jpg)

> 注意：  
> （1）DQN输入：输入是状态 s。这个例子中是一个游戏的截图。  
> （2）DQN输出：离散动作空间$\mathcal{A}$ 上的每个动作的 Q 值，即给每个动作的评分，分数越高意味着动作越好。例如下图中UP的Q值最高。

我们可以将 DQN 应用到玩游戏当中，在游戏的每一个回合中，我们总是根据DQN选出Q值最大的动作$a^\star = argmax_{a}Q^\star(s, a)$，转移到下一个状态，并重复这一过程，直到游戏结束。

![v2-1e49fd1e4e266d76236278416412aff8_1440w.jpg](https://raw.githubusercontent.com/Tendourisu/images/master/v2-1e49fd1e4e266d76236278416412aff8_1440w.jpg)

> 注意：  
> 这种方法被称为贪婪策略（greedy policy），即在每个时间步都选择当前最优的动作。在实际应用中，为了探索更多的动作并避免过早地陷入局部最优，可能会使用ε-贪婪策略（ε-greedy policy），即以一定的概率ε随机选择一个动作以探索环境，而不是总是选择当前最优的动作。

### 二、时间差分算法(Temporal Difference Learning)  

训练 **DQN** 最常用的算法是时间差分 (temporal difference，缩写 TD) 算法。时间差分学习是一种在线学习方法，**即在每一步中都会更新价值函数**。其关键思想是用下一个状态的价值来**估计**当前状态的价值，并据此进行更新。

TD算法的损失函数：$L(w) = \frac{1}{2}\left [Q(s,d;w) - y \right ]^2 \\$

> 其中： $[Q(s,d;w) - y]$称为TD 误差(TD error)**。**

然后使用链式法则对 $L(w)$关于参数 $w$求梯度：

$$
\frac{\partial{L}}{\partial{w}} = \frac{\partial{q}}{\partial{w}} \cdot \frac{\partial{L}}{\partial{q}} = (q-y) \cdot \frac{\partial{Q(w)}}{\partial{w}}
$$

最后做梯度下降更新模型参数$w$ :

$$
w_{t+1} = w_t - \alpha \cdot \frac{\partial{L}}{\partial w} \mid _{w=w_t}
$$

> 此处的 $\alpha$是学习率，是个超参数，需要手动调。

### 三、用 TD 算法训练 DQN(TD Learning for DQN)  

（1）首先用价值网络 $Q$ 给动作 $a_t$ 与 $a_{t+1}$ 打分

> 注意：这里的动作是根据策略网络随机抽样得到的

（2）计算TDtarget，把计算出来的结果记作 $y$ 

> 注意  
> （1）$\gamma$是折扣率，让未来的奖励没有当前奖励的权重高  
> （2）$y_t$和 $Q(s_t,a_t;w_t)$ 实际上都是对未来奖励综合的估计，但是$y_t$由一部分真实观测到的值 $r_t$ 组成，因此他的精度更高。**TD算法的核心就是用$Q(s_t,a_t;w_t)$做预测，将$y_t$做为目标，让预测尽可能的接近目标。**

（3）计算损失函数Loss（即两种估计作差并求平方，鼓励$Q(s_t,a_t;w_t)$尽量接近$y_t$）

（4）做梯度下降更新参数

> 注意：用梯度下降更新 $w$ 后，损失函数会逐步变小，训练结果越接近目标。

![v2-9a3aff4e6d7ff80dcf81ab966410ff0c_1440w.jpg](https://raw.githubusercontent.com/Tendourisu/images/master/v2-9a3aff4e6d7ff80dcf81ab966410ff0c_1440w.jpg)

 参考深度强化学习(4\_5)：Actor-Critic Methods 10：00

**参考资料：**

[Native8418：什么是时间差分（Temporal Difference）学习，它如何与蒙特卡罗方法相比？](https://zhuanlan.zhihu.com/p/658564004)

---

## P3 策略学习 (Policy-Based Reinforcement Learning)  

### 一、策略函数近似  

在强化学习基础的学习我们知道，如果我们有一个非常好的策略函数 $\pi(a \mid s)$ ，我们就可以根据该策略函数计算出每个动作的概率值，从而控制智能体。

然而策略函数与最优动作价值函数 $Q^\star$ 一样，我们并不知道他们的具体的函数值，因此我们可以使用**神经网络**近似策略函数。我们把这个神经网络称为**策略网络(policy network)** 记作 $\pi(a \mid s;\theta)$ ；将近似得到的函数称为**策略函数** ，记作 $\pi(a \mid s)$ **。**

![v2-74d26413756af98ffbb7891a61725dda_1440w.jpg](https://raw.githubusercontent.com/Tendourisu/images/master/v2-74d26413756af98ffbb7891a61725dda_1440w.jpg)

> 注意：$\theta$表示神经网络的参数。一开始我们随机初始化 $\theta$，随后我们利用收集的状态、动作、奖励不断更新 $\theta$，直到策略函数近似程度满足我们的需求。

策略网络的结果如下图所示，策略网络的输入是状态 $s$，经过卷积神经网络（Conv）处理得到画面的特征向量，然后经过全连接神经网络映射到维度为 $n$ 的向量 $f$ ，然后用$softmax$激活函数，输出概率分布。

> 注意：  
> （1）动作空间 $\mathcal{A}$ 的大小是多少，向量 $f$的维度 $n$ 就是多少。  
> （2）所以输出的向量所有元素都是正数（实际上是概率），且相加等于 1，即 $\sum_{a \in \mathcal{A}}\pi(a \mid s; \theta) = 1$

![v2-04af3fc257b55e855fa3bf444a49e604_1440w.jpg](https://raw.githubusercontent.com/Tendourisu/images/master/v2-04af3fc257b55e855fa3bf444a49e604_1440w.jpg)

### 二、策略学习的目标函数  

如果用策略网络 $\pi(a \mid s_t;\theta)$ 去近似策略函数$\pi(a \mid s_t)$ ，此时对应的近似状态价值函数如下：

$$
V(s_t;\theta) = \sum_a\pi(a \mid s_t; \theta)\cdot Q_\pi(s_t,a)
$$

若一个策略足够好好，那么状态价值函数的近似$V(s;\theta)$ 的均值也越大。因此我们定义**策略学习的目标函数**： $J(\theta) = E_S\left [V(S;\theta) \right]$

> 注意：目标函数$J(\theta)$ 排除了状态$S$ 的因素，只依赖于策略网络$\pi$ 的参数$\theta$ 。通过学习参数$\theta$ ，使得目标函数 $J(\theta)$ 越来越大，也就意味着策略网络越来越好。

这里使用**策略梯度上升**来更新 $\theta$ ，使得 $J(\theta)$ 增大。设当前策略网络的参数为 $\theta_{now}$ ,做梯度上升更新参数，得到新的参数

$$
\theta_{new} : \theta_{new} \leftarrow \theta_{now} + \beta\cdot\nabla_\theta{J(\theta_{now})}
$$

此处的 $\beta$ 是学习率，需要手动调。其中的梯度：

$$
\nabla_\theta{J(\theta_{now})} = \frac{\partial J(\theta)}{\partial \theta} \mid _{\theta=\theta_{now}}
$$ 

称为**策略梯度(policy gradient)**。

### 三、策略梯度(Policy Gradient)  

策略梯度计算公式如下所示，两者形式上等价。前者适用于动作离散的情形，后者适用于连续的动作。

![v2-26c84e3f4f3cdd5d6804b035d5b2ecb7_1440w.jpg](https://raw.githubusercontent.com/Tendourisu/images/master/v2-26c84e3f4f3cdd5d6804b035d5b2ecb7_1440w.jpg)

策略梯度两种计算方式

例如当动作空间为 $\mathcal{A} = \{left, right, up\}$ ，我们使用form1进行计算，只需要计算处所有动作的 $f(a,\theta)$ ，将所有结果相加即可得到策略梯度。  
![v2-202ebedd5999b422a2d002a7cee4242b_1440w.jpg](https://raw.githubusercontent.com/Tendourisu/images/master/v2-202ebedd5999b422a2d002a7cee4242b_1440w.jpg)

对于连续的动作空间，如 $\mathcal{A} = [0，1]$ ，我们则使用forms2计算策略梯度。然而采用上述公式中计算策略梯度十分困难（期望、概率密度函数过于复杂），连加或定积分的计算量非常大。 因此我们可以通过蒙特卡洛法去近似该期望，计算的过程如下：  
![v2-7d506449c067ab03e432874674c85e0b_1440w.jpg](https://raw.githubusercontent.com/Tendourisu/images/master/v2-7d506449c067ab03e432874674c85e0b_1440w.jpg)

> 注意： $\hat{a}$ 是根据概率密度函数抽取出来的，所以$g(\hat{a};\theta)$ 是策略梯度的无偏估计，进一步的我们可以使用$g(\hat{a};\theta)$近似策略梯度。

### 四、使用策略梯度更新策略网络  

算法步骤如下

![v2-1fc51b6f57be9f4268ffd402aee98a13_1440w.jpg](https://raw.githubusercontent.com/Tendourisu/images/master/v2-1fc51b6f57be9f4268ffd402aee98a13_1440w.jpg)

> 注意：在第 3 步中，我们是无法精确计算出 $q_t$ ，后续会介绍使用REINFORCE 算法、actor-critic 算法来近似$Q_\pi(s,a)$。

参考资料：

[codingpath：王树森老师 DRL 课程笔记 P3-策略学习 (Policy-Based Reinforcement Learning)](https://zhuanlan.zhihu.com/p/590289345)

---

## P4 运动员-裁判算法 (Actor-Critic Methods)  

### 一、价值函数近似  

在前面我们提到，状态价值函数 $V_\pi(s) = \sum_{a}\pi(a|s)\cdot Q_\pi(s,a)$中，$\pi(a|s;\theta)$函数与$q(s,a;w)$函数我们并不知道，**因此我们需要用两个网络近似它们，并使用Actor-Critic算法同时学习这两个网络**。

Actor-Critic算法是价值学习和策略学习相结合起来，我们用策略网络近似$\pi(a|s;\theta)$函数；用价值网络近似$q(s,a;w)$函数。其中，Actor是策略网络，用来控制agent运动；Critic是价值网络，用来给价值打分。近似结果如黄色部分所示。

![v2-8053823ff849e971f8fd59248636d594_1440w.jpg](https://raw.githubusercontent.com/Tendourisu/images/master/v2-8053823ff849e971f8fd59248636d594_1440w.jpg)

学习策略网络$\pi(a|s;\theta)$是为了让运动员得到**更高的平均分**，即获得更高的状态价值函数 $V_\pi(s)$；为了学习策略网络，我们需要价值网络$q(s,a;w)$来当裁判，给运动员打分，学习价值网络主要是为了让裁判**打分更加精准**。

![v2-409ecc9fe358bbfe6cc5d18ca7a886fa_1440w.jpg](https://raw.githubusercontent.com/Tendourisu/images/master/v2-409ecc9fe358bbfe6cc5d18ca7a886fa_1440w.jpg)

### 二、训练流程  

（1）观测到旧的状态 $s_t$，用策略网络计算概率分布，然后再根据概率随机抽取动作$a_t$： $a_t \sim \pi(\cdot | s_t;\theta_{now})$

（2）Agent执行动作$a_t$，然后从环境中观测到奖励 $r_t$ 和新的状态 $s_{t+1}$。

（3）拿新的状态$s_{t+1}$作为输入（回到第一步），根据策略网络计算出新的概率，并随机抽样得到动作$a_{t+1}$： $\tilde{a}_{t+1} \sim \pi(\cdot | s_{t+1};\theta_{now})$，**但不让智能体执行动作 $a_{t+1}$。**

（4）计算用上述两次状态和动作让裁判打分输出：

$$
\hat{q_t} = q(s_t,a_t;w_{now}) 和 q_{t+1} = q(s_{t+1},\tilde{a}_{t+1};w_{now})
$$ 

（5） 计算 TD 目标和 TD 误差：

$$
\hat{y_t} = r_t + \gamma \cdot \hat{q_{t+1}} 和 \delta_t = \hat{q_t} - \hat{y_t}
$$

> 注意： $\hat{q_t}$ 为当前预测， $\hat{y_t}$ 为TD目标，他们的差即为TD误差。

（6）对价值网络求导，计算 $Q$ 网络关于参数 $w$ 梯度，记作 $d_{w,t}$ ：

> 注意：$d_{w,t}$与 $w$ 是同样大小的矩阵。

（7）用TD算法梯度下降更新价值网络，让裁判打分更加精准：

$$
w_{new} = w_{now} - \alpha \cdot \delta_t \cdot d_{w,t}
$$

> 注意： $\delta_t \cdot d_{w,t}$ 表示梯度

（8）对策略网络 $\pi$ 求导，记作$d_{\theta,t}$

（9） 用梯度上升来更新策略网络，让运动员的平均分更高

$$
\theta_{new} = \theta_{now} + \beta \cdot q_t \cdot d_{\theta,t}
$$

> 注意：  
> （1） $q_t \cdot d_{\theta,t}$ 是策略梯度的蒙特卡罗近似， $\beta$ 为学习率。  
> （2）部分论文用TD误差 $\delta_t$ 进行更新，效果更好。

$$
\theta_{new} = \theta_{now} + \beta \cdot \delta_t \cdot d_{\theta,t}
$$

![v2-a1f661508c2307075d8bce604486bf73_1440w.jpg](https://raw.githubusercontent.com/Tendourisu/images/master/v2-a1f661508c2307075d8bce604486bf73_1440w.jpg)

---

## P5 AlphaGo  

### 一、AlphaGo设计思路  

AlphaGo的设计思路如图所示，先用分**三个步骤训练**，再进行决策。

（1）用16万局人类对决中采用**behavior cloning**来初步学习一个策略网络，让策略网络来**模仿人类**的动作

（2）用强化学习（**策略梯度算法**）进一步训练该网络，让AlphaGo做自我博弈，用**游戏胜负**还更新策略网络（赢了奖励为1，输了奖励为-1）

（3）第三步是训练价值网络，用来评估状态的好坏，这一步用策略网络做自我博弈，用**游戏胜负结果作为Target，**让**价值网络**来拟合这个Target。

> 注意：  
> （1）behavior cloning不是强化学习，是一种监督学习。  
> （2）AlphaGo的策略网络和价值网络不是同时训练，不属于Actor-Critic算法。

![v2-13fa638ff26fe8652b77beb45f0692e2_1440w.jpg](https://raw.githubusercontent.com/Tendourisu/images/master/v2-13fa638ff26fe8652b77beb45f0692e2_1440w.jpg)

当完成上述训练后，AlphaGo完全可以使用策略网络进行下棋，但更好的方式是采用**蒙特卡洛树搜索（Monte Carlo Tree Search）**。MCTS 不需要训练，可以根据前面所训练的训练策略网络和价值网络直接做决策。

### 二、蒙特卡洛树搜索主要思想  

人类玩家在下棋的时候通常都会向前看几步，越是高手，看的越远。MCTS 的基本原理就是向前看，通过每一轮的成千上万次的模拟，从而找出当前最优的动作。

![v2-0525d315f36a89b2cc70d259199489f8_1440w.jpg](https://raw.githubusercontent.com/Tendourisu/images/master/v2-0525d315f36a89b2cc70d259199489f8_1440w.jpg)

### 三、蒙特卡洛树搜索四步骤  

MCTS每一轮模拟都分为选择（selection）、扩展（expansion）、求值（evaluation）、回溯（backup）四部分。AlphaGo每走一步棋都要重复上面这些步骤，通过成**千上万次模拟**，AlphaGo便有了每个动作的 $Q(a)$ 分数与 $N(a)$ 分数，然后AlphaGo会**选择最大的$Q(a)$ 分数对应的动作**来执行。

![v2-2c02b30567f2480d26f609c76c3f3db6_1440w.jpg](https://raw.githubusercontent.com/Tendourisu/images/master/v2-2c02b30567f2480d26f609c76c3f3db6_1440w.jpg)

**（1）选择（Selection）：**选择的目的是找出胜算较高的动作，忽略掉其它不好的动作。首先它将所有动作都打上分，好的动作分数高，坏的动作分数低：

$$
score(a) = Q(a) + \frac{\eta}{1+N(a)} \cdot \pi(a \mid s;\theta)
$$

> 注意：  
> （1）$Q(a)$ 是搜索计算出来的分数，称为动作价值，主要由胜率和价值函数决定。$Q(a)$实际上是个表，记录了361个动作的分数。它的的初始值是 0，动作 a 每被选中一次，就会更新一次$Q(a)$ 。  
> （2）$N(a)$ 是动作 a 选中的次数，用于避免统一动作被探索很多次  
> （3）$\eta$ 是一个需要调的超参数，需要手动调整

例如在这个例子中，选中了分数最高的0.8

![v2-5920dc8efc62232d6840f936fcf4ebd3_1440w.jpg](https://raw.githubusercontent.com/Tendourisu/images/master/v2-5920dc8efc62232d6840f936fcf4ebd3_1440w.jpg)

**（2）扩展（Expansion）：** 把第一步选中的动作记作$a_t$ ，它只是个**假想的动作**，而不是 AlphaGo 真正执行的动作。然后通过策略函数来模拟对手，通过策略网络和**对手视角下**的状态 $s'_t$ 随机抽样一个动作 $a'_t$ ，并产生新的状态 $s'_{t+1}$ 。

![v2-e5a27c144e5171affa2554b3ee39ed92_1440w.jpg](https://raw.githubusercontent.com/Tendourisu/images/master/v2-e5a27c144e5171affa2554b3ee39ed92_1440w.jpg)

> 注意：此阶段会模拟对手所有下子的情况，因此是随机抽样。

**（3）求值（evaluation）：**

这部分采用两种方式来评价状态$s'_{t+1}$ 好坏：

（1）使用Fast Rollout评价：从让策略网络**自我博弈**，直到分出胜负为止，然后后输出奖励 $r_r$ 来评价状态$s'_{t+1}$的好坏。

（2）使用价值网络评价：使用前面训练出来的**价值网络** $v(s_{t+1},w)$ 来评价。

然后将两个分数求平均，作为状态$s'_{t+1}$的分数：

$$
V(s_{t+1}) = \frac{1}{2} v(s_{t+1}; \mathbf{w}) + \frac{1}{2} r_T
$$

![v2-df64d08f1b38f9a85162306b5a82f32e_1440w.jpg](https://raw.githubusercontent.com/Tendourisu/images/master/v2-df64d08f1b38f9a85162306b5a82f32e_1440w.jpg)

![v2-35ae24b79a826d385c4c1b3ee44a0065_1440w.jpg](https://raw.githubusercontent.com/Tendourisu/images/master/v2-35ae24b79a826d385c4c1b3ee44a0065_1440w.jpg)

**（4）回溯（backup）：**

将假想的动作 $a_t$ 下所有的分数作为$a_t$新的价值 $Q(a_t)$ ，AlphaGo的决策就是选中最大$Q(a_t)$值。

$$
Q(a_t) = \text{mean}(\text{the recorded } V's)
$$

![v2-634301fd0fb395659a1dc8cccf927f87_1440w.jpg](https://raw.githubusercontent.com/Tendourisu/images/master/v2-634301fd0fb395659a1dc8cccf927f87_1440w.jpg)

### 四、AlphaGo Zero 与 AlphaGo  

最新版的AlphaGo Zero 与前面的版本有所区别：一，不再使用人类的数据进行训练；二；MCTS被用来训练策略网络。结果两者相比，新版AlphaGo Zero完败旧版AlphaGo 。

> 注意：这个例子不能说明behavior cloning没有用，在其他物理世界模拟中，如自动驾驶、手术等等，behavior cloningkey有效的减少最坏的情况，不需要撞坏十几万辆车、不需要给真人动十几万次手术。

最新版的AlphaGo Zero训练步骤如下：

![v2-2ee6f40cddc9b4159f4c4cc2cba423ec_1440w.jpg](https://raw.githubusercontent.com/Tendourisu/images/master/v2-2ee6f40cddc9b4159f4c4cc2cba423ec_1440w.jpg)

---

## P6 蒙特卡罗方法  

### 一、 蒙特卡罗方法算法简介  

蒙特卡罗名字来源于**摩纳哥的梦塔卡罗赌场，**算法的名字来源于统计学大师Nicholas Metropolis1947年论文。蒙特卡罗方法的定义如下：

> 蒙特卡罗是一种数值算法，靠重复随机样本（repeated random sampling）来对目标做近似。

![v2-bbb416f7e7510e498796b9c824740fd3_1440w.jpg](https://raw.githubusercontent.com/Tendourisu/images/master/v2-bbb416f7e7510e498796b9c824740fd3_1440w.jpg)

> 注意：蒙特卡罗的算法往往是错的，只是目标的近似

下面是个实际的例子，采用蒙特卡罗方法计算某个复杂函数的定积分。首先我们在区间 $[0.8,3]$ 随机抽样得到 $n$ 个样本，记作 $x_1,...,x_n$ ，然后计算每个样本的函数值并取平均再乘以区间大小2.2，结果记作 $Q_n$ ，最后输出$Q_n$作为定积分的近似。 

> 注意：根据大数定理可以保证，当 $n$ 区域无穷时，$Q_n$的值趋于 $I$

![v2-c98f34b717e44c6034a3e37d342b463a_1440w.jpg](https://raw.githubusercontent.com/Tendourisu/images/master/v2-c98f34b717e44c6034a3e37d342b463a_1440w.jpg)

### 二、时间差分学习与蒙特卡罗方法对比  

| 特性 | 时间差分学习 (TD Learning) | 蒙特卡罗方法 (Monte Carlo Methods) |
| --- | --- | --- |
| 更新时机 | 在线更新，每一步都会更新价值函数。 | 在整个状态或动作序列结束后进行更新。 |
| 关键思想 | 用下一个状态的价值来估计当前状态的价值，并据此进行更新。 | 基于采样来估计价值函数，使用完整的序列信息 |
| 优点 | 在线学习，无需等待整个序列结束，具有较高的样本效率 | 精确度高，因为它使用了完整的序列信息 |
| 缺点 | 可能不够精确，因为它依赖于其他状态的价值估计 | 需要等待整个序列完成，因此在计算和时间上可能较慢 |
| 计算效率 | 较高 | 较低 |
| 准确性 | 较低 | 较高 |
| 适用场景 | 动态和未知的场景 | 状态转换和奖励非常确定的场景 |

参考资料：

[Native8418：什么是时间差分（Temporal Difference）学习，它如何与蒙特卡罗方法相比？](https://zhuanlan.zhihu.com/p/658564004)

---

## P7 随机排列与Fisher-Yates算法  

### 一、随机排列问题  

1.均匀随机排列数学定义：把n个元素变成一个随机序列，序列中的位置都是随机的

2.三种随机排列定义

（1）从所有可能的序列中做随机抽样得到一个序列，一共有 $n！ $种可能的序列，抽到的序列是所有序列中的一个

（2）排列以后，一个元素可以在 $\left\{ 0,1,...,n-1 \right\}$ 之间的任何一个位置上，且概率都是 $1/n$ 。

（3）排列以后，一个位置上出现任何元素，且他们的概率相等。

![v2-d82519346e87289d7152dc109efc884b_1440w.jpg](https://raw.githubusercontent.com/Tendourisu/images/master/v2-d82519346e87289d7152dc109efc884b_1440w.jpg)

### 二、Fisher-Yates算法  

基本想法：在**第i次**循环中，我们在剩余的元素中做**随机抽样**选取一个元素并把它放到**第i号**位置中。

特点：时间复杂度： $O(n^2)$ ，且需要额外数组特点

### 三、改进版Fisher-Yates算法过程  

**（1）随机抽取，然后将选中的数字放到第i轮对应的各子**

特点：时间复杂度： $O(n)$ ，且直接操作数组。两者区别如下：

![v2-4a9fb0f1e7e526a94b4d6f36e4f78e6a_1440w.jpg](https://raw.githubusercontent.com/Tendourisu/images/master/v2-4a9fb0f1e7e526a94b4d6f36e4f78e6a_1440w.jpg)

---

## P8 Sarsa算法  

Sarsa（state action reward state action），算法的目的是**学习动作价值函数 $Q(\pi)$** ，其可以用在表格形式的强化学习，直接去学$Q(\pi)$函数，但前提是状态和动作的数量数有限的，sarsa算法每次更新表格中的一个元素，T让TD error减小；也可以用来学习价值网络，Sarsa算法每次用一个五元组来更新参数w（实际上在前面的actor-critic算法课中，我们就用了sarsa算法更新价值网络参数w）

![v2-fff47efb93655272a4fdf9680b5d8cff_1440w.jpg](https://raw.githubusercontent.com/Tendourisu/images/master/v2-fff47efb93655272a4fdf9680b5d8cff_1440w.jpg)

### 一、Sarsa(Tabular Version)  

适用情形：状态和动作的数量有限

### 二、Sarsa(Value Network Version)  

适用情形：

---

## P9 Q-Learning算法  

与Sarsa算法不同，Q-Learning的目标是学**习最优动作价值函数** $Q^*$ ，其可以用在表格上直接去学习$Q^*$，但前提是状态和动作的数量数有限的，Q-Learning算法每次更新表格中的一个元素，让TD error减小；也可以用来训练DQN，Q-Learning算法每次用一个观测到的transition来更新一次参数w。

![v2-34619346708ba7a4dd18d994e7f500ef_1440w.jpg](https://raw.githubusercontent.com/Tendourisu/images/master/v2-34619346708ba7a4dd18d994e7f500ef_1440w.jpg)

### 一、Q-Learning(Tabular Version)  

### 二、Q-Learning(DQN Version)  

### 三、Sarsa 与 Q-Learning  

> 注意：两种算法的TD target都只包含一个奖励，这是标准的TD target，如果是多个奖励，那就变成我们下面介绍的Multi-Step TD Target。

![v2-b7abcdf4794a7d7624f82a1230ee9949_1440w.jpg](https://raw.githubusercontent.com/Tendourisu/images/master/v2-b7abcdf4794a7d7624f82a1230ee9949_1440w.jpg)

---

## P10 Multi-Step TD Target  

是TD算法的改进

---

## P11 经验回放 Experience Replay  

经验回放作用： 既可以重复利用经验，避免浪费；也可以把序列打散，消除相关性

### 一、Experience Replay  

### 二、Prioritized Experience Replay  

![v2-5b02cc3643d6280aeed64f54844f553d_1440w.jpg](https://raw.githubusercontent.com/Tendourisu/images/master/v2-5b02cc3643d6280aeed64f54844f553d_1440w.jpg)

---

## P12 高估问题、Target Network、Double D  

### 一、高估问题  

TD算法导致DQN高估真实动作价值的两个原因：

（1）计算TD target的时候用到了**最大化**

（2）**bootstrapping（自举）**，用自己的估计更新自己

![v2-2d06e5c754dacdfa24a989975bee7506_1440w.jpg](https://raw.githubusercontent.com/Tendourisu/images/master/v2-2d06e5c754dacdfa24a989975bee7506_1440w.jpg)

### 二、Target Network  

![v2-ba993ffb12b83fd73b2a5f8ee757afae_1440w.jpg](https://raw.githubusercontent.com/Tendourisu/images/master/v2-ba993ffb12b83fd73b2a5f8ee757afae_1440w.jpg)

### 三、Double D  

### 四、三种TD target计算方式对比  

![v2-a8214ec538580c7174ebc4c9db2705b1_1440w.jpg](https://raw.githubusercontent.com/Tendourisu/images/master/v2-a8214ec538580c7174ebc4c9db2705b1_1440w.jpg)
