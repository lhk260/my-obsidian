---
title: lec08-RISCV指令总结
tags:
  - cs61c
categories: dairy
date: " 2025-02-01T15:02:13+08:00 "
modify: " 2025-02-01T15:02:13+08:00 "
dir: dairy
share: false
cdate: " 2025-02-01"
mdate: " 2025-02-01 "
---

## R 型：2S + 1D  

![image.png](https://raw.githubusercontent.com/Tendourisu/images/master/202502011505478.png)

## I 型 1IMM + 1S + 1D

![image.png](https://raw.githubusercontent.com/Tendourisu/images/master/202502011505563.png)  
![image.png](https://raw.githubusercontent.com/Tendourisu/images/master/202502011843510.png)

## S 型 1IMM + 2S

![image.png](https://raw.githubusercontent.com/Tendourisu/images/master/202502011905537.png)

## B 型 1IMM+ 2S

![image.png](https://raw.githubusercontent.com/Tendourisu/images/master/202502011940979.png)

>[!attention]+  
>为了与 16 位的 riscv 兼容，本来可以扩展 2 位（由于对齐的规则，后两位一定是零）结果只能扩展一位（也就是由于历史原因，为了兼容性所做的牺牲）。故可以表示 $\displaystyle \pm 2^{12-1}\times 2=2^{12}bytes=2^{12}Instructions$

## J 型 1IMM + 1D

![image.png](https://raw.githubusercontent.com/Tendourisu/images/master/202502011953148.png)

>[!hint]+  
>JALR 是 I 型

![image.png](https://raw.githubusercontent.com/Tendourisu/images/master/202502012000160.png)

## U 型 1IMM + 1D

![image.png](https://raw.githubusercontent.com/Tendourisu/images/master/202502012007305.png)  
将 jump 从 12bytes 扩展为 32bytes 的方法：  
![image.png](https://raw.githubusercontent.com/Tendourisu/images/master/202502012008471.png)  
![image.png](https://raw.githubusercontent.com/Tendourisu/images/master/202502012009777.png)  
![image.png](https://raw.githubusercontent.com/Tendourisu/images/master/202502012009738.png)
