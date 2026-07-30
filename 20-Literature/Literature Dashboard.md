---
type: map
tags:
  - moc
---

# Literature Dashboard

## 阅读队列

```dataview
TABLE status, year, authors, topics
FROM "20-Literature/Notes"
WHERE type = "paper" AND status != "processed" AND status != "archived"
SORT year DESC
```

## 最近处理

```dataview
TABLE status, modified, topics
FROM "20-Literature/Notes"
WHERE type = "paper"
SORT modified DESC
LIMIT 20
```

## 等待复习

```dataview
LIST
FROM "20-Literature/Notes"
WHERE review = true
SORT file.name ASC
```

## 论文阅读方法

- [[论文阅读方法]]
- [[论文与学习工作流]]
