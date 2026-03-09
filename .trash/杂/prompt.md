---
title: " 2025-01-19 "
tags:
  - embodied-ai
  - prompt
categories: dairy
date: " 2025-01-31T11:09:33+08:00"
modify: " 2025-01-31T11:09:33+08:00 "
dir: dairy
share: false
cdate: " 2025-01-31 "
mdate: " 2025-01-31 "
---

#### 请根据Lab2实验内容，整理一份系统化的中文学习笔记。要求如下：

```text
请根据Lab2实验内容，整理一份系统化的中文学习笔记。要求如下：

# 内容结构
1. **实验目标**
   - 用3个bullet points说明核心学习目标
   - >[!tip] 使用「通过...掌握...」句式

2. **核心概念**
   - 分模块解释专业术语（每个术语包含：定义+作用+示例）
   - >[!important] 对易混淆概念用对比表格呈现

3. **关键操作**
   - 分步骤说明实验流程（STEP1-STEPn）
   - 包含必要代码片段（用```标注语言类型）
   - 对关键参数用**加粗**标记

4. **可视化辅助**
   - 描述需要呈现的图表/示意图
   - 标注图中需要突出的重点区域

5. **深度总结**
   - 常见错误及解决方法（使用⚠️图标）
   - 最佳实践建议（使用✅图标）

# 格式要求
• 严格使用Markdown语法
• 二级标题起手，禁用一级标题
• 每章节下先用段落说明，再用列表细化
• 技术术语首次出现时用`行内代码`格式
• 对关键警告使用 >[!warning] 特殊标注
• 对扩展知识使用 >[!note] 折叠框呈现

请确保内容：技术准确、层次分明、重点突出，适合作为实验复习材料。

```

#### 请根据「课程名称」讲座PDF内容，整理专业级中文学习笔记。要求如下：

```text
请根据「课程名称」讲座PDF内容，整理专业级中文学习笔记。要求如下：

# 内容架构
1. **课程脉络**
   - 用时间轴呈现lecture结构（日期→主题→关键学者）
   - >[!tip] 对跨章节关联用`[←链接→]`标注

2. **理论框架**
   - 分层解析核心模型（基础假设→数学表达→应用场景）
   - >[!important] 对复杂公式用LaTeX重写并附文字解读

3. **学术图谱**
   - 创建领域发展树形图（奠基理论→分支演进→最新突破）
   - 用不同颜色标注学派争议点

4.  **章节精析**
   - 对于课程脉络中的章节进行多维度拆解
   - 总结每一部分的核心内容，以精准的语言描述出来
   - 每一部分用“###”三级小标题

5. **思辨空间**
   - 整理课堂讨论中的关键辩题
   - 用正反方观点矩阵呈现学术争议

# 格式规范
• 学术名词首次出现时标注英文原文及年份（例：`认知失调(Cognitive Dissonance, Festinger 1957)`）
• 使用APA引用格式处理文献索引
• 对教师强调内容使用 >[!quote] 灰色引用框
• 对扩展阅读使用 >[!seealso]+ 折叠框
• 对易混淆概念使用彩虹表格对比（列：定义/代表人物/典型应用）

# 增值模块
1. **认知脚手架**
   - 创建知识迁移地图：如何将理论应用于现实场景
   
2. **学术预警系统**
   - 高频考点与常见论证误区（按出现频次★级标注）
   
3. **教授思维透视**
   - 分析授课者的论证偏好与学术倾向

请确保输出：具备学术严谨性、体现知识演进逻辑、保留课堂思辨特质、注意具体代码实现的例子
```

#### 我是一名电脑初学者，仅仅刚刚接触过python语言，在一个md文件中我读到了这样的代码： 

```html
我是一名电脑初学者，仅仅刚刚接触过python语言，在一个md文件中我读到了这样的代码： 
<br><br><br><br><br><br>

<h1 style="text-align: center;">
<span style="font-size:50px;">
Welcome to Kinnari's Site! 🎉
</span>
</h1>

<span style="display: block; text-align: center; font-size: 18px;">
[:octicons-link-16: My frineds!](./links/index.md) / [:octicons-info-16: About Me](./about/index.md) / [:academicons-google-scholar: Academic Page](./academy.md) / [:material-chart-line: Statistics](javascript:toggle_statistics();)
</span>

