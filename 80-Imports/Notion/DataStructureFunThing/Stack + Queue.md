```C++
## 接口

-size() / empty()
-push()入栈
-pop()出栈
-top()查顶
```

  

```C++
template <typename T> class Stack: public Vector<T> { //原有接口一概沿用
public:
		void push( T const & e ) { insert( e ); } //入栈
		T pop() { return remove( size() – 1 ); } //出栈
		T & top() { return (*this)[ size() – 1 ]; } //取顶
};
```

## 消除递归

- 隐式的维护调用栈需花费额外的时间，空间
- 因此需将递归算法改写为迭代版本-

[![](https://raw.githubusercontent.com/Tendourisu/images/master/image%208.png)](https://raw.githubusercontent.com/Tendourisu/images/master/image%208.png)

- 尾递归为最简单的递归模式，完全可改写为迭代形式

```C++
reverse(int* A, int n) {
	if (n < 2) return;
	swap(A[0], A[n-1];
	A++; n-= 2;
	reverse(A, n);
} //尾递归，O(n)时间+ O(n)空间

reverse(int* A, int n) {
	while(1 < n) {
		swap(A[0], A[n-1];
		A++; n-= 2;
	}
} //迭代，//O(n)时间+ O(1)空间
```

## 进制转换

- 计数法：大致使用$log n$﻿的符号来记录信息
- 短除法
- 采用栈，一方面自后向前反向输出，另一方面 避免计算空间长度

## 括号匹配

- 在括号序列中寻找一对紧邻的左右括号，并递归的进行——介值定理
    - 添加这对括号的最小性，则括号之前的序列必然为左括号
    - 使用栈来储存左括号，遇到右括号就出栈

```C++
bool
paren( const char exp[], Rank lo, Rank hi ) { //exp[lo, hi)
	Stack<char> S; //使用栈记录已发现但尚未匹配的左括号
	for ( Rank i = lo; i < hi; i++ ) //逐一检查当前字符
		if ( '(' == exp[i] ) S.push( exp[i] ); //遇左括号：则进栈
		else if ( ! S.empty() ) S.pop(); //遇右括号：若栈非空，则弹出对应的左括号
		else return false; //否则（遇右括号时栈已空），必不匹配
	returnS.empty(); //最终栈空，当且仅当匹配
}
```

## 中缀表达式求值

- 操作符位于其相关操作数的==中间==。这与==前缀表达式==（操作符位于操作数之前）和==后缀表达式==（操作符位于操作数之后）相对。不同的操作符有不同的==优先度==
- 自左向右扫描表达式用栈记录已扫描的部分，以及中间结果
- 栈中从下至上依次堆叠优先级高的运算符，遇到优先级低的说明可以计算前面的

[![](https://raw.githubusercontent.com/Tendourisu/images/master/image%201%203.png)](https://raw.githubusercontent.com/Tendourisu/images/master/image%201%203.png)

```C++
double evaluate( char* S, char* RPN ) { //S保证语法正确
	Stack<double> opnd; Stack<char> optr; //运算数栈、运算符栈
	optr.push('\0'); //哨兵
	while ( ! optr.empty() ) { //逐个处理各字符，直至运算符栈空
		if ( isdigit( *S ) ) //若为操作数（可能多位、小数），则
			readNumber( S, opnd ); //读入
		else //若为运算符，则视其与栈顶运算符之间优先级的高低
			switch( priority( optr.top(), *S ) ) { /* 分别处理*/}
	} //while
	return opnd.pop(); //弹出并返回最后的计算结果
}
```

- 处理优先级的方法，使用priority（）函数，查找pri这张表

[![](https://raw.githubusercontent.com/Tendourisu/images/master/image%202%204.png)](https://raw.githubusercontent.com/Tendourisu/images/master/image%202%204.png)

  

```C++
switch(priority( optr.top(), *S ) ) {
	case '<': //栈顶运算符优先级更低
		optr.push( *S ); //运算推迟，当前运算符进栈
		S++; //并转至下一字符
		break; 
	case '>':
		char op = optr.pop();
		if ( '!' == op ) opnd.push( calcu( op, opnd.pop() ) ); //一元运算符
		else {double opnd2= opnd.pop(),opnd1= opnd.pop(); //二元运算符
					opnd.push( calcu( opnd1, op, opnd2) ); //实施计算，结果入栈
		} //为何不直接：opnd.push( calcu( opnd.pop(), op, opnd.pop() ) )？
			//为了适应多平台
		break;
	case '~': //匹配的运算符（括号或'\0'）
		optr.pop(); //脱括号
		S++; //并转至下一字符
		break;
	} 
} //switch
```

## 逆波兰表达式 ==(Reverse Polish Notation)==

- 在由运算符（operator）和操作数（operand）组成的表达式中不使用括号（parenthesis-free），即可表示带优先级的运算关系
- 波兰表达式 ：函数+参数的直接连缀
- Nolan表达式的例子：
    
    0 ! + 123 + 4 * ( 5 * 6 ! + 7 ! / 8 ) / 9
    
    0 ！ 123 + 4 5 6 ！ * 7 ！ 8 / + * 9 / +
    

[![](https://raw.githubusercontent.com/Tendourisu/images/master/image%203%202.png)](https://raw.githubusercontent.com/Tendourisu/images/master/image%203%202.png)

[![](https://raw.githubusercontent.com/Tendourisu/images/master/image%204%202.png)](https://raw.githubusercontent.com/Tendourisu/images/master/image%204%202.png)

```C++
##自动转换

double evaluate( char* S, char* RPN) { //RPN转换
	/* ...... */
	while ( ! optr.empty() ) { //逐个处理各字符，直至运算符栈空
	if ( isdigit( * S ) ) //若当前字符为操作数，则直接
		{ readNumber( S, opnd ); append( RPN, opnd.top() ); } //将其接入RPN
	else //若当前字符为运算符
	switch( priority( optr.top(), *S ) ) {
		/* ...... */
		case '>': { //且可立即执行，则在执行相应计算的同时
			char op = optr.pop(); append( RPN, op ); //将其接入RPN
		/* ...... */
		} //case '>'
	/* ...... */
```

## 栈混洗

[![](https://raw.githubusercontent.com/Tendourisu/images/master/image%205%202.png)](https://raw.githubusercontent.com/Tendourisu/images/master/image%205%202.png)

- 其数目SP（n）=Caralan（n）= $\frac{C_{2n}^{n}}{n+1}$﻿

## Steap

### Steap = Stack + Heap = push + pop + getMax = S + P

- 构造一个S 的影子栈P，P中每个元素，都是S中对应前缀里的最大者

[![](https://raw.githubusercontent.com/Tendourisu/images/master/image%206%202.png)](https://raw.githubusercontent.com/Tendourisu/images/master/image%206%202.png)

```C++
Steap::getMax() { return P.top(); } //O(1)
Steap::pop() { P.pop(); return S.pop(); } //O(1)
Steap::push(e) { P.push( max( e, P.top() ) ); S.push(e); } //O(1)
```

### Steap = Stack + Heap = push + pop + getMax = S + P’

- 将P去重，升级为P’，S中的关键元素，才会记录在P'中；只需记录对应的引用，外加一个计数器
- S.push()和S.pop()，分别对应于计数器的增|生、减|灭

[![](https://raw.githubusercontent.com/Tendourisu/images/master/image%207%202.png)](https://raw.githubusercontent.com/Tendourisu/images/master/image%207%202.png)

## Queap

### Queap = Queue + Heap = enqueue + dequeue + getMax = Q + P

[![](https://raw.githubusercontent.com/Tendourisu/images/master/image%208%202.png)](https://raw.githubusercontent.com/Tendourisu/images/master/image%208%202.png)

```C++
Queap::dequeue() { P.dequeue(); return Q.dequeue(); } //O(1)
Queap::enqueue(e) { //最坏情况O(n)，且可能持续发生
	Q.enqueue(e); P.enqueue(e);
	for( x = P.rear(); x && (e =>x->key); x = x->pred) //见贤
		x->key =e; //思齐
}//最坏会到O（n)
```

### Queap = Queue + Heap = enqueue + dequeue + getMax = Q + P’

[![](https://raw.githubusercontent.com/Tendourisu/images/master/image%209.png)](https://raw.githubusercontent.com/Tendourisu/images/master/image%209.png)

```C++
//改进的enqueue
Queap::enqueue(e) { //分摊O(1)
	Q.enqueue(e); c = 1;
	for ( ; !P.emoty() && (e => P.rear()->key); c +=P.dequeuerear()->count );
	P.enqueue( {c, &(Q.rear())} );
```

- 我们称此为DEQUEUE，因为与Dequeue重名，故称之为DEQUE，与deck同音。