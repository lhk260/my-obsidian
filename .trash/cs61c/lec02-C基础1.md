---
title: lec02-C基础1
tags:
  - cs61c
categories: cs61c
date: " 2025-01-31T11:03:17+08:00 "
modify: " 2025-01-31T11:03:17+08:00 "
dir: dairy
share: false
cdate: " 2025-01-31 "
mdate: " 2025-01-31 "
---

# C语言核心笔记（lec02）

>[!important]+ **核心概念**
>- **C语言设计哲学**：贴近硬件、高效灵活，强调手动控制内存和底层操作
>- **类型系统**：强静态类型，需显式声明，支持指针和位级操作
>- **执行模型**：编译型语言，直接生成机器码，无运行时环境

---

## 1. 数据类型与表示

### 1.1 整数类型

| 类型         | 位宽    | 范围（32位）                        | 备注            |
| ---------- | ----- | ------------------------------ | ------------- |
| `int`      | ≥16位  | -2,147,483,648 ~ 2,147,483,647 | 平台相关          |
| `unsigned` | ≥16位  | 0 ~ 4,294,967,295              | 内存地址专用        |
| `int32_t`  | 精确32位 | -2³¹ ~ 2³¹-1                   | 需包含<stdint.h> |
| `uint64_t` | 精确64位 | 0 ~ 2⁶⁴-1                      | 精确控制时使用       |

```c
// 二进制字面量示例（C23支持）
uint8_t mask = 0b10101010; 
int32_t big_num = 0x7FFFFFFF;
```

### 1.2 浮点类型

| 类型      | 位宽 | 精度         | 范围               |
|-----------|------|-------------|--------------------|
| `float`   | 32位 | 6-7位小数    | ±3.4e38           |
| `double`  | 64位 | 15-16位小数  | ±1.7e308          |

```c
const double PI = 4 * atan(1.0); // 精确计算π值
```

### 1.3 布尔与枚举

```c
#include <stdbool.h>
bool is_valid = true;

enum Week {MON=1, TUE, WED, THU, FRI}; // 显式初始化
```

---

## 2. 内存管理与指针

### 2.1 指针基础

```c
int x = 42;
int *ptr = &x;      // 声明并初始化
*ptr = 100;         // 通过指针修改值
int **pptr = &ptr;  // 二级指针
```

>[!warning]+ **指针陷阱**
>1. **野指针**：未初始化的指针包含垃圾地址
>2. **悬垂指针**：指向已释放内存的指针
>3. **类型混淆**：`void*`强制转换需谨慎

### 2.2 动态内存管理

| 函数      | 功能                     | 最佳实践                  |
|-----------|--------------------------|--------------------------|
| `malloc`  | 分配未初始化内存          | 总是检查返回值是否为NULL |
| `calloc`  | 分配并清零内存            | 适合数组初始化           |
| `realloc` | 调整已分配内存大小        | 可能触发内存拷贝         |
| `free`    | 释放内存                 | 释放后立即置空指针       |

```c
int *arr = malloc(10 * sizeof(int));
if (!arr) {
    perror("Memory allocation failed");
    exit(EXIT_FAILURE);
}
free(arr);
arr = NULL;  // 防御性编程
```

### 2.3 结构体与指针

```c
typedef struct {
    int x;
    char name[20];
} Point;

Point p1 = {5, "origin"};
Point *p_ptr = &p1;
printf("X: %d\n", p_ptr->x);  // 箭头运算符访问成员
```

---

## 3. 函数与程序结构

### 3.1 函数指针

```c
int add(int a, int b) { return a + b; }
int (*func_ptr)(int, int) = add;  // 声明函数指针

// 回调函数应用
void calculator(int (*op)(int, int), int x, int y) {
    printf("Result: %d\n", op(x, y));
}
calculator(add, 3, 5);  // 输出8
```

### 3.2 参数传递

| 传递方式  | 语法             | 效果                      |
|-----------|------------------|--------------------------|
| 值传递    | `void func(int x)` | 函数内修改不影响原值      |
| 指针传递  | `void func(int *x)` | 可直接修改原值            |

```c
void swap(int *a, int *b) {
    int tmp = *a;
    *a = *b;
    *b = tmp;
}
```

---

## 4. 预处理与编译

### 4.1 编译流程

```mermaid
graph LR
A[foo.c] --> B[预处理器]
B --> C[foo.i]
C --> D[编译器]
D --> E[foo.s]
E --> F[汇编器]
F --> G[foo.o]
G --> H[链接器]
H --> I[a.out]
```

### 4.2 预处理器陷阱

```c
#define SQUARE(x) x*x       // 错误：应加括号
#define SAFE_SQ(x) ((x)*(x))// 正确写法

int x = SAFE_SQ(2+3);       // 展开为((2+3)*(2+3))=25
```

>[!important]+ **头文件保护**
>
>```c
>#ifndef MY_HEADER_H
>#define MY_HEADER_H
>/* 内容 */
>#endif
>```

---

## 5. 调试与工具

### 5.1 Valgrind使用

```bash
valgrind --leak-check=full --track-origins=yes ./program
```

| 错误类型           | 说明                      |
|--------------------|--------------------------|
| Invalid read/write | 非法内存访问              |
| Definitely lost    | 确认的内存泄漏            |
| Conditional jump   | 使用未初始化值            |

### 5.2 GDB调试要点

```bash
(gdb) break main          # 设置断点
(gdb) run                 # 启动程序
(gdb) print *ptr@5        # 查看连续5个元素
(gdb) watch x             # 监控变量变化
(gdb) backtrace           # 查看调用栈
```

---

## 6. C与Java关键差异

| 特性            | C                          | Java                       |
|-----------------|----------------------------|----------------------------|
| **内存管理**    | 手动分配/释放              | 自动垃圾回收               |
| **指针**        | 显式指针操作               | 引用类型（受限指针）       |
| **异常处理**    | 无原生支持                 | try-catch-finally          |
| **多线程**      | 依赖平台API（如pthread）   | 内置Thread类               |
| **标准库**      | 小型基础库（libc）         | 庞大的标准类库             |

---

## 7. 未定义行为(UB)全解

### 7.1 常见UB场景

```c
int x = INT_MAX + 1;         // 有符号溢出
int arr[3]; printf("%d", arr[5]); // 数组越界
char *s = "hello"; s[0] = 'H';    // 修改字符串字面量
```

### 7.2 UB后果等级

1. **无害结果**：程序输出错误但继续运行
2. **崩溃**：段错误（Segmentation Fault）
3. **安全漏洞**：缓冲区溢出被恶意利用

>[!danger]+ **防御UB的黄金法则**
>1. 启用所有编译器警告（`-Wall -Wextra`）
>2. 静态分析工具（如Clang Static Analyzer）
>3. 防御性编程（边界检查、空指针验证）

---

## 8. 现代C开发实践

### 8.1 代码规范

```c
// Good：清晰的命名和注释
typedef struct {
    float x;
    float y;
} Vector2D;

Vector2D normalize(Vector2D vec) {
    float mag = sqrt(vec.x*vec.x + vec.y*vec.y);
    if (mag < 1e-6) return (Vector2D){0, 0};  // 防止除以零
    return (Vector2D){vec.x/mag, vec.y/mag};
}
```

### 8.2 构建系统

```makefile
CC = gcc
CFLAGS = -Wall -O2

all: program

program: main.o utils.o
    $(CC) $(CFLAGS) -o $@ $^

%.o: %.c
    $(CC) $(CFLAGS) -c $<

clean:
    rm -f *.o program
```