<div id="statistics" markdown="1" class="card" style="width: 27em; border-color: transparent; opacity: 0; margin-left: auto; margin-right: 0; font-size: 110%">
<div style="padding-left: 1em;" markdown="1">
<li>Website Operating Time: <span id="web-time"></span></li>
<li>Total Visitors: <span id="busuanzi_value_site_uv"></span> people</li>
<li>Total Visits: <span id="busuanzi_value_site_pv"></span> times</li>
</div>
</div>

<script>
function updateTime() {
    var date = new Date();
    var now = date.getTime();
    var startDate = new Date("2024/12/05 20:00:00");
    var start = startDate.getTime();
    var diff = now - start;
    var y, d, h, m;
    y = Math.floor(diff / (365 * 24 * 3600 * 1000));
    diff -= y * 365 * 24 * 3600 * 1000;
    d = Math.floor(diff / (24 * 3600 * 1000));
    h = Math.floor(diff / (3600 * 1000) % 24);
    m = Math.floor(diff / (60 * 1000) % 60);
    if (y == 0) {
        document.getElementById("web-time").innerHTML = d + "<span> </span>d<span> </span>" + h + "<span> </span>h<span> </span>" + m + "<span> </span>m";
    } else {
        document.getElementById("web-time").innerHTML = y + "<span> </span>y<span> </span>" + d + "<span> </span>d<span> </span>" + h + "<span> </span>h<span> </span>" + m + "<span> </span>m";
    }
    setTimeout(updateTime, 1000 * 60);
}
updateTime();
function toggle_statistics() {
    var statistics = document.getElementById("statistics");
    if (statistics.style.opacity == 0) {
        statistics.style.opacity = 1;
    } else {
        statistics.style.opacity = 0;
    }
}
</script> 
请结合我的初学者的身份，为我逐步讲解这份代码，要求： 
1. 时刻考虑我的初学者的身份，在合适的时候要和我充分补充相关的代码语言基础知识
2. 代码语言基础知识与在上面的代码的具体应用的讲解需要穿插进行。如何安排讲解内容的顺序由你决定，但务必要让我在理解你的讲解时已经掌握相关的前置代码知识 
3. 遇到第一次碰到的符号与名词，要解释其全称。比如<div>,就要解释div的全称是division
4. 我说”开始你的讲解吧！“后，你开始讲解。我针对你的讲解提出问题后，你需要回答我的问题。我说”继续下一部分！“，你开始下一部分的讲解。如何拆解为各个部分由你决定。每次对话必须以”你听懂了喵？“来结尾
```

#### 请基于提供的PDF内容，按以下要求生成结构化总结：

```text

请基于提供的PDF内容，按以下要求生成**markdown格式**结构化总结：
1. **格式要求**
    - 使用Markdown语法，包含多级标题（如`##`、`###`）、项目符号列表（`-`）、代码块（```）和表格。   
    - 对代码示例、图表、表格等非文本内容保留原始格式，并附加简要说明。   
	- 尤其要注意保留数学公式的推导！ 数学公式用$符号包裹！       
2. **内容要求**    
    - **分章节总结**：按PDF中的主题划分章节，例如（仅仅作为示例，与文件内容无实际关联）：       
        - RISC-V指令（条件分支、无条件分支、JAL/JALR）          
        - 函数调用与堆栈管理（调用约定、栈帧、SP操作）          
        - 寄存器用途与保存规则（临时寄存器、保存寄存器、参数寄存器）     
        .....            
    - **关键概念**：寻找所有关键的概念，例如（仅仅作为示例，与文件内容无实际关联）：      
        - 程序计数器（PC）的行为        
        - 调用约定中Caller/Callee的责任划分         
     	   - 伪指令（如`j`、`ret`）的实现逻辑
        ......        
    - **代码示例**：用代码块展示重要示例（如循环、if-else、函数调用），并解释其逻辑。  
    - **图表信息**：若PDF包含图表（如内存布局图、栈操作示意图），用表格在md中呈现。   
3. **语言风格**
    - 简洁清晰，适合学习或复习使用。    
    - 避免冗余，仅保留核心知识点和示例。
    - 尤其要注意保留数学公式的推导！数学公式用$符号包裹！
```

```text

请基于提供的md内容，按以下要求生成*markdown格式**结构化总结：
1. **格式要求**
    - 使用Markdown语法，包含多级标题（如`##`、`###`）、项目符号列表（`-`）、代码块（```）和表格。   
    - 对代码示例、图表、表格等非文本内容保留原始格式，并附加简要说明。   
	- 尤其要注意保留数学公式的推导！数学公式用$符号包裹！        
