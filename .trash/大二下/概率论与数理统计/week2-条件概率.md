---
title: week2-条件概率
tags:
  - 概率论
date: " 2025-03-08T19:29:25+08:00 "
modify: " 2025-03-08T19:29:25+08:00 "
share: false
cdate: " 2025-03-08 "
mdate: " 2025-03-08 "
math: "true"
---
# week2-条件概率

## 1. 概率的连续性定理
### 1.1 核心结论
设$P$为定义在事件域$\mathcal{F}$上的非负集合函数，满足$P(\Omega)=1$且具有有限可加性，则以下条件等价：
1. **可数可加性**（概率测度）
2. **上连续性**：若$A_n \downarrow A$，则$\lim_{n\to\infty} P(A_n) = P(A)$
3. **下连续性**：若$A_n \uparrow A$，则$\lim_{n\to\infty} P(A_n) = P(A)$
4. **空集连续性**：若$A_{n+1} \subset A_n$且$\bigcap_{n=1}^\infty A_n = \emptyset$，则$\lim_{n\to\infty} P(A_n) = 0$
5. **极限保概率性**：若$\lim_{n\to\infty} A_n$存在，则$P(\lim A_n) = \lim P(A_n)$

### 1.2 关键证明思路
- **$(5)\Rightarrow(3)$**：通过构造单调事件序列$B_n = \bigcap_{k=n}^\infty A_k$，利用下连续性证明极限与概率可交换
- **$(3)\Rightarrow(5)$**：通过$\lim A_n = \bigcup_{n=1}^\infty \bigcap_{k=n}^\infty A_k$，结合上下连续性推导

---

## 2. 条件概率与贝叶斯理论
### 2.1 条件概率定义
$$
P(A|B) = \frac{P(A \cap B)}{P(B)} \quad (P(B) > 0)
$$
**性质**：条件概率满足概率公理体系的所有性质

### 2.2 乘法公式
若$P(\bigcap_{j=1}^{n-1} A_j) > 0$，则：
$$
P\left(\bigcap_{j=1}^n A_j\right) = P(A_1)P(A_2|A_1)P(A_3|A_1A_2)\cdots P(A_n|\bigcap_{j=1}^{n-1} A_j)
$$

### 2.3 全概率公式
设$\{B_i\}$是样本空间的正划分：
$$
P(A) = \sum_{i=1}^\infty P(B_i)P(A|B_i)
$$

### 2.4 贝叶斯公式
$$
P(B_i|A) = \frac{P(B_i)P(A|B_i)}{\sum_{j=1}^\infty P(B_j)P(A|B_j)}
$$

### 2.5 典型应用
- **例1**（古典概型）：从1~100中取数，已知$\leq50$时求2或3的倍数概率  
  $P = \frac{33}{50} \quad (\text{2的倍数25个，3的倍数16个，6的倍数8个})$
  
- **例3**（排列概率）：卡片排列为MAXAM的概率  
  $P = \frac{2}{5} \cdot \frac{2}{4} \cdot \frac{1}{3} \cdot \frac{1}{2} \cdot \frac{1}{1} = \frac{1}{30}$

---

## 3. 事件独立性
### 3.1 定义扩展
- **两事件独立**：$P(AB) = P(A)P(B)$
- **多事件独立**：对任意$k\geq2$和$i_1<...<i_k$，有：
  $$
  P\left(\bigcap_{j=1}^k A_{i_j}\right) = \prod_{j=1}^k P(A_{i_j})
  $$
- **条件独立**：$P(AB|C) = P(A|C)P(B|C)$

### 3.2 重要性质
| 关系类型 | 互斥性 | 独立性 |
|---------|--------|--------|
| 定义    | $AB=\emptyset$ | $P(AB)=P(A)P(B)$ |
| 共存性  | 不可共存       | 可共存         |
| 概率关系| $P(A|B)=0$    | $P(A|B)=P(A)$  |

### 3.3 极端事件
- **概率为0或1的事件**：与任意事件独立
- **非极端事件**：独立与互斥互斥

---

## 4. 可靠性函数推导
**问题**：已知风险率函数$\lambda(t) = \lim_{\Delta t\to0} \frac{h(t,t+\Delta t)}{\Delta t}$，求可靠性函数$g(t)$

**推导过程**：
1. 由定义得微分方程：
   $$
   g(t+\Delta t) = g(t)(1-\lambda(t)\Delta t) + o(\Delta t)
   $$
2. 取极限得：
   $$
   g'(t) = -\lambda(t)g(t)
   $$
3. 解得：
   $$
   g(t) = \exp\left(-\int_0^t \lambda(s)ds\right)
   $$

---

## 5. 典型问题分析
### 5.1 赌徒输光问题
**模型**：
- 甲有$i$元，乙有$a-i$元
- 每次甲赢概率$p$，输概率$q=1-p$

**解法**：
- 设$P_i$为甲输光概率，建立递推式：
  $$
  P_i = pP_{i+1} + qP_{i-1}
  $$
- 边界条件$P_0=1, P_a=0$
- 解得：
  $$
  P_i = \begin{cases}
  \frac{(q/p)^i - (q/p)^a}{1 - (q/p)^a}, & p \neq q \\
  1 - \frac{i}{a}, & p = q
  \end{cases}
  $$

### 5.2 传球问题
**模型**：
- $r$人传球，初始由甲传出
- 每次等概率传给其他$r-1$人

**递推关系**：
- 设$p_n$为第$n$次由甲传出的概率
- 递推式：
  $$
  p_n = \frac{1}{r-1}(1 - p_{n-1})
  $$
- 解得：
  $$
  p_n = \frac{1}{r} \left[1 - \left(-\frac{1}{r-1}\right)^{n-1}\right]
$$