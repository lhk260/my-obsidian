## equals

```Java
public boolean equals(Object other) {
        if (this == other) {
            return true;
        }
        if (other == null) {
            return false;
        }
        if (other.getClass() != this.getClass()) {
            return false;
        }
        ArraySet<T> o = (ArraySet<T>) other;
        if (o.size() != this.size()) {
            return false;
        }
        for (T item : this) {
            if (!o.contains(item)) {
                return false;
            }
        }
        return true;
    }
```

## QKV

```Python
 import numpy as np

    def softmax(x):
        return np.exp(x) / np.sum(np.exp(x), axis=-1, keepdims=True)

    # 输入序列 (batch_size, seq_length, d_model)
    X = np.random.rand(2, 5, 4)

    # 可训练的权重矩阵
    W_Q = np.random.rand(4, 4)
    W_K = np.random.rand(4, 4)
    W_V = np.random.rand(4, 4)

    # 计算 Q, K, V
    Q = np.dot(X, W_Q)
    K = np.dot(X, W_K)
    V = np.dot(X, W_V)

    # 计算注意力得分
    scores = np.matmul(Q, K.transpose(0, 2, 1)) / np.sqrt(K.shape[-1])

    # 检查 scores 的形状
    print("scores 形状:", scores.shape)

    # 计算注意力权重
    attention_weights = softmax(scores)

    # 加权求和值
    output = np.matmul(attention_weights, V)

    print("输出结果:\n", output, output.shape)
```

## **Simplification Summary**

- Only consider the worst case.
- Pick a representative operation (aka: cost model)
- Ignore lower order terms
- Ignore multiplicative constants.

## DisjiontSets

