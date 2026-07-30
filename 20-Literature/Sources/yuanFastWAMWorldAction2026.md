---
type: source-note
title: "Fast-WAM: Do World Action Models Need Test-time Future Imagination?"
citekey: "yuanFastWAMWorldAction2026"
year: "2026"
authors: "Tianyuan Yuan, Zibin Dong, Yicheng Liu, Hang Zhao"
doi: "10.48550/arXiv.2603.16666"
url: "http://arxiv.org/abs/2603.16666"
projects: []
topics: []
ai_explanation_done: false
my_note_done: false
imported: "2026-07-30"
tags:
  - paper/source
---

# Fast-WAM: Do World Action Models Need Test-time Future Imagination?

> [!info]- Source metadata
> - **Authors**: Tianyuan Yuan, Zibin Dong, Yicheng Liu, Hang Zhao
> - **Year**: 2026
> - **Venue**: 
> - **DOI**: 10.48550/arXiv.2603.16666
> - **Zotero / PDF**: [Preprint PDF](zotero://select/library/items/VZBB5ATT)
> - **Citation**: Yuan, Tianyuan, Zibin Dong, Yicheng Liu和Hang Zhao. 《Fast-WAM: Do World Action Models Need Test-time Future Imagination?》 arXiv:2603.16666. 预印本, arXiv, 2026年3月23日. [https://doi.org/10.48550/arXiv.2603.16666](https://doi.org/10.48550/arXiv.2603.16666).

## Abstract

World Action Models (WAMs) have emerged as a promising alternative to Vision-Language-Action (VLA) models for embodied control because they explicitly model how visual observations may evolve under action. Most existing WAMs follow an imagine-then-execute paradigm, incurring substantial test-time latency from iterative video denoising, yet it remains unclear whether explicit future imagination is actually necessary for strong action performance. In this paper, we ask whether WAMs need explicit future imagination at test time, or whether their benefit comes primarily from video modeling during training. We disentangle the role of video modeling during training from explicit future generation during inference by proposing \textbf{Fast-WAM}, a WAM architecture that retains video co-training during training but skips future prediction at test time. We further instantiate several Fast-WAM variants to enable a controlled comparison of these two factors. Across these variants, we find that Fast-WAM remains competitive with imagine-then-execute variants, while removing video co-training causes a much larger performance drop. Empirically, Fast-WAM achieves competitive results with state-of-the-art methods both on simulation benchmarks (LIBERO and RoboTwin) and real-world tasks, without embodied pretraining. It runs in real time with 190ms latency, over 4$\times$ faster than existing imagine-then-execute WAMs. These results suggest that the main value of video prediction in WAMs may lie in improving world representations during training rather than generating future observations at test time. Project page: https://yuantianyuan01.github.io/FastWAM/

## Questions before ChatGPT

<!-- 上传 PDF 前，先写下你希望讲解稿重点回答的问题。 -->

- 

## Zotero Annotations



> [!quote|Yellow]+ [p. 1](zotero://open-pdf/library/items/VZBB5ATT?page=1&annotation=BURTPP5N)
> whether WAMs need explicit future imagination at test time, or whether their benefit comes primarily from video modeling during training





## Pipeline links

- AI explanation:
- My note:

<!-- Source Note 只保存原始材料。不要在这里写长篇个人总结。 -->
