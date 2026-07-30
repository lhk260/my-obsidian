# 伸展树/SplayTree：逐层伸展

- 局部性/Locality：
    - 刚被访问过的数据，极有可能很快地**再次**被访问
    - 下一将要访问的节点，极有可能就在刚被访问过节点的**附近**
- 利用这个特性，我们可以增加如下规则：
    - 节点v一旦被访问随即被推送至根
    - 具体来说，是自下而上，逐层旋转上去
    - 但是这样很容易构造出bad case

[![](https://raw.githubusercontent.com/Tendourisu/images/master/image%2013.png)](https://raw.githubusercontent.com/Tendourisu/images/master/image%2013.png)

> [!important]  
> Self-Adjusting Binary TreesD. D. SleatorR. E. TarjanJ. ACM, 32:652-686, 1985  

- 构思的精髓：向上追溯两层，而非一层
    - 反复考察祖孙三代：g = parent(p), p = parent(v), v  
          
        
    - 根据它们的相对位置，经两次旋转使v上升两层，成为（子）树根

[![](https://raw.githubusercontent.com/Tendourisu/images/master/image%201%207.png)](https://raw.githubusercontent.com/Tendourisu/images/master/image%201%207.png)

- 节点访问之后，对应路径的长度随即**折半**

[![](https://raw.githubusercontent.com/Tendourisu/images/master/image%202%208.png)](https://raw.githubusercontent.com/Tendourisu/images/master/image%202%208.png)

```C++
//接口
template <typename T> class Splay: public BST<T> { //由BST派生
	protected:
		BinNodePosi<T> splay( BinNodePosi<T> v ); //将v伸展至根
	public: //伸展树的查找也会引起整树的结构调整，故search()也需重写
		BinNodePosi<T> &search( const T & e ); //查找（重写）
		BinNodePosi<T> insert( const T & e ); //插入（重写）
		bool remove( const T & e ); //删除（重写）
};
```

```C++
template <typename T> BinNodePosi<T> Splay<T>::splay( BinNodePosi<T> v ) {
	BinNodePosi<T> p,g; //父亲、祖父
	while ( (p = v->parent) && (g = p->parent) ) {
		BinNodePosi<T>gg = g->parent; //great-grand parent
		switch ( ( IsRChild( p ) << 1 ) | IsLRhild(v ) ) {
			/* 视p、v的拐向分四种情况，相应地双层伸展*/
			case 0b00: /* ... zig-zig... */
								/*2*/g->attachLc( p->rc );
								/*1*/p->attachLc( v->rc );
								p->attachRc( g );
								v->attachRc( p );
								break;//
			case 0b01: /* ... zig-zag... */
								p->attachRc( v->lc ); g->attachLc( v->rc ); //zig-zag
								v->attachRc( g ); v->attachLc( p ); break;
			case 0b10: /* ... zag-zig... */
								p->attachLc( v->rc ); g->attachRc( v->lc );//zag-zig
								v->attachLc( g ); v->attachRc( p ); break;
			default : /* ... zag-zag... */ /*0b11*/
								g->attachRc( p->lc ); p->attachRc( v->lc );//zag-zag
								p->attachLc( g ); v->attachLc( p ); break;
		}
		/* 向上联接，更新高度*/
		if ( !gg) v->parent = NULL; //若原曾祖父*gg不存在，则*v现应为树根；否则*gg应以
		else ( g == gg->lc) ?gg->attachLc(v) : gg->attachRc(v); //v作为左或右孩子
		g->updateHeight(); p->updateHeight(); v->updateHeight();
	}
	if ( p = v->parent ) { 
		/* 若p果真是根，只需再额外单层伸展一次*/
		if ( IsLChild( v ) ) {
			p->attachLc( v->rc );
			v->attachRc( p );
		} else { p->attachRc( v->lc ); v->attachLc( p ); }
		p->updateHeight(); v->updateHeight();
	}v->parent = NULL; return v; //伸展完成，v抵达树根
}
```

```C++
//search

template <typename T> BinNodePosi<T> & Splay<T>::search( const T & e ) {
	//调用标准BST的内部接口定位目标节点
	BinNodePosi<T> p = BST<T>::search( e );
	//无论如何，最后被访问的节点都将伸展至根
	_root = p ? splay(p) : _hot ? splay(_hot) : NULL; //成功、失败、空树
	//总是返回根节点return _root;
}
```

```C++
//insert

template <typename T>BinNodePosi<T> Splay<T>::insert( const T & e ) {
	if ( !_root ) { _size = 1; return _root = new BinNode<T>( e ); }
	BinNodePosi<T> t = search( e ); if ( e == t->data ) return t;
	if ( t->data <e ) { //在右侧嫁接（rc或为空，lc== t必非空）
		_root = t->parent = new BinNode<T>( e, NULL, t, t->rc);
		t->rc= NULL;
	} else { //e <t->data，在左侧嫁接（lc或为空，rc == t必非空）
		t->parent = _root = new BinNode<T>( e, NULL, t->lc, t );
		t->lc= NULL;
	}
	_size++; t->updateHeightAbove(); return _root; //更新记录，插入成功
} //无论如何，返回时总有_root->data == e
```

```C++
// delete

template <typename T> bool Splay<T>::remove( const T & e ) {
	if ( !_root || ( e != search( e )->data ) ) return false;
	BinNodePosi<T> L = _root->lc, R = _root->rc; delete _root; //删
	if ( !R ) { if ( L ) L->parent = NULL; _root = L; //若R空，则L即是余树
	} else { //否则
		_root = R; R->parent = NULL;
		search( e ); //查找必败，但最小节点必伸展至根
		_root->attachLc(L); //可令其以L作为左子树
	}
	_size--; if ( _root ) _root->updateHeight(); return true; //更新记录，删除成功
}
```

# 伸展树/SplayTree：分摊分析

- 势能分摊法：去找一个状态下的一个**量**当作势能,其中这个量可以满足：
    - 在一次操作的耗时多时，势能减少
    - 在一次操作的耗时少时，势能增加
    - 这样总操作用时与势能相加可以刻画，从而可以用分摊法算出平均分摊时间
- 具体到SplayTree：
    
    - 考查对伸展树的m>>n次连续访问（不妨仅考查search()）
    - 任何一棵伸展树在任何时刻，都可以**假想地**视作具有势能：
    
    $\Phi(S)=\log(\Pi_{v\in S}size(v))=\sum_{v\in S}\log(size(v))=\sum_{v\in S}rank(v)=\sum_{v\in S}\log V$
    
- 直觉：越平衡/倾侧的树，势能越小/大
    - 单链：$\Phi(S)=\log n!=O(n\log n)$﻿
    - 满树：$\Phi(S)=\log \Pi^h_{d=0}(s^{h-d+1}-1)^{2^d}\\\leq\log \Pi^h_{d=0}(2^{h-d+1})^{2^d}\\=log \Pi^h_{d=0}2^{(h-d+1)2^d}\\=\sum^h_{d=0}(h-d+1)2^d\\=(h+1)\sum^h_{d=0}2^d-\sum^h_{d=0}d2^d\\=(h+1)(2{h+1}-1)-[(h-1)2^{h+1}+2]\\=2^{h+2}-h-3\\=O(n)$﻿

[![](https://raw.githubusercontent.com/Tendourisu/images/master/image%203%206.png)](https://raw.githubusercontent.com/Tendourisu/images/master/image%203%206.png)

[![](https://raw.githubusercontent.com/Tendourisu/images/master/image%204%206.png)](https://raw.githubusercontent.com/Tendourisu/images/master/image%204%206.png)

[![](https://raw.githubusercontent.com/Tendourisu/images/master/image%205%206.png)](https://raw.githubusercontent.com/Tendourisu/images/master/image%205%206.png)

[![](https://raw.githubusercontent.com/Tendourisu/images/master/image%206%206.png)](https://raw.githubusercontent.com/Tendourisu/images/master/image%206%206.png)

# 伸展树/SplayTree：综合评价

- 无需记录高度或平衡因子；编程实现简单——优于AVL树
- 分摊复杂度$O(\log n)$﻿——与AVL树相当
- 局部性强、缓存命中率极高时（即k<<n<<m）
    - 效率甚至可以更高——自适应的$O(\log k)$﻿
    - 任何**连续的m次**查找，仅需$O(m\log k+n\log n)$﻿时间
- 若**反复**地**顺序**访问任一子集，分摊成本仅为**常数**
- 不能杜绝**单次**最坏情况，不适用于对效率敏感的场合