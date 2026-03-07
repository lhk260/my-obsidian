---
title: week6-随机过程与Poisson过程
tags:
  - 概率论
categories: 
date: 2025-03-24T09:45:12+08:00
modify: 2025-03-24T09:45:12+08:00
dir: 
share: false
cdate: 2025-03-24T09
mdate: 2025-03-24T09
---

# 随机过程与Poisson过程

## 一、随机过程基础
### 1.1 随机过程定义
- **定义**：概率空间$(Ω, F, P)$上，参数$t ∈ T$的随机变量族$\{X_t\}$称为随机过程
	- S——状态空间， $X_{i}$ 所有可能
- **样本轨道**：固定$ω ∈ Ω$时，$\{X_t(ω), t ∈ T\}$为确定性函数

### 1.2 分类标准
| 指标集T | 状态空间S | 典型过程 |
|---------|-----------|----------|
| 离散    | 离散      | 随机徘徊 |
| 离散    | 连续      | -        |
| 连续    | 离散      | Poisson过程 |
| 连续    | 连续      | Brown运动 |

### 1.3 有限维分布族
- **定义**：
  - 一维：$F_{t_1}(x_1) = P(X_{t_1} ≤ x_1)$
  - 二维：$F_{t_1,t_2}(x_1,x_2) = P(X_{t_1} ≤ x_1, X_{t_2} ≤ x_2)$
  - n维：$F_{t_1,...,t_n}(x_1,...,x_n) = P(X_{t_1} ≤ x_1,..., X_{t_n} ≤ x_n)$

- **性质**：
	- 对称性：若 $\{i_1, \ldots, i_j\}$ 为 $\{1, \ldots, j\}$ 的一个排列，则  
		$$
		F_{t_1, \ldots, t_j}(x_{i_1}, \ldots, x_{i_j}) = F_{t_1, \ldots, t_j}(x_1, \ldots, x_j)
		$$
	- 相容性：对任意 $i < j$ ，有  
$$
F_{t_1, \ldots, t_i, t_{i+1}, \ldots, t_j}(x_1, \ldots, x_i, \infty, \ldots, \infty) = F_{t_1, \ldots, t_i}(x_1, \ldots, x_i)
$$

## 二、独立增量过程
### 2.1 定义
- **独立增量性**：不相交区间增量$X_{m_1} - X_{n_1}, ..., X_{m_s} - X_{n_s}$相互独立
- **时齐性**：增量分布仅与时间差相关，即$X_{m+n} - X_m \overset{d}{=} X_n - X_0$

### 2.2 性质
- 独立增量过程的任一有限维分布由初始分布和增量分布完全决定
- 时齐过程仅需一维增量分布即可确定
- 简单证明：
为方便起见，不妨考虑离散状态的随机过程，且设 $X_0 = x_0$，$t_1 < t_2 < \cdots < t_k$，过程的有限维分布为

$$
P(X_{t_1} = x_1, \ldots, X_{t_k} = x_k) = P(X_0 = x_0, X_{t_1} - X_0 = x_1 - x_0, \ldots, X_{t_k} - X_{t_{k-1}} = x_k - x_{k-1})
$$

$$
= P(X_0 = x_0) P(X_{t_1} - X_0 = x_1 - x_0) \cdots P(X_{t_k} - X_{t_{k-1}} = x_k - x_{k-1})
$$

若为时齐的独立增量过程，则

$$
P(X_{t_k} - X_{t_{k-1}} = x_k - x_{k-1}) = P(X_{t_k - t_{k-1}} - X_0 = x_k - x_{k-1})
$$

$$
= P(X_{t_k - t_{k-1}} = x_k - x_{k-1} + x_0)
$$




## 三、随机徘徊（Random Walk）
### 3.1 定义
- **构造**：$X_n = X_0 + \sum_{i=1}^n Z_i$，其中$Z_i \sim \begin{pmatrix}1 & -1\\p & q\end{pmatrix}$
- **对称随机徘徊**：当$p = q = 1/2$时

### 3.2 分布性质
  
- **定理：简单随机徘徊是时齐的独立增量过程，其一维分布为**

$$
P(X_n = k) =
\begin{cases}
C_{\frac{n+k-x}{2}} \cdot p^{\frac{n+k-x}{2}} \cdot (1-p)^{\frac{n-k+x}{2}}, & \text{(} n \geq |k-x|, \, n \text{与 } k-x \text{同奇偶)} \\
0, & \text{(其他情形)}
\end{cases}
$$

- **简单证明：只证一维分布的求法**

