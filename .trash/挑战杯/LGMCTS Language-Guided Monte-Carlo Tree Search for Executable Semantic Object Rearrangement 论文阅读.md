#paper #embodied-ai #MCTS 

>[!abstract]-  
>Abstract—We present LGMCTS, a framework that uniquely combines language guidance with geometrically informed sam-pling distributions to effectively rearrange objects according to geometric patterns dictated by natural language descriptions. LGMCTS uses Monte Carlo Tree Search (MCTS) to create feasible action plans that ensure executable semantic object rearrangement. We present a comprehensive comparison with leading approaches that use language to generate goal rear-rangements independently of actionable planning, including Structformer, StructDiffusion, and Code as policies. We also present a new benchmark, the Executable Language Guided Rearrangement (ELGR) Bench, containing tasks involving in-tricate geometry. With the ELGR bench, we show limitations of task and motion planning (TAMP) solutions that are purely based on Large Language Models (LLM) such as Code as Policies and Progprompt on such tasks. Our findings advo-cate for using LLMs to generate intermediary representations rather than direct action planning in geometrically complex rearrangement scenarios, aligning with perspectives from recent literature. Our code and supplementary materials are accessible at https://lgmcts.github.io/

>[!summary]-  
>We introduced LGMCTS, a new framework for tabletop, semantic object rearrangement tasks. LGMCTS stands out by accepting free-form natural language input, accommodating multiple pattern requirements, and jointly solving goal pose generation and action planning. Its main limitation is the extended execution time for complex scenes, highlighting the need for improved tree search efficiency. Future research should focus on adapting LGMCTS to more complex rearrangement scenarios.

## Intro

- 背景：在日常生活中，物体重排任务，例如，父母要求我们去“收拾厨房”，“收拾书桌”，“收拾茶几”等任务是十分常见的，在这些情景之中，涉及到根据自然语言来指令智能体去组织/排列各个物体。这个过程对人类来说很直观，但对机器人来说却是一个重大挑战。语义重新排列问题旨在赋予机器人根据语言描述重新组织场景的能力。这一挑战要求机器人通过自然语言理解任务，并有效解决相应的任务和运动规划（**TAMP** task and motion planning）问题。
- 过去的解决方案
	- 传统上(指在深度学习方法还没有流行之前)，解决这类问题需要将语义重排给形式化为符号表示，并且需要明确定义目标配置或约束，并使用正式规划器（例如 STRIPS[^1] 和 PDDL [^2]）或基于搜索的规划器（例如 MCTS [^3]）来设计一个可行的计划（类比于定制化的 FPGA 板）。尽管有效且高速，但这种方法需要专家级知识才能将问题抽象为正式的表示形式，从而限制了普通用户的可访问性。同时能够解决的任务范围受限制于预先定义的任务中，没有泛化能力。
	- > 不能泛化
	- 在深度学习方法流行后，最近的许多研究都试图直接从自然语言输入和 RGB-D 观察中解决这个问题 [^4][^5][^6]。一种方法使用多模态转换器，利用模拟生成的数据建立口头描述和对象位置之间的相关性。 StructDiffusion [^5] StructFormer[^6]等后续工作通过使用扩散模型来构建多模态解决方案。然而，这些方法的一个共同缺点是它们完全依赖于离线训练阶段，这使得它们仅适用于经过训练的对象类别和空间模式。而对于训练时没有的类似场景，它们不能做到很好的泛化。
	- >依赖预先训练的场景，泛化能力差。生成的重拍方案是不可执行的。
	- 随着大型语言模型（LLM）的出现，GPT [^7] 和 Llama [^8] 等模型在理解复杂场景和展示零样本规划能力方面表现出了极强的泛化能力。这促使研究人员探索利用 LLM来解决基于语言的 TAMP 问题 [^9][^10][^11]。然而，尽管对 LLM提出的计划的可行性进行了具体考虑，但据报道，与为该任务设计的正确实施的传统求解器制定的计划相比，这些计划在可执行性和完整性方面明显落后[^12]。这一观察结果自然促使研究人员寻求将 LLM 的用户友好性与 PDDL、STRIPS 或 MCTS 等传统 TAMP 算法的稳健性相结合的方法。
	- >LLM 直接由传统的TAMP 算法可解释的中间表示
	- LLM-GROP [^13] 在重排任务中遵循这种方法，利用 LLM 将用户任务从语言解析为成对的空间关系规范，然后调用基于采样的任务和运动规划器 [^14] 来生成计划。 LLM-GROP 的局限性在于它只能处理成对关系，因此无法执行复杂的重排任务。 AutoTAMP [^15] 使用 LLM 将自然语言翻译成形式表示，然后调用规划器来解决问题。 AutoTAMP 可以解决广泛的 TAMP 任务，但它不适用于动作空间不离散且可能很大的一般语义重排。
	- 我们提出了语言引导蒙特卡罗树搜索（LGMCTS），这是一种用于可执行语义对象重新排列的新技术。与其前身 AutoTAMP 和 LLMGROP 一样，LGMCTS 利用 LLM 生成中间表示，并使用规划器来制定可行的计划。 LGMCTS 的一个关键新颖之处是集成了空间关系表示的参数几何先验。 LGMCTS 有助于更细致地处理多个对象之间的复杂几何关系，解决需要超越简单的成对交互（例如直线或矩形配置）的组织的场景。此外，LGMCTS 采用整体方法，同时考虑任务规划（目标规范）和运动规划（执行顺序和中间步骤）。在规划过程中，障碍物重定位策略用于处理可能阻碍执行的障碍物。这种协调确保计划不仅在语义上一致，而且实际上可执行，从而平衡考虑目标实现和运营效率。为了评估 LGMCTS 的功效，我们引入了可执行语言引导重排 (ELGR) 基准测试，其中包含 1,600 多种不同的语言查询和机器人执行检查。我们的评估表明，LGMCTS 在 ELGR 基准上表现有效，特别是与代码即策略和 Progprompt 相比，在生成目标的可行性和语义一致性方面。 LGMCTS 在 Structformer 数据集上的目标生成方面也优于 Structformer 和 StructDiffusion。

