function yamlString(value) {
  return JSON.stringify(String(value ?? ""));
}

function today() {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function section(markdown, heading) {
  const escaped = heading.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const match = markdown.match(
    new RegExp(`^## ${escaped}\\s*\\n([\\s\\S]*?)(?=^## |\\Z)`, "m")
  );
  return match ? match[1].trim() : "";
}

function arxivId(...values) {
  for (const value of values) {
    const match = String(value ?? "").match(
      /(?:arxiv(?:\.org\/(?:abs|pdf|html)\/|:)|10\.48550\/arxiv\.)(\d{4}\.\d{4,5})(?:v\d+)?/i
    );
    if (match) return match[1];
  }
  return "";
}

async function ensureFolder(folderPath) {
  const normalized = folderPath.replace(/\\/g, "/").replace(/\/+/g, "/");
  if (!app.vault.getAbstractFileByPath(normalized)) {
    await app.vault.createFolder(normalized);
  }
}

async function createIfMissing(path, content) {
  const normalized = path.replace(/\\/g, "/").replace(/\/+/g, "/");
  const existing = app.vault.getAbstractFileByPath(normalized);
  if (existing?.extension === "md") return existing;
  return app.vault.create(normalized, content);
}

function makeAiNote({ title, citekey, sourceName, myName, links }) {
  return `---
type: ai-explanation
title: ${yamlString(title)}
citekey: ${yamlString(citekey)}
status: waiting
source: "[[${sourceName}]]"
my_note: "[[${myName}]]"
created: ${today()}
---

# 使用说明

> [!tip] 已复制讲解提示词并打开 ChatGPT
> 在 ChatGPT 按 \`Ctrl+V\` 发送。回答完成后点击回答下方的“复制”，回到 Obsidian 按 \`Ctrl+Alt+V\`，脚本会自动清理并写入。

## 在线全文

${links.map((link) => `- ${link}`).join("\n")}

<!-- AI_BODY_START -->
`;
}

function makeMyNote({ title, citekey, sourceName, aiName }) {
  return `---
type: my-paper-note
title: ${yamlString(title)}
citekey: ${yamlString(citekey)}
status: draft
source: "[[${sourceName}]]"
ai_note: "[[${aiName}]]"
rating:
projects: []
topics: []
created: ${today()}
modified: ${today()}
---

# 一句话理解

# 核心问题

# 核心机制

# 训练与推理

## 训练阶段

## 推理阶段

# 最关键证据

# 我的判断

## 我相信的部分

## 我不完全相信的部分

# 与我的研究

# 最小验证实验

- **假设**：
- **修改**：
- **Baseline**：
- **指标**：

# 未解决问题

- [ ]

# Active Recall

Q:: 这篇论文最关键、可证伪的主张是什么？
A::
`;
}

function makePrompt({ title, citekey, links, questions, annotations }) {
  const evidence = annotations || "（尚无 Zotero 批注）";
  const focus = questions || "（尚未填写；请完整讲解）";
  return `请联网阅读并讲解这篇论文。

论文标题：${title}
citekey：${citekey}

在线入口：
${links.map((link) => `- ${link}`).join("\n")}

我阅读前的问题：
${focus}

我的 Zotero 批注：
${evidence}

要求：
1. 必须阅读全文，不要只根据摘要回答；优先读取 HTML 全文，必要时使用 PDF。
2. 开头先列出论文标题、版本、总页数、第 2 节和第 3 节标题，证明你读取了全文。无法访问全文时明确说明，不要猜测。
3. 从问题设定和作者假设开始，给出完整的方法数据流。
4. 明确 observation、state、action、监督信号、输出和 loss。
5. 严格区分训练流程和推理流程。
6. 解释关键公式，先定义所有变量；重要结论注明页码、图号或表号。
7. 逐条建立 Claim—Evidence 对应，并检查信息泄漏、不公平 baseline 和训练—部署不一致。
8. 区分“论文明确事实”“你的合理推断”“必须查看代码确认”。
9. 分析局限性、与我的研究可能相关的机制，并提出一个低成本、可证伪的最小验证实验。
10. 最终只输出正文 Markdown，不要输出 YAML/Frontmatter，不要重复“使用说明”和在线链接，也不要使用包住全文的代码围栏。
11. 回答完成后，我会使用回答下方的“复制”按钮，再由 Obsidian 自动写入，因此请保留标准 Markdown 标题、表格和公式语法。

请使用以下正文结构：
# 论文定位
# 问题设定
# 方法总览
# 输入、输出与张量
# 模块逐一讲解
# 训练流程
# 推理流程
# 公式讲解
# 实验与 Claim—Evidence
# 批判性分析
# 与我的研究的关系
# 最小验证实验
# 可信度边界
## 论文明确事实
## ChatGPT 合理推断
## 必须查看代码确认`;
}

module.exports = async function () {
  const sourceFile = app.workspace.getActiveFile();
  if (!sourceFile || sourceFile.extension !== "md") {
    new Notice("请先打开一篇 Zotero Source Note。", 6000);
    return;
  }

  const cache = app.metadataCache.getFileCache(sourceFile);
  const frontmatter = cache?.frontmatter ?? {};
  if (frontmatter.type !== "source-note") {
    new Notice("当前文件不是 source-note；请先打开 Zotero 导入的论文笔记。", 7000);
    return;
  }

  const sourceText = await app.vault.cachedRead(sourceFile);
  const title = frontmatter.title || sourceFile.basename;
  const citekey = frontmatter.citekey || sourceFile.basename;
  const sourceName = sourceFile.basename;
  const aiName = `${citekey}.ai`;
  const myName = `${citekey}.my`;
  const id = arxivId(frontmatter.url, frontmatter.doi, sourceText);

  const links = [];
  if (id) {
    links.push(`摘要：https://arxiv.org/abs/${id}`);
    links.push(`HTML 全文：https://arxiv.org/html/${id}`);
    links.push(`PDF 全文：https://arxiv.org/pdf/${id}`);
  } else {
    if (frontmatter.url) links.push(`论文网页：${frontmatter.url}`);
    if (frontmatter.doi) links.push(`DOI：https://doi.org/${frontmatter.doi}`);
  }

  if (!links.length) {
    new Notice("没有找到 arXiv、URL 或 DOI；请先补充 Source Note 的 url 字段。", 8000);
    return;
  }

  await ensureFolder("20-Literature/AI-Explanations");
  await ensureFolder("20-Literature/My-Notes");

  const aiFile = await createIfMissing(
    `20-Literature/AI-Explanations/${aiName}.md`,
    makeAiNote({ title, citekey, sourceName, myName, links })
  );
  await createIfMissing(
    `20-Literature/My-Notes/${myName}.md`,
    makeMyNote({ title, citekey, sourceName, aiName })
  );

  const updatedSource = sourceText
    .replace(/^- AI explanation:.*$/m, `- AI explanation: [[${aiName}]]`)
    .replace(/^- My note:.*$/m, `- My note: [[${myName}]]`);
  if (updatedSource !== sourceText) {
    await app.vault.modify(sourceFile, updatedSource);
  }
  await app.fileManager.processFrontMatter(sourceFile, (properties) => {
    properties.status = "explaining";
    properties.ai_note = `[[${aiName}]]`;
    properties.my_note = `[[${myName}]]`;
  });

  const prompt = makePrompt({
    title,
    citekey,
    links,
    questions: section(sourceText, "Questions before ChatGPT"),
    annotations: section(sourceText, "Zotero Annotations"),
  });

  await navigator.clipboard.writeText(prompt);
  await app.workspace.getLeaf(false).openFile(aiFile);
  window.open("https://chatgpt.com/", "_blank");
  new Notice("已创建笔记并打开 ChatGPT。发送后点击回答的“复制”，回 Obsidian 按 Ctrl+Alt+V。", 10000);
};
