#zsh #tools 

![](https://gitee.com/liuzhongkun1/img-store/raw/master/20231/1674298103_zztnuti00p.png1674298103071.png)

## 一、 环境准备

这个美化教程适合于大多数的 Linux 系统，其实可以通用的。

首先，我们需要进行一定的环境准备：

安装 Git，以及对 Git 进行相关配置

```shell
sudo apt update
sudo apt upgrade
sudo apt install git  # 安装 git 仓库管理器
git --version  # 查看是否安装完成# 对 git 进行全局配置
git config --global user.name Tendourisu
git config --global user.email hd-zhu23@mails.tsinghua.edu.cn
```

安装其余工具：

```shell
sudo apt install zsh curl
```

下载 oh-my-zsh：

```shell
sh -c "$(curl -fsSL https://raw.githubusercontent.com/robbyrussell/oh-my-zsh/master/tools/install.sh)"
```

> 记得在中途把默认的 bash 修改为 zsh。

```bash
# 设置为默认 Shell
chsh -s /usr/bin/zsh
```

## 二、 配置文件

### 1、 主题

大家可以在 [https://github.com/ohmyzsh/ohmyzsh/wiki/Themes](https://github.com/ohmyzsh/ohmyzsh/wiki/Themes) 查看 oh-my-zsh 中的主题，修改 `~/.zshrc` 文件(我使用的是`powerlevel10k/powerlevel10k`)：

```shell
ZSH_THEME = "powerlevel10k/powerlevel10k"
```

### 2、 修改插件

#### 2.1 官方插件

官方自带插件：[https://github.com/ohmyzsh/ohmyzsh/wiki/Plugins](https://github.com/ohmyzsh/ohmyzsh/wiki/Plugins)

大家可以在里面查找官方自带的插件，然后修改`~/.zshrc`配置文件，默认添加 git 插件，如：我需要添加 poetry 插件：

```shell
plugins=(	git	poetry)
```

设置完之后，我们需要运行`source ~/.zshrc`来刷新 zsh 的配置。

#### 2.2 第三方插件

推荐的第三方插件：`zsh-syntax-highlighting`, `zsh-autosuggestions`

如，我想要安装 `zsh-autosuggestions`插件，我们可以这样：

```shell
git clone https://github.com/zsh-users/zsh-autosuggestions ~/.oh-my-zsh/custom/plugins/zsh-autosuggestions \
&& git clone https://github.com/zsh-users/zsh-syntax-highlighting.git ~/.oh-my-zsh/custom/plugins/zsh-syntax-highlighting
```

```text
plugins=(
	git
	zsh-syntax-highlighting
	zsh-autosuggestions
)
```

> custom 文件夹存放的是我们的第三方文件

然后，我们把文件下载到指定文件夹内之后，我们就可以把插件名字添加在 plugins 变量里面了。

最后，运行`source ~/.zshrc`就可以实现第三方插件的导入了。
