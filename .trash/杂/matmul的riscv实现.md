---
title: matmul的riscv实现
tags:
  - RISC-V
categories: dairy
date: " 2025-02-09T17:10:18+08:00 "
modify: " 2025-02-09T17:10:18+08:00 "
dir: dairy
share: false
cdate: " 2025-02-09 "
mdate: " 2025-02-09 "
---

```python
.globl matmul

  

.text

# =======================================================

# FUNCTION: Matrix Multiplication of 2 integer matrices

#   d = matmul(m0, m1)

# Arguments:

#   a0 (int*)  is the pointer to the start of m0

#   a1 (int)   is the # of rows (height) of m0

#   a2 (int)   is the # of columns (width) of m0

#   a3 (int*)  is the pointer to the start of m1

#   a4 (int)   is the # of rows (height) of m1

#   a5 (int)   is the # of columns (width) of m1

#   a6 (int*)  is the pointer to the the start of d

# Returns:

#   None (void), sets d = matmul(m0, m1)

# Exceptions:

#   Make sure to check in top to bottom order!

#   - If the dimensions of m0 do not make sense,

#     this function terminates the program with exit code 38

#   - If the dimensions of m1 do not make sense,

#     this function terminates the program with exit code 38

#   - If the dimensions of m0 and m1 don't match,

#     this function terminates the program with exit code 38

# =======================================================

matmul:

    ebreak

    addi t0 x0 1

    blt a1 t0 exit38

    blt a2 t0 exit38

    blt a4 t0 exit38

    blt a5 t0 exit38

    bne a2 a4 exit38

    # Error checks

    addi sp sp -32

    sw ra 0(sp)

    sw s0 4(sp)

    sw s1 8(sp)

    sw s2 12(sp)

    sw s3 16(sp)

    sw s4 20(sp)

    sw s5 24(sp)

    sw s6 28(sp)

  
  

    # Prologue

    mv s0 a0

    mv s1 a1

    mv s2 a2

    mv s3 a3

    mv s4 a4

    mv s5 a5

    mv s6 a6

  

    li t0 0 # i

    li t1 0 # j

  
  
  

outer_loop_start:

  
  
  
  

inner_loop_start:

    mv a0 s0

    mv a1 s3

    mv a2 s2

    li a3 1

    mv a4 s5

  

    addi sp sp -8

    sw t0 0(sp)

    sw t1 4(sp)

    jal ra dot

    lw t0 0(sp)

    lw t1 4(sp)

    addi sp sp 8

  
  
  
  

inner_loop_end:

    sw a0 0(s6)

    addi s6 s6 4

    addi s3 s3 4

  

    addi t1 t1 1

    bne t1 s5 inner_loop_start

    li t1 0

    slli t2 s5 2 # s3前移量

    sub s3 s3 t2

  
  
  

outer_loop_end:

    slli t2 s2 2 # s0前移量

    add s0 s0 t2

    addi t0 t0 1

    bne t0 s1 outer_loop_start

    # Epilogue

    lw ra 0(sp)

    lw s0 4(sp)

    lw s1 8(sp)

    lw s2 12(sp)

    lw s3 16(sp)

    lw s4 20(sp)

    lw s5 24(sp)

    lw s6 28(sp)

    addi sp sp 32

  

    ret

  

exit38:

    li a0 17

    li a1 38

    ecall
```
