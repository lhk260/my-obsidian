---
type: paper
title: "{{title | escape}}"
citekey: "{{citekey}}"
year: "{{date | format("YYYY")}}"
authors: "{{authors}}"
doi: "{{DOI}}"
url: "{{url}}"
status: reading
topics: []
tags:
  - paper
review: false
imported: "{{importDate | format("YYYY-MM-DD")}}"
---

# {{title}}

> [!info]- 文献信息
> - **作者**：{{authors}}
> - **年份**：{{date | format("YYYY")}}
> - **期刊 / 会议**：{{publicationTitle}}
> - **DOI**：{{DOI}}
> - **Zotero**：{{pdfZoteroLink}}
> - **引用**：{{bibliography}}

## Abstract

{{abstractNote}}

{% persist "synthesis" %}
## 我的综合

### 一句话结论

### 问题、方法、证据

### 局限与反例

### 与已有知识的连接

- [[ ]]

### 下一步

- [ ] 拆成概念笔记
- [ ] 复现或验证
{% endpersist %}

## Zotero Annotations

{% for annotation in annotations %}
{% if annotation.annotatedText %}
> [!quote|{{annotation.colorCategory}}]+ [p. {{annotation.pageLabel}}](zotero://open-pdf/library/items/{{annotation.attachment.itemKey}}?page={{annotation.pageLabel}}&annotation={{annotation.id}})
> {{annotation.annotatedText | nl2br}}
{% if annotation.comment %}
> 
> **我的批注**：{{annotation.comment | nl2br}}
{% endif %}
{% if annotation.imageRelativePath %}
> ![[{{annotation.imageRelativePath}}]]
{% endif %}
{% endif %}
{% endfor %}

## Active Recall

<!-- 要让 Q:: A:: 进入卡片队列，请给本笔记添加 #flashcards -->

Q:: 这篇论文解决的核心问题是什么？
A:: 

Q:: 它最关键的方法机制是什么？
A:: 
