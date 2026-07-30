---
type: home
tags:
  - moc
---

# Home

> [!tip] 当前学习闭环
> **捕获 → Source → ChatGPT 讲解 → 个人笔记 → ChatGPT 核验 → 概念 / 项目 → 复习与输出**

## 快速入口

- [[Literature Dashboard|论文流水线]]
- [[Knowledge Map|知识地图]]
- [[论文与学习工作流|完整工作流]]
- [[Paper AI Explanation Prompt|复制首次讲解提示词]]
- [[Paper Verification Prompt|复制对照核验提示词]]
- `Ctrl/Cmd + P` → **Zotero Integration: Import Notes**
- `Ctrl/Cmd + P` → **Spaced Repetition: Review**

## 待 ChatGPT 讲解

```dataview
TABLE citekey, year, projects
FROM "20-Literature/Sources"
WHERE type = "source-note" AND ai_explanation_done != true
SORT file.mtime DESC
LIMIT 10
```

## 待核验的个人笔记

```dataview
TABLE citekey, rating, projects
FROM "20-Literature/My-Notes"
WHERE type = "my-paper-note" AND summary_done = true AND verified != true
SORT file.mtime DESC
LIMIT 10
```

## Inbox

```dataview
LIST
FROM "00-Inbox"
SORT file.mtime DESC
```

## 最近更新

```dataview
TABLE file.folder AS Folder
FROM ""
WHERE !startswith(file.path, ".") AND file.name != this.file.name
SORT file.mtime DESC
LIMIT 15
```
