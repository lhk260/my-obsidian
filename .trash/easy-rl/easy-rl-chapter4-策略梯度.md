---
title: easy-rl-chapter4-策略梯度
tags:
  - RL
categories: dairy
date: " 2025-02-21T16:13:25+08:00 "
modify: " 2025-02-21T16:13:25+08:00 "
dir: dairy
share: false
cdate: " 2025-02-21 "
mdate: " 2025-02-21 "
---

[[策略梯度算法]]

# 第4章 策略梯度

## 4.1 目标函数与梯度推导

### 目标函数定义

策略梯度的核心目标是最大化期望总回报：

$$
\bar{R}_\theta = \mathbb{E}_{\tau \sim p_\theta(\tau)}[R(\tau)]
$$

其中：

- $\tau = \{s_1, a_1, s_2, a_2, \dots, s_T, a_T\}$ 是轨迹。
- $R(\tau) = \sum_{t=1}^T r_t$ 是轨迹的总奖励。
- $p_\theta(\tau) = p(s_1) \prod_{t=1}^T p_\theta(a_t|s_t) p(s_{t+1}|s_t,a_t)$ 是轨迹的概率。

---

### 梯度计算步骤

#### 1. 初始梯度表达式

对 $\bar{R}_\theta$ 求梯度：

$$
\nabla \bar{R}_\theta = \sum_{\tau} R(\tau) \nabla p_\theta(\tau)
$$

#### 2. 对数概率技巧

利用 $\nabla p_\theta(\tau) = p_\theta(\tau) \nabla \log p_\theta(\tau)$，将梯度转化为期望形式：

$$
\nabla \bar{R}_\theta = \sum_{\tau} R(\tau) p_\theta(\tau) \nabla \log p_\theta(\tau) = \mathbb{E}_{\tau \sim p_\theta(\tau)} \left[ R(\tau) \nabla \log p_\theta(\tau) \right]
$$

#### 3. 分解轨迹概率

展开 $\log p_\theta(\tau)$：

$$
\log p_\theta(\tau) = \log p(s_1) + \sum_{t=1}^T \log p_\theta(a_t|s_t) + \sum_{t=1}^T \log p(s_{t+1}|s_t,a_t)
$$

- **关键点**：$\log p(s_1)$ 和 $\log p(s_{t+1}|s_t,a_t)$ 与 $\theta$ 无关，梯度为0。
- 最终保留项：

$$
\nabla \log p_\theta(\tau) = \sum_{t=1}^T \nabla \log p_\theta(a_t|s_t)
$$

#### 4. 梯度简化

代入后梯度表达式简化为：

$$
\nabla \bar{R}_\theta = \mathbb{E}_{\tau \sim p_\theta(\tau)} \left[ R(\tau) \sum_{t=1}^T \nabla \log p_\theta(a_t|s_t) \right]
$$

#### 5. 采样近似

通过采样 $N$ 条轨迹，近似计算梯度：

$$
\nabla \bar{R}_\theta \approx \frac{1}{N} \sum_{n=1}^N \sum_{t=1}^{T_n} R(\tau^n) \nabla \log p_\theta(a_t^n|s_t^n)
$$

---

### 引入基线（Baseline）

#### 动机

- **问题**：当奖励始终为正时，所有动作的概率均被提升，导致高方差。
- **解决方案**：引入基线 $b$（通常为平均奖励），调整梯度公式：

$$
\nabla \bar{R}_\theta \approx \frac{1}{N} \sum_{n=1}^N \sum_{t=1}^{T_n} (R(\tau^n) - b) \nabla \log p_\theta(a_t^n|s_t^n)
$$

#### 数学证明

- **无偏性**：由于 $\sum \nabla p_\theta(\tau) = 0$，基线项不改变期望值：

$$
\mathbb{E}[\nabla \log p_\theta(\tau) \cdot b] = b \cdot \mathbb{E}[\nabla \log p_\theta(\tau)] = 0
$$

---

### 分配合适的分数（Credit Assignment）

#### 问题与改进

- **问题**：整场游戏的奖励无法区分单个动作的贡献。
- **改进1**：仅使用当前动作后的未来奖励：

$$
G_t = \sum_{t'=t}^T r_{t'}
$$

