---
title: week5-多维随机变量
tags:
  - 概率论
categories: 
date: 2025-03-17T13:37:58+08:00
modify: 2025-03-17T13:37:58+08:00
dir: 
share: false
cdate: 2025-03-17
mdate: 2025-03-17
---
# week5-多维随机变量

## 1. 二维随机变量的联合分布与边缘分布
### 1.1 联合分布函数
- **定义**：对任意实数 $x, y$，联合分布函数定义为：
  $$
  F(x, y) = P(X \leq x, Y \leq y)
  $$
- **性质**：
  - 非减性：$F(x, y)$ 对 $x$ 或 $y$ 单调不减。
  - 有界性：$0 \leq F(x, y) \leq 1$，且 $F(+\infty, +\infty) = 1$，$F(-\infty, y) = F(x, -\infty) = 0$。
  - 右连续性：$F(x, y)$ 对 $x$ 或 $y$ 右连续。
  - 非负性：对 $x_1 \leq x_2, y_1 \leq y_2$，
    $$
    F(x_2, y_2) - F(x_1, y_2) - F(x_2, y_1) + F(x_1, y_1) \geq 0
    $$

### 1.2 边缘分布函数
- **定义**：
  - $X$ 的边缘分布函数：$F_X(x) = F(x, +\infty)$
  - $Y$ 的边缘分布函数：$F_Y(y) = F(+\infty, y)$


## 2. 独立性判断
### 2.1 独立性条件
- **充要条件**：
  $$
  X \perp Y \iff F(x, y) = F_X(x)F_Y(y), \quad \forall x, y
  $$
  对于离散型变量，等价于：
  $$
  p_{ij} = p_{i\cdot} \cdot p_{\cdot j}, \quad \forall i, j
  $$



## 3. 二维离散型随机变量
### 3.1 联合分布律与边缘分布律
- **联合分布律**：$p_{ij} = P(X = x_i, Y = y_j)$
- **边缘分布律**：
  - $X$ 的边缘分布：$p_{i\cdot} = \sum_j p_{ij}$
  - $Y$ 的边缘分布：$p_{\cdot j} = \sum_i p_{ij}$

### 3.2 条件分布律
- **定义**：在 $Y = y_j$ 条件下，$X$ 的条件分布为：
  $$
  P(X = x_i | Y = y_j) = \frac{p_{ij}}{p_{\cdot j}}, \quad p_{\cdot j} > 0
  $$
- **例 1（骰子问题）**：掷两颗均匀骰子，记第一颗骰子出现的点数为 X，而两颗骰子中点数的最大值为 Y，求 (X, Y) 的联合分布律.

| Y\X      | 1    | 2    | 3    | 4    | 5    | 6     | $p_{i\cdot}$ |
| -------- | ---- | ---- | ---- | ---- | ---- | ----- | ------------ |
| 1        | 1/36 | 1/36 | 1/36 | 1/36 | 1/36 | 1/36  | 1/6          |
| 2        | 0    | 2/36 | 1/36 | 1/36 | 1/36 | 1/36  | 1/6          |
| 3        | 0    | 0    | 3/36 | 1/36 | 1/36 | 1/36  | 1/6          |
| 4        | 0    | 0    | 0    | 4/36 | 1/36 | 1/36  | 1/6          |
| 5        | 0    | 0    | 0    | 0    | 5/36 | 1/36  | 1/6          |
| 6        | 0    | 0    | 0    | 0    | 0    | 6/36  | 1/6          |
| $p_{.j}$ | 1/36 | 3/36 | 5/36 | 7/36 | 9/36 | 11/36 | 1            |

- **结论**： $X$ 与 $Y$ 不独立（边缘分布与联合分布乘积不匹配）。

- 例 2（分层抽样): 在{1,2,3,4}中任取一数，记为 X，再从{1,2, L, X}中任取一数，记为 Y，求 (X, Y) 的联
合分布律以及关于 Y 的边缘分布。