```Java
//DisjointSets
//QuickFind
public class QuickFindDS implements DisjointSets {

    private int[] id;

    /* Θ(N) */
    public QuickFindDS(int N){
        id = new int[N];
        for (int i = 0; i < N; i++){
            id[i] = i;
        }
    }

    /* need to iterate through the array => Θ(N) */
    public void connect(int p, int q){
        int pid = id[p];
        int qid = id[q];
        for (int i = 0; i < id.length; i++){
            if (id[i] == pid){
                id[i] = qid;
            }
        }
    }

    /* Θ(1) */
    public boolean isConnected(int p, int q){
        return (id[p] == id[q]);
    }
}
//QuickUnion
public class QuickUnionDS implements DisjointSets {
    private int[] parent;

    public QuickUnionDS(int num) {
        parent = new int[num];
        for (int i = 0; i < num; i++) {
            parent[i] = i;
        }
    }

    private int find(int p) {
        while (parent[p] >= 0) {
            p = parent[p];
        }
        return p;
    }

    @Override
    public void connect(int p, int q) {
        int i = find(p);
        int j= find(q);
        parent[i] = j;
    }

    @Override
    public boolean isConnected(int p, int q) {
        return find(p) == find(q);
    }
}
//WeightedQuickUnion
public class WeightedQuickUnionUF {
    private int[] parent;   // parent[i] = parent of i
    private int[] size;     // size[i] = number of elements in subtree rooted at i
    private int count;      // number of components

    /**
     * Initializes an empty union-find data structure with
     * {@code n} elements {@code 0} through {@code n-1}.
     * Initially, each element is in its own set.
     *
     * @param  n the number of elements
     * @throws IllegalArgumentException if {@code n < 0}
     */
    public WeightedQuickUnionUF(int n) {
        count = n;
        parent = new int[n];
        size = new int[n];
        for (int i = 0; i < n; i++) {
            parent[i] = i;
            size[i] = 1;
        }
    }

    /**
     * Returns the number of sets.
     *
     * @return the number of sets (between {@code 1} and {@code n})
     */
    public int count() {
        return count;
    }

    /**
     * Returns the canonical element of the set containing element {@code p}.
     *
     * @param  p an element
     * @return the canonical element of the set containing {@code p}
     * @throws IllegalArgumentException unless {@code 0 <= p < n}
     */
    public int find(int p) {
        validate(p);
        while (p != parent[p])
            p = parent[p];
        return p;
    }

    /**
     * Returns true if the two elements are in the same set.
     *
     * @param  p one element
     * @param  q the other element
     * @return {@code true} if {@code p} and {@code q} are in the same set;
     *         {@code false} otherwise
     * @throws IllegalArgumentException unless
     *         both {@code 0 <= p < n} and {@code 0 <= q < n}
     * @deprecated Replace with two calls to {@link \#find(int)}.
     */
    @Deprecated
    public boolean connected(int p, int q) {
        return find(p) == find(q);
    }

    // validate that p is a valid index
    private void validate(int p) {
        int n = parent.length;
        if (p < 0 || p >= n) {
            throw new IllegalArgumentException("index " + p + " is not between 0 and " + (n-1));
        }
    }

    /**
     * Merges the set containing element {@code p} with the set
     * containing element {@code q}.
     *
     * @param  p one element
     * @param  q the other element
     * @throws IllegalArgumentException unless
     *         both {@code 0 <= p < n} and {@code 0 <= q < n}
     */
    public void union(int p, int q) {
        int rootP = find(p);
        int rootQ = find(q);
        if (rootP == rootQ) return;

        // make smaller root point to larger one
        if (size[rootP] < size[rootQ]) {
            parent[rootP] = rootQ;
            size[rootQ] += size[rootP];
        }
        else {
            parent[rootQ] = rootP;
            size[rootP] += size[rootQ];
        }
        count--;
    }


    /**
     * Reads an integer {@code n} and a sequence of pairs of integers
     * (between {@code 0} and {@code n-1}) from standard input, where each integer
     * in the pair represents some element;
     * if the elements are in different sets, merge the two sets
     * and print the pair to standard output.
     *
     * @param args the command-line arguments
     */
    public static void main(String[] args) {
        int n = StdIn.readInt();
        WeightedQuickUnionUF uf = new WeightedQuickUnionUF(n);
        while (!StdIn.isEmpty()) {
            int p = StdIn.readInt();
            int q = StdIn.readInt();
            if (uf.find(p) == uf.find(q)) continue;
            uf.union(p, q);
            StdOut.println(p + " " + q);
        }
        StdOut.println(uf.count() + " components");
    }

}


//WeightedQuickUnionWithPathCompression
public class QuickUnionPathCompressionUF {
    private int[] id;    // id[i] = parent of i
    private int count;   // number of components

    /**
     * Initializes an empty union-find data structure with
     * {@code n} elements {@code 0} through {@code n-1}.
     * Initially, each element is in its own set.
     *
     * @param  n the number of elements
     * @throws IllegalArgumentException if {@code n < 0}
     */
    public QuickUnionPathCompressionUF(int n) {
        count = n;
        id = new int[n];
        for (int i = 0; i < n; i++) {
            id[i] = i;
        }
    }

    /**
     * Returns the number of sets.
     *
     * @return the number of sets (between {@code 1} and {@code n})
     */
    public int count() {
        return count;
    }

    /**
     * Returns the canonical element of the set containing element {@code p}.
     *
     * @param  p an element
     * @return the canonical element of the set containing {@code p}
     * @throws IllegalArgumentException unless {@code 0 <= p < n}
     */
    public int find(int p) {
        int root = p;
        while (root != id[root])
            root = id[root];
        while (p != root) {
            int newp = id[p];
            id[p] = root;
            p = newp;
        }
        return root;
    }

    /**
     * Returns true if the two elements are in the same set.
     *
     * @param  p one element
     * @param  q the other element
     * @return {@code true} if {@code p} and {@code q} are in the same set;
     *         {@code false} otherwise
     * @throws IllegalArgumentException unless
     *         both {@code 0 <= p < n} and {@code 0 <= q < n}
     * @deprecated Replace with two calls to {@link \#find(int)}.
     */
    @Deprecated
    public boolean connected(int p, int q) {
        return find(p) == find(q);
    }

    /**
     * Merges the set containing element {@code p} with the set
     * containing element {@code q}.
     *
     * @param  p one element
     * @param  q the other element
     * @throws IllegalArgumentException unless
     *         both {@code 0 <= p < n} and {@code 0 <= q < n}
     */
    public void union(int p, int q) {
        int rootP = find(p);
        int rootQ = find(q);
        if (rootP == rootQ) return;
        id[rootP] = rootQ;
        count--;
    }

    /**
     * Reads an integer {@code n} and a sequence of pairs of integers
     * (between {@code 0} and {@code n-1}) from standard input, where each integer
     * in the pair represents some element;
     * if the elements are in different sets, merge the two sets
     * and print the pair to standard output.
     *
     * @param args the command-line arguments
     */
    public static void main(String[] args) {
        int n = StdIn.readInt();
        QuickUnionPathCompressionUF uf = new QuickUnionPathCompressionUF(n);
        while (!StdIn.isEmpty()) {
            int p = StdIn.readInt();
            int q = StdIn.readInt();
            if (uf.find(p) == uf.find(q)) continue;
            uf.union(p, q);
            StdOut.println(p + " " + q);
        }
        StdOut.println(uf.count() + " components");
    }

}
```

