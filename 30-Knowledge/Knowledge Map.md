---
type: map
tags:
  - moc
---

# Knowledge Map

- [[Concepts]]
- [[Skills]]
- [[Tools]]

## 最近形成的概念

```dataview
TABLE topics, sources, modified
FROM "30-Knowledge"
WHERE type = "concept"
SORT modified DESC
LIMIT 30
```

## 待复习

```dataview
LIST
FROM "30-Knowledge"
WHERE review = true
SORT file.name ASC
```
