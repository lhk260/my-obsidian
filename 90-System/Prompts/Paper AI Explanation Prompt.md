# ChatGPT 首次讲解提示词

日常不需要手动复制本文件。打开 Source Note 后按 `Ctrl + Alt + G`，脚本会根据当前论文自动生成提示词，并加入：

- arXiv HTML/PDF/摘要链接；
- 论文标题与 citekey；
- `Questions before ChatGPT`；
- Zotero Annotations；
- 固定的论文讲解结构和全文读取验证要求。

ChatGPT 回答结束后点击回答下方的“复制”按钮，回到 Obsidian 按 `Ctrl + Alt + V`。脚本会自动清理重复 YAML、代码围栏、特殊空格和网页复制造成的多余空行，并写入对应 AI Note。

如果快捷键暂时不可用，可以从 QuickAdd 命令中依次运行：

1. `论文 → ChatGPT`
2. `ChatGPT 回答 → AI Note`