- **改进2**：引入折扣因子 $\gamma$，降低远期奖励的权重：

$$
G_t = \sum_{t'=t}^T \gamma^{t'-t} r_{t'}
$$

#### 梯度公式更新

$$
\nabla \bar{R}_\theta \approx \frac{1}{N} \sum_{n=1}^N \sum_{t=1}^{T_n} (G_t^n - b) \nabla \log p_\theta(a_t^n|s_t^n)
$$

---

## 4.2 REINFORCE算法推导

### 未来总奖励计算

- **蒙特卡洛方法**：从时刻 $t$ 到回合结束的折扣奖励和：

$$
G_t = r_{t+1} + \gamma r_{t+2} + \gamma^2 r_{t+3} + \dots + \gamma^{T-t-1} r_T
$$

- **递归计算**（从后向前）：

$$
G_t = r_{t+1} + \gamma G_{t+1}
$$

### 损失函数构造

- **交叉熵损失**：结合未来奖励 $G_t$，加权动作的对数概率：

$$
\text{Loss} = -\frac{1}{N} \sum_{n=1}^N \sum_{t=1}^{T_n} G_t^n \cdot \log p_\theta(a_t^n|s_t^n)
$$

### 伪代码实现

```python
# 生成轨迹
states, actions, rewards = [], [], []
state = env.reset()
done = False
while not done:
    action_probs = policy_net(state)
    action = sample(action_probs)  # 根据概率采样动作
    next_state, reward, done = env.step(action)
    states.append(state)
    actions.append(action)
    rewards.append(reward)
    state = next_state

# 计算未来奖励 G_t
G = 0
returns = []
for r in reversed(range(len(rewards))):
    G = r + gamma * G
    returns.insert(0, G)

# 计算梯度并更新参数
loss = 0
for s, a, G in zip(states, actions, returns):
    log_prob = torch.log(policy_net(s)[a])
    loss += -log_prob * G
optimizer.zero_grad()
loss.backward()
optimizer.step()
```

---

## 核心公式总结

| 公式 | 说明 |
|------|------|
| $\bar{R}_\theta = \mathbb{E}_{\tau}[R(\tau)]$ | 目标函数：最大化期望总奖励 |
| $\nabla \bar{R}_\theta = \mathbb{E}[R(\tau) \sum \nabla \log p_\theta(a_t\|s_t)]$ | 原始策略梯度 |
| $\nabla \bar{R}_\theta \approx \frac{1}{N} \sum \sum (G_t - b) \nabla \log p_\theta(a_t\|s_t)$ | 带基线和折扣的未来奖励梯度 |
| $G_t = r_{t+1} + \gamma G_{t+1}$ | 未来奖励的递归计算 |

## 关键词

- **策略（policy）**：在每一个演员中会有对应的策略，这个策略决定了演员的后续动作。具体来说，策略就是对于外界的输入，输出演员现在应该要执行的动作。一般地，我们将策略写成 $\pi$ 。
- **回报（return）**：一个回合（episode）或者试验（trial）得到的所有奖励的总和，也被人们称为总奖励（total reward）。一般地，我们用 $R$ 来表示它。
- **轨迹（trajectory）**：一个试验中我们将环境输出的状态 $s$ 与演员输出的动作 $a$ 全部组合起来形成的集合称为轨迹，即 $\tau=\left\{s_{1}, a_{1}, s_{2}, a_{2}, \cdots, s_{t}, a_{t}\right\}$ 。
- **奖励函数（reward function）**：用于反映在某一个状态采取某一个动作可以得到的奖励分数，这是一个函数。即给定一个状态-动作对 ($s_1$,$a_1$) ，奖励函数可以输出 $r_1$ 。给定 ($s_2$,$a_2$)，它可以输出 $r_2$。 把所有的 $r$ 都加起来，我们就得到了 $R(\tau)$ ，它代表某一个轨迹 $\tau$ 的奖励。
- **期望奖励（expected reward）**：$\bar{R}_{\theta}=\sum_{\tau} R(\tau) p_{\theta}(\tau)=E_{\tau \sim p_{\theta}(\tau)}[R(\tau)]$。
- **REINFORCE**：基于策略梯度的强化学习的经典算法，其采用回合更新的模式。
