---
title: " 2025-01-19 "
tags:
  - git
categories: dairy
date: " 2025-01-24T10:56:47+08:00 "
modify: " 2025-01-24T10:56:47+08:00 "
dir: dairy
share: false
cdate: " 2025-01-24 "
mdate: " 2025-01-24 "
---

# 对fork 仓库进行修改后 pr 的流程（你没有权限，是提 pr 的）

1. 切换到main分支： 

```shell
git checkout main
```

2. 获取上游仓库最新代码： 

```shell
git fetch upstream
```

3. 将本地main分支重置为上游仓库状态： 

```shell
git reset --hard upstream/main
```

4. 强制推送更新到origin远程仓库： 

```shell
git push --force origin main
```

5. 切换到some-changes分支： 

```shell
git checkout some-changes
```

6. 将some-changes分支基于最新的main分支： 

```shell
git rebase main
```

7. 解决可能出现的冲突（如果有）
8. 推送更新后的some-changes分支： 

```shell
git push --force origin some-changes
```

本地可能只有 `main` 分支，而 `feature-branch` 是远程仓库中的分支。为了在本地合并 `feature-branch`，你需要先将远程分支拉取到本地。以下是详细步骤：

# 对 remote 仓库中的分支进行合并的流程（你有权限，是解决 pr 的）

### 1. 拉取远程分支到本地

1. **获取远程分支信息**：

    ```bash
    git fetch origin
    ```

    这会更新本地的远程分支信息，但不会自动创建本地分支。

2. **在本地创建并切换到 `feature-branch` 分支**：

    ```bash
    git checkout -b feature-branch origin/feature-branch
    ```

    这会在本地创建一个 `feature-branch` 分支，并将其与远程的 `feature-branch` 分支关联起来。

### 2. 合并 `feature-branch` 到 `main`

1. **切换到 `main` 分支**：

    ```bash
    git checkout main
    ```

2. **拉取最新的 `main` 分支代码**：

    ```bash
    git pull origin main
    ```

3. **合并 `feature-branch` 到 `main`**：

    ```bash
    git merge feature-branch
    ```

4. **解决冲突（如果有）**： 如果合并过程中有冲突，Git会提示你解决冲突。你需要手动编辑冲突文件，然后标记冲突已解决：    

    ```bash
    git add <冲突文件>
    ```

5. **提交合并结果**：

    ```bash
    git commit -m "Merge feature-branch into main"
    ```

6. **推送合并后的 `main` 分支到远程仓库**：

    ```bash
    git push origin main
    ```

### 3. 清理本地分支（可选）

如果你不再需要本地的 `feature-branch` 分支，可以将其删除：

```bash
git branch -d feature-branch
```

如果你不再需要远程的 `feature-branch` 分支，可以将其删除：

```shell
git push origin --delete lab00-backup
```

```

*   93d48b4 (HEAD -> main) Merge branch 'lab00-backup'
|\  
| * a996a22 (origin/lab00-backup, lab00-backup) initialize
| * ff4f3b4 (starter/main) [lab09] add starter (#9)
| * 1e8ad6f [lab08] add starter (#8)
| * f221192 [lab07] add starter
| * 53eff2a [lab06] add starter (#5)
| * b1c46c8 [lab05] add starter
| * 53c001e [Lab04] Add starter
| * 175ece1 [Lab03] Adding starter
| * 263e24b [Lab02] Adding starter
| * 8adaa37 [Lab01] Adding starter
* |   0e0b188 (origin/main) Merge branch 'main' of github.com:Tendourisu/cs61c
|\ \  
| * | c8fa506 (starter/lab00-oski) [lab00] fix fizzbuzz
| |/  
* / 1126d0d fix code.oy
|/  
* 727cde1 [lab00] add files
* 3c8c421 [meta] init repo
```

```
*   93d48b4 (HEAD -> main, origin/main) Merge branch 'lab00-backup'
|\  
| * a996a22 (origin/lab00-backup, lab00-backup) initialize
| * ff4f3b4 (starter/main) [lab09] add starter (#9)
| * 1e8ad6f [lab08] add starter (#8)
| * f221192 [lab07] add starter
| * 53eff2a [lab06] add starter (#5)
| * b1c46c8 [lab05] add starter
| * 53c001e [Lab04] Add starter
| * 175ece1 [Lab03] Adding starter
| * 263e24b [Lab02] Adding starter
| * 8adaa37 [Lab01] Adding starter
* |   0e0b188 Merge branch 'main' of github.com:Tendourisu/cs61c
|\ \  
| * | c8fa506 (starter/lab00-oski) [lab00] fix fizzbuzz
| |/  
* / 1126d0d fix code.oy
|/  
* 727cde1 [lab00] add files
* 3c8c421 [meta] init repo
```