| Y\X           | 1     | 2     | 3    | 4    | $p_{i\cdot}$ |
| ------------- | ----- | ----- | ---- | ---- | ------------ |
| 1             | 1/4   | 0     | 0    | 0    | 1/4          |
| 2             | 1/8   | 1/8   | 0    | 0    | 1/4          |
| 3             | 1/12  | 1/12  | 1/12 | 0    | 1/4          |
| 4             | 1/16  | 1/16  | 1/16 | 1/16 | 1/4          |
| $p_{\cdot j}$ | 25/48 | 13/48 | 5/36 | 7/36 | 1            |

二维离散随机变量的 **LOTUS定理** 是单变量情况的自然推广，它允许我们直接通过 **联合概率分布** 计算二元函数 \( g(X,Y) \) 的期望，而无需先求出 \( g(X,Y) \) 的分布。具体形式如下：

  

$$  

E[g(X,Y)] = \sum_{i} \sum_{j} g(x_i, y_j) \cdot P(X = x_i, Y = y_j)

$$

#### **关键点解析**

1. **核心思想**  

   直接利用原始变量    $(X,Y)$ 的 **联合概率质量函数** $P(X = x_i, Y = y_j)$，而不是先推导 $g(X,Y)$ 的分布。例如：

   - 若 $X$ 和 $Y$ 是两个独立骰子的点数，计算  $E[X + Y]$ 时，无需分析 $X + Y$ 的可能值，直接用 $\sum_{x=1}^6 \sum_{y=1}^6 (x + y) \cdot \frac{1}{36}$。

  

2. **适用条件**  

   - 要求 **绝对收敛性**：$\sum_i \sum_j |g(x_i, y_j)| \cdot P(X = x_i, Y = y_j) < \infty$，否则期望可能不存在。

   - 适用于任何二元函数 $g(X,Y)$，例如 $X^2Y$、$\sin(X+Y)$ 等。

  

3. **与单变量LOTUS的关系**  

   - 单变量LOTUS是二维情况的特例（例如当 $Y$ 退化为常数时）。

   - 多维情况可推广到更高维度（如三维函数 $g(X,Y,Z)$）。

  

#### **示例：独立骰子的期望**

设 $X$ 和 $Y$ 为独立均匀分布的骰子点数（$P(X = x) = P(Y = y) = \frac{1}{6}$），求 $E[X^2 Y]$。

  

**解法：**

$$

E[X^2 Y] = \sum_{x=1}^6 \sum_{y=1}^6 x^2 y \cdot \frac{1}{36} = \frac{1}{36} \left( \sum_{x=1}^6 x^2 \right) \left( \sum_{y=1}^6 y \right) = \frac{1}{36} \cdot 91 \cdot 21 = 53.5

$$

（利用了独立性将双重求和分解为乘积）

	  

## 4. 随机变量函数的分布
### 4.1 分布律计算
- **一维函数**：若 $Y = g(X)$，则：
  $$
  P(Y = y_k) = \sum_{x_i: g(x_i) = y_k} P(X = x_i)
  $$
- **二维函数**：若 $Z = g(X, Y)$，则：
  $$
  P(Z = z_k) = \sum_{(x_i, y_j): g(x_i, y_j) = z_k} P(X = x_i, Y = y_j)
  $$


---

## 5. 数学期望性质

- **线性性**：
  $$
  E\left(\sum_{i=1}^n a_i X_i + c\right) = \sum_{i=1}^n a_i E(X_i) + c
  $$
- 如果 $a\le X \le b \ a.s.\Rightarrow a\le EX\le b$
- **独立变量乘积**：
  $$
  E(XY) = E(X)E(Y), \quad \text{若 } X 与Y独立
  $$
- Markov 不等式
$$
P(X\ge c)\le \frac{EX}{c}
$$
- Chebyshev 不等式 : $E(X^2)<\infty, then \forall \epsilon>0,DX=E(X-EX)^2$
$$
P\left( |X - EX| \geq \epsilon \right) \leq \frac{DX}{\epsilon^2}
$$
- 均方误差：
$$ \min_C \{E((X - C)^2)\} = E((X - EX)^2) $$
- 绝对误差：
$$ \min_C \{E ((X - C))\} = E ((X - X_{median})) $$
- **Cauchy-Schwarz不等式**：
  $$
   [E (XY)] ^2 \leq E(X^2)E(Y^2)
  $$