## BinarySearchTree

```Java
private class BST<Key> {
    private Key key;
    private BST left;
    private BST right;

    public BST(Key key, BST left, BST Right) {
        this.key = key;
        this.left = left;
        this.right = right;
    }

    public BST(Key key) {
        this.key = key;
    }
}

static BST find(BST T, Key sk) {
   if (T == null)
      return null;
   if (sk.equals(T.key))
      return T;
   else if (sk ≺ T.key)
      return find(T.left, sk);
   else
      return find(T.right, sk);
}

static BST insert(BST T, Key ik) {
  if (T == null)
    return new BST(ik);
  if (ik ≺ T.key)
    T.left = insert(T.left, ik);
  else if (ik ≻ T.key)
    T.right = insert(T.right, ik);
  return T;
}
//HibbardDelete
static BST delete(BST T, Key dk) {
    if (T == null) return null; // 没有找到要删除的节点，返回null

    if (dk.equals(T.key)) {
        // 情况 1：节点没有子节点
        if (T.left == null && T.right == null) {
            return null;
        }
        // 情况 2：节点只有一个子节点
        if (T.left == null) return T.right;
        if (T.right == null) return T.left;

        // 情况 3：节点有两个子节点
        BST minNode = findMin(T.right);  // 找到右子树的最小节点
        T.key = minNode.key;              // 用右子树的最小节点的键值替换当前节点的键值
        T.right = delete(T.right, minNode.key); // 删除右子树中的最小节点
    } else if (dk ≺ T.key) {
        T.left = delete(T.left, dk);  // 在左子树中递归删除
    } else {
        T.right = delete(T.right, dk);  // 在右子树中递归删除
    }

    return T;
}

// 辅助方法：找到右子树的最小节点
private static BST findMin(BST T) {
    while (T.left != null) {
        T = T.left;
    }
    return T;
}
```

## BSTmap

```Java
package bstmap;

import java.util.Iterator;
import java.util.Set;

public class BSTMap<K extends Comparable<K>, V> implements Map61B<K, V> {

    private Node root;

    private class Node {
        private K key;
        private V value;
        private Node left;
        private Node right;

        public Node(K key, V value) {
            this.key = key;
            this.value = value;
        }
    }

    public BSTMap() {
        root = null;
    }

    @Override
    public void clear() {
        root = null;
    }

    @Override
    public boolean containsKey(K key) {
        return containsKey(root, key);
    }

    public boolean containsKey(Node node, K key) {
        if (node == null) {
            return false;
        }
        int cmp = key.compareTo(node.key);
        if (cmp < 0) {
            return containsKey(node.left, key);
        } else if (cmp > 0) {
            return containsKey(node.right, key);
        } else {
            return true;
        }
    }

    @Override
    public V get(K key) {
        return get(root, key);
    }

    private V get(Node node, K key) {
        if (node == null) {
            return null;
        }
        int cmp = key.compareTo(node.key);
        if (cmp < 0) {
            return get(node.left, key);
        } else if (cmp > 0) {
            return get(node.right, key);
        } else {
            return node.value;
        }
    }

    @Override
    public int size() {
        return size(root);
    }

    private int size(Node node) {
        if (node == null) {
            return 0;
        }
        return 1 + size(node.left) + size(node.right);
    }

    @Override
    public void put(K key, V value) {
        root = put(root, key, value);
    }

    private Node put(Node node, K key, V value) {
        if (node == null) {
            return new Node(key, value);
        }
        int cmp = ((Comparable<K>) key).compareTo(node.key);
        if (cmp < 0) {
            node.left = put(node.left, key, value);
        } else if (cmp > 0) {
            node.right = put(node.right, key, value);
        } else {
            node.value = value;
        }
        return node;
    }

    @Override
    public Set<K> keySet() {
        throw new UnsupportedOperationException();
    }

    @Override
    public V remove(K key) {
        throw new UnsupportedOperationException();
    }

    @Override
    public V remove(K key, V value) {
        throw new UnsupportedOperationException();
    }

    @Override
    public Iterator<K> iterator() {
        throw new UnsupportedOperationException();
    }
}
```

