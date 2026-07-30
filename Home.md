---
type: home
tags:
  - moc
---

# Home

> [!tip] 这套库只保留一个循环
> **捕获 → 筛选 → 精读 → 提炼 → 主动回忆 → 输出**

## 快速入口

- [[Literature Dashboard|论文与阅读]]
- [[Knowledge Map|知识地图]]
- [[论文与学习工作流|工作流说明]]
- `Ctrl/Cmd + P` → **Zotero Integration: Import Notes**
- `Ctrl/Cmd + P` → **Spaced Repetition: Review**

## Inbox

```dataview
LIST
FROM "00-Inbox"
SORT file.mtime DESC
```

## 正在读

```dataview
TABLE year, authors, topics
FROM "20-Literature/Notes"
WHERE type = "paper" AND status = "reading"
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
