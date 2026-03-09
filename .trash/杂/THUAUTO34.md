---
title: THUAUTO34
tags:
  - notes
date: " 2025-03-03T19:20:07+08:00 "
modify: " 2025-03-03T19:20:07+08:00 "
share: false
cdate: " 2025-03-03 "
mdate: " 2025-03-03 "
math: "true"
---

想法：创建一个自 34 的 notes 记录网站（~~也可以记录一些别的东西~~）  
初步想法：使用 mkdocs 托管在 githubpage 实现，以 md 文件的形式记录。  
每一个学科可以用一个文件夹然后按周分类

- 个人感觉可以让同学们把 md 文件的笔记资料发给我，然后由我部署在网站上。
- 也可以统一上传到班级云盘上，然后我再整理到网站上
- 也使用 github 的 pr，但效率有点慢，个人认为可以让愿意 pr 的同学自行 pr

>[!hint]+  
>- 推荐一款笔记软件 obsidian, 大家可以去 [GitHub - Tendourisu/my-obsidian](https://github.com/Tendourisu/my-obsidian) clone 下我的仓库（~~点个 star 谢谢喵~~），然后留下. obsidian 这个文件夹，就可以使用我的插件配置了。你也可以去网上搜索别人的 obsidian 配置。
>- 推荐一个图床软件 [GitHub - Molunerfinn/PicGo: :rocket:A simple & beautiful tool for pictures uploading built by vue-cli-electron-builder](https://github.com/Molunerfinn/PicGo/)，按照官方仓库配置好 picgo，然后再在 obsidian 中配置好“image auto upload plugin”, 你就能实现将电脑的复制缓冲区的图片用“CTRL + V”一键上传到图床并将 md 格式的引用粘贴到光标位置。对于手写笔记的同学可以用该方法快速拍照并将照片部署到 md 文件中
>- 对于手写笔记的同学，也可以使用大模型（Claude 3.7 deepseek gpt 等）用 prompt 快速将笔记转为 md 内容。图片提取 md 的prompt 也可以让大模型帮你写
>- 该网站支持 callout 语法，形如  
>   `>[!hint]+ 你想呈现的标题`  
>   `> 正文`  
>   `> 正文`  
>   其中`+`号代表默认初始展开正文，`-`代表默认初始折叠正文  
>   详细语法见[Callout语法 - Obsidian中文教程 - Obsidian Publish](https://publish.obsidian.md/chinesehelp/01+2021%E6%96%B0%E6%95%99%E7%A8%8B/Callout%E8%AF%AD%E6%B3%95)

网站具体效果可以参考 [Tendourisu's Site](https://tendourisu.github.io/)( ~~点点 star 谢谢喵~~)
现网站初步搭设效果：[THUAUTO34](https://tendourisu.github.io/THUAUTO34/)( ~~点点 star 谢谢喵~~)