- 一些概念：
    - Rooted Tree
    - Ordered Tree(child, children, sibling, parent)
    - depth(v) = |path(v)|
    - 祖先（ancestor), 后代（descendent
    - 高度（height）所有叶子深度的最大者，特别的，空树的高度取-1
        - depth(v) + height(v) ≤height(T)
- **Binary Trees**: 节点度数≤2
- **一些性质(设度数为0、1和2的节点，各有n0、n1和n2个)**
    - 边数$e=n−1= $﻿$n_1 + 2n_2$﻿
    - 叶节点数$n_0=n_2+1$﻿
    - 节点数$n = n_0+ n_1+ n_2= 1 + n_1+ 2n_2$﻿
    - 特别地，当$n_1= 0$﻿时，有e = 2n_2和$n_0= n_2+ 1 = \frac{n + 1}{2}$﻿此时，节点度数均为偶数，不含单分支节点…
- 满树
    - 深度为k的节点，至多$2^k$﻿个
    - n个节点、高h的二叉树满足 $h+1≤n≤2^{h+1}-1$﻿
    - 特殊情况
        - $n = h + 1：$﻿退化为一条单链
        - $n = 2^{h+1} - 1$﻿：即所谓满二叉树  
            full binary tree  
            

## BinNode模板类

```C++
template <typenameT> using BinNodePosi= BinNode<T>*; //节点位置
template <typename T> struct BinNode{
	BinNodePosi<T> parent, lc, rc; //父亲、孩子
	T data; Rank height, npl; RBColor color; //数据、高度、npl、颜色
	Rank size(); Rank updateHeight();void updateHeightAbove(); //更新规模、高度
	BinNodePosi<T> insertLc( T const & ); //插入左孩子
	BinNodePosi<T> insertRc( T const & ); //插入右孩子
	BinNodePosi<T> succ(); //（中序遍历意义下）当前节点的直接后继
	template <typename VST> void travLevel( VST & ); //层次遍历
	template <typename VST> void travPre( VST & ); //先序遍历
	template <typename VST> void travIn( VST & ); //中序遍历
	template <typename VST> void travPost( VST & ); //后序遍历
};

	template <typename T>BinNodePosi<T> BinNode<T>::insertLc( T const & e 
		{ return lc= new BinNode<T>( e, this ); }
	template <typename T>BinNodePosi<T> BinNode<T>::insertRc( T const & e )
		s{ return rc= new BinNode<T>( e, this ); }
	\#define stature(p) ( (int) ((p) ? (p)->height : -1) ) //空树高度-1，以上递推
	template <typename T> //勤奋策略：及时更新节点x高度，具体规则因树不同而异
	Rank BinNode<T>::updateHeight() //此处采用常规二叉树规则，O(1)
		{ return height = 1 + max( stature( lc ), stature( rc ) ); }
	
	template <typename T> //更新节点及其历代祖先的高度
	void BinNode<T>::updateHeightAbove() //更新当前节点及其祖先的高度，O( n = depth(x) )
	 { for ( BinNodePosi<T>x = this; x; x = x->parent ) x->updateHeight(); } //可优化,在第一次updateHeight时实际上没有更新时可以停止
}
```

## BinTree模板类

