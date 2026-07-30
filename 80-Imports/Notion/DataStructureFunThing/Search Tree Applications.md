## 穿刺查询/Stabbing Query

- 沿着x轴给定一组区间：

$S=\{s_i=[x_i,x_i^,]|1\le i \le n\}$

- 对于任何点$q_x$﻿,找出所有包含它的区间：

$S(q_x)=\{s_i=[x_i,x_i']|1\le i \le n, x_i \le q_x \le x_i'\}$

- 将区间集预处理成一棵区间树（Interval Tree）  
    可以得到一个在线查询算法  
    
- 令所有区间的端点构成集合$\delta P$﻿,取其中的中位数$x_{mid}=median(P)$﻿
- 所有区间于是分为三类:

$S_{left}=\{S_i|x_i'<x_{mid}\}$

$S_{mid}=\{S_i|x_i \leq x_{mid} \leq x_i'\}$

$S_{right}=\{S_i|x_{mid} < x_i\}$

[![](https://raw.githubusercontent.com/Tendourisu/images/master/image%2012.png)](https://raw.githubusercontent.com/Tendourisu/images/master/image%2012.png)

[![](https://raw.githubusercontent.com/Tendourisu/images/master/image%201%206.png)](https://raw.githubusercontent.com/Tendourisu/images/master/image%201%206.png)

- 线性递归，只会访问O(logn)个节点；对L/R-List的访问：累计O(r)个元素成功，O(logn)个失败

## 线段树/Segment Tree

### 基本区间/Elementary Interval

- 任意给x轴上的n段区间: $I=\{[x_i, x_i']|i=1,2,3,...,n\}$﻿
- 将它们的端点排序为: $\{p_1, p_2, p_3, ...,p_m\},m\leq2n$﻿
- 于是，得到m+1段**基本区间**/**EI**：$(-\infin, p_1],(p_1,p_2],(p_2,p_3],...,(p_{m-1},p_m],(p_m,+\infin]$﻿

### 离散化/Discretization

- 观察：**同一**段EI内的任何位置，穿刺查询的输出必然完全**一样**
- 于是，只要将所有所有EI预处理为**有序向量**，并使每段EI记录其对应的查询**输出**，那么
    
    一旦确定穿刺位置，便可快速地完成查询：二分查找+ 输出结果 //O(logn + r)
    

[![](https://raw.githubusercontent.com/Tendourisu/images/master/image%202%207.png)](https://raw.githubusercontent.com/Tendourisu/images/master/image%202%207.png)

- 但是在最坏的情况之下，输入的每段区间都会横跨$\Omega(n)$﻿段EI，总共需要$\Omega(n^2)$﻿附加空间

[![](https://raw.githubusercontent.com/Tendourisu/images/master/image%203%205.png)](https://raw.githubusercontent.com/Tendourisu/images/master/image%203%205.png)

[![](https://raw.githubusercontent.com/Tendourisu/images/master/image%204%205.png)](https://raw.githubusercontent.com/Tendourisu/images/master/image%204%205.png)

[![](https://raw.githubusercontent.com/Tendourisu/images/master/image%205%205.png)](https://raw.githubusercontent.com/Tendourisu/images/master/image%205%205.png)

[![](https://raw.githubusercontent.com/Tendourisu/images/master/image%206%205.png)](https://raw.githubusercontent.com/Tendourisu/images/master/image%206%205.png)

[![](https://raw.githubusercontent.com/Tendourisu/images/master/image%207%204.png)](https://raw.githubusercontent.com/Tendourisu/images/master/image%207%204.png)