![](https://raw.githubusercontent.com/Tendourisu/images/master/202501092012474.png)

[^1]: R. E. Fikes and N. J. Nilsson, “Strips: A new approach to the application of theorem proving to problem solving,” Artificial intelligence, vol. 2, no. 3-4, pp. 189–208, 1971.
[^2]: M. Fox and D. Long, “Pddl2. 1: An extension to pddl for expressing temporal planning domains,” Journal of artificial intelligence research, vol. 20, pp. 61–124, 2003.
[^3]: R. Coulom, “Efficient selectivity and backup operators in monte-carlo tree search,” in International conference on computers and games. Springer, 2006, pp. 72–83.
[^4]: M. Shridhar, L. Manuelli, and D. Fox, “Cliport: What and where pathways for robotic manipulation,” in 5th Annual Conference on Robot Learning, 2021.
[^5]: W. Liu, T. Hermans, S. Chernova, and C. Paxton, “Structdiffusion: Object-centric diffusion for semantic rearrangement of novel objects,” in Workshop on Language and Robotics at CoRL 2022, 2022.
[^6]: W. Liu, C. Paxton, T. Hermans, and D. Fox, “Structformer: Learning spatial structure for language-guided semantic rearrangement of novel objects,” in 2022 International Conference on Robotics and Automation (ICRA). IEEE, 2022, pp. 6322–6329.
[^7]: T. Brown, B. Mann, N. Ryder, M. Subbiah, J. D. Kaplan, P. Dhariwal, A. Neelakantan, P. Shyam, G. Sastry, A. Askell et al., “Language models are few-shot learners,” Advances in neural information processing systems, vol. 33, pp. 1877–1901, 2020.
[^8]: H. Touvron, L. Martin, K. Stone, P. Albert, A. Almahairi, Y. Babaei, N. Bashlykov, S. Batra, P. Bhargava, S. Bhosale et al., “Llama 2: Open foundation and fine-tuned chat models,” arXiv preprint arXiv: 2307.09288, 2023.
[^9]: W. Huang, P. Abbeel, D. Pathak, and I. Mordatch, “Language models as zero-shot planners: Extracting actionable knowledge for embodied agents,” in International Conference on Machine Learning. PMLR, 2022, pp. 9118–9147.
[^10]: A. Brohan, Y. Chebotar, C. Finn, K. Hausman, A. Herzog, D. Ho, J. Ibarz, A. Irpan, E. Jang, R. Julian et al., “Do as i can, not as i say: Grounding language in robotic affordances,” in Conference on Robot Learning. PMLR, 2023, pp. 287–318.
[^11]: J. Liang, W. Huang, F. Xia, P. Xu, K. Hausman, B. Ichter, P. Florence, and A. Zeng, “Code as policies: Language model programs for embodied control,” in 2023 IEEE International Conference on Robotics and Automation (ICRA). IEEE, 2023, pp. 9493–9500.
[^12]: K. Valmeekam, A. Olmo, S. Sreedharan, and S. Kambhampati, “Large language models still can’t plan (a benchmark for LLMs on planning and reasoning about change),” in NeurIPS 2022 Foundation Models for Decision Making Workshop, 2022. [Online]. Available: https://openreview.net/forum?id=wUU-7XTL5XO
[^13]: Y. Ding, X. Zhang, C. Paxton, and S. Zhang, “Task and motion planning with large language models for object rearrangement,” arXiv preprint arXiv: 2303.06247, 2023.  
[^14]: X. Zhang, Y. Zhu, Y. Ding, Y. Zhu, P. Stone, and S. Zhang, “Visually grounded task and motion planning for mobile manipulation,” in 2022 International Conference on Robotics and Automation (ICRA). IEEE, 2022, pp. 1925–1931.
[^15]: Y. Chen, J. Arkin, Y. Zhang, N. Roy, and C. Fan, “Autotamp: Autoregressive task and motion planning with llms as translators and checkers,” arXiv preprint arXiv:2306.06531, 2023.
[^16]: S. Tellex, T. Kollar, S. Dickerson, M. Walter, A. Banerjee, S. Teller, and N. Roy, “Understanding natural language commands for robotic navigation and mobile manipulation,” in Proceedings of the AAAI conference on artificial intelligence, vol. 25, no. 1, 2011, pp. 15071514.
[^17]: T. M. Howard, S. Tellex, and N. Roy, “A natural language planner interface for mobile manipulators,” in 2014 IEEE International Conference on Robotics and Automation (ICRA). IEEE, 2014, pp. 66526659.