## Serializable

```Java
"""
在序列化中，“序列”这个词指的是将数据结构或对象状态转换为一种可以按顺序访问的形式，通常是字节流。这种形式便于存储到文件、数据库或者通过网络传输。

详细解释：
线性表示：序列化过程中，对象的状态被转换成一个字节序列（即一串有序的字节）。这个字节序列是按照一定的顺序组织的，因此称为“序列”。

可读性与可写性：

可读性：通过这种方式，可以将复杂的数据结构以一种简单且连续的方式进行保存和传输。
可写性：接收方可以通过反序列化过程读取这些字节，并根据原始对象的结构重新构建出相应的对象实例。
格式标准化：在Java中，ObjectOutputStream使用特定的协议来编码对象的数据。这包括类信息、字段值等。这样确保了不同系统间能够正确地识别和处理这些数据。

跨平台兼容性：由于数据是以标准的二进制格式存储的，所以它不依赖于任何特定平台的细节。这意味着可以在不同的操作系统和硬件架构之间轻松共享和迁移数据。

总结来说，在计算机科学中，“序列”通常指一个元素集合的线性排列方式。在序列化的上下文中，则特指将复杂数据结构转化为易于管理和传输的线性字节流的过程。Model m = ....;
"""

File outFile = new File(saveFileName);
try {
    ObjectOutputStream out =
        new ObjectOutputStream(new FileOutputStream(outFile));
    out.writeObject(m);
    out.close();
} catch (IOException excp) {
    ...
}
Model m;
File inFile = new File(saveFileName);
try {
    ObjectInputStream inp =
        new ObjectInputStream(new FileInputStream(inFile));
    m = (Model) inp.readObject();
    inp.close();
} catch (IOException | ClassNotFoundException excp) {
    ...
    m = null;
}
```

## LeftLeanRedBlack

```Java
enum class Color {
    RED,
    BLACK
}

class Node {
    private Key key;
    private Value val;
    private Node left;
    private Node right;
    private Color color;
    private int height;

    public Node(Key key, Value val, Color color) {
        this.key = key;
        this.val = val;
        this.color = color;
        this.height = 1; // 新节点的初始高度
    }

    // getters and setters for key, val, left, right, color, and height
}

private Node put(Node h, Key key, Value val) {
	if (h == null) { return new Node(key, val, RED); }
 
	int cmp = key.compareTo(h.key);
    if (cmp < 0)      { h.left  = put(h.left,  key, val); }
    else if (cmp > 0) { h.right = put(h.right, key, val); }
    else              { h.val   = val;                    }
 
	if (isRed(h.right) && !isRed(h.left))      { h = rotateLeft(h);  }
	if (isRed(h.left)  &&  isRed(h.left.left)) { h = rotateRight(h); }
	if (isRed(h.left)  &&  isRed(h.right))     { flipColors(h);      } 
 
	return h;
}

private boolean isRed(Node node) {
    return node != null && node.color == RED;
}

private boolean isRed(Node node) {
    return node != null && node.color == RED;
}

private Node rotateLeft(Node h) {
    Node x = h.right;
    h.right = x.left;
    x.left = h;
    h.height = Math.max(height(h.left), height(h.right)) + 1;
    x.height = Math.max(height(x.left), height(x.right)) + 1;
    return x;
}

private Node rotateRight(Node h) {
    Node x = h.left;
    h.left = x.right;
    x.right = h;
    h.height = Math.max(height(h.left), height(h.right)) + 1;
    x.height = Math.max(height(x.left), height(x.right)) + 1;
    return x;
}

private void flipColors(Node h) {
    h.color = !h.color;
    h.left.color = !h.left.color;
    h.right.color = !h.right.color;
}
```

