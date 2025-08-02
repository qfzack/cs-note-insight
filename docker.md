## Docker

### 什么是Docker容器

Docker容器是操作系统层级的轻量级虚拟化技术，是一个运行的进程，它与宿主机隔离开，但是共享主机的内核

> VM是操作系统级别的隔离，每个VM有自己的OS，容器是进程级别的隔离

### 使用Docker的优势

使用Docker容器化封装应用程序的好处是：

- 一致性与可移植性：容器将应用及其依赖、配置、运行环境封装在一起，无论在哪个机器上运行，行为都一致
- 轻量级与高性能：容器基于宿主机的操作系统，不需要嵌套完整的系统
- 高效的CI/CD支持：Docker镜像可以集成到Jenkins、GitHub Actions等CI/CD流水线中，支持持续集成、持续发布、回滚、灰度发布等交付策略
- 适合微服务架构：每个服务打包到一个容器中，契合微服务架构，使用容器编排工具（如K8s）可帮助管理大量容器实例
- 社区生态丰富：有非常多的第三方Docker镜像可以直接使用，Docker Hub、K8s等工具形成完整生态

### Docker的架构是什么

- **Docker Client**：命令行工具，将用户的命令发送给Docker Daemon，客户端不处理容器，而是发起请求
- **Docker Daemon**：程序名是dockerd，负责管理容器的生命周期、镜像构建与管理、网络与存储配置，接收客户端请求并执行操作
- **Docker Registry**：存储和分发Docker镜像，可以是一个公共或私有的注册表，如Docker Hub、Harbor等

### 容器的生命周期

- Created：容器被创建但是还未启动
- Running：容器正在运行
- Paused：容器暂停，所有进程挂起
- Stopped/Exited：容器停止运行，主进程退出，容器仍保留
- Restarting：容器重新启动
- Dead：容器异常无法恢复

### Docker的网络模式

Docker提供了几种不同的网络模式来满足容器间通信的不同需求：

- **bridge**（默认）：容器启动后会自动连接到bridge网络，每个容器分配一个私有IP，容器间通过IP或容器名通信，可以使用`-p`将容器端口映射到宿主机
- **host**：使用宿主机网络，与宿主机共用网络命名空间（不再有隔离的IP），容器中运行的服务可以直接使用宿主机的IP和端口
- **none**：容器启动时无网络，容器没有IP，也无法连接到外部网络
- **共享容器网络**：与指定的容器共享网络命名空间，所有网络配置都一样（IP、端口等）

```shell
docker run -d --name container_a nginx
docker run --network container:container_a busybox
```

- **自定义网络**：使用docker network create创建自定义的网络，容器可以通过名字相互访问

```shell
docker network create mynet
docker run -d --network mynet --name web nginx
docker run -it --network mynet busybox ping web
```

### Docker的数据持久化

创建容器的时候通过挂载（Mount）将宿主机的存储资源挂载到容器内部使用，常见的挂载方式有三种：

- **Volume挂载**：使用Docker专用的挂载目录，默认在`/var/lib/docker/volumes`下自动管理

```shell
docker volume create mydata
docker run -v mydata:/app/data nginx
```

- **Bind Mount（绑定挂载）**:将宿主机上某个具体路径挂载进容器中

```shell
docker run -v /host/path:/app/data nginx
```

- **tmpfs挂载**：在内存中挂载临时文件系统，不落盘、掉电即丢失，适用于缓存、临时文件

```shell
docker run --tmpfs /app/cache:rw,size=100m nginx
```

### 容器的ENTRYPOINT和CMD是什么，什么时候会被覆盖

ENTRYPOINT和CMD是Dockerfile中用来指定容器启动时执行的命令和参数的指令

**ENTRYPOINT**：设置容器启动时的主命令，容器启动后执行的程序，不容易被覆盖，适合定义容器主进程

```dockerfile
ENTRYPOINT ["command", "param1", "param2"]
ENTRYPOINT command param1 param2
```

**CMD**：给ENTRYPOINT或容器启动命令提供默认参数，当没有ENTRYPOINT时也可以单独作为启动命令，运行容器时可以通过命令行覆盖

```dockerfile
CMD ["param1", "param2"]
CMD command param1 param2
```

