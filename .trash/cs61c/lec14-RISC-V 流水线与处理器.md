---
title: lec14-RISC-V 流水线与处理器
tags:
  - cs61c
categories: dairy
date: " 2025-02-08T00:11:01+08:00 "
modify: " 2025-02-08T00:11:01+08:00 "
dir: dairy
share: false
cdate: " 2025-02-08 "
mdate: " 2025-02-08 "
---

# RISC-V 流水线与处理器设计总结

## RISC-V 流水线设计

### 流水线阶段

**IF（取指）**：从指令存储器（IMEM）读取指令。  
**ID（译码/读寄存器）**：解析指令，读取寄存器值。  
**EX（执行）**：ALU 计算或地址生成。  
**WB（写回）**：将结果写回寄存器。  
**MEM（访存）**：访问数据存储器（DMEM）。

### 流水线寄存器

- 分隔各阶段，保存指令的中间状态。
- **核心设计**：  

  ```plaintext
  IMEM → ALU → DMEM → RegFile（带转发路径）
  ```

---

## 结构冒险（Structural Hazards）

### 定义

多个指令同时竞争同一硬件资源（如寄存器文件、存储器端口）。

### 解决方法

**分时复用**：插入暂停（Stall）让指令轮流使用资源。  
**增加硬件**：
   - 寄存器文件：独立读写端口（2读1写）。
   - 存储器：分离指令缓存（I-Cache）与数据缓存（D-Cache）。  
![image.png](https://raw.githubusercontent.com/Tendourisu/images/master/202502080056834.png)
---

## 数据冒险（Data Hazards）

### 定义

后续指令依赖前序指令未完成的结果。

### 类型与解决

| 类型           | 示例                                  | 解决方案             |
| ------------ | ----------------------------------- | ---------------- |
| **RAW**      | `add t0, t1, t2` → `sub t2, t0, t3` | 转发（Forwarding）   |
| **Load-Use** | `lw t0, 8(t3)` → `add t1, t0, t2`   | 插入 1 周期暂停（Stall） |

### 插入气泡（Stall）

![image.png](https://raw.githubusercontent.com/Tendourisu/images/master/202502080059084.png)

### 数据前递（Forwarding）

- **原理**：将 ALU 结果直接传递给后续指令的输入。
- **举例**：  
**识别数据冒险**：当 `sw` 指令在ID阶段读取 `t0` 时， `add` 指令尚未将结果写回寄存器（处于EX阶段），导致 `sw` 读取旧值  
**前递机制**：将 `add` 指令在EX阶段计算出的 `t0` 结果直接旁路（Bypass）到 `sw` 指令的EX阶段操作数输入端，覆盖ID阶段读取的旧值  
**硬件支持**：流水线需设计前递路径，将前递路径，的EX阶段输出连接到段输出连的EX阶段输入，确保段输入，在计算存储地址和写入数据时使用最新的时使用最新的 `t0` 值  
![image.png](https://raw.githubusercontent.com/Tendourisu/images/master/202502080101185.png)  
![image.png](https://raw.githubusercontent.com/Tendourisu/images/master/202502080103304.png)

## 控制冒险（Control Hazards）

### 定义

分支指令导致后续指令的取指不确定。

### 解决方法

**分支预测**：
   - **静态预测**：前向分支默认不跳转，后向分支（循环）默认跳转。
   - **动态预测**：使用分支历史表（BHT）记录历史行为。  
**流水线冲刷**：若预测失败，将错误指令转为空操作（NOP）。  
![image.png](https://raw.githubusercontent.com/Tendourisu/images/master/202502080139388.png)

### 分支惩罚

- **简单流水线**：2 周期损失（冲刷 2 条错误指令）。
- **优化目标**：通过预测减少冲刷次数。

---

## 超标量处理器与优化

### 超标量设计

- **多发射（Multiple Issue）**：每周期启动多条指令。
- **乱序执行（Out-of-Order）**：动态调度指令以规避冒险。
- **关键指标**：IPC（Instructions Per Cycle）。

### 示例：Intel Core i7

- **流水线深度**：14-20 级。
- **重排序缓冲区（ROB）**：支持 128 条指令乱序执行。
- **实际 CPI**：约 1.02（受冒险和缓存未命中影响）。  
![image.png](https://raw.githubusercontent.com/Tendourisu/images/master/202502080155065.png)

### 能效优化

- **大小核架构（Big.Little）**：高性能核与高能效核混合部署（如 Apple M1）。

---

## RISC-V ISA 设计特点

### 流水线友好特性

**定长指令**：RV32I 中所有指令为 32 位，简化取指与译码。  
**对齐访存**：内存操作对齐，单周期完成。  
**精简格式**：指令格式规则化（如 R/I/S 型），便于快速解析。

### Apple M1 对比

| 特性          | RISC-V/ARM          | x86               |
|---------------|---------------------|-------------------|
| 解码复杂度    | 低（定长/类 RISC）  | 高（变长指令）     |
| 寄存器数量    | 32                  | 16                |
| 重排序能力    | 630 条指令（M1）    | 128 条（Intel）   |