- Holder 不等式： $E|X|^p<\infty ,\ E|Y|^q<\infty ,\ \frac{1}p{+\frac{1}q{=1 ,\ p>1}}$
  $$
   [E (XY)]  \leq (E(X^p))^{\frac{1}{p}}(E(Y^q))^{\frac{1}{q}}
  $$
- 高阶矩存在，则低阶矩一定存在

---

## 6. 方差及其性质

### 定义
- **方差**： $D(X) = E[(X - EX)^2]$ ，若 $E(X^2) < \infty$ 。
- **计算公式**： $D(X) = E(X^2) - (EX)^2$ 。

### 性质
1. **常数方差为零**： $D(C) = 0$ ，且 $D(X) = 0 \Leftrightarrow P(X = EX) = 1$ 。
2. **线性组合方差**：若 $X_1, X_2, \dots, X_n$ 相互独立，则  
   $$D\left(\sum_{i=1}^n a_i X_i\right) = \sum_{i=1}^n a_i^2 D(X_i)$$

### 分布示例
- **二项分布** $X \sim B(n, p)$ ：  
  $EX = np$ ， $DX = npq$ （ $q = 1-p$ ）。
- **几何分布** $X \sim Ge(p)$ ：  
  $EX = \frac{1}{p}$ ， $DX = \frac{q}{p^2}$ 。
