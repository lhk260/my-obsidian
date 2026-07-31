function cleanClipboardMarkdown(input) {
  let text = String(input ?? "")
    .replace(/\r\n?/g, "\n")
    .replace(/[\u00A0\u2007\u202F]/g, " ")
    .replace(/[\u200B-\u200D\uFEFF]/g, "")
    .trim();

  const fenced = text.match(/^```(?:markdown|md)?\s*\n([\s\S]*?)\n```\s*$/i);
  if (fenced) text = fenced[1].trim();

  // ChatGPT 有时会把已有 AI Note 的 YAML 和“使用说明”一起复制回来。
  // 只保留规范正文，从而避免 YAML 出现在笔记正文中。
  const canonicalHeading = text.search(/^# 论文定位\s*$/m);
  if (canonicalHeading >= 0) {
    text = text.slice(canonicalHeading);
  } else {
    text = text.replace(/^---\s*\n[\s\S]*?\n---\s*\n/, "");
  }

  const lines = text.split("\n").map((line) => line.replace(/[ \t]+$/g, ""));
  const output = [];
  let inMath = false;

  const compactKinds = (line) =>
    /^(?:[-*+] |\d+[.)] |>|\|)/.test(line.trim());

  for (let index = 0; index < lines.length; index += 1) {
    const line = lines[index];
    const trimmed = line.trim();

    if (trimmed === "$$") {
      inMath = !inMath;
      output.push("$$");
      continue;
    }

    if (trimmed !== "") {
      output.push(line);
      continue;
    }

    const previous = output.length ? output[output.length - 1].trim() : "";
    let next = "";
    for (let cursor = index + 1; cursor < lines.length; cursor += 1) {
      if (lines[cursor].trim() !== "") {
        next = lines[cursor].trim();
        break;
      }
    }

    // 删除网页选择复制产生的“每一行之间一个空行”，但保留正常段落。
    if (
      inMath ||
      !previous ||
      !next ||
      (compactKinds(previous) && compactKinds(next)) ||
      (previous.startsWith("|") && next.startsWith("|")) ||
      (previous.startsWith(">") && next.startsWith(">"))
    ) {
      continue;
    }

    if (output[output.length - 1] !== "") output.push("");
  }

  return output.join("\n").replace(/\n{3,}/g, "\n\n").trim() + "\n";
}

function frontmatterValue(file, key) {
  return app.metadataCache.getFileCache(file)?.frontmatter?.[key];
}

async function findAiFile(activeFile) {
  if (!activeFile || activeFile.extension !== "md") return null;
  const type = frontmatterValue(activeFile, "type");
  if (type === "ai-explanation") return activeFile;

  const citekey = frontmatterValue(activeFile, "citekey");
  if (!citekey) return null;
  const candidate = app.vault.getAbstractFileByPath(
    `20-Literature/AI-Explanations/${citekey}.ai.md`
  );
  return candidate?.extension === "md" ? candidate : null;
}

async function updateStatus(file, status, extra = {}) {
  if (!file || file.extension !== "md") return;
  await app.fileManager.processFrontMatter(file, (properties) => {
    properties.status = status;
    Object.assign(properties, extra);
  });
}

module.exports = async function () {
  const activeFile = app.workspace.getActiveFile();
  const aiFile = await findAiFile(activeFile);

  if (!aiFile) {
    new Notice("请打开 Source Note 或对应的 .ai.md 笔记后再运行。", 7000);
    return;
  }

  const clipboard = await navigator.clipboard.readText();
  if (!clipboard || clipboard.trim().length < 100) {
    new Notice("剪贴板内容太短。请点击 ChatGPT 回答下方的“复制”按钮后重试。", 8000);
    return;
  }

  const cleaned = cleanClipboardMarkdown(clipboard);
  if (!/^#\s+/m.test(cleaned)) {
    new Notice("没有检测到 Markdown 标题；请使用 ChatGPT 回答下方的复制按钮。", 8000);
    return;
  }

  const current = await app.vault.cachedRead(aiFile);
  const marker = "<!-- AI_BODY_START -->";
  const markerIndex = current.indexOf(marker);
  let prefix;

  if (markerIndex >= 0) {
    prefix = current.slice(0, markerIndex + marker.length).trimEnd();
  } else {
    const yamlMatch = current.match(/^---\s*\n[\s\S]*?\n---\s*/);
    prefix = yamlMatch
      ? `${yamlMatch[0].trim()}\n\n${marker}`
      : `${marker}`;
  }

  await app.vault.modify(aiFile, `${prefix}\n\n${cleaned}`);
  await updateStatus(aiFile, "complete");

  const citekey = frontmatterValue(aiFile, "citekey") || aiFile.basename.replace(/\.ai$/, "");
  const sourceFile = app.vault.getAbstractFileByPath(
    `20-Literature/Sources/${citekey}.md`
  );
  const myFile = app.vault.getAbstractFileByPath(
    `20-Literature/My-Notes/${citekey}.my.md`
  );

  await updateStatus(sourceFile, "explained");
  await updateStatus(myFile, "draft");
  await app.workspace.getLeaf(false).openFile(aiFile);
  new Notice("ChatGPT 回答已清理并写入 AI Note；重复 YAML 和多余空行已移除。", 9000);
};