```C++
template <typename T> class
BinTree{
	protected: Rank _size;BinNodePosi<T> _root;
	public: Rank size() const { return _size; };bool empty() const { return !_root; }
		BinNodePosi<T> root() const { return _root; }
		BinNodePosi<T>insert( T const& ); //插入根节点
		BinNodePosi<T>insert( T const&, BinNodePosi<T> ); //插入左孩子
		BinNodePosi<T>insert( BinNodePosi<T>, T const& ); //插入右孩子
		BinNodePosi<T>attach( BinTree<T>, BinNodePosi<T>); //接入左子树
		BinNodePosi<T>attach( BinNodePosi<T>, BinTree<T> ); //接入右子树
		Rank remove( BinNodePosi<T>); //子树删除
		BinTree<T>* secede( BinNodePosi<T>); //子树分离
	}
	
	BinNodePosi<T> BinTree<T>::insert( BinNodePosi<T> x, T const & e); //作为右孩子
	BinNodePosi<T> BinTree<T>::insert( T const & e, BinNodePosi<T> x) { //作为左孩子
		_size++;
		x->insertLc( e );
		x->updateHeightAbove();return x->lc;
	}
	BinNodePosi<T> BinTree<T>::attach( BinTree<T> S, BinNodePosi<T> x ); //接入左子树
	BinNodePosi<T> BinTree<T>::attach( BinNodePosi<T> x, BinTree<T> S ) { //接入右子树
		if ( x->rc = S._root )
			x->rc->parent = x;
		_size += S._size;x->updateHeightAbove();
		S._root = NULL;
		S._size = 0;
		return x;
	}
	
	//\#define FromParentTo( x ) /*来自父亲的引用*/ \
    ( (x)->parent ? ( ((x) == (x)->parent->lc) ? (x)->parent->lc : (x)->parent->rc ) : _root )
    
	template <typename T> BinTree<T>* BinTree<T>::secede( BinNodePosi<T> x ) {
		FromParentTo( x ) = NULL; x->parent->updateHeightAbove();
	// 以上与BinTree<T>::remove()一致
	// 以下还需对分离出来的子树重新封装
		BinTree<T> * S = new BinTree<T>; //创建空树
		S->_root = x; x->parent = NULL; //新树以x为根
		S->_size = x->size(); _size -= S->_size; //更新规模
		return S; //返回封装后的子树
}
```

## 遍历 traverse

### 先序遍历

```C++
//递归实现
template <typename T, typename VST> 
void traverse( BinNodePosi<T> x, VST & visit ) {
	if ( ! x ) return;
	visit( x->data );
	traverse( x->lc, visit );
	traverse( x->rc, visit );
} //O(n)
```

- 制约：使用默认的Call Stack，允许的递归深度有限

（观察，attention，你注意到）