容器启动时执行`ENTRYPOINT+CMD`，如果有启动命令如`docker run <image> [command]`，command会覆盖CMD，但是不会覆盖ENTRYPOINT，除非使用`--entrypoint`参数

在K8s中启动容器时，可以使用`command`参数来覆盖ENTRYPOINT，使用`args`来覆盖CMD

### Docker镜像和镜像层之间的关系

**Docker镜像**是一个只读的模板，用来创建Docker容器，包含运行程序所需的所有内容，比如操作系统环境、依赖库、程序代码、配置文件等

Docker镜像是由多个只读的**镜像层**叠加组成的，每个镜像层对应Dockerfile中的一个命令（比如RUN、COPY、ADD），层与层之间是增量关系，每层只保存相对于上一层的差异，镜像层采用了分层存储和写时复制（Copy-on-Write）技术，提高了构建效率和存储利用率

分层可以**加快构建速度**，修改Dockerfile后只重建受影响的层，其他层可以缓存复用；**节省存储**，多个镜像共享相同的层，不重复存储；**分发效率**：推送和拉取镜像时，只有缺失的层会被传输

### 如何导入和导出镜像文件

`docker save`和`docker load`是Docker用来导出和导入镜像文件的命令，方便镜像的备份迁移和离线传输

`docker save`是将一个或多个镜像打包成一个tar文件，导出到本地磁盘

```shell
docker save -o myimage.tar myimage:latest
```

`docker load`是从tar文件加载导出的镜像，恢复到本地Docker镜像仓库

```shell
docker load -i myimage.tar
```

## Dockerfile

Dockerfile是Docker用来构建镜像的文件，包括自定义的指令和格式，需要时可以根据配置文件进行自动化构建

Dockerfile描述的是组装镜像的过程，其中每条指令都是单独运行的，除了FROM之外，每条指令都会在上一条指令生成的镜像基础上执行，执行完后会生成一个新的**镜像层**，并覆盖在原镜像上形成新的镜像，最终Dockerfile构建的镜像就是在基础镜像上一层层构建起来的

### Dockerfile指令

Dockerfile中指令不区分大小写（但一般会大写），第一条指令必须是FROM，用于指定构建镜像的基础镜像，Dockerfile中可用的指令有：

- **FROM**：`FROM <image>或者FROM <image>:<tag>`，指定构建所需的基础镜像
  - 如果有多个FROM（多阶段构建），每个FROM会开启一个新的构建，前一个阶段的上下文会被清空，需要使用`COPY --from=`复制文件快照，多阶段构建可以减小最终的镜像体积

```dockerfile
FROM golang:1.20 as builder
WORKDIR /app
COPY . .
RUN go build -o main .

# 此处不会保留任何上面阶段的文件，但可以访问其快照
FROM alpine:latest
WORKDIR /app
COPY --from=builder /app/main .

CMD ["./main"]
```

- **ENV**：`ENV <key> <value>或者ENV <key>=<value>`，可以定义环境变量在构建镜像时、容器运行访问时使用

- **COPY**：`COPY <src1> <src2> <dest>`，复制所指向的文件或目录，将它添加到新镜像中，

- **ADD**：`ADD <src> <dest>`，和COPY有些类似，但ADD的src可以指向网络文件的url，一般更推荐使用COPY，因为行为清晰简单

- **EXPOSE**：`EXPOSE <port> [<port>/<protocol>...]`，通知Docker该容器在运行时监听指定的网络端口，默认协议是TCP，但不会开发端口或者进行端口映射，只是一个标记信息提高可读性

- **USER**：`USER <user>[:<group] 或者 USER <UID>[:<GID>]`，设置user name或user group，之后的指令都是以设置的user来执行

- **WORKDIR**：`WORKDIR /path/to/workdir`，设置工作目录，之后执行的指令都是在这个工作目录下运行，如果目录不存在则会新建一个

- **RUN**：`RUN <command>或者RUN ["executable", "param1", "param2"]`，在前一条指令创建的镜像层上创建一个新的临时容器，然后执行指定的指令，完成之后将该临时容器销毁，并将文件系统快照保存为一个新的镜像层
  - 多个RUN可以和并在一起执行来减少镜像层，过多的RUN会导致层数增多，镜像体积变大

