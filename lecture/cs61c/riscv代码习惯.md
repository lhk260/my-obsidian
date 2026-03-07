---
title: riscv代码习惯
tags:
  - cs61c
categories: dairy
date: " 2025-02-02T10:39:31+08:00 "
modify: " 2025-02-02T10:39:31+08:00 "
dir: dairy
share: false
cdate: " 2025-02-02 "
mdate: " 2025-02-02 "
---

```riscv
.globl factorial

.data
n: .word 8

.text
main:
    la t0, n
    lw a0, 0(t0)
    jal ra, factorial

    addi a1, a0, 0
    addi a0, x0, 1
    ecall # Print Result

    addi a1, x0, '\n'
    addi a0, x0, 11
    ecall # Print newline

    addi a0, x0, 10
    ecall # Exit

factorial:
    # YOUR CODE HERE
    addi a1 x0 1   # a1 result
loop:
    beq a0 x0 exit # a0 != 0
    mul a1 a1 a0   # a1 *= a0 
    addi a0 a0 -1  # a0 -= 1
    j loop         #loop
exit: 
    add a0 a1 x0
    jr ra

```

- 调用函数用 `jal jalr` 如果要在函数中再次调用函数，记得使用 `addi sp sp -4`
- 函数返回用 `jr ra`
- 在纯 loop 中才用 `j`
- 调用函数前：`lw, mv`
- 调用函数后：`sw`

### 4.4 Calling Convention

>[!important]+  
>
>| Register|Name|Description|Saved by|
| ---|---|---|---|
| x0|zero|Always Zero|N/A|
| x1|ra|Return Address|Caller|
| x2|sp|Stack Pointer|Callee|
| x3|gp|Global Pointer|N/A|
| x4|tp|Thread Pointer|N/A|
| x5-7|t0-2|Temporary|Caller|
| x8-x9|s0-s1|Saved Registers|Callee|
| x10-x17|a0-7|Function Arguments/Return Values|Caller|
| x18-27|s2-11|Saved Registers|Callee|
| x28-31|t3-6|Temporaries|Caller|  
>
>逐行解释：  
>x0: 恒 0  
>x1：返回的地址（Return Address）
>   1. 由 caller 保存交给 callee 使用，是 callee 结束生命周期后返回的地址。
>   2. callee 在开始时需保存 caller 传过来的 ra，防止 callee 内部有函数调用（callee 此时成了下一级的 caller）将 ra 覆写找不回 ra
>  
>x2：用于恢复想要保存但可能被覆写的值的地方  
>a0-7: caller 用来传递参数的地方。a0-1 一般放返回值  
>t0-6：caller 想要保存参数的地方，由 caller 借助 x2 维护

1. **Caller-Saved (临时寄存器)**：
    - `t0` 到 `t6`
    - 这些寄存器用于存储临时变量或中间结果。
    - 如果调用者（caller）在调用另一个函数之前使用了这些寄存器，并且希望在调用返回后还能使用这些值，那么调用者必须在调用前将这些寄存器的内容保存到栈中。
2. **Callee-Saved (已保存寄存器)**：
    
    - `s0` 到 `s11`
    - 这些寄存器通常用于存储需要长期保存的变量或指针。
    - 被调用者（callee）如果使用了这些寄存器，必须在函数返回前将它们恢复到原始值。