由于 $Z_n \sim \begin{pmatrix} -1 & 1 \\ q & p \end{pmatrix}$ ，将其化为标准 0-1 分布，令 $Y_n = \frac{Z_n + 1}{2}$ ，则 $Y_n \sim \begin{pmatrix} 0 & 1 \\ q & p \end{pmatrix}$ 。

从而 $X_n = X_0 + \sum_{i=1}^n (2Y_i - 1) = x + 2\sum_{i=1}^n Y_i - n$ ，由于 $\sum_{i=1}^n Y_i \sim B(n, p)$ ，故

$$
P(X_n = k) = P\left(x + 2\sum_{i=1}^n Y_i - n = k\right) = P\left(\sum_{i=1}^n Y_i = \frac{k - x + n}{2}\right),
$$

因此，

$$
P(X_n = k) =
\begin{cases}
C_{\frac{n+k-x}{2}} \cdot p^{\frac{n+k-x}{2}} \cdot (1-p)^{\frac{n-k+x}{2}}, & \text{(} n \geq |k-x|, \, n \text{与 } k-x \text{同奇偶)} \\
0, & \text{(其他情形)}
\end{cases}
$$

- **有限维分布（当 $X_0 = 0$ 时）为**

$$
P(X_{n_1} = s_1, X_{n_2} = s_2, \ldots, X_{n_k} = s_k) = P\left(\sum_{i=1}^{n_1} Z_i = s_1, \sum_{i=n_1+1}^{n_2} Z_i = s_2 - s_1, \ldots, \sum_{i=n_{k-1}+1}^{n_k} Z_i = s_k - s_{k-1}\right)
$$

$$
= \prod_{l=1}^k C_{m_l}^{r_l} p^{r_l} (1-p)^{m_l - r_l}, \quad \left(m_l = n_l - n_{l-1}, r_l = \frac{1}{2}(n_l - n_{l-1} + s_l - s_{l-1})\right)
$$

- **数字特征**：
  - 期望：$E [X_n]  = x_0 + n(p - q)$
  - 方差：$D [X_n]  = 4npq$
  - 协方差：$Cov(X_n, X_m) = 4pq \cdot \min(n,m)$

### 3.3 首达概率
- **边界问题**：定义$T_y = \min\{n ≥ 0 | X_n = y\}$
- **首达概率公式**：
  $$
  φ(x) = P(T_d < T_c | X_0 = x) = 
  \begin{cases}
    \frac{(q/p)^{x-c} - 1}{(q/p)^{d-c} - 1}, & p ≠ q \\
    \frac{x - c}{d - c}, & p = q
  \end{cases}
  $$

## 四、Poisson过程
### 4.1 定义三条件
1. **独立增量性**：不相交区间事件数独立
2. **时齐性**：事件发生统计规律与时间起点无关
3. **普通性**：
   - $P(N_{t+h} - N_t ≥ 2) = o(h)$
   - $P(N_{t+h} - N_t = 1) = λh + o(h)$

### 4.2 分布推导
- **微分方程**：
  $$
  \begin{cases}
    p'_0(t) = -λp_0(t) \\
    p'_k(t) = -λp_k(t) + λp_{k-1}(t) \quad (k ≥ 1)
  \end{cases}
  $$
  
- **解的形式**：
  $$
  p_k(t) = P(N_t = k) = \frac{(λt)^k}{k!}e^{-λt}
  $$

### 4.3 矩母函数法
- **定义**：$M(t,z) = E [e^{zN_t}]  = \sum_{k=0}^\infty p_k(t)e^{zk}$
- **方程求解**：
  $$
  \frac{∂M}{∂t} = λ(e^z - 1)M \implies M(t,z) = e^{λt(e^z - 1)}
  $$
  
- **分布验证**：展开后系数即为Poisson分布表达式

## 五、关键公式推导
### 5.1 随机徘徊方差
$$
D [X_n]  = D\left [\sum_{i=1}^n Z_i\right]  = \sum_{i=1}^n D [Z_i]  = n(4pq)
$$

### 5.2 Poisson过程矩母函数
$$
M(t,z) = e^{λt(e^z - 1)} \implies \frac{∂^k}{∂z^k}M(t,0) = (λt)^k \implies p_k(t) = \frac{(λt)^k}{k!}e^{-λt}
$$


# 第 9 周讲稿—Poisson 分布与 Poisson 过程

## 六、Poisson 分布

### 1. 定义与背景
- **定义**：随机变量 $X$ 服从参数为 $\lambda>0$ 的 Poisson 分布，记为 $X \sim P(\lambda)$ ，其概率质量函数为：
  $$
  P(X=k) = \frac{e^{-\lambda}\lambda^k}{k!}, \quad k=0,1,2,\ldots
  $$