- **CMD**：提供容器运行时的默认参数，如果有多条CMD，只有最后一条会生效，CMD有三种主要形式：
  - shell形式：`CMD command param1 param2`，由`/bin/sh -c`执行，即在shell中执行
  - exec形式：`CMD ["executable", "param1", "param2"]`，不经过shell解析
  - 参数形式：`CMD ["param1", "param2"]`，其实也是exec形式，但是通常配合ENTRYPOINT使用，作为默认参数传递给ENTRYPOINT
  - **只有exec形式的ENTRYPOINT才会把CMD追加作为参数执行，shell形式的ENTRYPOINT不会追加CMD**

- **ENTRYPOINT**：和CMD类似，可以让容器每次启动时执行相同的命令，如果有多个ENTRYPOINT，只有最后一条生效，也有两种形式：
  - shell形式：`ENTRYPOINT <command>`
  - exec形式：`ENTRYPOINT ["executable", "param1", "param2"]`
  - 和CMD的区别在于ENTRYPOINT一般是定义容器启动执行的主命令，CMD提供的是默认参数

### Dockerfile实践规范

- **使用标签**：每次构建为镜像设置标签
- **谨慎选择镜像**：尽量选择官方的镜像，并且只包含必须的基础环境和所需的包，控制镜像的大小
- **充分利用缓存**：如果当前指令的缓存实效，后续的缓存都不能使用，因此尽量将不会变动的指令和Dockerfile之间相同的指令放在前面执行
- **正确使用ADD和COPY**：多阶段构建的时候，只添加所需的文件，从而减少镜像的体积
- **apt-get update**和**apt-get install**一起执行，避免单独执行引起的缓存问题导致执行失败
- 用ENTRYPOINT的exec形式设置容器启动的主命令，CMD设置命令的默认参数

## 常用Docker命令

### 根据Docker镜像创建容器

```shell
# 创建并启动容器
docker run [-options] <image_name> [command]
# docker run -it -v /local/path:/container/path ubuntu /bin/bash
```

- `-d`：后台运行
- `-it`：交互式运行
- `--name`：指定容器名称
- `-p`：端口映射，`主机端口:容器端口`
- `-v`：挂载数据卷
- `--rm`：容器停止后自动删除
- `-e`：设置环境变量
- `-m`：限制内存使用
- `--cpus`：限制可用CPU

### 容器生命周期管理

```shell
# 仅创建容器
docker create <container_name>

# 启动已存在的容器
docker start <container_name>

# 重启容器
docker restart <container_name>

# 暂停容器
docker pause <container_name>

# 恢复容器
docker unpause <container_name>

# 删除容器，-f强制删除
docker rm <container_name>

# 删除所有已停止容器
docker container prune

docker rm $(docker ps -aq)

# 查看运行中的容器，-a查看所有容器
docker ps

# 查看容器详细信息
docker inspect <container_name>

# 查看容器日志，-查看实时日志
docker logs <container_name>

# 断开后重新连接容器
docker attach <container_name>

# 查看容器资源使用情况
docker status <container_name>

# 更新容器部分参数（内存、CPU等）
docker update --memory=512m <container_name>

# 停止所有运行的容器
docker stop $(docker ps -q)
```

### 在运行的容器中执行命令

```shell
docker exec [-options] <container_name> [command]
```

- `-i`：保持STDIN开放（交互式）
- `-t`：分配一个伪终端（TTY）
- `-d`：后台执行命令
- `-u`：指定用户
- `-w`：指定工作目录
- `-e`：设置环境变量

### 构建Docker镜像

```shell
docker build [-options] Dockerfile_path 
# docker build -t <image_name>:<tag> --build-arg ENV=prod <Dockerfile_path>
```

- **-t**：设置镜像的名称和标签
- **-f**：指定Dockerfile的名称（默认是Dockerfile）
- **--no-cache**：构建时不使用缓存
- **--build-arg**：传递构建时的参数（Dockerfile中的ARG）
- **--target**：多阶段构建中指定目标构建阶段
- **--platform**：指定目标平台，如linux/amd64或linux/arm64
- **--pull**：始终尝试拉取最新版本的基础镜像