## SeparateChainingHashTable

```Java
public class SeparateChainingHashST<Key, Value> {
    private static final int INIT_CAPACITY = 4;

    private int n;                                // number of key-value pairs
    private int m;                                // hash table size
    private SequentialSearchST<Key, Value>[] st;  // array of linked-list symbol tables


    /**
     * Initializes an empty symbol table.
     */
    public SeparateChainingHashST() {
        this(INIT_CAPACITY);
    }

    /**
     * Initializes an empty symbol table with {@code m} chains.
     * @param m the initial number of chains
     */
    public SeparateChainingHashST(int m) {
        this.m = m;
        st = (SequentialSearchST<Key, Value>[]) new SequentialSearchST[m];
        for (int i = 0; i < m; i++)
            st[i] = new SequentialSearchST<Key, Value>();
    }

    // resize the hash table to have the given number of chains,
    // rehashing all of the keys
    private void resize(int chains) {
        SeparateChainingHashST<Key, Value> temp = new SeparateChainingHashST<Key, Value>(chains);
        for (int i = 0; i < m; i++) {
            for (Key key : st[i].keys()) {
                temp.put(key, st[i].get(key));
            }
        }
        this.m  = temp.m;
        this.n  = temp.n;
        this.st = temp.st;
    }

    // hash function for keys - returns value between 0 and m-1
    private int hashTextbook(Key key) {
        return (key.hashCode() & 0x7fffffff) % m;
    }

    // hash function for keys - returns value between 0 and m-1 (assumes m is a power of 2)
    // (from Java 7 implementation, protects against poor quality hashCode() implementations)
    private int hash(Key key) {
        int h = key.hashCode();
        h ^= (h >>> 20) ^ (h >>> 12) ^ (h >>> 7) ^ (h >>> 4);
        return h & (m-1);
    }

    /**
     * Returns the number of key-value pairs in this symbol table.
     *
     * @return the number of key-value pairs in this symbol table
     */
    public int size() {
        return n;
    }

    /**
     * Returns true if this symbol table is empty.
     *
     * @return {@code true} if this symbol table is empty;
     *         {@code false} otherwise
     */
    public boolean isEmpty() {
        return size() == 0;
    }

    /**
     * Returns true if this symbol table contains the specified key.
     *
     * @param  key the key
     * @return {@code true} if this symbol table contains {@code key};
     *         {@code false} otherwise
     * @throws IllegalArgumentException if {@code key} is {@code null}
     */
    public boolean contains(Key key) {
        if (key == null) throw new IllegalArgumentException("argument to contains() is null");
        return get(key) != null;
    }

    /**
     * Returns the value associated with the specified key in this symbol table.
     *
     * @param  key the key
     * @return the value associated with {@code key} in the symbol table;
     *         {@code null} if no such value
     * @throws IllegalArgumentException if {@code key} is {@code null}
     */
    public Value get(Key key) {
        if (key == null) throw new IllegalArgumentException("argument to get() is null");
        int i = hash(key);
        return st[i].get(key);
    }

    /**
     * Inserts the specified key-value pair into the symbol table, overwriting the old
     * value with the new value if the symbol table already contains the specified key.
     * Deletes the specified key (and its associated value) from this symbol table
     * if the specified value is {@code null}.
     *
     * @param  key the key
     * @param  val the value
     * @throws IllegalArgumentException if {@code key} is {@code null}
     */
    public void put(Key key, Value val) {
        if (key == null) throw new IllegalArgumentException("first argument to put() is null");
        if (val == null) {
            delete(key);
            return;
        }

        // double table size if average length of list >= 10
        if (n >= 10*m) resize(2*m);

        int i = hash(key);
        if (!st[i].contains(key)) n++;
        st[i].put(key, val);
    }

    /**
     * Removes the specified key and its associated value from this symbol table
     * (if the key is in this symbol table).
     *
     * @param  key the key
     * @throws IllegalArgumentException if {@code key} is {@code null}
     */
    public void delete(Key key) {
        if (key == null) throw new IllegalArgumentException("argument to delete() is null");

        int i = hash(key);
        if (st[i].contains(key)) n--;
        st[i].delete(key);

        // halve table size if average length of list <= 2
        if (m > INIT_CAPACITY && n <= 2*m) resize(m/2);
    }

    // return keys in symbol table as an Iterable
    public Iterable<Key> keys() {
        Queue<Key> queue = new Queue<Key>();
        for (int i = 0; i < m; i++) {
            for (Key key : st[i].keys())
                queue.enqueue(key);
        }
        return queue;
    }


    /**
     * Unit tests the {@code SeparateChainingHashST} data type.
     *
     * @param args the command-line arguments
     */
    public static void main(String[] args) {
        SeparateChainingHashST<String, Integer> st = new SeparateChainingHashST<String, Integer>();
        for (int i = 0; !StdIn.isEmpty(); i++) {
            String key = StdIn.readString();
            st.put(key, i);
        }

        // print keys
        for (String s : st.keys())
            StdOut.println(s + " " + st.get(s));

    }

}
```

