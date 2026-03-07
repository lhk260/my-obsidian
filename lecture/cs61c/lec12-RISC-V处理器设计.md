---
title: lec12-RISC-V处理器设计
tags:
  - cs61c
  - RISC-V
categories: dairy
date: " 2025-02-05T18:47:34+08:00 "
modify: " 2025-02-05T18:47:34+08:00 "
dir: dairy
share: false
cdate: " 2025-02-05 "
mdate: " 2025-02-05 "
---

# RISC-V处理器设计与关键概念总结

## 1. CMOS电路的延迟与功率消耗

### 关键概念

- **晶体管非理想特性**  
  - 关断时存在漏电流  
  - 导通时存在有限电阻  
- **电容效应**  
  - 节点电压变化需充放电，导致延迟  
- **延迟积累**  
  - 级联门电路的总延迟为各阶段延迟之和  
- **功率公式**  
  $P_{SW} = 1/2 \alpha C  V_{dd}^2 F$

  - α: 活动因子，C: 总电容，F: 时钟频率

---

## 2. RISC-V数据路径设计

### 核心组件

- **寄存器文件 (Regfile)**  
  - 32个32位寄存器，支持双读单写  
- **算术逻辑单元 (ALU)**  
  - 支持加减、逻辑运算等操作，由`ALUSel`控制  
- **立即数生成器 (Imm Gen)**  
  - 处理不同格式的立即数（I型/S型/B型）  
- **内存单元 (DMEM/IMEM)**  
  - 分离的指令与数据存储器，异步读同步写  

### 控制信号

| 信号       | 作用            |
| -------- | ------------- |
| `RegWEn` | 寄存器写使能        |
| `BSel`   | 选择ALU第二个操作数来源 |
| `ImmSel` | 选择立即数格式       |
| `PCSel`  | 选择下一条PC来源     |

![image.png](https://raw.githubusercontent.com/Tendourisu/images/master/202502051848020.png)

---

## 3. 指令执行阶段

### 五级流水线

```plaintext
IF (取指) → ID (译码/读寄存器) → EX (执行) → MEM (访存) → WB (写回)
```

- **单周期机特点**  
  - 所有指令在一个时钟周期内完成  
  - 关键路径决定时钟周期长度  

---

## 4. RISC-V指令实现

### 4.1 算术指令 (ADD/SUB)

- **R型指令格式**  

  ```plaintext
  add x1, x2, x3 → 0000000 x3 x2 000 x1 0110011
  sub x1, x2, x3 → 0100000 x3 x2 000 x1 0110011
  ```

- **数据路径**  
  - 寄存器值→ALU→写回目标寄存器，PC+4更新  
![image.png](https://raw.githubusercontent.com/Tendourisu/images/master/202502051942754.png)

### 4.2 立即数指令 (ADDI)

- **I型指令格式**  

  ```plaintext
  addi x15, x1, -50 → 111111001110 x1 000 x15 0010011
  ```

- **实现逻辑**  
  - 立即数符号扩展后与`rs1`相加，结果写回`rd`  
![](https://raw.githubusercontent.com/Tendourisu/images/master/202502051946121.png)  
![image.png](https://raw.githubusercontent.com/Tendourisu/images/master/202502051946789.png)

### 4.3 访存指令 (LW/SW)

- **LW指令数据路径**  
  - `rs1 + offset`计算内存地址 → 读取数据 → 写回寄存器  
- **SW指令控制信号**  

  ```plaintext
  MemRW=Write, RegWEn=0, Bsel=1 (选择立即数)
  ```

![image.png](https://raw.githubusercontent.com/Tendourisu/images/master/202502052009727.png)  
![image.png](https://raw.githubusercontent.com/Tendourisu/images/master/202502052027949.png)  
![image.png](https://raw.githubusercontent.com/Tendourisu/images/master/202502052033579.png)

### 4.4 分支指令 (BEQ/BNE)

- **B型指令格式**  

  ```plaintext
  beq x1, x2, label → 偏移量编码为12位（低1位隐含为0）
  ```

- **比较逻辑**  
  - `BrEq=1`若`Reg[rs1] == Reg[rs2]`，`BrLT`用于有符号/无符号比较  
![image.png](https://raw.githubusercontent.com/Tendourisu/images/master/202502052040805.png)  
![image.png](https://raw.githubusercontent.com/Tendourisu/images/master/202502052043585.png)

### 4.5 跳转指令 (JAL/JALR)

- **JAL实现**  
  - PC相对跳转，`Reg[rd] = PC+4`，更新`PC = PC + offset`  
- **JALR实现**  
  - 绝对跳转，`PC = Reg[rs1] + imm`，`Reg[rd] = PC+4`  
![image.png](https://raw.githubusercontent.com/Tendourisu/images/master/202502052044604.png)  
![image.png](https://raw.githubusercontent.com/Tendourisu/images/master/202502052045721.png)

---

## 5. 关键概念

### 5.1 程序计数器 (PC) 行为

- 默认行为：`PC = PC + 4`  
- 分支/跳转时：由`PCSel`选择新值（ALU结果或立即数偏移）  

### 5.2 调用约定与栈管理

- **Caller责任**  
  - 保存临时寄存器 (`a0-a7`, `t0-t6`)  
  - 传递参数并保存返回地址 (`ra`)  
- **Callee责任**  
  - 保存被调用者保存寄存器 (`s0-s11`)  
  - 通过`sp`操作管理栈帧  

### 5.3 伪指令实现

- **`j label`**  
  - 转换为`jal x0, label`（不保存返回地址）  
- **`ret`**  
  - 转换为`jalr x0, 0(x1)`（跳转到`ra`地址）  

---

## 6. 单周期数据路径示意图

![image.png](https://raw.githubusercontent.com/Tendourisu/images/master/202502052047894.png)

- **核心逻辑**  
  - 指令流从IMEM流入，经译码后控制多路选择器和功能单元  
  - 分支比较器决定是否跳转，ALU处理计算和地址生成  
