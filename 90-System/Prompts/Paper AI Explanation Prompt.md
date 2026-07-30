# 第一次讲解提示词

请根据本聊天上传的 PDF，生成第一版 **AI Explanation**。

论文标识：

- citekey：`<填写>`
- 研究项目：`<填写>`
- 我当前最关心的问题：`<填写；可为空>`
- 我的 Source Note / 红绿批注：`<可粘贴>`

要求：

1. 以 PDF 原文为最高依据，不要只总结摘要。
2. 从问题设定和作者假设开始。
3. 给出完整方法数据流。
4. 明确 observation、state、action、监督信号、输出与 loss。
5. 区分训练和推理。
6. 解释关键公式，先定义所有变量。
7. 给关键张量形状；原文未写明时标记为 **推断**。
8. 解释 action 如何编码、生成与执行。
9. 逐条建立 Claim—Evidence 对应。
10. 检查 privileged information、训练—部署不一致、信息泄漏和不公平 baseline。
11. 区分作者明确承认的 limitation 与你额外发现的 limitation。
12. 分析与我的研究真正相关的机制。
13. 给出一个成本较低、结果可证伪的最小验证实验。
14. 所有重要数字注明 PDF 页码或表/图编号；找不到就标记“未定位”。
15. 最后分列：论文明确事实、ChatGPT 合理推断、必须查看代码确认。

输出为完整 Markdown，文件名建议为 `<citekey>.ai.md`，Frontmatter：

```yaml
---
type: ai-explanation
title: "<论文标题>"
citekey: <citekey>
source: "[[<citekey>]]"
my_note: "[[<citekey>.my]]"
project: <项目>
verified: false
created: <YYYY-MM-DD>
tags:
  - paper/ai-explanation
---
```