[![](https://raw.githubusercontent.com/Tendourisu/images/master/image%2010.png)](https://raw.githubusercontent.com/Tendourisu/images/master/image%2010.png)

- **藤 蔓**（vine）！（你想到了栈！

[![](https://raw.githubusercontent.com/Tendourisu/images/master/image%201%204.png)](https://raw.githubusercontent.com/Tendourisu/images/master/image%201%204.png)

- 序曲

```C++
template <typename T, typename VST> static void visitAlongVine
( BinNodePosi<T> x, VST & visit, Stack< BinNodePosi<T> > &S ) { //分摊O(1)
	while ( x ) { //反复地
		visit( x->data ); //访问当前节点
		S.push( x->rc); //右孩子（右子树）入栈（将来逆序出栈）
		x = x->lc; //沿藤下行
	} //只有右孩子、NULL可能入栈——增加判断以剔除后者，是否值得？
}
```

- 全曲

```C++
template <typename T, typename VST> void travPre_I2
( BinNodePosi<T> x, VST & visit ) {
	Stack< BinNodePosi<T> > S; //辅助栈
	while ( true ) { //以右子树为单位，逐批访问节点
		visitAlongVine( x, visit, S ); //访问子树x的藤蔓，各右子树（根）入栈缓冲
		if ( S.empty() ) break; //栈空即退出
		x = S.pop(); //弹出下一右子树（根）
	} //\#push = \#pop = \#visit = O(n) = 分摊O(1)
}
```

### 中序遍历

```C++
//递归实现
template <typename T, typename VST> 
void traverse( BinNodePosi<T> x, VST & visit ) {
	if ( ! x ) return;
	traverse( x->lc, visit );
	visit( x->data );
	traverse( x->rc, visit );
} //O(n)
```

[![](https://raw.githubusercontent.com/Tendourisu/images/master/image%202%205.png)](https://raw.githubusercontent.com/Tendourisu/images/master/image%202%205.png)

- 序曲

```C++
template <typename T> static void goAlongVine
(BinNodePosi<T> x,Stack< BinNodePosi<T> > & S) {
	while ( x )
		{ S.push( x ); x = x->lc; }
}
```

- 全曲

```C++
template <typename T, typename V> 
void travIn_I1( BinNodePosi<T> x, V& visit ) {
	Stack< BinNodePosi<T> > S; //辅助栈
	while ( true ) { //反复地
		goAlongVine( x, S ); //从当前节点出发，逐批入栈
		if ( S.empty() ) break; //直至所有节点处理完毕
		x = S.pop(); //x的左子树或为空，或已遍历（等效于空），故可以
		visit( x->data ); //立即访问之
		x = x->rc; //再转向其右子树（可能为空，留意处理手法）
	}
}
```

- 如果想要一个for循环做到直接遍历呢？想到实现**succ()**！
- 简明遍历：for ( BinNodePosi<T> t = first(); t; t = t->**succ()** )

## 直接后继

- 直接后继：
- 最靠左的右后代

[![](https://raw.githubusercontent.com/Tendourisu/images/master/image%203%203.png)](https://raw.githubusercontent.com/Tendourisu/images/master/image%203%203.png)

- 最低的左祖先

[![](https://raw.githubusercontent.com/Tendourisu/images/master/image%204%203.png)](https://raw.githubusercontent.com/Tendourisu/images/master/image%204%203.png)

```C++
//在中序遍历意义下的直接后继
//稍后将被BST::remove中的removeAt()调用
template <typename T>
BinNodePosi<T> BinNode<T>::succ() {
	BinNodePosi<T> s = this;
	if ( rc) { //若有右孩子，则
		s = rc; //直接后继必是右子树中的
		while ( HasLChild( s ) )
			s = s->lc; //最小节点
		} else { //否则
			//后继应是“以当前节点为直接前驱者”
			while ( IsRChild( s ) )
				s = s->parent; //不断朝左上移动
			//最后再朝右上移动一步
			s = s->parent; //可能是NULL
		}
		return s; //两种情况下，运行时间分别为
	} //当前节点的高度与深度，不过O(h)
```

## 后序遍历

  

```C++
//递归实现
template <typename T, typename VST> 
void traverse( BinNodePosi<T> x, VST & visit ) {
	if ( ! x ) return;
	traverse( x->lc, visit );
	traverse( x->rc, visit );
	visit( x->data );
} //O(n)
```

[![](https://raw.githubusercontent.com/Tendourisu/images/master/image%205%203.png)](https://raw.githubusercontent.com/Tendourisu/images/master/image%205%203.png)

- 序曲

```C++
template <typename T> static void gotoLeftmostLeaf
( Stack<BinNodePosi<T>> & S ) {
	while ( BinNodePosi<T> x =S.top() ) //自顶而下反复检查栈顶节点
		if ( HasLChild( x ) ) { //尽可能向左。在此之前
			if ( HasRChild( x ) ) //若有右孩子，则
				S.push( x->rc); //优先入栈
			S.push( x->lc); //然后转向左孩子
		} else //实不得已
			S.push( x->rc); //才转向右孩子
	S.pop(); //返回之前，弹出栈顶的空节点
}
```

- 全曲

```C++
template <typename T, typenameV> void travPost_I
( BinNodePosi<T> x, V & visit ) {
	Stack< BinNodePosi<T> > S; //辅助栈
	if ( x ) S.push( x); //根节点首先入栈
	while ( ! S.empty() ) { //x始终为当前节点
		if ( S.top() != x->parent) //若栈顶非x之父（而为右兄）
			gotoLeftmostLeaf( S ); //则转入右兄子树
		x = S.pop(); //弹出栈顶（即前一节点之后继）
		visit( x->data ); //并随即访问之
	}
}
```

## 遍历

### 广度优先

```C++
template <typename T> template <typename VST>
void BinNode<T>::travLevel( VST & visit ) { //二叉树层次遍历
	Queue< BinNodePosi<T> > Q;Q.enqueue( this); //引入辅助队列，根节点入队
	while ( ! Q.empty() ) { //在队列再次变空之前，反复迭代
		BinNodePosi<T> x = Q.dequeue();visit( x->data ); //取出队首节点并随即访问
		if ( HasLChild( x ) ) Q.enqueue( x->lc); //左孩子入队
		if ( HasRChild( x ) ) Q.enqueue( x->rc); //右孩子入队
	}
}
```

## 完全（complete）二叉树

- complete： 叶节点仅限于最低两层底层叶子，均居于次底层叶子左侧（相对于LCA）除末节点的父亲，内部节点均有双子
- 想法：任何一个完全二叉树都唯一对应一个向量

## 二进制编码~PFC编码

- 句读难题：某字符的编码 恰是另一字符编码的前缀
- 解决方法：使用编码树：x的编码串由根到v(x)的通路（root path）确定向左、向右分别对应于0、1
- 问题：最优编码树是什么？
- 想法: $\forall v\in T_{opt}, deg(v)=0\ only\ if\ depth(v)\geq height(T_{opt})-1$﻿
    - 亦即，叶子只能出现在倒数两层以内——否则，通过节点交换即可…
    - 特别地，真完全树即是最优编码树
- 问题：字符频率不同，最优代码树又是什么？
- 想法：频率高/低的（超）字符，应尽可能放在高/低处
    - 文件长度正比于平均带权深$wald(T)=\Sigma_x rps(x)\times w(x)$﻿
- Huffman的贪心策略
    - 为每个字符创建一棵单节点的树，组成森林F按照出现频率，对所有树排序
    - while ( F中的树不止一棵)
        - 取出频率最小的两棵树：T1和T2
        - 将它们合并成一棵新树T，并令：
            - lc(T) = T1且rc(T) = T2
            - w( root(T) ) =w( root(T1) ) +w( root(T2) )
- 最优编码树有何特征？
    - 首先，每一内部节点都有两个孩子——节点度数均为偶数（0或2），即真二叉树
    - 不唯一性：对任一内部节点而言左、右子树互换之后wald不变(甚至有子树频率相等）
    - 层次性：出现频率最低的字符x和y，必在某棵最优编码树中处于最底层，且互为兄弟
        
        - 否则，任取一棵最优编码树，并在其最底层任取一对兄弟a和b 于是，a和x、b和y交换之后，wald绝不会增加
        
        [![](https://raw.githubusercontent.com/Tendourisu/images/master/image%206%203.png)](https://raw.githubusercontent.com/Tendourisu/images/master/image%206%203.png)
        

### Huffman Tree的实现

```C++
\#define N_CHAR (0x80-0x20) //仅以可打印字符为例
struct HuffChar{ //Huffman（超）字符
	char ch; unsigned int weight; //字符、频率
	HuffChar( char c = '^', unsigned int w = 0 ) : ch( c ), weight ( w ) {};
	bool operator<( HuffCharconst& hc) { return weight >hc.weight; } //比较器
	bool operator== ( HuffCharconst& hc) { return weight == hc.weight; } //判等器
};
```

- Huffman（子）树 `using HuffTree=BinTree< HuffChar>;`
- Huffman 森林 `using HuffForest=List< HuffTree>;`
- 更多高效的数据结构
    - `using HuffForest=PQ_List< HuffTree>; //基于列表的优先级队列`
    - `using HuffForest=PQ_ComplHeap< HuffTree>; //完全二叉堆`
    - `using HuffForest=PQ_LeftHeap< HuffTree>; //左式堆`
- 反复合并二叉树

```C++
HuffTree* generateTree( HuffForest* forest ) { //Huffman编码算法
	while ( 1 < forest->size() ) { //每迭代一步，森林中都会减少一棵树
		HuffTreeT1= delMax( forest ), T2= delMax( forest ); //取出权重最小（优先级最高）的两棵树
		HuffTreeS; //将其合并成一棵新树
		S.insert( HuffChar('^', T1.root()->data.weight+T2.root()->data.weight) );
		S.attach( T2, S.root() ); S.attach( S.root(), T1); //T2权重不小于T1
		forest->insertLast( S ); //再插回至森林
	} //森林中最终唯一所剩的那棵树，即Huffman编码树（且其层次遍历序列必然单调非增）
	return forest->first()->data; //故返回之
}
```

- 遍历森林（List），取出优先级最高（权重最小）的树

```C++
HuffTree delMax( HuffForest* forest ) {
	ListNodePosi<HuffTree> m = forest->first(); //从首节点出发，遍历所有节点
	for ( ListNodePosi<HuffTree*> p = m->succ; forest->valid( p ); p = p->succ)
		if ( m->data <p->data ) //不断更新（因已定义比较器，故能简捷）
			m = p; //优先级更高（权重更小）者
	return forest->remove( m ); //取出最高者并返回
} //O(n)，改用优先级队列后可做到O(logn)
```