- 能否有DT兼顾向量的静态查找与链表的动态修改特点？
    - **BST！**
- 接口：

```C++
//词条
template <typename K, typename V> struct Entry{ //词条模板类
	K key; V value; //关键码、数值
	Entry( K k= K(), V v= V() ) : key(k), value(v) {}; //默认构造函数
	Entry( Entry<K, V> const & e ) : key(e.key), value(e.value) {}; //克隆
// 比较器、判等器（从此，不必严格区分词条及其对应的关键码）
	bool operator<( Entry<K, V> const & e ) { return key <e.key; } //小于
	bool operator>( Entry<K, V> const & e ) { return key >e.key; } //大于
	bool operator==( Entry<K, V> const & e ) { return key ==e.key; } //等于
	bool operator!=( Entry<K, V> const & e ) { return key !=e.key; } //不等
};
```

```C++
//BST
template <typename T> class BST: public BinTree<T> { //由BinTree派生
public: virtual BinNodePosi<T> &search( const T &); //查找
				virtual BinNodePosi<T> insert( const T &); //插入
				virtual bool remove( const T &); //删除
protected: BinNodePosi<T> _hot; //命中节点的父亲
					 BinNodePosi<T> connect34( //3+4重构，稍晚再详解
						 BinNodePosi<T>, BinNodePosi<T>, BinNodePosi<T>,
						 BinNodePosi<T>, BinNodePosi<T>, BinNodePosi<T>, BinNodePosi<T> );
						BinNodePosi<T> rotateAt( BinNodePosi<T> ); //旋转调整
};
```

- 顺序性：任一节点均不==小/大于==其==左/右====**后代（不能弱化为孩子）**==
- BST的中序遍历序列，必然单调非降

## 查找

- 从根节点出发，逐步地缩小查找范围，直到
    - 发现目标（成功）
    - 抵达空树（失败）
- 对照中序遍历序列可见，整个过程可视作是在仿效有序向量的**二分查找**

```C++
template <typename T> BinNodePosi<T> &BST<T>::search( const T &e ){
	if ( !_root || e == _root->data )//空树，或恰在树根命中
		{ _hot = NULL; return _root; }
	for ( _hot = _root; ; ) { //否则，自顶而下
		BinNodePosi<T> &v = ( e < _hot->data ) ? _hot->lc: _hot->rc; //深入一层
		if ( !v || e == v->data ) return v; _hot = v; //一旦命中或抵达叶子，随即返回
	} //返回目标节点位置的引用，以便后续插入、删除操作
} //无论命中或失败，_hot均指向v之父亲（v是根时，hot为NULL）
```

## 插入

- 先借助search(e)确定插入位置及方向
- 若e尚不存在，则再将新节点作为叶子插入
    - _hot为新节点的父亲
    - v = search(e) 为_hot对新孩子的引用
- 于是，只需令_hot通过v指向新节点

```C++
template <typename T> BinNodePosi<T>BST<T>::insert( const T &e ) {
	BinNodePosi<T> &x = search( e ); //通过查找
	if ( x ) return x; //确认目标不存在，并设置_hot
	x = new BinNode<T>( e, _hot ); //在
	
	x处创建新节点，以_hot为父亲
	_size++; x->updateHeightAbove(); //更新全树规模，以及历代祖先的高度
	return x; //新插入的节点，必为叶子
} //无论e是否存在于原树中，返回时总有x->data== e
```

- 时间主要消耗于`search(e)`和`updateHeightAbove(x)`；均线性正比于x的深度，不超过树高

## 删除

```C++
template <typename T> bool BST<T>::remove( const T &e ) {
	BinNodePosi<T> &x = search( e ); //定位目标节点
	if ( !x ) return false; //确认目标存在（此时_hot为x的父亲）
	
	removeAt( x, _hot ); //分两大类情况实施删除
	_size--; _hot->updateHeightAbove(); //更新全树规模，以及历代祖先的高度
	return true;
} //删除成功与否，由返回值指示
```

- 累计O(h)时间：`search()`、`updateHeightAbove()`；还有`removeAt()`中可能调用的`succ()`

### 单分支：

```C++
template <typename T> static BinNodePosi<T>
removeAt( BinNodePosi<T> &x, BinNodePosi<T> &hot ) {
	BinNodePosi<T> w = x; //实际被摘除的节点，初值同x
	BinNodePosi<T> succ= NULL; //实际被删除节点的接替者
  
  if ( ! HasLChild( x ) ) succ= x = x->rc; //左子树为空

	else if ( ! HasRChild( x ) ) succ= x = x->lc; //右子树为空

	else { /* ...左、右子树并存的情况，略微复杂些... */}
	
	hot = w->parent; //记录实际被删除节点的父亲
	if ( succ) succ->parent = hot; //将被删除节点的接替者与hot相联
	delete w; return succ; //释放被摘除节点，返回接替者
} //此类情况仅需O(1)时间
```

