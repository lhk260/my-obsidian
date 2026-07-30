---
type: weekly
tags:
  - weekly
---

# 本周复盘

## 本周读完

```dataview
TABLE status, topics
FROM "20-Literature/Notes"
WHERE modified >= date(today) - dur(7 days)
SORT modified DESC
```

## 本周形成的概念

```dataview
LIST
FROM "30-Knowledge"
WHERE type = "concept" AND modified >= date(today) - dur(7 days)
```

## 仍然解释不清的问题

- 

## 下周只推进三件事

- [ ]
- [ ]
- [ ]