2. **内容要求**    
    - **分章节总结**：按md中的主题划分章节，例如：       
        - RISC-V指令（条件分支、无条件分支、JAL/JALR）          
        - 函数调用与堆栈管理（调用约定、栈帧、SP操作）          
        - 寄存器用途与保存规则（临时寄存器、保存寄存器、参数寄存器）     
        .....            
    - **关键概念**：寻找所有关键的概念，例如：      
        - 程序计数器（PC）的行为        
        - 调用约定中Caller/Callee的责任划分         
     	   - 伪指令（如`j`、`ret`）的实现逻辑
        ......        
    - **代码示例**：用代码块展示重要示例（如循环、if-else、函数调用），并解释其逻辑。  
    - **图表信息**：若md包含图表（如内存布局图、栈操作示意图），表格在md中呈现。   
3. **语言风格**
    - 简洁清晰，适合学习或复习使用。    
    - 避免冗余，仅保留核心知识点和示例。
    - 尤其要注意保留数学公式的推导！数学公式用$符号包裹！
```

提示词原则：

- 清晰明确
- 给系统足够的时间思考

数据标注：

```

prompt = f"""

从评论文本中识别以下项目：

- 情绪（正面或负面）

- 审稿人是否表达了愤怒？（是或否）

- 评论者购买的物品

- 制造该物品的公司

  

评论用三个反引号分隔。将您的响应格式化为 JSON 对象，以 “Sentiment”、“Anger”、“Item” 和 “Brand” 作为键。

如果信息不存在，请使用 “未知” 作为值。

让你的回应尽可能简短。

将 Anger 值格式化为布尔值。

  

评论文本: ```{lamp_review_zh}```

"""

response = get_completion(prompt)

print(response)
```

### 论文总结
```text
请按照以下框架总结一篇人工智能领域的学术论文，确保清晰覆盖每个关键部分：

### 1. **元信息提取**

- 论文标题、作者、会议/期刊（如NeurIPS、ICML等）、发表年份
- 研究类型（理论推导/算法创新/应用研究/综述）
- 代码与数据可用性（如GitHub链接、数据集名称）

### 2. **逐部分解析**

**2.1 引言(Introduction)**

- 核心研究问题：论文试图解决的AI领域痛点（如模型效率、泛化能力等）
- 现有方法局限性：指出前人工作的不足（例如Transformer计算开销大）
- 本文主张：用一句话概括论文的核心主张（如提出轻量级注意力机制X）

**2.2 方法(Methodology)**

- 技术路径：模型架构图/算法流程图的关键改进点（用非技术语言解释）
    - 例：_"将传统卷积替换为动态稀疏卷积，通过门控机制自适应选择激活区域"_
- 创新点标注：列出1-3个技术突破（如新损失函数、训练策略等）
- 理论支撑：重要公式/定理的物理意义（如证明模型收敛速度提升20%）

**2.3 实验(Experiments)**

- 数据集：名称、规模、选择理由（如ImageNet-1K用于验证泛化性）
- 基线模型：对比的经典算法（如ResNet、BERT等）
- 评估指标：任务相关指标（准确率、BLEU、FID等）
- 关键结果：用数据对比突出优势（如"在COCO数据集上mAP提高4.2%"）

**2.4 讨论(Discussion)**

- 优势验证：实验结果如何支撑核心主张
- 缺陷分析：当前方法的局限性（如需要更多GPU显存）
- 潜在影响：对AI社区的意义（如为边缘设备部署提供新思路）

### 3. **全局总结**

- 技术贡献三角： `问题 → 方法 → 验证`
- 应用价值分级：理论突破/工程优化/商业落地可能性
- 未来方向：作者建议的延伸研究（如扩展到多模态任务）

### 4. **输出控制**

- 语言：中文术语优先，英文术语后标注（如"多头注意力机制(Multi-Head Attention)"）
- 技术深度：
    - 简化版：跳过公式，用比喻解释原理（如"类似筛选重要信息的过滤器"）
    - 专业版：保留关键公式并解释其作用（如公式3中的稀疏约束项）
- 可视化需求：是否需要生成结构对比表格/流程图
```

## commit
```text
You are an expert software engineer.
Review the provided context and diffs which are about to be committed to a git repo.
Review the diffs carefully.
Generate a commit message for those changes.
The commit message MUST use the imperative tense.
The commit message should be structured as follows: <type>: <description>
Use these for <type>: fix, feat, build, chore, ci, docs, style, refactor, perf, test
Reply with JUST the commit message, without quotes, comments, questions, etc!
回复中文
```