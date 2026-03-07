---
title: 
tags:
  - 概率论
date: " 2025-03-10T13:32:37+08:00 "
modify: " 2025-03-10T13:32:37+08:00 "
share: false
cdate: " 2025-03-10 "
mdate: " 2025-03-10 "
math: "true"
---
## 期望（均值）
### 均值定义
- Lotus定理
$$
Def  \ X\sim{p_i}\ \  E(X)=\sum_{i}x_{i}p_{i}(必须绝对收敛)
$$
>[!hint]+
>- **绝对收敛**：若级数 $\sum a_n$ 的各项绝对值组成的级数 $\sum |a_n|$ **收敛**，则原级数$\sum a_n$称为**绝对收敛**。
>- **条件收敛**：若级数 $\sum a_n$**本身收敛**，但绝对值级数 $\sum |a_n|$∑∣**发散**，则原级数称为**条件收敛**。
### 方差定义
- 方差
$$
D（X）=E[X-EX]^2
$$
- 样本方差
$$
S^2=\frac{1}{n-1}\sum^n_{i=1}(X-\overline{X})^2
$$
### 中位数定义
- p分位数$x_p$
$$
P(X\le x_{p})\ge p, P(X\ge x_{p})\ge 1-p, 0\lt q \lt 1
$$
- 中位数$p=\frac{1}{2}$
- 性质：x为随机变量 X 的中位数 $\leftrightarrow \frac{1}{2}\le F(x)\le \frac{1}{2}+P(X=x)$
### 众数定义
- 概率密度最大的$x_{p}$

### 引理
$$
X \sim {p_{i}} \ \overline{y}=h(\overline{x} )\in {h(x_{1}, \dots,x_{n})}\rightarrow P(\overline{y}=y_{i})=\sum_{i:h(x_{i}=y_{i})}p_{i}
$$

