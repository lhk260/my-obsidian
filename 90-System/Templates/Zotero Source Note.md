---
type: source-note
title: "{{title | escape}}"
citekey: "{{citekey}}"
status: inbox
year: "{{date | format("YYYY")}}"
authors: "{{authors}}"
doi: "{{DOI}}"
url: "{{url}}"
ai_note: "[[{{citekey}}.ai]]"
my_note: "[[{{citekey}}.my]]"
imported: "{{importDate | format("YYYY-MM-DD")}}"
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

## Pipeline

- AI explanation: [[{{citekey}}.ai]]
- My note: [[{{citekey}}.my]]
