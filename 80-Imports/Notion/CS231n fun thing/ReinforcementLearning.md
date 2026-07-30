## Markov Decision Processe

$S$﻿: set of possible states

$A$﻿: set of possible actions

$R$﻿: distribution of reward given (state, action) pair

$P$﻿: transition probability i.e. distribution over next state given (state, action) pair

$\gamma$﻿: discount factor

- 最开始，从$p(s_0)$﻿中随机采样一个$s_0$﻿作为初始环境状态
- 然后，从t=0开始直到任务结束：
    - 智能体选择一个行动$a_t$﻿
    - 环境根据当前的状态与行动得到奖励$r_t\char'176 R(.|s_t,a_t)$﻿
    - 环境根据当前的状态与行动采样下一个状态$s_{t+1}\char'176 P(.|s_t,a_t)$﻿
    - 智能体接受奖励$r_t$﻿与新的状态$s_{t+1}$﻿
- 策略$\pi$﻿:一个从S到A的函数，决定在当前状态之下智能体要采取什么action
- 目标：找到策略$\pi$﻿,使得最大化配权重的奖励之和$\Sigma_{t\geq 0}\gamma^tr_t$﻿
- Formally:

$\pi^*=\arg \max_{\pi}\mathbb{E}[\sum_{t\geq p}\gamma^tr_t|\pi] ~\text{with}~s_0\char'176p(s_0),a_t\char'176\pi(.|s_t),s_{t+1}\char'176p(.|s_t,a_t)$

刻画一个状态有多好：

$V^{\pi}(s)=\mathbb{E}[\sum_{t\geq p}\gamma^tr_t|s_0=s,\pi] $

刻画一个状态-行动对有多好：

$Q^{\pi}(s,a)=\mathbb{E}[\sum_{t\geq p}\gamma^tr_t|s_0=s,a_0=a,\pi] $

[![](https://raw.githubusercontent.com/Tendourisu/images/master/image%2017.png)](https://raw.githubusercontent.com/Tendourisu/images/master/image%2017.png)

## Q-Learning

- 使用函数逼近器去逼近action-value函数

[![](https://raw.githubusercontent.com/Tendourisu/images/master/image%201%2010.png)](https://raw.githubusercontent.com/Tendourisu/images/master/image%201%2010.png)

## Policy Gradients