---
title: cs61c intro
tags:
  - "#cs61c"
  - "#RISC-V"
categories: dairy
date: " 2025-01-24T10:57:06+08:00 "
modify: " 2025-01-24T10:57:06+08:00 "
dir: dairy
share: false
cdate: " 2025-01-24 "
mdate: " 2025-01-24 "
---

![image.png](https://raw.githubusercontent.com/Tendourisu/images/master/202501241058813.png)

- Concurrent Thread
- Parallel Thread
- Parallel Instruction
- Parallel Data

## 5 Great Ideas in Computer Architecture

1. Abstraction (Layers of Representation/Interpretation)
2. Moore’s Law (Designing through trends) 
3. Principle of Locality (Memory Hierarchy) 
4. Parallelism & Amdahl's law (which limits it) 
5. Dependability via Redundancy

![image.png](https://raw.githubusercontent.com/Tendourisu/images/master/202501241230832.png)

Sumery:

- Binary, Decimal, Hex 
- Sign and Magnitude 
- One’s Complement
- Two’s Complement
- Bias
- IEC Prefixes  
![image.png](https://raw.githubusercontent.com/Tendourisu/images/master/202501241549093.png)  
![image.png](https://raw.githubusercontent.com/Tendourisu/images/master/202501241601077.png)

```c
int *fn(void *, void *); // 这是一个返回 int* 类型的函数，不是函数指针
int (*fn)(void *, void *); // 这是一个指向返回 int 类型并接受两个 void* 参数的函数的指针
```

```c
Bar* b = (Bar*) malloc(sizeof(Bar));
Bar* b = new Bar
```

```c
int strlen(char*s){
	char*p= s;
	while(*p++)
		;/* Null body of while*/
	return(p – s – 1);
}
```

![image.png](https://raw.githubusercontent.com/Tendourisu/images/master/202501260031148.png)

![image.png](https://raw.githubusercontent.com/Tendourisu/images/master/202501252355443.png)

- If you forget to deallocate memory: “Memory Leak””
	- Your program will eventually run out of memory
- If you call free twice on the same memory: “Double Free”
	- Possible crash or exploitable vulnerabilityy
- If you use data after calling free: “Use after free” 
	- Possible crash or exploitable vulnerability
