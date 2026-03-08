#algorithm  
[[LGMCTS Language-Guided Monte-Carlo Tree Search for Executable Semantic Object Rearrangement 论文阅读|基于论文LGMCTS的探索]]

### 概述

蒙特卡洛树搜索的目的就是选择最优决策。结合了随机模拟的通用性和树搜索的准确性。理论上，任何可以被用{State，Action}所定义且能通过模拟预测结果的问题，都可以用MCTS来解决。

MCTS的具体实现步骤如下图所示，主要包含4部分。  
![](https://raw.githubusercontent.com/Tendourisu/images/master/202501091414796.png)

1. **选择 (Selection)**  
    从根节点R开始，递归地选择最优子节点（通过UCB，后续**节点选择**展开讲解），直到到达叶子节点L。
2. **探索 (Expansion)**  
    如果L不是终止节点（即它没有结束游戏），则创建一或多个子节点并从中随机选择一个子节点C进行探索。
3. **模拟/仿真 (Simulation、Rollout)**  
    从C运行一个模拟的rollout，直到获得一个结果。（后续**节点模拟**会举例子展开讲解如何模拟）
4. **反传 (Backpropagation)**  
    用模拟结果（终止节点的代价或游戏的终局分数）更新当前的移动序列，更新模拟路径中节点的奖励均值和被访问次数。注意，反传的过程中，每个节点必须包含两个重要的信息：基于模拟结果的估计值和它被访问的次数。

#### 节点选择

我们在树的递归选择最优子节点时，通常会选择预期收益最大的子节点。因此，我们可以利用上限置信区间算法（Upper Confidence Bounds, UCB）来选择子节点。  
$UCB_j = \overline{X}_j + C \sqrt{\frac{2 \ln N_C}{N_j}}$  
其中j表示第j个子节点， $\overline{X}_{}j$ 表示第j个子节点的预期收益，C为固定常数， $N_{C}$ 为截至目前其父节点被访问到的总次数， $N_j$ 为第j个子节点被访问的次数。  

可以看到UCB公式在利用已知奖励进行开发的同时，鼓励对未被充分探索的节点进行探索。由于预期收益的估计值基于随机模拟，因此节点必须被多次访问后，这些估计值才变得可靠；MCTS估计值在搜索的初期通常不可靠，但在足够的时间和无限的时间下，会趋向于更可靠的估计值。

在后续的研究中，Kocsis and Szepervari (2006)将UCB扩展到minimax 树搜索中，称之为Upper Confidence Bounds for Trees (UCT)。 UCT=MCTS + UCB。

### 节点模拟

从子节点C开始，运行一个模拟的输出，直到游戏结束。举个例子：例如说 五子棋，给你一个下到一半的残局（子节点C），让你和AI下十次（模拟十次），如果你赢了九次（获胜 9次），那么这个残局（子节点C）的奖励得分就会很高，反之则比较低。

更详细的示例在[蒙特卡洛树搜索 MCTS 入门_python class-CSDN博客](https://link.zhihu.com/?target=https%3A//blog.csdn.net/qq_41033011/article/details/109034887)的Blog中有描述。

```python
# 伪代码
class Node:
    def __init__(self, state, parent=None):
        self.state = state  # 当前棋盘状态
        self.parent = parent  # 父节点
        self.children = []  # 子节点
        self.visits = 0  # 访问次数
        self.value = 0  # 平均奖励值

def mcts(root_state, max_iterations):
    root = Node(root_state)  # 创建根节点

    for _ in range(max_iterations):
        # 选择阶段
        node = root
        while node.children:  # 直到叶子节点
            node = select_child(node)

        # 扩展阶段
        if not is_terminal(node.state):
            expand(node)

        # 模拟阶段
        result = simulate(node.state)

        # 回溯阶段
        backpropagate(node, result)

    # 选择访问次数最多的动作
    best_child = max(root.children, key=lambda c: c.visits)
    return best_child.state

def select_child(node):
    # 使用 UCB1 选择子节点
    return max(node.children, key=lambda c: c.value + c * sqrt(2 * log(node.visits) / c.visits))

def expand(node):
    # 扩展一个未尝试过的合法动作
    legal_actions = get_legal_actions(node.state)
    for action in legal_actions:
        new_state = apply_action(node.state, action)
        node.children.append(Node(new_state, node))

def simulate(state):
    # 随机模拟直到游戏结束
    while not is_terminal(state):
        action = random.choice(get_legal_actions(state))
        state = apply_action(state, action)
    return get_result(state)  # 返回模拟结果（1 或 0）

def backpropagate(node, result):
    # 回溯更新统计信息
    while node:
        node.visits += 1
        node.value += (result - node.value) / node.visits
        node = node.parent
```

[Site Unreachable](https://zhuanlan.zhihu.com/p/9644482549)
