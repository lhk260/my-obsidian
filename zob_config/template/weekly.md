---
title: "{{date}}"
tags:
  - "周记"
categories: dairy
date: "{{ date:YYYY-MM-DDTHH:mm:ss+08:00 }}"
modify: "{{ date:YYYY-MM-DDTHH:mm:ss+08:00 }}"
dir: dairy
share: false
cdate: "{{ date:YYYY-MM-DD }}"
mdate: " {{ date:YYYY-MM-DD }} "
---

# {{date:YYYY}}-W{{date:WW}}-{{date:MM}}

## Review

## Next Week Plan

## THOUGHTS

##  NOTE

```dataview
LIST
FROM ""
WHERE file.cday.weekyear = this.file.cday.weekyear OR file.mday.weekyear = this.mile.cday.weekyear
```