### 中心距
- $E(X^k)$: k阶（原点）距
- $E(X-EX)^k$:k阶中心距
- $E^*=\frac{X-EX}{\sqrt{DX }}$ 标准化
- $E((X^*)^3)$:偏度skewness
	在统计学中，**正偏（Positive Skewness）** 的定义如下：
	
	### **正偏（右偏）的定义**
	当数据分布**右侧（较大值方向）的尾部比左侧更长**，且主要数据集中在左侧时，这种不对称性称为**正偏态（右偏态）**。其特点是：
	1. **均值（Mean） > 中位数（Median） > 众数（Mode）**  
	   - 右侧的极端值（大值）会显著拉高均值，而中位数和众数相对不受影响。
	1. **偏度系数（Skewness）> 0**  
	   - 通过计算偏度系数（如 Pearson 偏度系数或矩偏度系数），若结果为正，则表明分布右偏。
	
	### **直观理解**
	- **图形特征**：正偏分布的“峰值”位于左侧，右侧有一条长尾。  
	  - 例如：大多数人的收入集中在较低水平，但少数极高收入者使右侧出现长尾（下图示意）。  
	  ![正偏态分布示意图](https://upload.wikimedia.org/wikipedia/commons/thumb/f/f8/Negative_and_positive_skew_diagrams_%28English%29.svg/320px-Negative_and_positive_skew_diagrams_%28English%29.svg.png)
	
	- **实际场景**：  
	  - 自然现象：洪水发生频率（大多数年份正常，少数年份极严重）。  
	  - 社会经济：个人收入、房价（多数集中在低值，少数极高值）。  
	  - 生物学：某些物种的寿命分布（多数个体寿命较短，少数存活极久）。
	
	### **注意事项**
	- **名称与方向的关系**：  
	  - **正偏 = 右偏**：名称中的“正”指偏度系数为正，“右”指长尾在右侧。
	- **数据处理的启示**：  
	  - 正偏数据可能不服从正态分布，需通过取对数、Box-Cox变换等方法处理后再建模。

- $E((X^*)^4$ :峰度kurtosis
- 矩母函数MGF:
$$
M_{X}(u)=E[e^uX]=\begin{cases}
\sum_{i} e^{ux_{i}}p_{i}\\
 \int_{-\infty}^{\infty}e^{ux}f_{X}(x) dx 
\end{cases}
$$
![image.png](https://raw.githubusercontent.com/Tendourisu/images/master/20250313092136649.png)

若$M_{X}(u)$在u=0的某个开邻域内存在，则
$$
E(X^k)=M_{X}^{(k)}(0)
$$
矩母函数（若存在）与分布函数相互唯一确定
有关矩母函数的详细讲解与证明可参考：[如何通俗的理解矩母函数](https://zhuanlan.zhihu.com/p/148408669)
### 常见分布
1. $X\sim B(n,p)\leftrightarrow P(X=k)=C^k_{n}p^kq^{n-k}$  
	1. $M_{X}(u)=pe^u+q$    $M_{X^n}(u)=(pe^u+q)^n$
	2. $EX=np$
	3. $DX=Var(X)=npq$  $DX=E(X-EX)^2=E{X^2-2XE(X)+(E(X))^2}=E(X^2)-(E(X))^2$
	4. 二项分布B(n, p)的最大可能值k *存在，且
$$k^* = 
\begin{cases} 
(n+1)p \text{ 或 } (n+1)p-1, & \text{当}(n+1)p\text{为整数时}, \\
\lfloor (n+1)p \rfloor, & \text{当}(n+1)p\text{为非整数时}.
\end{cases}$$
2. $X\sim Ge(P)\leftrightarrow PX=k)=q^{k-1}p\leftrightarrow P(X>k)=\sum^{\infty}_{i=k+1}q^{i-1}p=q^k$, 则
	1. $M_{X}=\sum_{k=1}^{\infty}e^{uk}q^{k-1}p=\frac{p}{q}\sum^{\infty}_{k=1}[qe^u]^k=\frac{p}{q} \frac{qe^u}{1-qe^u}=\frac{pe^u}{1-qe^u}$    
	2. $EX=\frac{1}{p}$
	3. $DX=\frac{q}{p^2}$
	4. X是正整数，则下列三条等价
		1. $X\sim Ge(p)$
		2. X是具有“无记忆性的”，i.e.$P(X>m+n|X>m)=P(X>n)$
		3. $P(X=m+n|X>m)=P(X>n)=P(X=n)$
3. $X\sim NB(r,p)\leftrightarrow P(X=k)=C^{r-1}_{k-1}p^rq^{n-r}, k=r,r+1,\dots,$
	1. $M_{X}(u)=\left[ \frac{pe^u}{1-qe^u} \right]^r$
	2. $EX=\frac{r}{q}$
	3. $DX=\frac{rq}{p^2}$
4. $X\sim HGe(n,a,b)\leftrightarrow P(X=k)=\frac{C^k_{a}C^{n-k}_{k}}{C^n_{a+b}}$
	4. $EX=n \frac{a}{a+b}$ 

>[!Thm]+
>若$\lim_{ a+b \to \infty } \frac{a}{a+b}=p\in (0,1)$
>则$P(X=k)=\frac{C^k_{a}C^{n-k}_{k}}{C^n_{a+b}}\rightarrow_{a+b\rightarrow \infty}C^k_{n}p^kq^{n-k}$


超几何分布的概率质量函数为：

$$

P(X=k) = \frac{\binom{a}{k} \binom{b}{n-k}}{\binom{a+b}{n}}

$$

  

将组合数展开为阶乘形式：

$$

P(X=k) = \frac{\frac{a!}{k!(a-k)!} \cdot \frac{b!}{(n-k)!(b-n+k)!}}{\frac{(a+b)!}{n!(a+b-n)!}}

$$

  

整理分子和分母：

$$

P(X=k) = \frac{a! \cdot b! \cdot n! \cdot (a+b-n)!}{k! \cdot (a-k)! \cdot (n-k)! \cdot (b-n+k)! \cdot (a+b)!}

$$

  

**近似处理：**

当$a$和$b$极大时，利用以下近似：

$$

\frac{a!}{(a-k)!} \approx a^k, \quad \frac{b!}{(b-(n-k))!} \approx b^{n-k}, \quad \frac{(a+b)!}{(a+b-n)!} \approx (a+b)^n

$$

  

代入后得：

$$

P(X=k) \approx \frac{a^k \cdot b^{n-k} \cdot n!}{k! \cdot (n-k)! \cdot (a+b)^n} = \binom{n}{k} \cdot \left(\frac{a}{a+b}\right)^k \cdot \left(\frac{b}{a+b}\right)^{n-k}

$$

  

**取极限：**

由条件$\lim_{a+b \to \infty} \frac{a}{a+b} = p$，则$\frac{b}{a+b} \to 1-p = q$。因此：

$$

\lim_{a+b \to \infty} P(X=k) = \binom{n}{k} p^k q^{n-k}

$$

1. Riemann Zeta函数:$X\sim Zipf(\alpha)\leftrightarrow P(X=k)=\frac{1}{\zeta(\alpha)k^{\alpha}},where \ \xi(\alpha)=\sum^\infty_{n=1} \frac{1}{n^{\alpha}}$
- 证明：$\pi_{p\in P}\left(  \frac{1}{1-p^{-\alpha}} \right)=\sum^{\infty}_{n=1} \frac{1}{n^\alpha}$

## 随机向量（$X， Y$）
### （联合joint）分布函数F（x,y）具有如下性质
- F(x, y)是 x 或y 的不减函数。
- 0 ≤ F(x, y) ≤1，且F(x,−∞) = F(−∞, y) = F(−∞,−∞) = 0,F(+∞,+∞) =1。
- F(x, y)关于 x 或 y 是右连续的。
- 对于任意的$x_{1}\le x_{2},y_{1}\le y_{2}, F(x_{2}, y_{2})-F(x_{2}, y_{1})-F(x_{1}, y_{2})+F(x_{1}, y_{1})\ge 0$
注：二元实函数F(x, y)为某一随机向量的分布函数当且仅当上述四个性质成立。
- X的边缘分布函数为：$F _{X}(x) = F(x,+∞)$；
- Y的边缘分布函数为：$F _{Y}(y) = F(+∞,y)$；

$$
\begin{align}
X \text{ 与 } Y \text{ 相互独立} &\Leftrightarrow P(X \in A, Y \in B) = P(X \in \\ A)P(Y \in B), \forall A, B \subset \mathbb{R}
&\Leftrightarrow F(x, y) = F_X(x)F_Y(y) \quad \forall x, y \\
&\Leftrightarrow p_{ij} = p_{i\cdot} \cdot p_{\cdot j} \quad \forall i, j \text{ （离散型）} \\
\end{align}
$$
>[!Def]+
>称$X_1,...,X_n\ i.d.$
>若$F(x_{1},\dots,x_{n})=F_{X_{1}}(x_{1})\dots F_{X_{n}}(x_{n})\ \forall x_{1}, \dots,x_{n}\in \mathbb{R}$

