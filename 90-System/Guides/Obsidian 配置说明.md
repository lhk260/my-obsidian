# Obsidian 配置说明

## 论文笔记只保留的属性

### Source Note

| 属性 | 用途 |
|---|---|
| `type` | 固定为 `source-note`，供 Dataview 识别 |
| `title` | 论文标题 |
| `citekey` | Zotero 与三层笔记的唯一标识 |
| `status` | `inbox / explaining / explained` |
| `year`、`authors`、`doi`、`url` | 必要文献元数据 |
| `ai_note`、`my_note` | 关联另外两层笔记 |
| `imported` | 导入日期 |

### AI Explanation

只保留 `type、title、citekey、status、source、my_note、created`。这是中间材料，不保存主题、评分和项目判断。

### My Note

只保留 `type、title、citekey、status、source、ai_note、topics、projects、rating、created、modified`。主题、项目和评分只放在个人笔记，避免三处重复维护。

## 为什么不再使用论文标签

论文流程已经由文件夹、`type` 和 `status` 完整表达。`paper/source`、`paper/ai-explanation`、`paper/my-note` 等标签与这些信息重复，所以移除。`#flashcards` 和 `#review` 仍可按需写在正文中，它们是复习插件的功能开关。

## 保留启用的社区插件

| 插件 | 用途 |
|---|---|
| QuickAdd | 两个论文自动化命令 |
| Zotero Integration | 从 Zotero 导入 Source Note 和批注 |
| Dataview | Literature Dashboard |
| Templater | 日记、概念和个人笔记模板 |
| PDF++ | Vault 内 PDF 阅读与页码链接 |
| Latex Suite | 快速输入论文公式 |
| Easy Typing | 中文输入和标点优化 |
| Linter | Markdown 基础格式统一 |
| Auto Link Title | 粘贴网页链接时补标题 |
| Calendar + Periodic Notes | 日记和周记 |
| Paste Image Rename | 图片附件命名 |
| Spaced Repetition | 可选的 `#flashcards`、`#review` |
| Remotely Save | 保留现有远程同步配置 |

其余插件只是停用，没有删除插件文件或配置，需要时可以重新启用。Obsidian Git 已停用，避免启动时继续弹出 remote/origin 错误。

## 其他保留设置

- 新建普通笔记统一进入 `00-Inbox`，避免根目录继续堆文件。
- 删除文件重新显示确认；删除目标仍是 Vault 内的 `.trash`，可恢复。
- 附件继续进入 `90-System/Attachments`。
- 自动更新内部链接保持开启，移动或改名笔记时链接会一起更新。
- 核心 Daily Notes 和核心 Templates 已关闭，分别由 Periodic Notes 和 Templater 接管，避免两套设置冲突。
- Calendar 的周记目录已与 Periodic Notes 统一为 `10-Daily/weekly`。
- Linter 不再自动添加 `title`、搬运正文 tag 或重排 YAML，防止属性再次膨胀。

## 日常操作

1. Zotero Integration 导入论文。
2. 打开的 Source Note 中按 `Ctrl + Alt + G`。
3. ChatGPT 网页版发送提示词。
4. 回答完成后点击回答下方“复制”按钮。
5. 回到 Obsidian 按 `Ctrl + Alt + V`。
6. AI Note 自动写好；随后只需完成 My Note。
