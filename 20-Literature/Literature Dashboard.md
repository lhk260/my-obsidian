# Literature Dashboard

> [!tip] 固定流程
> **Source → ChatGPT AI Explanation → My Note → 核验**

## 1 · 尚未送入 ChatGPT

```dataview
TABLE citekey, year
FROM "20-Literature/Sources"
WHERE type = "source-note" AND status = "inbox"
SORT file.mtime DESC
```

## 2 · 等待复制 ChatGPT 回答

```dataview
TABLE citekey, source
FROM "20-Literature/AI-Explanations"
WHERE type = "ai-explanation" AND status = "waiting"
SORT file.mtime DESC
```

## 3 · AI 讲解已完成，个人笔记待写

```dataview
TABLE citekey, topics, projects
FROM "20-Literature/My-Notes"
WHERE type = "my-paper-note" AND status = "draft"
SORT file.mtime DESC
```

## 4 · 个人笔记待核验

```dataview
TABLE citekey, rating, topics, projects
FROM "20-Literature/My-Notes"
WHERE type = "my-paper-note" AND status = "complete"
SORT file.mtime DESC
```

## 5 · 已完成

```dataview
TABLE citekey, rating, topics, projects
FROM "20-Literature/My-Notes"
WHERE type = "my-paper-note" AND status = "verified"
SORT rating DESC
```

## 快捷键

- `Ctrl + Alt + G`：从 Source Note 创建笔记、复制提示词、打开 ChatGPT 网页版。
- `Ctrl + Alt + V`：读取剪贴板，清理 ChatGPT Markdown 并写入 AI Note。

## 状态含义

- Source Note：`inbox → explaining → explained`
- AI Explanation：`waiting → complete`
- My Note：`draft → complete → verified`