一个方差计算的例子：
![2cee7f93ce6acf8b632cd55b32cbc8f.jpg](https://raw.githubusercontent.com/Tendourisu/images/master/20250320104225565.png)

---

## 7. 协方差与相关系数

### 定义
- **协方差**： $\text{Cov}(X, Y) = E[(X - EX)(Y - EY)]=EXY-EXEY$ 
- **相关系数**： $r_{X,Y} = \frac{\text{Cov}(X, Y)}{\sqrt{DX \cdot DY}}$ 。
- 称之为 X 与Y 的相关系系数，称 X 与Y的不相关，若 $r_{X,Y}=0$

### 性质
1. **对称性与双线性**：
   - $\text{Cov}(X, Y) = \text{Cov}(Y, X)$ 。
   - $\text{Cov}(aX, bY) = ab \cdot \text{Cov}(X, Y)$ 。
   - $Cov\left( \sum^m_{i=1}a_{i}X_{i},\ \sum^n_{j=1}b_{j}Y_{j} \right)=\sum^m_{i=1}\sum^n_{j=1}a_{i}b_{j}Cov(X_{i},\ Y_{j})$
   - $\text{Cov}(X_1 + X_2, Y) = \text{Cov}(X_1, Y) + \text{Cov}(X_2, Y)$ 。
2. **相关系数范围**： $|r_{X,Y}| \leq 1$ ，且  
   $r_{X,Y} = \pm 1 \Leftrightarrow X与 Y线性相关\Leftrightarrow P(Y=a^*X+b^*)=1$
3. $r_{aX+b,cY+d}=\frac{ac}{|ac|}r_{X,Y}$
4. $X^*=\frac{X-EX}{\sqrt{ DX }}\rightarrow EX^*=0,DX^*=1$ 则 $r_{X^*,Y^*}=r_{X,Y}$
5. **协方差矩阵**：对随机向量 $(X_1, \dots, X_n)$ ，协方差矩阵 $\Sigma = (\text{Cov}(X_i, X_j))_{n \times n}$ 。
6. 不相关与独立等价的情况：
$$
X=1_{A}, Y=1_{B}, XY=1_{AB}
$$
7. 协相关矩阵一般是正定的
### 最佳线性预测
- **目标**：寻找 $a, b$ 使 $E[(X - aY - b)^2]$ 最小。
- **解**：
  $$a = \frac{\text{Cov}(X, Y)}{DY}, \quad b = EX - a \cdot EY$$
- **预测误差**：
	- $\min{E(Y-C)^2}=E(Y-EY^2)=DY$
	- $\min E[(X - aY - b)^2] = DX \cdot (1 - r_{X,Y}^2)$ 。
	- $\min{E(Y-g(X))^2}=E(Y-E(Y|X))^2$

---

## 8. 条件数学期望

### 定义
- **离散情形**：若 $(X, Y)$ 离散，条件期望  
  $$E(X | Y = y) = \sum_i x_i P(X = x_i | Y = y)$$
- **随机变量形式**： $E(X | Y)$ 是 $Y$ 的函数，记为 $g(Y)$ 。




> [!Thm]+ 最佳预测
> 设 $X$ 与 $Y$ 的平方的数学期望均存在，则
> $$
> \boxed{E [X - E (X|Y)] ^2 = \min_{\phi} E [X - \phi (Y)] ^2}
> $$

证明：先证明

$$
E\{(X - \phi(Y))^2\} = E\{(X - E(X|Y))^2\} + E\{(E(X|Y) - \phi(Y))^2\}
$$
我们先考虑
$E\{(X - \phi(Y))^2 | Y\} = E\{(X - E(X|Y) + E(X|Y) - \phi(Y))^2 | Y\}$
$= E\{(X - E(X|Y))^2 + 2(X - E(X|Y))(E(X|Y) - \phi(Y)) + (E(X|Y) - \phi(Y))^2 | Y\}$$= E\{(X - E(X|Y))^2 | Y\} + E\{(E(X|Y) - \phi(Y))^2 | Y\} + 2E\{(X - E(X|Y))(E(X|Y) - \phi(Y)) | Y\}$
由于
$E\{(X - E(X|Y))(E(X|Y) - \phi(Y)) | Y\}$
$=  [E (X|Y) - \phi (Y)] E\{(X - E(X|Y)) | Y\}$
$=  [E (X|Y) - \phi (Y)] \{E(X|Y) - E(X|Y)\}$
$= 0$
于是
$E\{(X - \phi(Y))^2 | Y\} = E\{(X - E(X|Y))^2 | Y\} + E\{(E(X|Y) - \phi(Y))^2 | Y\}$
两边取数学期望，由全期望公式得到，
$E\{(X - \phi(Y))^2\} = E\{(X - E(X|Y))^2\} + E\{(E(X|Y) - \phi(Y))^2\}$
从而可知道，当 $E\{(E(X|Y) - \phi(Y))^2\} = 0, i.e., \phi(Y) = E(X|Y)$ 时，取到最小。
- 推论 1: $\boxed{E\{(X - \phi(Y))^2\} \geq E\{(X - E(X|Y))^2\}}$
- 推论 2: $\boxed{DX = E\{(X - E(X|Y))^2\} + D(E(X|Y))}$
- 推论 3: $\boxed{DX \geq D(E(X|Y))}$，且等号成立当且仅当 $X = E(X|Y)$（即 $X$ 是 $Y$ 的一个函数）。
- 定理 3 
	- （1）若 $a \leq X \leq b, a, b$ 为常数，则 $E(X|Y)$ 存在，且 $a \leq E(X|Y) \leq b$。
	- （2）若 $E(X_1|Y)$ 与 $E(X_2|Y)$ 存在，$a, b$ 为常数，则 $E(aX_1 + bX_2|Y)$ 也存在，且$E(aX_1 + bX_2|Y) = aE(X_1|Y) + bE(X_2|Y)$
- 定理 4 设离散型随机变量 $X$ 与 $Y$ 相互独立，则 $E(X|Y) = EX$ 。
- 定理 5 设 $(X,Y)$ 为二维离散型随机变量，且 $g(\cdot), h(\cdot)$ 为任意两个实值函数，$\boxed{E(g(X)h(Y)|Y) = h(Y)E(g(X)|Y)}$
- 定理 6 $E(X|A)=E(X|AB)P(B|A)+E(X|AB^C)P(B^C|A)$
![8149972714164504547b90028923d20.jpg](https://raw.githubusercontent.com/Tendourisu/images/master/20250324135644048.png)
