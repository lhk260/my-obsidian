---
type: source-note
title: "{{title | escape}}"
citekey: "{{citekey}}"
year: "{{date | format("YYYY")}}"
authors: "{{authors}}"
doi: "{{DOI}}"
url: "{{url}}"
projects: []
topics: []
ai_explanation_done: false
my_note_done: false
imported: "{{importDate | format("YYYY-MM-DD")}}"
tags:
  - paper/source
---

# {{title}}

> [!info]- Source metadata
> - **Authors**: {{authors}}
> - **Year**: {{date | format("YYYY")}}
> - **Venue**: {{publicationTitle}}
> - **DOI**: {{DOI}}
> - **Zotero / PDF**: {{pdfZoteroLink}}
> - **Citation**: {{bibliography}}

## Abstract

{{abstractNote}}

## Questions before ChatGPT

<!-- 上传 PDF 前，先写下你希望讲解稿重点回答的问题。 -->

- 

## Zotero Annotations

{% for annotation in annotations %}
{% if annotation.annotatedText %}
> [!quote|{{annotation.colorCategory}}]+ [p. {{annotation.pageLabel}}](zotero://open-pdf/library/items/{{annotation.attachment.itemKey}}?page={{annotation.pageLabel}}&annotation={{annotation.id}})
> {{annotation.annotatedText | nl2br}}
{% if annotation.comment %}
>
> **My annotation**: {{annotation.comment | nl2br}}
{% endif %}
{% if annotation.imageRelativePath %}
> ![[{{annotation.imageRelativePath}}]]
{% endif %}
{% endif %}
{% endfor %}

## Pipeline links

- AI explanation:
- My note:

<!-- Source Note 只保存原始材料。不要在这里写长篇个人总结。 -->
