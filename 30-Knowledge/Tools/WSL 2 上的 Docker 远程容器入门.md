# WSL 2 上的 Docker 远程容器入门

本分步指南将通过使用 WSL 2（适用于 Linux 的 Windows 子系统，版本 2）设置 Docker Desktop for Windows，帮助开始使用远程容器进行开发。

Docker Desktop for Windows 为生成、交付和运行 Docker 化的应用提供了一个开发环境。 通过启用基于 WSL 2 的引擎，可以在同一计算机上的 Docker Desktop 中运行 Linux 和 Windows 容器。 （Docker Desktop 免费供个人和小型企业使用，有关专业、团队或企业定价的信息，请参阅 [Docker 站点常见问题解答](https://www.docker.com/pricing/faq)）。

 备注

建议使用 Docker Desktop，因为它[与 Windows 和适用于 Linux 的 Windows 子系统集成](https://docs.docker.com/desktop/windows/wsl/)。 但是，虽然 Docker Desktop 支持运行 Linux 和 Windows 容器，但**不**能同时运行它们两个。 若要同时运行 Linux 和 Windows 容器，需要在 WSL 中安装并运行单独的 Docker 实例。 如果需要同时运行容器，或者只是希望直接在 Linux 发行版中安装容器引擎，请按照该容器服务的 Linux 安装说明进行操作，例如[在 Ubuntu 上安装 Docker 引擎](https://docs.docker.com/engine/install/ubuntu/)或[安装 Podman 以运行 Linux 容器](https://podman.io/getting-started/installation#windows)。

[](https://learn.microsoft.com/zh-cn/windows/wsl/tutorials/wsl-containers#overview-of-docker-containers)

## Docker 容器概述

Docker 是一种工具，用于创建、部署和运行应用程序（通过使用容器）。 容器使开发人员可以将应用与需要的所有部件（库、框架、依赖项等）打包为一个包一起交付。 使用容器可确保此应用的运行与之前相同，而不受任何自定义设置或运行该应用的计算机上先前安装的库的影响（运行应用的计算机可能与用于编写和测试应用代码的计算机不同）。 这使开发人员可以专注于编写代码，而无需操心将运行代码的系统。

Docker 容器与虚拟机类似，但不会创建整个虚拟操作系统。 相反，Docker 允许应用使用与运行它的系统相同的 Linux 内核。 这使得应用包能够仅要求主计算机上尚未安装的部件，从而降低包大小以及提高性能。

将 Docker 容器与 [Kubernetes](https://learn.microsoft.com/zh-cn/azure/aks/) 等工具结合使用以实现持续可用性是容器普及的另一个原因。 这样就可以在不同的时间创建应用容器的多个版本。 每个容器（及其特定的微服务）均可以动态更换，而无需停止整个系统来进行更新或维护。 你可以准备一个包含所有更新的新容器，将该容器设置用于生产，并在新容器准备就绪后直接指向该容器。 你还可以使用容器对不同版本的应用进行存档，如有需要，还可将其作为安全回退保持运行。

若要了解详细信息，请查看 [Docker 容器简介](https://learn.microsoft.com/zh-cn/training/modules/intro-to-docker-containers/)。

[](https://learn.microsoft.com/zh-cn/windows/wsl/tutorials/wsl-containers#prerequisites)

## 先决条件

- WSL 1.1.3.0 或更高版本。
- Windows 11 64 位：家庭版或专业版 21H2 或更高版本，或者企业版或教育版 21H2 或更高版本。
- Windows 10 64 位（推荐）：家庭版或专业版 22H2（内部版本 19045）或更高版本，或者企业版或教育版 22H2（内部版本 19045）或更高版本。 （最低要求）：家庭版或专业版 21H2（内部版本 19044）或更高版本，或者企业版或教育版 21H2（内部版本 19044）或更高版本。 [更新 Windows](ms-settings:windowsupdate)
- 具有[二级地址转换 (SLAT)](https://en.wikipedia.org/wiki/Second_Level_Address_Translation) 的 64 位处理器。
- 4GB 系统 RAM。
- 在 BIOS 中启用硬件虚拟化。
- [安装 WSL，并为在 WSL 2 中运行的 Linux 发行版设置用户名和密码](https://learn.microsoft.com/zh-cn/windows/wsl/install)。
- [安装 Visual Studio Code](https://code.visualstudio.com/download)_（可选）_。 这将提供最佳体验，包括能够在远程 Docker 容器中进行编码和调试并连接到 Linux 发行版。
- [安装 Windows 终端](https://learn.microsoft.com/zh-cn/windows/terminal/get-started)_（可选）_。 这将提供最佳体验，包括能够在同一界面中自定义和打开多个终端（包括 Ubuntu、Debian、PowerShell、Azure CLI 或你喜欢使用的任何内容）。
- [在 Docker Hub 中注册 Docker ID](https://hub.docker.com/signup)_（可选）_。
- 有关使用条款的更新，请参阅 [Docker Desktop 许可协议](https://docs.docker.com/subscription/#docker-desktop-license-agreement)。

有关详细信息，请参阅[在 Windows 上安装 Docker Desktop 的 Docker 文档系统要求](https://docs.docker.com/desktop/install/windows-install/)。

若要了解如何在 Windows Server 上安装 Docker，请参阅[入门：为容器准备 Windows](https://learn.microsoft.com/zh-cn/virtualization/windowscontainers/quick-start/set-up-environment)。

 备注

WSL 可以在 WSL 版本 1 或 WSL 2 模式下运行发行版。 可通过打开 PowerShell 并输入以下内容进行检查：`wsl -l -v`。 通过输入 `wsl --set-version <distro> 2`，确保发行版设置为使用 WSL 2。 将 `<distro>` 替换为发行版名称（例如 Ubuntu 18.04）。

在 WSL 版本 1 中，由于 Windows 和 Linux 之间的根本差异，Docker 引擎无法直接在 WSL 内运行，因此 Docker 团队使用 Hyper-V VM 和 LinuxKit 开发了一个替代解决方案。 但是，由于 WSL 2 现在在具有完整系统调用容量的 Linux 内核上运行，因此 Docker 可以在 WSL 2 中完全运行。 这意味着 Linux 容器可以在没有模拟的情况下以本机方式运行，从而在 Windows 和 Linux 工具之间实现更好的性能和互操作性。

[](https://learn.microsoft.com/zh-cn/windows/wsl/tutorials/wsl-containers#install-docker-desktop)

## 安装 Docker Desktop

借助 Docker Desktop for Windows 中支持的 WSL 2 后端，可以在基于 Linux 的开发环境中工作并生成基于 Linux 的容器，同时使用 Visual Studio Code 进行代码编辑和调试，并在 Windows 上的 Microsoft Edge 浏览器中运行容器。

若要安装 Docker（在已[安装 WSL](https://learn.microsoft.com/zh-cn/windows/wsl/install) 之后）：

1. 下载 [Docker Desktop](https://docs.docker.com/docker-for-windows/wsl/#download) 并按照安装说明进行操作。
    
2. 安装后，从 Windows 开始菜单启动 Docker Desktop，然后从任务栏的隐藏图标菜单中选择 Docker 图标。 右键单击该图标以显示 Docker 命令菜单，然后选择“设置”。 ![Docker Desktop 仪表板图标](https://learn.microsoft.com/zh-cn/windows/wsl/media/docker-starting.png)
    
3. 确保在“设置”>“常规”中选中“使用基于 WSL 2 的引擎”。 ![Docker Desktop 常规设置](https://learn.microsoft.com/zh-cn/windows/wsl/media/docker-running.png)
    
4. 通过转到“设置”>“资源”>“WSL 集成”，从要启用 Docker 集成的已安装 WSL 2 发行版中进行选择。 ![Docker Desktop 资源设置](https://learn.microsoft.com/zh-cn/windows/wsl/media/docker-dashboard.png)
    
5. 若要确认已安装 Docker，请打开 WSL 发行版（例如 Ubuntu），并通过输入 `docker --version` 来显示版本和内部版本号
    
6. 通过使用 `docker run hello-world` 运行简单的内置 Docker 映像，测试安装是否正常工作

 提示

下面是一些需要了解的有用 Docker 命令：

- 通过输入以下命令列出 Docker CLI 中可用的命令：`docker`
- 使用以下命令列出特定命令的信息：`docker <COMMAND> --help`
- 使用以下命令列出计算机上的 docker 映像（此时仅为 hello-world 映像）：`docker image ls --all`
- 使用以下命令列出计算机上的容器：`docker container ls --all` 或 `docker ps -a`（如果没有 -a 显示全部标志，则仅显示正在运行的容器）
- 使用以下命令列出有关 Docker 安装的系统范围的信息，包括 WSL 2 上下文中你可使用的统计信息和资源（CPU 和内存）：`docker info`

[](https://learn.microsoft.com/zh-cn/windows/wsl/tutorials/wsl-containers#develop-in-remote-containers-using-vs-code)

## 使用 VS Code 在远程容器中开发

若要开始使用 Docker 和 WSL 2 开发应用，建议使用 VS Code 以及 WSL、Dev Containers 和 Docker 扩展。

- [安装 VS Code WSL 扩展](https://marketplace.visualstudio.com/items?itemName=ms-vscode-remote.remote-wsl)。 此扩展使你能够在 VS Code 中打开在 WSL 上运行的 Linux 项目（无需担心路径问题、二进制兼容性或其他跨 OS 的难题）。
    
- [安装 VS Code Dev Containers 扩展](https://marketplace.visualstudio.com/items?itemName=ms-vscode-remote.remote-containers)。 此扩展使你能够打开容器内的项目文件夹或存储库，并利用 Visual Studio Code 的完整功能集在容器中执行开发工作。
    
- [安装 VS Code Docker 扩展](https://marketplace.visualstudio.com/items?itemName=ms-azuretools.vscode-docker)。 此扩展添加了从 VS Code 内生成、管理和部署容器化应用程序的功能。 （需要 Dev Containers 扩展才能使用容器作为你的开发环境。）

让我们使用 Docker 为现有应用项目创建开发容器。

1. 对于此示例，我将在 Python 开发环境设置文档中使用[适用于 Django 的 Hello World 教程](https://learn.microsoft.com/zh-cn/windows/python/web-frameworks#hello-world-tutorial-for-django)中的源代码。如果想要使用自己的项目源代码，可以跳过此步骤。 若要从 GitHub 下载 HelloWorld-Django Web 应用，请打开 WSL 终端（例如 Ubuntu）并输入：`git clone https://github.com/mattwojo/helloworld-django.git`

     备注

    始终将代码存储在使用工具的相同文件系统中。 这将提高文件访问性能。 在本例中，我们使用的是 Linux 发行版 (Ubuntu)，并且想要将项目文件存储在 WSL 文件系统 `\\wsl\` 上。 在 WSL 中使用 Linux 工具访问项目文件时，将项目文件存储在 Windows 文件系统上会明显降低速度。

2. 在 WSL 终端中，将目录更改为此项目的源代码文件夹：

    Bash复制

    ```
    cd helloworld-django
    ```

3. 通过输入以下内容，在本地 WSL 扩展服务器上运行的 VS Code 中打开项目：

    Bash复制

    ```
    code .
    ```

    通过检查 VS Code 实例左下角的绿色远程指示器，确认已连接到 WSL Linux 发行版。

    ![VS Code WSL 远程指示器](https://learn.microsoft.com/zh-cn/windows/wsl/media/vscode-remote-indicator.png)

4. 从 VS Code 命令面板 (Ctrl + Shift + P)，输入：开发容器: 在容器中重新打开，因为我们使用的是已使用 WSL 扩展打开的文件夹。 也可使用“开发容器: 在容器中打开文件夹...”，以使用本地 `\\wsl$` 共享（从 Windows 端）选择 WSL 文件夹。 有关更多详细信息，请参阅 Visual Studio Code [快速入门：在容器中打开现有文件夹](https://code.visualstudio.com/docs/devcontainers/containers#_quick-start-open-an-existing-folder-in-a-container)。 如果这些命令在你开始键入时未显示，请检查并确保你已安装上面链接的 Dev Containers 扩展。

    ![VS Code 开发容器命令](https://learn.microsoft.com/zh-cn/windows/wsl/media/docker-extension.png)

5. 选择要容器化的项目文件夹。 在我的示例中，它是 `\\wsl\Ubuntu-20.04\home\mattwojo\repos\helloworld-django\`

    ![VS Code 开发容器文件夹](https://learn.microsoft.com/zh-cn/windows/wsl/media/docker-extension2.png)

6. 将显示容器定义列表，因为项目文件夹（存储库）中还没有 dev container 配置。 显示的容器配置定义列表将根据项目类型进行筛选。 对于 Django 项目，我将选择 Python 3。

    ![VS Code 开发容器配置定义](https://learn.microsoft.com/zh-cn/windows/wsl/media/docker-extension3.png)

7. 系统将打开新的 VS Code 实例，开始生成新映像，生成完成后，将启动容器。 将看到出现新的 `.devcontainer` 文件夹，其中 `Dockerfile` 和 `devcontainer.json` 文件中包含容器配置信息。

    ![VS Code .devcontainer 文件夹](https://learn.microsoft.com/zh-cn/windows/wsl/media/docker-extension4.png)

8. 若要确认项目仍然连接到 WSL 和容器中，请打开 VS Code 集成终端 (Ctrl + Shift + ~)。 通过输入 `uname` 检查操作系统，并通过 `python3 --version` 检查 Python 版本。 可以看到，uname 返回为“Linux”，因此你仍然连接到 WSL 2 引擎，Python 版本号将基于容器配置，该配置可能不同于 WSL 发行版上安装的 Python 版本。
    
9. 若要使用 Visual Studio Code 在容器内运行和调试应用，请首先打开“运行”菜单（Ctrl+Shift+D 或选择最左侧菜单栏上的选项卡）。 然后选择“运行和调试”以选择调试配置，并选择最适合项目的配置（在我的示例中，这将是“Django”）。 这会在项目的 `launch.json` 文件夹中创建一个 `.vscode` 文件，其中包含有关如何运行应用的说明。

    ![VS Code 运行调试配置](https://learn.microsoft.com/zh-cn/windows/wsl/media/vscode-run-config.png)

10. 在 VS Code 中，选择“运行”>“开始调试”（或只按 F5 键）。 这会在 VS Code 中打开终端，并且你应会看到如下所示的结果：“正在 [http://127.0.0.1:8000/](http://127.0.0.1:8000/) 启动开发服务器。使用 CONTROL-C 退出服务器。”按住 Control 键并选择显示的地址，以在默认 Web 浏览器中打开应用，并查看在其容器中运行的项目。

    ![运行 docker 容器的 VS Code](https://learn.microsoft.com/zh-cn/windows/wsl/media/vscode-running-in-container.png)

现在，你已使用 Docker Desktop 成功配置了远程开发容器，该容器由 WSL 2 后端提供支持，你可以使用 VS Code 对该容器进行编码、生成、运行、部署或调试！

[](https://learn.microsoft.com/zh-cn/windows/wsl/tutorials/wsl-containers#troubleshooting)

## 疑难解答

[](https://learn.microsoft.com/zh-cn/windows/wsl/tutorials/wsl-containers#wsl-docker-context-deprecated)

### 已弃用的 WSL docker 上下文

如果你使用的是 Docker for WSL 的早期技术预览版，则可能有一个名为“wsl”的 Docker 上下文，该上下文现已弃用。 可以使用以下命令进行检查：`docker context ls`。 如果想要同时对 Windows 和 WSL2 使用默认上下文，可以使用 `docker context rm wsl` 命令删除此“wsl”上下文，以避免出现错误。

使用此已弃用的 wsl 上下文可能遇到的错误包括：`docker wsl open //./pipe/docker_wsl: The system cannot find the file specified.` 或 `error during connect: Get http://%2F%2F.%2Fpipe%2Fdocker_wsl/v1.40/images/json?all=1: open //./pipe/docker_wsl: The system cannot find the file specified.`

有关此问题的详细信息，请参阅[如何在 Windows 10 上的适用于 Linux 的 Windows 系统 (WSL2) 中设置 Docker](https://www.hanselman.com/blog/HowToSetUpDockerWithinWindowsSystemForLinuxWSL2OnWindows10.aspx)。

[](https://learn.microsoft.com/zh-cn/windows/wsl/tutorials/wsl-containers#trouble-finding-docker-image-storage-folder)

### 查找 docker 映像存储文件夹时遇到问题

Docker 创建了两个用于存储数据的发行版文件夹：

- \wsl$\docker-desktop
- \wsl$\docker-desktop-data

可以通过打开 WSL Linux 发行版并输入 `explorer.exe .` 以在 Windows 文件资源管理器中查看文件夹来查找这些文件夹。 输入：`\\wsl\<distro name>\mnt\wsl`，将 `<distro name>` 替换为你的发行版的名称（即 Ubuntu-20.04）以查看这些文件夹。

如需查找有关在 WSL 中查找 docker 存储位置的详细信息，请参阅 [WSL 存储库中的问题](https://github.com/microsoft/WSL/issues/4176)或这篇 [StackOverflow 帖子](https://stackoverflow.com/questions/62380124/where-docker-image-is-stored-with-docker-desktop-for-windows)。

有关 WSL 中常规故障排除问题的更多帮助，请参阅[故障排除](https://learn.microsoft.com/zh-cn/windows/wsl/troubleshooting)文档。

[](https://learn.microsoft.com/zh-cn/windows/wsl/tutorials/wsl-containers#additional-resources)

## 其他资源

- [Docker 文档：将 Docker Desktop 与 WSL 2 配合使用的最佳做法](https://docs.docker.com/docker-for-windows/wsl/#best-practices)
- [Docker Desktop for Windows 反馈：提交问题](https://github.com/docker/for-win/issues)
- [VS Code 博客：用于选择开发环境的指南](https://code.visualstudio.com/docs/containers/choosing-dev-environment#_guidelines-for-choosing-a-development-environment)
- [VS Code 博客：在 WSL 2 中使用 Docker](https://code.visualstudio.com/blogs/2020/03/02/docker-in-wsl2)
- [VS Code 博客：在 WSL 2 中使用远程容器](https://code.visualstudio.com/blogs/2020/07/01/containers-wsl)
- [Hanselminutes 播客：与 Simon Ferquel 一起让 Docker 成为开发人员的宠儿](https://hanselminutes.com/736/making-docker-lovely-for-developers-with-simon-ferquel)