### 双分支：

[![](https://raw.githubusercontent.com/Tendourisu/images/master/image%2011.png)](https://raw.githubusercontent.com/Tendourisu/images/master/image%2011.png)

```C++
template <typename T> static BinNodePosi<T> 
removeAt( BinNodePosi<T> &x, BinNodePosi<T> &hot ) {
	/* ...... */
	else { //若x的左、右子树并存，则
		w = w->succ(); swap( x->data, w->data ); //令x与其后继w互换数据
		BinNodePosi<T> u = w->parent; //原问题即转化为，摘除非二度的节点w
		( u == x ? u->rc: u->lc) = succ= w->rc; //兼顾特殊情况：u可能就是x
	}
	/* ...... */
} //时间主要消耗于succ()，正比于x的高度——更精确地，search()与succ()总共不过O(h)
```

## 平衡：期望树高

- 平衡树的必要性：==理想随机==在实际中H：局部性、关联性、（分段）单调性、（近似）周期性、...较高甚至极高的BST频繁出现，不足为怪；平衡化处理==很有必要==！

### 平衡：等价变换

- 上下可变：联接关系不尽相同，承袭关系可能颠倒
- 左右不乱：中序遍历序列完全一致，全局单调非降

[![](https://raw.githubusercontent.com/Tendourisu/images/master/image%201%205.png)](https://raw.githubusercontent.com/Tendourisu/images/master/image%201%205.png)

- 等价变换+ 旋转调整：==序齿不序爵==

[![](https://raw.githubusercontent.com/Tendourisu/images/master/image%202%206.png)](https://raw.githubusercontent.com/Tendourisu/images/master/image%202%206.png)

### AVL树：渐进平衡

- 平衡因子Balance Factor：balFac（v) = height(lc(v)) - height(rc(v))
- G. **A**delson-**V**elsky & E. **L**andis (1962)：$\forall v \in AVL,|balFac(v)|\le1$﻿

[![](https://raw.githubusercontent.com/Tendourisu/images/master/image%203%204.png)](https://raw.githubusercontent.com/Tendourisu/images/master/image%203%204.png)

- AVL树未必理想平衡，但必然渐近平衡…
- 高度为的AVL树，至少包含$S(h) = fib(h+3) - 1$﻿个节点
    - 证明：
    - 固定高度，考查节点最少的AVL，将其规模记作$S(h)$﻿
    - $S(h) = 1 + S(h-1)+S(h-2)\\S(h)+1=[S(h-1)+1]+[S(h-2)+1]\\fib(h+3)=fib(h+2)+fib(H+1)$﻿
    - 反过来，由个节点构成的AVL树，高度不超过$O(log\ n)$﻿

### AVL树：失衡与复衡

```C++
//接口

\#defineBalanced(x) ( stature( (x)->lc ) == stature( (x)->rc ) ) //理想平衡
\#define BalFac(x) ( stature( (x)->lc ) -stature( (x)->rc ) ) //平衡因子
\#define AvlBalanced(x) ( ( -2< BalFac(x) ) && ( BalFac(x) < 2) ) //AVL平衡条件

template <typename T> class AVL: public BST<T> { //由BST派生
public: //BST::search()等接口，可直接沿用
	BinNodePosi<T> insert( const T & ); //插入（重写）
	bool remove( const T & ); //删除（重写）
};
```

- 失衡

[![](https://raw.githubusercontent.com/Tendourisu/images/master/image%204%204.png)](https://raw.githubusercontent.com/Tendourisu/images/master/image%204%204.png)

- 插入：从祖父开始，每个祖先都有可能失衡，且可能同时失衡！
- 删除：从父亲开始，每个祖先都有可能失衡，但至多一个！因为失衡的那个节点的高度不会变化！

### AVL树：插入

[![](https://raw.githubusercontent.com/Tendourisu/images/master/image%205%204.png)](https://raw.githubusercontent.com/Tendourisu/images/master/image%205%204.png)

[![](https://raw.githubusercontent.com/Tendourisu/images/master/image%206%204.png)](https://raw.githubusercontent.com/Tendourisu/images/master/image%206%204.png)

```C++
//实现

template <typename T> BinNodePosi<T> AVL<T>::insert( const T & e ) {
	BinNodePosi<T> &x = search( e ); if ( x ) return x; //插入失败
	BinNodePosi<T> xx = x = new BinNode<T>( e, _hot ); _size++; //则创建新节点
	
	for ( BinNodePosi<T> g = _hot; g; g->updateHeight(), g = g->parent ) //逐层上溯
		if ( ! AvlBalanced( g ) ) { //一旦发现失衡祖先g，则
			rotateAt( tallerChild( tallerChild( g ) ) ); //通过调整恢复平衡
			break; //并随即终止（局部子树复衡后，高度必然复原；所有祖先亦必复衡）
		}
		return xx; //插入成功
	} //至多会做O(1)次调整
```

[![](https://raw.githubusercontent.com/Tendourisu/images/master/image%207%203.png)](https://raw.githubusercontent.com/Tendourisu/images/master/image%207%203.png)

[![](https://raw.githubusercontent.com/Tendourisu/images/master/image%208%203.png)](https://raw.githubusercontent.com/Tendourisu/images/master/image%208%203.png)

```C++
//实现

template <typename T> bool AVL<T>::remove( const T & e ) {
	BinNodePosi<T> &x = search( e ); if ( !x ) return false; //删除失败
	removeAt( x, _hot ); _size--; //则在按BST规则删除之后，_hot及祖先均有可能失衡

	for ( BinNodePosi<T> g = _hot; g; g->updateHeight(), g = g->parent ) //逐层上溯
		if ( ! AvlBalanced( g ) ) //每当发现失衡祖先g，都
			rotateAt( tallerChild( tallerChild( g ) ) ); //通过调整恢复平衡
			
	return true;//删除成功
} //可能需做过(logn)次调整
```

- 但是，后人发现，并非需要两次zig/zag，我们可以把树查下来，然后按照_**0-a-1-b-2-c-3**_的顺序給组装回去！

[![](https://raw.githubusercontent.com/Tendourisu/images/master/image%209%202.png)](https://raw.githubusercontent.com/Tendourisu/images/master/image%209%202.png)

[![](https://raw.githubusercontent.com/Tendourisu/images/master/image%2010%202.png)](https://raw.githubusercontent.com/Tendourisu/images/master/image%2010%202.png)

### AVL树：(3+4)-重构  
  

```C++
template <typename T> BinNodePosi<T> BST<T>::connect34(
	BinNodePosi<T> a, BinNodePosi<T> b, BinNodePosi<T> c,
	BinNodePosi<T> T0, BinNodePosi<T> T1,BinNodePosi<T> T2, 
	BinNodePosi<T> T3)
{
	a->lc= T0; if (T0) T0->parent = a;
	a->rc= T1; if (T1) T1->parent = a;
	c->lc= T2; if (T2) T2->parent = c;
	c->rc= T3; if (T3) T3->parent = c;
	b->lc= a; a->parent = b; b->rc= c; c->parent = b;
	a->updateHeight(); c->updateHeight(); b->updateHeight(); return b;
}
```

```C++
template<typename T> BinNodePosi<T> BST<T>::rotateAt( BinNodePosi<T> v ) {
	BinNodePosi<T> p = v->parent; int TurnV = IsRChild(v);
	BinNodePosi<T> g = p->parent; int TurnP = IsRChild(p);
	BinNodePosi<T>r = ( TurnP == TurnV ) ? p : v; //子树新的根节点
	( FromParentTo(g)= r )->parent = g->parent;; //须保持与母树的联接
	switch ( ( TurnP << 1 ) | TurnV ) { /* 视p、v的拐向，无非四种情况*/}
}
```

```C++
switch ( ( TurnP << 1 ) | TurnV )
{
	case 0b00: return connect34( v, p, g, v->lc, v->rc, p->rc, g->rc );
	case 0b01: return connect34( p, v, g, p->lc, v->lc, v->rc, g->rc );
	case 0b10: return connect34( g, v, p, g->lc, v->lc, v->rc, p->rc );
	default/*11*/:return connect34( g, p, v, g->lc, p->lc, v->lc, v->rc );
}
```

## AVL：综合评价

- 优点
    - 无论查找、插入或删除，最坏情况下的复杂度均为
    - O(logn)O(n)的存储空间
- 缺点
    - 借助高度或平衡因子，为此需改造元素结构，或额外封装实测复杂度与理论值尚有差距
        - -插入/删除后的旋转，成本不菲
        - -删除操作后，最多需旋转(logn)次（Knuth：平均仅0.21次）
        - -若需频繁进行插入/删除操作，未免得不偿失
    - 单次动态调整后，全树拓扑结构的变化量可能高达(logn)