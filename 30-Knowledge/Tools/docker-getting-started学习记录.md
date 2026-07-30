---
title: docker-getting-started学习记录
tags:
  - docker
  - tools
  - tutorial
date: " 2025-02-22T21:49:36+08:00 "
modify: " 2025-02-22T21:49:36+08:00 "
share: false
cdate: " 2025-02-22 "
mdate: " 2025-02-22 "
---

- 仓库地址[GitHub - docker/getting-started: Getting started with Docker](https://github.com/docker/getting-started.git)
- 如果你的 dockers 里面还没有docker/getting-started 这个镜像（image），记得 `docker pull docker/getting-started`
- 如果你在国内无法直接连接 dockerhub，建议添加一些国内的源，参考文章 [docker pull 报错Get “https://registry-1.docker.io/v2/“: net/http: request canceled while waiting for c-CSDN博客](https://blog.csdn.net/jhgj56/article/details/142209517)
- 对于 docker 的解释：[Docker入门教程（非常详细）从零基础入门到精通 - Webfunny](https://www.webfunny.com/blog/post/235) 我简单地将 docker 理解为，我们使用 `image` 记录下一个文件系统的切片（像照相一样成为一个不可更改的照片），然后 container 利用这个 image，拷贝一部分文件系统的切片，加上一个文件读写层，再连接到机器的内核，然后就可以虚拟出你想要的环境并且开始 run 这个环境了![](https://www.webfunny.cn/blog_img/909e0241-8f64-11ee-9e17-83fc70d0184f.jpeg)

## Getting Started

```sh
docker run -dp 80:80 docker/getting-started

#`-d`  run the container in detached mode (in the background)
#`-p 80:80`  map port 80 of the host to port 80 in the container
#`docker/getting-started` - the image to use
```

- 什么是 container：简单的讲，容器是机器上与主机上所有其他进程隔离的另一个进程
- 什么是 container image：在运行容器时，它需要使用一个隔离的文件系统。这个自定义文件系统由容器映像提供

## Our Application

- 该教程使用一个简单的 todo list manager 作为 docker 使用的一个例子

### Building the App's Container Image

1. 在与文件包相同的文件夹中创建一个名为 `Dockerfile ` 的文件 `Json ` ，包含以下内容。

```DockerFile
    FROM node:18-alpine 
    WORKDIR /app 
    COPY . . 
    RUN yarn install --production CMD ["node", "src/index.js"]
```

2. Go to the `app` directory with the `Dockerfile` . Now build the container image using the `docker build` command.

    `docker build -t getting-started .`

	这个命令使用Dockerfile来构建一个新的容器映像。你可能已经注意到下载了很多“图层”。这是因为我们指示构建器从`node:18-alpine`映像开始。但是，由于我们的机器上没有这个，所以需要下载这个映像

	下载完镜像后，我们复制应用程序，并使用 `yarn` 来安装应用程序的依赖项。 `CMD` 指令指定从该映像启动容器时运行的默认命令。

	最后， `-t` 标记我们的图像。可以简单地将其视为最终图像的人类可读名称。由于我们将映像命名为 `getting-started` ，因此我们可以在运行容器时引用该映像。 `docker build ` 命令末尾的`Dockerfile `告诉docker应该在当前目录下查找`Dockerfile`。

### Starting an App Container

1. 使用`docker run` 命令启动你的容器，并指定我们刚刚创建的镜像的名称：

    `docker run -dp 3000:3000 getting-started`

    还记得 `-d` 和`-p`标志吗？我们以“分离”模式（在后台）运行新容器，并在主机的端口3000和容器的端口3000之间创建映射。如果没有端口映射，我们将无法访问应用程序。

2. 几秒钟后，使用浏览器打开 [http://localhost:3000](http://localhost:3000/)

    ![Empty Todo List](http://localhost/tutorial/our-application/todo-list-empty.png)

3. 继续添加一两项，看看效果是否如你所愿。您可以将项目标记为已完成并删除项目。您的前端成功地将项目存储在后端！又快又简单，是吧？

## Sharing our App

使用docker标签命令为入门映像指定一个新名称。一定要把YOUR-USER-NAME换成你的Docker ID。

>[!attention]  
>你的 Docker ID 必须全为小写，不能有大写字母

`docker tag getting-started YOUR-USER-NAME/getting-started ` 

- 这里需要 tag 的原因是 docker 将路径名的第一项解析为 namespace 以对应到特定的用户/组织，所以你需要将其 tag 一个别名，或者在最开始就将 image 命名为`YOUR-USER-NAME/getting-started`  
`docker push tendoutrisu/getting-started `  
将你想 `push` 的 image 给 `push` 上 hub 中以便分享

## Persisting our DB

- 当容器运行时，它使用映像中的各个层作为它的文件系统。每个容器也有自己的“临时空间”来创建/更新/删除文件。任何更改都不会在另一个容器中看到，即使它们使用相同的映像。
- 为了看到这一个特性。你可以执行下面这几个指令：  
`docker run -d ubuntu bash -c "shuf -i 1-10000 -n 1 -o /data.txt && tail -f /dev/null"`  
`docker exec eb5273f95fa9c9657d56ba40c835d7f4381040aab5f3d7a19e7aedf0cf4b4ac8 cat /data.txt`
- 然后再运行下面的指令  
`docker run -it ubuntu ls /`
- 你会发现其中没有 `data.txt` ，这证实了上面的特性。
- 在前面的实验中，我们看到每个 `container` 每次启动时都是从定义开始的。虽然 `container` 可以创建、更新和删除文件，但当 `container` 被删除时，这些更改将丢失，并且所有更改都与该 `container` 隔离。有了 `volume` (卷) ，我们可以改变这一切
- `volume`提供了将容器的特定文件系统路径连接回主机的能力。如果挂载了`container`中的某个目录，那么在主机上也可以看到该目录的更改。如果我们在`container`重启时挂载相同的目录，我们将看到相同的文件。
- 创造一个卷，并且命名为 rodo-db  
`docker volume create todo-db`
- 看看你的卷  
`docker volume list   `
- 挂载你的卷。你之前创造的卷：你想要挂载的路径  
`docker run -dp 3000:3000 -v todo-db:/etc/todos getting-started `
- 看看 Docker 究竟是如何如何存储你的卷的  
`docker volume inspect todo-db `

```shell
docker volume inspect todo-db 
[ 
	{ 	
		"CreatedAt": "2019-09-26T02:18:36Z", 
		"Driver": "local", "Labels": {}, 
		"Mountpoint": "/var/lib/docker/volumes/todo-db/_data", 
		"Name": "todo-db", 
		"Options": {}, 
		"Scope": "local" 
	}
]
```

- Mountpoint是磁盘上存储数据的实际位置。注意，在大多数机器上，你需要具有从主机访问该目录的根访问权限。但是，它就在那里！

## Using Bind Mounts

- 在上一节中，我们讨论了如何使用命名卷来持久化数据库中的数据。如果我们只是想存储数据，那么命名卷是很好的选择，因为我们不必担心数据存储在哪里。
- 除了使用命名卷，让 docker 帮我们存储数据，我们还有一种挂载外部文件的方式，叫做 **bind mounts**()绑定挂载)。通过绑定挂载，我们可以控制主机上的确切挂载点。我们可以使用它来持久化数据，但它通常用于向`container`中提供额外的数据。在处理应用程序时，我们可以使用绑定挂载将源代码挂载到`container`中，让它看到代码更改、做出响应，并让我们立即看到更改。

|                                              | Named Volumes             | Bind Mounts                   |     |
| -------------------------------------------- | ------------------------- | ----------------------------- | --- |
| Host Location                                | Docker chooses            | You control                   |     |
| Mount Example (using `-v`)                   | my-volume:/usr/local/data | /path/to/data:/usr/local/data |     |
| Populates new volume with container contents | Yes                       | No                            |     |
| Supports Volume Drivers                      | Yes                       | No                            |     |

```sh
docker run -dp 3000:3000 \ 
	-w /app -v "$(pwd):/app" \ 
	node:18-alpine \ 
	sh -c "yarn install && yarn run dev"
```

- `dp 3000:3000` 和以前一样。以分离（后台）模式运行并创建端口映射
- `-w /app` - 将指定路径设置为 `container` 的工作环境
- `-v "$(pwd):/app"` - 绑定挂载（链接）主机当前的 `getting-started/app`目录到容器的 `/app` 目录。注意：Docker需要绑定挂载的绝对路径，所以在这个例子中，我们使用`pwd` 来打印工作目录的绝对路径，即`app` 目录，而不是手动输入
- `node:18-alpine` - 需要使用的基础 `image`
- `sh -c "yarn install && yarn run dev"` - 我们使用`sh` 启动一个shell （alpine没有` bash` ），运行‘`yarn install` 来安装所有依赖项，然后运行`yarn run dev` 。如果我们看一下包装。，我们会看到` dev `脚本开始` nodemon` 
- `docker logs -f <container-id>` 您可以使用该命令查看日志。当你看到这个的时候，你就知道你已经准备好了……

```bash
docker logs -f <container-id> 
$ nodemon src/index.js 
[nodemon] 2.0.20 [nodemon] to restart at any time, enter `rs` 
[nodemon] watching path(s): *.* 
[nodemon] watching extensions: js,mjs,json 
[nodemon] starting `node src/index.js` Using sqlite database at /etc/todos/todo.db 
Listening on port 3000
```

后面的章节涉及多容器开发，非常神奇，但是我暂时还用不上。有兴趣的话可以自己上手试一试。

## Muti-Container Apps

`docker network create todo-app`

```sh
docker run -d \ 
	--network todo-app --network-alias mysql \ 
	-v todo-mysql-data:/var/lib/mysql \ 
	-e MYSQL_ROOT_PASSWORD=secret \ 
	-e MYSQL_DATABASE=todos \ mysql: 8.0 
```

`docker exec -it <mysql-container-id> mysql -p`  
`mysql> SHOW DATABASES;`  
`docker run -it --network todo-app nicolaka/netshoot`  
`dig mysql`

```sh
docker run -dp 3000:3000 \ 
	-w /app -v "$(pwd):/app" \ 
	--network todo-app \ 
	-e MYSQL_HOST=mysql \ 
	-e MYSQL_USER=root \ 
	-e MYSQL_PASSWORD=secret \ 
	-e MYSQL_DB=todos \ 
	node:18-alpine \ 
	sh -c "yarn install && yarn run dev"
```

[Docker Scout | Docker Docs](https://docs.docker.com/engine/scan/)  
[Node.js](https://nodejs.org/en/docs/guides/nodejs-docker-webapp/)