- **与 Poisson 过程的联系**：可视为 Poisson 过程在时间区间 $[0,1]$ 内的事件计数分布。

### 2. 基本性质
- **Poisson 定理**（二项分布近似）：
  $$
  \lim_{n\to\infty} C_n^k p_n^k (1-p_n)^{n-k} = \frac{e^{-\lambda}\lambda^k}{k!}, \quad \text{其中} \ \lambda = \lim_{n\to\infty} np_n
  $$
- **期望与方差**：
  $$
  E[X] = \lambda, \quad D[X] = \lambda
  $$
- **可加性**：独立 Poisson 变量之和仍为 Poisson 分布，参数为各参数之和。
- **随机选择不变性**：从 $X \sim P(\lambda)$ 中以概率 $p$ 独立筛选，得到 $Y \sim P(p\lambda)$ 。

---

## 七、Poisson 过程

### 1. 定义
- **强度为 $\lambda$ 的 Poisson 过程** $\{N_t, t\geq 0\}$ 满足：
  1. $N_0 = 0$ ；
  2. **独立增量性**：不重叠时间区间内的增量相互独立；
  3. **增量分布**：对任意 $s,t>0$ ， $N_{t+s} - N_s \sim P(\lambda t)$ 。

### 2. 核心性质
- **有限维分布**：
  
$$
P (N_{t_1}=k_1, \ldots, N_{t_n}=k_n) = e^{-\lambda t_n} \frac{(\lambda t_1)^{k_1} \cdots (\lambda (t_n-t_{n-1}))^{k_n-k_{n-1}}}{k_1! \cdots (k_n-k_{n-1})!}
$$

- **协方差与方差**：
  $$
  E[N_t] = \lambda t, \quad D[N_t] = \lambda t, \quad \text{Cov}(N_s, N_t) = \lambda \min(s,t)
  $$
- **可加性**：独立 Poisson 过程之和仍为 Poisson 过程，强度相加。
- **与二项分布的联系**：
  $$
  P(Y_t = k | X_t + Y_t = n) = C_n^k \left(\frac{\lambda_1}{\lambda_1+\lambda_2}\right)^k \left(\frac{\lambda_2}{\lambda_1+\lambda_2}\right)^{n-k}
  $$

### 3. 应用：复合 Poisson 过程
- **定义**： $X_t = \sum_{i=1}^{N_t} Y_i$ ，其中 $Y_i$ 独立同分布且与 $N_t$ 独立。
- **性质**：
  $$
  E[X_t] = \lambda t E[Y], \quad D[X_t] = \lambda t E[Y^2]
  $$
## 八、矩母函数补充

### 1. 定义与性质
- **矩母函数**：
  $$
  m_X (u) = E[e^{uX}]
  $$
- **性质**：
  1. $m_X^{(n)}(0) = E[X^n]$；
  2. 独立变量和的矩母函数为各矩母函数之积；
  3. 唯一决定分布。

### 2. Poisson分布的矩母函数
- **推导**：
  $$
  m_X (u) = E[e^{uX}] = \sum_{k=0}^\infty e^{uk} \frac{e^{-\lambda}\lambda^k}{k!} = e^{\lambda (e^u - 1)}
  $$
- **应用**：直接验证 $E[X] = \lambda$，$D[X] = \lambda$。

### 3. 复合Poisson过程的矩母函数
- **推导**：
  $$
  m_{X_t}(u) = e^{\lambda t (m_Y (u) - 1)}
  $$
- **推导期望与方差**：
  $$
  E[X_t] = \lambda t E[Y], \quad D[X_t] = \lambda t E[Y^2]
  $$

---

## 九、关键示例

### 示例 1：顾客购买行为建模
- **场景**：顾客到达商场人数为 Poisson 过程 $N_t \sim P(\lambda t)$ ，每个顾客购买概率为 $p$ 。
- **结论**：
  - 男性顾客数 $N_t^{(1)} \sim P(p\lambda t)$ ；
  - 女性顾客数 $N_t^{(2)} \sim P((1-p)\lambda t)$ ；
  - $N_t^{(1)}$ 与 $N_t^{(2)}$ 相互独立。

### 示例 2：复合 Poisson 过程的期望计算
- **场景**： $X_t = \sum_{i=1}^{N_t} Y_i$ ， $Y_i \sim \text{Exp}(\mu)$ 。
- **结果**：
  $$
  E[X_t] = \frac{\lambda t}{\mu}, \quad D[X_t] = \frac{2\lambda t}{\mu^2}
  $$