## MinPriorityQueue

```Java
/** (Min) Priority Queue: Allowing tracking and removal of 
  * the smallest item in a priority queue. */
public interface MinPQ<Item> {
    /** Adds the item to the priority queue. */
    public void add(Item x);
    /** Returns the smallest item in the priority queue. */
    public Item getSmallest();
    /** Removes the smallest item from the priority queue. */
    public Item removeSmallest();
    /** Returns the size of the priority queue. */
    public int size();
}

public void swim(int k) {
    if (keys[parent(k)] ≻ keys[k]) {
       swap(k, parent(k));
       swim(parent(k));              
    }
}

public int parent(int k) {
    return (k - 1) / 2;
}
```

```Java
public List<String> unharmoniousTexts(Sniffer sniffer, int M) {
    ArrayList<String>allMessages = new ArrayList<String>();
    for (Timer timer = new Timer(); timer.hours() < 24; ) {
        allMessages.add(sniffer.getNextMessage());
    }

    Comparator<String> cmptr = new HarmoniousnessComparator();
    Collections.sort(allMessages, cmptr, Collections.reverseOrder());

    return allMessages.sublist(0, M);
```

```Java
public class MinHeapPQ<Item extends Comparable<Item>> implements MinPQ<Item> {
    private Item[] keys;
    private int n;

    @SuppressWarnings("unchecked")
    public MinHeapPQ(int capacity) {
        keys = (Item[]) new Comparable[capacity];
        n = 0;
    }

    @Override
    public void add(Item x) {
        keys[n] = x;
        swim(n);
        n++;
    }

    @Override
    public Item getSmallest() {
        if (n == 0) {
            throw new IllegalStateException("Priority queue is empty");
        }
        return keys[0];
    }

    @Override
    public Item removeSmallest() {
        if (n == 0) {
            throw new IllegalStateException("Priority queue is empty");
        }
        Item min = keys[0];
        swap(0, n - 1);
        n--;
        sink(0);
        keys[n] = null; // Avoid loitering
        return min;
    }

    @Override
    public int size() {
        return n;
    }

    private void swim(int k) {
        while (k > 0 && keys[parent(k)].compareTo(keys[k]) > 0) {
            swap(k, parent(k));
            k = parent(k);
        }
    }

    private void sink(int k) {
        while (leftChild(k) < n) {
            int j = leftChild(k);
            if (j < n - 1 && keys[j].compareTo(keys[j + 1]) > 0) {
                j++;
            }
            if (keys[k].compareTo(keys[j]) <= 0) {
                break;
            }
            swap(k, j);
            k = j;
        }
    }

    private int parent(int k) {
        return (k - 1) / 2;
    }

    private int leftChild(int k) {
        return 2 * k + 1;
    }

    private int rightChild(int k) {
        return 2 * k + 2;
    }

    private void swap(int i, int j) {
        Item temp = keys[i];
        keys[i] = keys[j];
        keys[j] = temp;
    }
```
