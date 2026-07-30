[![](https://raw.githubusercontent.com/Tendourisu/images/master/961090547a37758a5a4832b340cb826.jpg)](https://raw.githubusercontent.com/Tendourisu/images/master/961090547a37758a5a4832b340cb826.jpg)

  

## 归并排序 ： State Of The Art

```C++
template
<typename T> void Vector<T>::mergeSort( Rank lo, Rank hi ) {
	if ( hi -lo < 2 ) return; //单元素区间自然有序，否则...
	Rank mi = (lo + hi) >> 1; //以中点为界
	mergeSort( lo, mi ); //对前半段排序
	mergeSort( mi, hi ); //对后半段排序
	merge( lo, mi, hi ); //归并
}
```

[![](https://raw.githubusercontent.com/Tendourisu/images/master/image.png)](https://raw.githubusercontent.com/Tendourisu/images/master/image.png)

`C不用动，自己就好了`

**对于MergeSort的评价**

**优点**

- 实现最坏情况下最优$O(n\log n)$﻿性能的第一个排序算法
- 不需随机读写，完全顺序访问——尤其适用于列表之类的序列、磁带之类的设备
- 只要实现恰当，可保证稳定——出现相等元素时，左侧子向量优先
- 可扩展性极佳，十分适宜于外部排序——海量网页搜索结果的归并
- 易于并行化

**缺点**

- 非就地，需要对等规模的辅助空间——可否更加节省？
- 即便输入已是完全（或接近）有序，仍需$\Omega (n\log n)$﻿时间——如何改进？