---
title: 
tags: 
categories: dairy
date: " 2025-02-20T20:12:29+08:00 "
modify: " 2025-02-20T20:12:29+08:00 "
dir: dairy
share: false
cdate: " 2025-02-20 "
mdate: " 2025-02-20 "
---

## 一、绘制信号波形

1. 必做题
	1. **单边指数信号**  
		![image.png](https://raw.githubusercontent.com/Tendourisu/images/master/202502202117354.png)
	2. 左边正弦信号  
		![image.png](https://raw.githubusercontent.com/Tendourisu/images/master/202502202128463.png)
	3. 右边指数衰减震荡信号  
		![image.png](https://raw.githubusercontent.com/Tendourisu/images/master/202502202131331.png)
	4. 复合信号  
		![image.png](https://raw.githubusercontent.com/Tendourisu/images/master/202502202154492.png)
	5. 单边衰减震荡序列  
		![image.png](https://raw.githubusercontent.com/Tendourisu/images/master/202502202206947.png)
	6. 奇怪的周期序列  
		![image.png](https://raw.githubusercontent.com/Tendourisu/images/master/202502202209214.png)
2. 选做题  
	2. sinc 函数乘积信号  
		![image.png](https://raw.githubusercontent.com/Tendourisu/images/master/202502202220263.png)

## 二、写出信号函数表达式

1. 必做题
	1. 三角信号： $f(t) = (u(t+1)-u(t))*2*(t+1)+(u(t)-u(t-2))*(t-2)$
	2. 分段阶跃信号 ： $f(t)=[1-u(t)]+0.7[u(t)-u(t-1.2)]+1.5[u(t-1.2)-u(t-2)]+2u(t-2)$
	3. 升余弦信号： $f(t)=(0.5+0.5\cos(t)) \cdot (u(t+\pi)-u(t-\pi))$
	4. 高斯调制信号： $f(t)=\sin(3\pi t)\cdot e^{-(t/2)^2}$
2. 选做题
	1. 周期方波信号： $f(t)=u(\cos(t))$
	2. 阶跃衰减信号： $f(t)=\sum^{+\infty}_{n=0}[u(t-1+2^{-n})-u(t-1+2^{-n-1})]$

## 三、判断信号的周期性

1. 必做题
	1. 是
	2. 不是
	3. 是
	4. 是
	5. 不是
	6. 是
2. 选做题
	1. 不是 3/8 乘上一个整数不可能是 $2\pi$ 的整数倍
		- 对
		- 对
		- 不一定
		- 是

## 四、冲激信号特性

1. 必做题
	1. $\sqrt{ 2 }$
	2. $e^{-3}$
	3. $1(当t_{0}\gt 0) 或 0(当t_{0} \lt 0)或1/2(当t_{0}=0)$
