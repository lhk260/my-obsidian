---
title: 重现GPT-2-from Andrej Karpathy
tags:
  - LLM
categories: 
date: 2025-03-16T20:35:38+08:00
modify: 2025-03-16T20:35:38+08:00
dir: 
share: false
cdate: 2025-03-16
mdate: 2025-03-16
---
# 重现 GPT-2 (124M) 笔记

> [!Meta]
> YouTube： [Let's reproduce GPT-2 (124M) - YouTube](https://www.youtube.com/watch?v=l8pRSuU81PU) 
> bilibili： [【精校】“让我们重现GPT-2（1.24亿参数）!”AI大神Andrej Karpathy最新4小时经典教程 【中英】\_哔哩哔哩\_bilibili](https://www.bilibili.com/video/BV12s421u7sZ)

## 介绍与目标

*   本视频是 "Zero to Hero" 系列的延续，目标是**重现 GPT-2 的 1.24 亿参数版本**。
*   OpenAI 于 2019 年发布了 GPT-2，包括**博客文章、论文和 GitHub 代码** (openai/gpt-2)。
*   GPT-2 有一个**模型系列**，包含不同大小的模型，最大的通常被称为 GPT-2。
*   模型大小与下游任务（如翻译、摘要、问答）的性能之间存在**缩放规律**，即模型越大，性能越好。
*   GPT-2 系列包含**四个模型**，参数量从 1.24 亿到 15.58 亿不等。
*   1.24 亿参数模型拥有 **12 个 Transformer 层**和 **768 个通道（维度）**。
*   本视频假设观众对 Transformer 的基本概念有一定的了解，这些内容在之前的 "Let's build GPT from scratch" 视频中已涵盖。
*   目标是通过从零开始训练，最终达到甚至**超过** OpenAI 发布的 1.24 亿参数 GPT-2 模型的性能，通过**验证损失**来衡量.
*   如今，重现该模型大约只需要**一小时**和 **10 美元**的云 GPU 计算成本。
*   OpenAI **发布了 GPT-2 的模型权重**。
*   GPT-2 论文在训练细节方面不够完善，因此还会参考**GPT-3 论文**，后者在超参数和优化设置等方面更加具体，且架构与 GPT-2 差异不大.
*   首先会**加载 OpenAI 发布的 GPT-2 124M 模型**，并进行简单的文本生成，作为目标参考.

## 加载预训练的 GPT-2 模型

*   原始 GPT-2 代码使用 **TensorFlow** 编写，但为了方便起见，本视频将使用 **PyTorch**.
*   使用 **Hugging Face Transformers** 库可以轻松加载和使用 GPT-2 的 PyTorch 实现.
*   Hugging Face 已经完成了将 TensorFlow 权重转换为 PyTorch 格式的工作.
*   通过 `transformers` 库可以加载 `GPT2LMHeadModel`.
*   需要注意的是，使用 `gpt2` 作为预训练模型名称时，实际加载的是 **1.24 亿参数模型**，而 `gpt2-xl` 才是 15 亿参数模型.
*   可以获取模型的 `state_dict`，其中包含原始的张量权重.
*   查看 `state_dict` 可以了解模型中不同参数的名称和形状.

### 模型参数示例

*   `wte.weight`: **词嵌入** (Token Embedding) 的权重，形状为 ``，其中 50257 是 GPT-2 的**词汇表大小**，768 是每个词嵌入的维度.
    *   GPT-2 的 tokenizer 具有 50257 个 tokens，这些 tokens 在之前的 **tokenization 系列视频**中有详细介绍.
    *   每个 token 都由一个 768 维的向量表示.
*   `wpe.weight`: **位置嵌入** (Position Embedding) 的权重，形状为 ``，GPT-2 的最大序列长度为 1024.
    *   每个位置都有一个 768 维的固定向量表示，通过优化学习得到.
    *   位置嵌入学习到了类似**正弦和余弦**的结构.
    *   与原始 Transformer 中固定的位置编码不同，GPT-2 中的位置嵌入是**可学习的参数**.
*   其他参数包括 Transformer 层的权重和偏置等.

> [!model]-
> transformer.wte.weight torch.Size([50257, 768])
> transformer.wpe.weight torch.Size([1024, 768])
> transformer.h.0.ln_1.weight torch.Size([768])
> transformer.h.0.ln_1.bias torch.Size([768])
> transformer.h.0.attn.c_attn.weight torch.Size([768, 2304])
> transformer.h.0.attn.c_attn.bias torch.Size([2304])
> transformer.h.0.attn.c_proj.weight torch.Size([768, 768])
> transformer.h.0.attn.c_proj.bias torch.Size([768])
> transformer.h.0.ln_2.weight torch.Size([768])
> transformer.h.0.ln_2.bias torch.Size([768])
> transformer.h.0.mlp.c_fc.weight torch.Size([768, 3072])
> transformer.h.0.mlp.c_fc.bias torch.Size([3072])
> transformer.h.0.mlp.c_proj.weight torch.Size([3072, 768])
> transformer.h.0.mlp.c_proj.bias torch.Size([768])
> transformer.h.1.ln_1.weight torch.Size([768])
> transformer.h.1.ln_1.bias torch.Size([768])
> transformer.h.1.attn.c_attn.weight torch.Size([768, 2304])
> transformer.h.1.attn.c_attn.bias torch.Size([2304])
> transformer.h.1.attn.c_proj.weight torch.Size([768, 768])
> transformer.h.1.attn.c_proj.bias torch.Size([768])
> transformer.h.1.ln_2.weight torch.Size([768])
> transformer.h.1.ln_2.bias torch.Size([768])
> transformer.h.1.mlp.c_fc.weight torch.Size([768, 3072])
> transformer.h.1.mlp.c_fc.bias torch.Size([3072])
> transformer.h.1.mlp.c_proj.weight torch.Size([3072, 768])
> transformer.h.1.mlp.c_proj.bias torch.Size([768])
> transformer.h.2.ln_1.weight torch.Size([768])
> transformer.h.2.ln_1.bias torch.Size([768])
> transformer.h.2.attn.c_attn.weight torch.Size([768, 2304])
> transformer.h.2.attn.c_attn.bias torch.Size([2304])
> transformer.h.2.attn.c_proj.weight torch.Size([768, 768])
> transformer.h.2.attn.c_proj.bias torch.Size([768])
> transformer.h.2.ln_2.weight torch.Size([768])
> transformer.h.2.ln_2.bias torch.Size([768])
> transformer.h.2.mlp.c_fc.weight torch.Size([768, 3072])
> transformer.h.2.mlp.c_fc.bias torch.Size([3072])
> transformer.h.2.mlp.c_proj.weight torch.Size([3072, 768])
> transformer.h.2.mlp.c_proj.bias torch.Size([768])
> transformer.h.3.ln_1.weight torch.Size([768])
> transformer.h.3.ln_1.bias torch.Size([768])
> transformer.h.3.attn.c_attn.weight torch.Size([768, 2304])
> transformer.h.3.attn.c_attn.bias torch.Size([2304])
> transformer.h.3.attn.c_proj.weight torch.Size([768, 768])
> transformer.h.3.attn.c_proj.bias torch.Size([768])
> transformer.h.3.ln_2.weight torch.Size([768])
> transformer.h.3.ln_2.bias torch.Size([768])
> transformer.h.3.mlp.c_fc.weight torch.Size([768, 3072])
> transformer.h.3.mlp.c_fc.bias torch.Size([3072])
> transformer.h.3.mlp.c_proj.weight torch.Size([3072, 768])
> transformer.h.3.mlp.c_proj.bias torch.Size([768])
> transformer.h.4.ln_1.weight torch.Size([768])
> transformer.h.4.ln_1.bias torch.Size([768])
> transformer.h.4.attn.c_attn.weight torch.Size([768, 2304])
> transformer.h.4.attn.c_attn.bias torch.Size([2304])
> transformer.h.4.attn.c_proj.weight torch.Size([768, 768])
> transformer.h.4.attn.c_proj.bias torch.Size([768])
> transformer.h.4.ln_2.weight torch.Size([768])
> transformer.h.4.ln_2.bias torch.Size([768])
> transformer.h.4.mlp.c_fc.weight torch.Size([768, 3072])
> transformer.h.4.mlp.c_fc.bias torch.Size([3072])
> transformer.h.4.mlp.c_proj.weight torch.Size([3072, 768])
> transformer.h.4.mlp.c_proj.bias torch.Size([768])
> transformer.h.5.ln_1.weight torch.Size([768])
> transformer.h.5.ln_1.bias torch.Size([768])
> transformer.h.5.attn.c_attn.weight torch.Size([768, 2304])
> transformer.h.5.attn.c_attn.bias torch.Size([2304])
> transformer.h.5.attn.c_proj.weight torch.Size([768, 768])
> transformer.h.5.attn.c_proj.bias torch.Size([768])
> transformer.h.5.ln_2.weight torch.Size([768])
> transformer.h.5.ln_2.bias torch.Size([768])
> transformer.h.5.mlp.c_fc.weight torch.Size([768, 3072])
> transformer.h.5.mlp.c_fc.bias torch.Size([3072])
> transformer.h.5.mlp.c_proj.weight torch.Size([3072, 768])
> transformer.h.5.mlp.c_proj.bias torch.Size([768])
> transformer.h.6.ln_1.weight torch.Size([768])
> transformer.h.6.ln_1.bias torch.Size([768])
> transformer.h.6.attn.c_attn.weight torch.Size([768, 2304])
> transformer.h.6.attn.c_attn.bias torch.Size([2304])
> transformer.h.6.attn.c_proj.weight torch.Size([768, 768])
> transformer.h.6.attn.c_proj.bias torch.Size([768])
> transformer.h.6.ln_2.weight torch.Size([768])
> transformer.h.6.ln_2.bias torch.Size([768])
> transformer.h.6.mlp.c_fc.weight torch.Size([768, 3072])
> transformer.h.6.mlp.c_fc.bias torch.Size([3072])
> transformer.h.6.mlp.c_proj.weight torch.Size([3072, 768])
> transformer.h.6.mlp.c_proj.bias torch.Size([768])
> transformer.h.7.ln_1.weight torch.Size([768])
> transformer.h.7.ln_1.bias torch.Size([768])
> transformer.h.7.attn.c_attn.weight torch.Size([768, 2304])
> transformer.h.7.attn.c_attn.bias torch.Size([2304])
> transformer.h.7.attn.c_proj.weight torch.Size([768, 768])
> transformer.h.7.attn.c_proj.bias torch.Size([768])
> transformer.h.7.ln_2.weight torch.Size([768])
> transformer.h.7.ln_2.bias torch.Size([768])
> transformer.h.7.mlp.c_fc.weight torch.Size([768, 3072])
> transformer.h.7.mlp.c_fc.bias torch.Size([3072])
> transformer.h.7.mlp.c_proj.weight torch.Size([3072, 768])
> transformer.h.7.mlp.c_proj.bias torch.Size([768])
> transformer.h.8.ln_1.weight torch.Size([768])
> transformer.h.8.ln_1.bias torch.Size([768])
> transformer.h.8.attn.c_attn.weight torch.Size([768, 2304])
> transformer.h.8.attn.c_attn.bias torch.Size([2304])
> transformer.h.8.attn.c_proj.weight torch.Size([768, 768])
> transformer.h.8.attn.c_proj.bias torch.Size([768])
> transformer.h.8.ln_2.weight torch.Size([768])
> transformer.h.8.ln_2.bias torch.Size([768])
> transformer.h.8.mlp.c_fc.weight torch.Size([768, 3072])
> transformer.h.8.mlp.c_fc.bias torch.Size([3072])
> transformer.h.8.mlp.c_proj.weight torch.Size([3072, 768])
> transformer.h.8.mlp.c_proj.bias torch.Size([768])
> transformer.h.9.ln_1.weight torch.Size([768])
> transformer.h.9.ln_1.bias torch.Size([768])
> transformer.h.9.attn.c_attn.weight torch.Size([768, 2304])
> transformer.h.9.attn.c_attn.bias torch.Size([2304])
> transformer.h.9.attn.c_proj.weight torch.Size([768, 768])
> transformer.h.9.attn.c_proj.bias torch.Size([768])
> transformer.h.9.ln_2.weight torch.Size([768])
> transformer.h.9.ln_2.bias torch.Size([768])
> transformer.h.9.mlp.c_fc.weight torch.Size([768, 3072])
> transformer.h.9.mlp.c_fc.bias torch.Size([3072])
> transformer.h.9.mlp.c_proj.weight torch.Size([3072, 768])
> transformer.h.9.mlp.c_proj.bias torch.Size([768])
> transformer.h.10.ln_1.weight torch.Size([768])
> transformer.h.10.ln_1.bias torch.Size([768])
> transformer.h.10.attn.c_attn.weight torch.Size([768, 2304])
> transformer.h.10.attn.c_attn.bias torch.Size([2304])
> transformer.h.10.attn.c_proj.weight torch.Size([768, 768])
> transformer.h.10.attn.c_proj.bias torch.Size([768])
> transformer.h.10.ln_2.weight torch.Size([768])
> transformer.h.10.ln_2.bias torch.Size([768])
> transformer.h.10.mlp.c_fc.weight torch.Size([768, 3072])
> transformer.h.10.mlp.c_fc.bias torch.Size([3072])
> transformer.h.10.mlp.c_proj.weight torch.Size([3072, 768])
> transformer.h.10.mlp.c_proj.bias torch.Size([768])
> transformer.h.11.ln_1.weight torch.Size([768])
> transformer.h.11.ln_1.bias torch.Size([768])
> transformer.h.11.attn.c_attn.weight torch.Size([768, 2304])
> transformer.h.11.attn.c_attn.bias torch.Size([2304])
> transformer.h.11.attn.c_proj.weight torch.Size([768, 768])
> transformer.h.11.attn.c_proj.bias torch.Size([768])
> transformer.h.11.ln_2.weight torch.Size([768])
> transformer.h.11.ln_2.bias torch.Size([768])
> transformer.h.11.mlp.c_fc.weight torch.Size([768, 3072])
> transformer.h.11.mlp.c_fc.bias torch.Size([3072])
> transformer.h.11.mlp.c_proj.weight torch.Size([3072, 768])
> transformer.h.11.mlp.c_proj.bias torch.Size([768])
> transformer.ln_f.weight torch.Size([768])
> transformer.ln_f.bias torch.Size([768])
> lm_head.weight torch.Size([50257, 768])

> [!Model explain]+
> 1. **Embedding层**：
> - `wte`：词嵌入矩阵 [50257, 768]（50257是vocab size）
> - `wpe`：位置编码矩阵 [1024, 768]（支持最大1024 token的序列）
> 2. **12层Transformer Block**（h.0到h.11）： 每层包含：
> - **LayerNorm**：`ln_1`（自注意力前）和`ln_2`（前馈网络前）
> - **自注意力机制**：
>     - `c_attn`：QKV投影矩阵 [768, 2304]（768*3=2304）
>     - `c_proj`：输出投影矩阵 [768, 768]
> - **前馈网络**：
>     - `c_fc`：扩展层 [768, 3072]（4倍扩展）
>     - `c_proj`：收缩层 [3072, 768]
> 3. **最终组件**：
> - `ln_f`：输出层归一化
> - `lm_head`：语言模型头 [50257, 768]（通常与wte共享权重）
> 模型配置推测：
> - 隐藏层维度：768
> - 注意力头数：12头（2304 / 768 = 3）
> - FFN维度：3072（768*4）
> - 最大上下文长度：1024
> - 层数：12层（h.0到h.11)

## 文本生成示例

*   使用 Hugging Face Transformers 提供的 `pipeline` 可以方便地进行文本采样生成.
*   给定一个前缀 (e.g., "hello I'm a language model,"), 模型可以生成后续的文本.
*   即使固定随机种子，生成的文本结果也可能与示例不同，这可能是由于代码更新所致.
*   重要的是，即使是预训练模型也能生成**连贯的文本**.

## 从零开始实现 GPT-2 模型

*   为了更深入地理解模型内部机制，将**从零开始实现 GPT-2 模型**.
*   目标是将 OpenAI 发布的 GPT-2 124M 模型的权重加载到我们自己实现的模型类中，以验证实现的正确性.
*   最终目标是从零开始初始化模型并进行训练.

## GPT-2 模型架构与原始 Transformer 的差异

*   GPT-2 是一个 **decoder-only Transformer**，因此**没有 encoder 部分**.
*   **交叉注意力机制 (cross-attention)** 也被移除.
*   与原始 Transformer 相比，GPT-2 的 **Layer Normalization 的位置发生了变化**，且**添加了一个额外的 Layer Normalization 层**.
    *   原始 Transformer 的 Layer Normalization 位于多头注意力和前馈网络之后.
    *   GPT-2 将 Layer Normalization 移到了**多头注意力和前馈网络之前**.
    *   GPT-2 在**最后一个自注意力模块之后添加了一个额外的 Layer Normalization 层**，位于最终分类器之前.
*   **预归一化 (Pre-normalization)** 结构被认为更优，因为它保持了**干净的残差路径**，有利于梯度流动.
*   Transformer 的核心操作是**多头注意力 (Multi-Head Attention)** 和 **多层感知机 (MLP)**.
    *   **注意力机制**是 **通信操作**，允许序列中的 tokens 之间交换信息，是一种 **reduce 操作**.
    *   **MLP** 在每个 token 上**独立**进行计算，没有 token 之间的信息交换，是一种 **map 操作**.
    *   Transformer 可以被看作是 **map-reduce 操作的重复应用**.

## 实现模型组件

*   使用 `nn.Module` 实现模型的各个组件，并尽量匹配 Hugging Face Transformers 的命名规范.
*   模型的骨架结构 `GPT` 包含以下模块:
    *   `transformer`: 一个 `nn.ModuleDict`，包含模型的子模块。
        *   `wte`: **Token Embedding** (`nn.Embedding`)。
        *   `wpe`: **Position Embedding** (`nn.Embedding`)。
        *   `h`: 一个 `nn.ModuleList`，包含 **N 层 Transformer Block** (`Block`)，对于 124M 模型，N=12.
        *   `ln_f`: 最终的 **Layer Normalization** (`nn.LayerNorm`).
    *   `lm_head`: **语言模型头**，一个线性层 (`nn.Linear`)，将隐藏层维度 (768) 映射到词汇表大小 (50257)，**没有偏置**.
*   **Transformer Block** (`Block`) 的实现包含:
    *   Layer Normalization (第一个)。
    *   **自注意力 (Self-Attention)** 模块 (`CausalSelfAttention`)。
    *   Layer Normalization (第二个)。
    *   **MLP** 模块 (`MLP`)。
    *   **残差连接**.
*   **MLP** 模块的实现包含两个线性投影层，中间夹着 **GELU (Gaussian Error Linear Unit) 非线性激活函数**.
    *   GPT-2 使用 GELU 的近似版本 (`nn.GELU(approximate='tanh')`).
*   **自注意力 (CausalSelfAttention)** 模块的实现:
    *   将输入映射为 **Query (Q), Key (K), Value (V)** 向量。
    *   实现**多头注意力机制**，通过对 Q 和 K 进行点积计算注意力权重。
    *   应用 **mask** 确保每个 token 只能attend到之前的 tokens (因果关系)。
    *   使用 **softmax** 对注意力权重进行归一化。
    *   将注意力权重与 V 相乘，得到每个 token 的加权表示。
    *   **高效的 PyTorch 实现** 使用 `transpose` 和 `split` 等操作来处理多头注意力，避免显式地为每个头创建单独的模块.

## 加载预训练权重到自定义模型

*   创建与 Hugging Face Transformers 模型结构相匹配的自定义 `GPT` 模型配置 (`GPTConfig`)，包括 `block_size` (最大序列长度)、`vocab_size`、`n_layer` (层数)、`n_head` (注意力头数) 和 `n_embd` (嵌入维度) 等.
*   编写代码将 Hugging Face 预训练模型的 `state_dict` 中的权重复制到自定义 `GPT` 模型的对应参数中.
*   需要**忽略一些 buffers** (例如 attention 的 `bias`).
*   由于 TensorFlow 和 PyTorch 中权重的存储顺序可能不同，可能需要**手动转置某些权重**.
*   实现 `from_pretrained` 类方法，方便从预训练模型加载权重.

## 实现模型的前向传播

*   实现 `GPT` 模型的 `forward` 函数，接收 token indices 作为输入.
*   在前向传播过程中:
    *   获取 **token embeddings** 和 **position embeddings**。
    *   将两者**相加**。
    *   将结果依次通过 **Transformer 的所有 Blocks**。
    *   通过最终的 **Layer Normalization**。
    *   通过 **语言模型头 (LM Head)** 得到 **logits**，其形状为 `[B, T, vocab_size]`，表示序列中每个位置的下一个 token 的预测分数.

## 使用自定义模型生成文本

*   将模型设置为**评估模式 (`model.eval()`)**.
*   将模型和输入数据移动到**GPU (CUDA)** 上进行加速.
*   使用 OpenAI 的 `tiktoken` 库对输入前缀进行 **tokenization**.
*   将 tokenized 的前缀转换为 **PyTorch 张量**，并复制多份形成一个 batch.
*   实现**文本生成循环**，每一步都将当前序列输入模型，获取最后一个位置的 logits，通过 **softmax** 得到概率分布，然后从该分布中**采样**下一个 token，并将采样的 token 追加到序列中.
*   可以使用 **Top-K 采样** (只考虑概率最高的 K 个 tokens) 来提高生成质量.
*   使用 `tiktoken` 的 `decode` 函数将生成的 token IDs 转换回文本.
*   最初的模型（加载预训练权重之前）会生成**随机的文本**.
*   即使没有 GPU，也可以在 **CPU** 上运行代码，但速度会慢很多.

## 数据集准备

*   使用 **Tiny Shakespeare 数据集** 进行简单的调试和开发.
*   使用 `tiktoken` 对文本数据进行 tokenization.
*   将一维的 token 序列重塑为**二维的 batch 张量** (`[B, T]`)，作为模型的输入.
*   **目标标签 (target)** 是输入序列中每个 token 的下一个 token.

## 实现损失函数

*   修改模型的前向传播函数，使其在接收到目标标签时**计算损失**.
*   使用 **交叉熵损失函数 (`nn.functional.cross_entropy`)** 来衡量模型的预测与真实标签之间的差异.
*   交叉熵损失函数需要将 logits 张量和目标标签张量**展平**为二维和一维.
*   可以计算**随机初始化模型的预期损失**，作为 sanity check. 对于一个拥有 50257 个词汇的均匀分布，预期损失约为 `log(50257)`，即约 10.82.

## 实现优化过程

*   使用 **AdamW 优化器** (`torch.optim.AdamW`) 来更新模型参数.
*   在每个优化步骤中:
    *   **清空梯度** (`optimizer.zero_grad()`).
    *   进行**前向传播**计算损失。
    *   进行**反向传播**计算梯度 (`loss.backward()`).
    *   使用优化器**更新参数** (`optimizer.step()`).
    *   打印当前的步数和损失值.
*   可以使用**学习率调度器** (例如 `torch.optim.lr_scheduler.CosineAnnealingLR`) 来在训练过程中调整学习率.

## 数据加载器的改进

*   实现一个更完善的数据加载器，可以**按 batch 从文本文件中读取数据**.
*   数据加载器需要能够处理**不完整的 batch**，并在到达文件末尾时**循环**回到文件开头.
*   每次返回一个 batch 的输入 (`x`) 和对应的目标 (`y`).

## 权重绑定 (Weight Tying)

*   GPT-2 采用了**权重绑定** (weight tying) 的技巧，即**词嵌入矩阵 (`wte.weight`) 和语言模型头的权重 (`lm_head.weight`) 共享相同的参数**.
*   这种做法源于 "Attention is All You Need" 论文及其之前的研究.
*   直觉是**语义相似的 tokens 应该在嵌入空间中靠近，并且在 Transformer 的输出层也应该具有相似的概率分布**.
*   通过共享权重，可以**减少模型参数量** (对于 124M 模型，可以节省约 30% 的参数).
*   在代码中实现权重绑定，将 `lm_head.weight` 指向 `wte.weight` 的数据指针.

## 模型参数初始化

*   GPT-2 的权重初始化遵循一定的策略.
*   根据 OpenAI 发布的代码，**Transformer 层的权重使用标准差为 0.02 的正态分布初始化，偏置初始化为 0**.
*   **Token embeddings 的标准差初始化为 0.02，position embeddings 的标准差初始化为 0.01**.
*   可以在自定义模型的初始化函数中实现这些初始化策略.

## 硬件选择与利用

*   选择合适的硬件 (例如 **NVIDIA GPU**) 对于加速模型训练至关重要.
*   了解所用 GPU 的**计算能力 (Teraflops)** 和 **内存带宽**.
*   可以使用 `nvidia-smi` 命令查看 GPU 的使用情况.

## 混合精度训练 (Mixed Precision Training)

*   默认情况下，PyTorch 使用 **float32 (FP32)** 精度存储激活和参数.
*   **混合精度训练** (例如使用 **TF32** 或 **BFloat16**) 可以在不显著降低模型性能的情况下，**加速计算并减少内存占用**.
*   NVIDIA GPU 的 **Tensor Cores** 可以加速低精度浮点运算.
*   **TF32** 是一种较低精度的格式，可以在 Ampere 架构的 GPU 上获得高达 8 倍的性能提升，且对 PyTorch 代码是**透明的**.
*   **BFloat16 (BF16)** 是另一种低精度格式，与 FP16 相比，BF16 保留了与 FP32 相同的**指数范围**，因此通常**不需要梯度缩放**，使用起来更简单.
*   可以使用 `torch.autocast` 上下文管理器在 PyTorch 中启用混合精度训练，**只需要修改 forward 传播和损失计算部分**.

## Torch Compile

*   **`torch.compile`** 是 PyTorch 2.0 引入的一项技术，可以将 PyTorch 模型编译为**优化的可执行代码**，从而显著**提高训练和推理速度**.
*   `torch.compile` 可以分析整个模型，**移除 Python 解释器**的开销，并进行**kernel fusion** 等优化，减少 GPU 内存的读写次数.

## Flash Attention

*   **Flash Attention** 是一种**更高效的注意力机制算法**，通过**kernel fusion** 和**在线 softmax** 等技巧，**减少了对高带宽内存 (HBM) 的访问**，从而显著**加速了注意力计算**.
*   即使 Flash Attention 的浮点运算次数可能更多，但由于减少了内存访问，因此速度更快.
*   Flash Attention **不显式地物化巨大的注意力矩阵**，从而节省了大量内存.
*   可以使用 PyTorch 的 `scaled_dot_product_attention` 函数来调用 Flash Attention.

## Padding 优化

*   在处理序列长度不一致的 batch 时，通常需要进行 **padding**。
*   某些硬件对特定的张量形状具有更高的效率。例如，NVIDIA GPU 在处理维度是 8 的倍数的张量时可能更高效.
*   将词汇表大小 padding 到 8 的倍数 (例如从 50257 到 50304) 可以带来 **4% 左右的性能提升**.

## 分布式训练 (Distributed Training)

*   使用 **分布式数据并行 (Distributed Data Parallel, DDP)** 可以利用**多个 GPU** 加速训练.
*   DDP 的基本原理是**在每个 GPU 上运行相同的训练代码，处理不同的数据子集，然后在每个反向传播步骤之后对梯度进行平均**.
*   可以使用 `torch.distributed` 模块来实现 DDP，并通过 `torchrun` 命令启动多个训练进程.
*   需要**同步不同进程之间的损失值**，以获得整个数据集上的平均损失.
*   可以设置**梯度累积 (gradient accumulation)** 来模拟更大的 batch size.

## 训练数据集

*   GPT-2 使用了 **WebText** 数据集，这是一个从未公开的数据集，通过抓取 Reddit 上的出站链接得到.
*   GPT-3 使用了更广泛的数据集混合，包括 **Common Crawl、WebText、Books 和 Wikipedia** 等，但具体细节也未完全公开.
*   一些高质量的开源替代数据集包括 **Red Pajama、Slim Pajama 和 FineWeb 数据集**.
*   **FineWeb Edu** 是一个高质量的教育内容子集，包含 1.3 万亿 tokens.
*   本视频使用了 **FineWeb Edu 的 100 亿 tokens 子样本**进行训练.
*   提供了一个脚本 (`prepare_data.py`) 用于**下载、预处理和 tokenization FineWeb Edu 数据集**，并将其保存为多个 shards.
*   预处理过程包括在每个文档的开头添加 **end-of-text token**.

## 改进的数据加载器以支持 FineWeb 数据

*   修改数据加载器，使其能够**加载 FineWeb 数据 shards** (NumPy 文件).
*   数据加载器需要能够**遍历所有 shards**，并在每个 shard 内部按 batch 读取数据.
*   支持加载训练集和验证集.

## 训练过程与评估

*   在训练循环中，定期**评估验证损失**和**生成文本样本**.
*   为了更好地评估模型的性能，引入了 **HellaSwag 评估基准**.
*   **HellaSwag** 是一个句子补全多项选择题数据集，旨在测试模型的常识推理能力.
*   可以通过计算模型在不同选项上的**平均交叉熵损失**来评估模型在 HellaSwag 上的性能.
*   自定义了一个脚本 (`hellaswag.py`) 用于评估预训练的 GPT-2 模型在 HellaSwag 上的性能.
*   GPT-2 124M 在 HellaSwag 上的准确率约为 **29.5%**.
*   将 HellaSwag 评估集成到主要的训练脚本中，定期评估训练过程中的模型性能.
*   在评估 HellaSwag 时，**暂时禁用了 `torch.compile`**，因为存在兼容性问题.
*   在训练过程中，定期**保存模型检查点**.

## 训练结果

*   经过约 200 亿 tokens 的训练后，模型在验证集上的损失**低于** OpenAI GPT-2 124M 模型的水平.
*   生成的文本样本也变得**更加连贯**.
*   HellaSwag 准确率也逐渐提高.

## 后续步骤与相关项目

*   当前的训练只是**预训练**阶段，要使其具备类似 ChatGPT 的对话能力，还需要进行**微调 (fine-tuning)**.
*   **nanoGPT** 是一个基于 PyTorch 的简洁的 GPT 模型实现，本视频的内容是构建 nanoGPT 的过程.
*   **LLM.C** 是一个使用纯 CUDA 实现的 GPT-2/GPT-3 训练框架，速度更快，nanoGPT 可以作为其 PyTorch 参考实现.
*   LLM.C 在训练速度上优于 PyTorch 实现，但 PyTorch 是一个更通用的框架.
