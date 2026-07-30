---
type: map
tags:
  - moc
---

# Literature Dashboard

> [!tip] 每篇论文的强制顺序
> **Source Note → ChatGPT AI Explanation → 关闭 AI 稿写 My Note → ChatGPT 对照核验 → Concept / Project**

## ① 待 ChatGPT 讲解

```dataview
TABLE citekey, year, projects, topics
FROM "20-Literature/Sources"
WHERE type = "source-note" AND ai_explanation_done != true
SORT file.mtime DESC
```

## ② 旧个人笔记待 AI 回填

```dataview
TABLE summary_done, rating, projects, topics
FROM "20-Literature/My-Notes"
WHERE type = "my-paper-note" AND ai_explanation_done != true
SORT file.mtime DESC
```

处理方式：上传原论文 PDF 和旧笔记，生成 AI Explanation，再进行对照核验。完成后将 `ai_explanation_done` 改为 `true`。

## ③ 已有 AI 稿，等待个人笔记

```dataview
TABLE citekey, project, verified
FROM "20-Literature/AI-Explanations"
WHERE type = "ai-explanation" AND my_note_done != true
SORT file.mtime DESC
```

## ④ 个人笔记未完成

```dataview
TABLE citekey, rating, projects, topics
FROM "20-Literature/My-Notes"
WHERE type = "my-paper-note" AND summary_done != true
SORT file.mtime DESC
```

## ⑤ 等待 ChatGPT 对照核验

```dataview
TABLE citekey, rating, projects, topics
FROM "20-Literature/My-Notes"
WHERE type = "my-paper-note" AND ai_explanation_done = true AND summary_done = true AND verified != true
SORT file.mtime DESC
```

## ⑥ 已完成

```dataview
TABLE citekey, rating, projects, topics
FROM "20-Literature/My-Notes"
WHERE type = "my-paper-note" AND summary_done = true AND verified = true
SORT rating DESC
```

## 快速入口

- [[Paper AI Explanation Prompt|ChatGPT 首次讲解提示词]]
- [[Paper Verification Prompt|ChatGPT 对照核验提示词]]
- [[ChatGPT Project Instructions]]
- [[论文与学习工作流]]
- [[论文阅读方法]]
