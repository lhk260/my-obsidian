![[learn from error.png]]
![[learn from error-1.png]]
## 1. 概述
1. 三层反思：
	1.  **行动前的内部反思**（reflection-in-action）：先脑内模拟多个候选动作，再选最优；
	2. **行动后的外部反思**（reflection-on-action）：执行后根据真实结果复盘；
	3. **带 hindsight 的追溯反思**（retrospective reflection）：过一段时间回头看，修正对早先动作的评价，再用这些修正后的评价做测试时训练
## 2. 算法流程
![[learn from error-2.png]]
1. ![[learn from error-3.png]]
	由这四个变量给出一个 prompt： $$
x_{action}  = (\tau,o_{t} , a_{t-1},f^{t-1}_{e})

$$![[learn from error-4.png]]
	然后根据 prompt  x 生成动作分布，并采样 N 个动作（语言描述的动作）
2. ![[learn from error-6.png]]
3. ![[learn from error-7.png]]
4. ![[learn from error-8.png]]

5. ![[learn from error-9.png]]当 working memory 满了 KKK 步，或者到了关键 milestone，就触发一次 reflection-on-action，然后进行两段 test-time training：

6. 
    
7. **训练 action LLM πθ\pi_\thetaπθ​**：policy gradient / REINFORCE
    

动作模型更新公式是：
$θ(s+1)=θ(s)−ηθ∇θ∑ℓθ\theta^{(s+1)}=\theta^{(s)}-\eta_\theta \nabla_\theta \sum \ell_\thetaθ(s+1)=θ(s)−ηθ​∇θ​∑ℓθ​$

其中
$$
ℓ_{\theta}=−rlog⁡pθ(a∣xaction)\ell_\theta = -r \log p_\theta(a|x_{\text{action}})ℓθ​=−rlogpθ​(a∣xaction​)
$$
这就是标准的“参数更新一步”。所以不是只在前向推理，**而是边执行边更新参数**。