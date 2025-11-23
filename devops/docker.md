## Docker基础

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

## Docker底层原理

![Docker architecture](../resources/images/docker-arch.png)

Docker采用C/S架构，包括客户端和服务端，Docker守护进程（Daemon）作为服务端接受并处理来自客户端的请求（创建、运行、分发容器）

客户端为用户提供一系列的可执行命令，用户用这些命令与Docker守护进程进程交互

Docker核心原理就是为新创建的用户进程：

1. 启动Linux Namespace配置，创建隔离来决定进程能够看到和使用哪些东西
2. 设置指定的Cgroups参数，来约束进程对资源的使用
3. 切换进程的根目录（Change Root），重新挂载它的整个根目录，用来为容器提供隔离后的执行环境文件系统

### Root File System

> https://blog.csdn.net/Geffin/article/details/109741226

rootfs是Linux的根文件系统内容，是最基础的文件和目录集合，即系统启动后挂载到`/`根目录的一套文件结构（FHS的子集），包含:

- **`/bin`**: 基础的用户命令sh, ls, cp等
- **`/sbin`**: 系统管理命令，如init, ifconfig, reboot等
- **`/etc`**: 系统配置文件目录
- **`/lib`**&**`/lib64`**: 系统运行所需的共享库
- `/usr`: 用户相关程序和数据
  - `/usr/bin`: 普通程序
  - `/usr/sbin`: 系统管理程序
  - `/usr/lib`: 用户程序的共享库
- **`/dev`**: 设备文件目录
- **`/proc`**: 虚拟文件系统，包含内核和进程信息
- **`/sys`**: 虚拟文件系统，包含内核设备和驱动信息
- **`/tmp`**: 临时文件目录
- `/var`: 可变数据文件目录，如日志、缓存等
- `/home`: 用户主目录
- `/root`: root用户的主目录
- `mnt`&`media`: 挂载点目录

rootfs可以理解为一个最小的Linux运行环境，不包括内核，系统运行时内核会挂载rootfs作为根目录，而Docker容器启动时使用宿主机的内核和镜像中的rootfs

### Union File System

Union File System（联合文件系统）是一种将多个文件系统层叠加在一起形成一个单一文件系统视图的技术，Docker使用UnionFS来实现镜像的分层存储和高效构建，常见的UnionFS有AUFS、OverlayFS、Overlay2等

Docker镜像的目的是：

- 镜像的分层存储
- 不同镜像要复用层
- 容器运行时必须提供可写层，但不改变镜像层

因此需要UnionFS/Overlay2来实现Docker镜像系统：

- Docker镜像是多层只读层叠加而成的，每一层对应Dockerfile中的一条指令
- Docker容器是运行时会在镜像层之上添加一个可写层，所有对文件系统的修改都发生在这个可写层

> 镜像的只读层和容器的只读层是复用的，多个容器可以基于同一个镜像创建，每个容器有自己的可写层，这也是Docker轻量级的关键

Overlay2的工作原理：
- **LowerDir**：只读层，包含镜像的各个只读层
- **UpperDir**：可写层，容器运行时对文件系统的修改都写入这里
- **WorkDir**：工作目录，Overlay2用来进行文件系统操作的临时目录
- **MergedDir**：合并目录，用户看到的文件系统视图，是LowerDir和UpperDir的合并结果
- 当容器访问文件时，Overlay2会先检查UpperDir（可写层），如果文件存在则直接使用；如果不存在，则从LowerDir（只读层）中读取
- 当容器修改文件时，Overlay2会将文件从LowerDir复制到UpperDir（写时复制），然后在UpperDir中进行修改
- 这种机制确保了镜像层的不可变性，同时允许容器进行文件系统的修改

Overlay2的层结构：

- `/var/lib/docker/overlay2/`目录下存储了所有的Overlay2层，每个层都有一个唯一的ID，表示不同的镜像层和容器层

```
overlay2/
├── <layerid1>/      # 镜像层
│   ├── diff/        # 这一层实际的文件内容（delta）
│   ├── link         # 用于硬链接层管理
│   └── lower        # 指向更低层的“白名单”文件
│
├── <layerid2>/      # 另一个镜像层
│   ├── diff/
│   ├── link
│   └── lower
│
├── <containerid>/   # 容器层
│   ├── diff/        # 容器可写层的改动
│   ├── merged/      # 最终容器看到的 rootfs（union mount）
│   ├── work/        # overlayfs 运行所需的工作目录
│   └── lower        # 镜像所有只读层的组合
```

- `diff/`：存储该层的实际文件内容，包括新增、修改、删除的文件，是该层的增量
- `lower`：指向该层下面的所有只读层，形成一个链式结构
- `merged/`：容器启动后看到的文件系统视图，是UpperDir和LowerDir的合并结果
- `work/`：Overlay2运行时需要的工作目录，用于存储临时数据
- `link`：用于管理层之间的硬链接关系，优化存储

写时复制（Copy-on-Write）机制：

- 当容器尝试修改一个只读层中的文件时，Overlay2会将该文件从只读层复制到可写层，然后在可写层中进行修改，merged目录会反映出修改后的文件
- 当容器删除一个文件时，Overlay2不会直接删除只读层中的文件，而是在可写层中的`diff/`目录下创建一个“白名单”文件whiteout，标记该文件为已删除

Overlay2通过将多个只读层和一个可写层叠加在一起，加上COW机制，实现了高效的存储和文件系统管理，满足了Docker对镜像分层和容器运行时修改的需求

### Namespace

### Cgroups

## 常见面试题

- [Docker Interview Questions](https://www.wecreateproblems.com/interview-questions/docker-interview-questions)
- [100+ must know Docker interview questions and answers 2025](https://www.turing.com/interview-questions/docker)

### 什么是Docker

Docker 是一个开源的平台，用于开发、发布和运行应用程序。它通过使用容器（Containers）技术，将应用及其所有依赖项打包在一起，确保应用在任何环境中都能以相同的方式运行

### Docker中的容器是什么

容器是 Docker 镜像的运行实例。它是一个轻量级、可执行的软件包，包含运行应用程序所需的一切：代码、运行时、系统工具、系统库等。容器相互隔离，并在同一个宿主操作系统的内核上运行

### Docker与虚拟机(Virtual Machines)有何不同

| 特性         | Docker 容器                   | 虚拟机 (VM)                     |
| :----------- | :--------------------------- | :------------------------------|
| **操作系统** | 共享宿主机的操作系统内核          | 每个 VM 都有自己的客户操作系统      |
| **隔离级别** | 进程级隔离                      | 硬件级隔离（通过 Hypervisor）     |
| **大小**     | 兆字节 (MB) 级，非常小巧轻量     | 千兆字节 (GB) 级，较大且臃肿       |
| **启动时间** | 秒级或毫秒级，非常快             | 分钟级，启动较慢                  |
| **资源消耗** | 资源开销小，效率高               | 资源开销大，需要更多 CPU 和内存     |

### Docker镜像的用途是什么

Docker 镜像（Image）是用于创建 Docker 容器的只读模板。它包含了容器运行时所需的文件系统、代码、依赖项和配置信息。镜像是容器的蓝图，用于确保环境的一致性和可重复性

### 解释一下什么是Docker容器

Docker容器是Docker镜像的可运行实例。容器从镜像创建，在被启动后，它可以被执行、停止、移动和删除。容器是轻量级的、可移植的，并且是操作系统级别的虚拟化

### 什么是Dockerfile

Dockerfile是一个文本文件，包含了一系列构建 Docker 镜像的指令（例如 `FROM`, `RUN`, `COPY`, `EXPOSE` 等）。Docker 通过读取 Dockerfile 中的指令来自动生成 Docker 镜像。

### Docker守护进程 (Docker Daemon) 的作用是什么

Docker Daemon（通常称为 `dockerd`）是 Docker 架构的核心组件。它运行在宿主机上，负责监听 Docker API 请求，并管理 Docker 对象，例如镜像、容器、网络和存储卷。它是 Docker 引擎的控制中心

### 什么是 Docker Hub

Docker Hub 是 Docker 官方提供的公共注册中心（Registry）。它允许用户和团队存储、共享和管理 Docker 镜像。它是一个大型的公共镜像仓库，包含数百万个社区和官方镜像。

### 如何删除 Docker 中已停止的容器？

使用 `docker rm` 命令，后跟容器 ID 或名称。

```bash
docker rm <container_id_or_name>
```

要删除所有已停止的容器，可以使用：

```bash
docker container prune
```

### 什么是 Docker Volume（卷）？

Docker Volume 是一种持久化存储机制，用于存储容器生成或使用的数据。卷独立于容器的生命周期存在，即使容器被删除，数据也不会丢失。

### 如何在 Docker 容器中管理数据？

主要有三种方式：

1. **Volume (卷)：** 推荐的方式，由 Docker 管理，独立于容器。
2. **Bind Mount (绑定挂载)：** 直接将宿主机上的文件或目录挂载到容器内。
3. **Tmpfs Mount (内存挂载)：** 将数据临时存储在宿主机的内存中，不写入磁盘。

### Docker Compose 的用途是什么？

Docker Compose 是一个用于定义和运行多容器 Docker 应用程序的工具。通过一个 YAML 文件（通常是 `docker-compose.yml`），可以配置应用的所有服务、网络和存储卷，然后使用一个命令（`docker-compose up`）来启动整个应用栈。

### 如何通过 Dockerfile 创建 Docker 镜像？

使用 `docker build` 命令，后跟 Dockerfile 所在的路径（通常是当前目录 `.`）。

```bash
docker build -t <image_name>:<tag> .
# 示例：
docker build -t my-app:latest .
```

- `-t`：用于为镜像指定名称和标签。

### 什么是 Docker Network（网络）？

Docker Network 允许容器相互通信，并与宿主机或外部世界通信。Docker 提供了多种网络驱动，如 Bridge（默认）、Host、Overlay 等。

### 如何查找正在运行的 Docker 容器的 IP 地址？

使用 `docker inspect` 命令配合格式化选项 `-f`：

```bash
docker inspect -f '{{range .NetworkSettings.Networks}}{{.IPAddress}}{{end}}' <container_id_or_name>
```

### `docker run` 和 `docker exec` 有什么区别？

- `docker run`：**创建并启动**一个新的容器。
- `docker exec`：在**已经运行**的容器内执行一个新的命令。通常用于调试或进入正在运行的容器（例如：`docker exec -it <container_name> /bin/bash`）。

### 使用 Docker 的优势是什么？

- **一致性：** 确保应用在开发、测试和生产环境中的一致性。
- **可移植性：** 容器可以在任何支持 Docker 的系统上运行。
- **隔离性：** 容器相互隔离，避免了依赖冲突。
- **效率：** 容器轻量且启动快，提高了资源利用率。
- **CI/CD 集成：** 易于集成到持续集成/持续交付流程中。

### 如何检查 (inspect) 一个 Docker 容器？

使用 `docker inspect` 命令，后跟容器 ID 或名称。它会返回一个包含容器详细低级信息（JSON 格式）的对象，包括网络、配置、卷挂载等。

### Docker 中的环境变量是什么？

环境变量是设置在容器环境中的变量，可供容器内运行的应用程序使用，用于运行时配置。可以在 Dockerfile 中使用 `ENV` 指令设置，或在 `docker run` 时使用 `-e` 标志传递。

### 如何扩展 (scale) 一个 Docker 容器？

- **基本方式：** 手动使用 `docker run` 命令启动多个相同的容器实例。
- **推荐方式：** 使用编排工具，如 **Docker Compose**（用于本地开发）或 **Docker Swarm/Kubernetes**（用于生产环境），通过配置服务定义来管理多个副本。

### 什么是 Docker Registry（注册中心）？

Docker Registry 是一个存储 Docker 镜像的仓库。它是一个服务器端应用，负责存储和分发镜像。Docker Hub 是最知名的公共 Registry。也可以设置私有 Registry。

### 什么是 Docker Swarm？

Docker Swarm 是 Docker 官方提供的原生容器编排工具。它允许用户将多个 Docker 主机（节点）组成一个虚拟的集群，并以服务（Service）的形式管理和部署应用。

### Docker 容器的默认网络模式是什么？

默认的网络模式是 **Bridge（桥接）** 模式。在这种模式下，Docker 会创建一个虚拟桥接网络，容器连接到这个网络，并获得一个私有 IP 地址，可以通过宿主机的 IP 进行通信。

### 如何更新一个现有的 Docker 容器？

Docker 容器本质上是不可变的。更新一个容器的标准流程是：

1. 构建一个包含新代码或配置的**新镜像**。
2. 停止并删除**旧容器** (`docker stop` 和 `docker rm`)。
3. 使用新镜像**启动新容器** (`docker run`)。
    *在生产环境中，应使用编排工具（如 Swarm 或 Kubernetes）进行零停机时间的滚动更新。*

### 如何检查系统上的 Docker 状态？

在使用 `systemd` 的 Linux 系统上，可以使用：

```bash
systemctl status docker
```

此外，`docker info` 命令可以提供关于 Docker 守护进程和系统资源的详细信息。

### Docker 中的默认桥接网络是什么？

默认桥接网络是 Docker 在安装时自动创建的 `bridge` 网络。所有没有指定网络的容器默认都会连接到这个网络，它们可以通过 IP 地址互相通信。

### `docker-compose.yml` 的用途是什么？

它是 Docker Compose 的配置文件，用于**定义多容器应用的结构**。它指定了组成应用程序的所有服务（容器）、它们使用的镜像、端口映射、卷挂载和网络配置。

### 如何以分离模式 (detached mode) 运行容器？

在 `docker run` 命令中使用 `-d` 或 `--detach` 标志。容器将在后台运行，并将容器 ID 打印到终端。

```bash
docker run -d <image_name>
```

-----

### 解释多阶段 Docker 构建 (multi-stage Docker build) 的概念

多阶段构建允许您在 Dockerfile 中定义多个 `FROM` 语句。每个 `FROM` 指令都代表一个新的构建阶段。其核心思想是：利用第一个或中间阶段来编译代码、运行测试等，然后将最终需要的少量工件（如编译后的二进制文件或最终的运行代码）复制到最终的、更精简的基础镜像中。这极大地减小了最终生产镜像的大小，提高了安全性。

### 什么是 Docker Compose，它如何帮助管理多容器应用程序？

Docker Compose 是用于定义和运行多容器 Docker 应用程序的工具。它通过以下方式简化管理：

- **单一配置文件：** 使用一个 `docker-compose.yml` 文件定义所有服务、网络和卷。
- **一键式操作：** 使用 `docker-compose up` 命令即可启动、连接和管理整个应用程序堆栈（包括数据库、前端、后端等多个容器）。
- **服务发现：** 默认情况下，Compose 会创建一个网络，并允许容器通过服务名称互相访问。

### Docker 网络是如何工作的？描述 Bridge、Host 和 Overlay 网络

Docker 使用网络驱动程序来提供不同类型的网络：

- **Bridge (桥接)：** **默认网络。** Docker 在宿主机上创建一个私有内部网络，容器连接到此网络。容器之间可以相互通信，但需要通过宿主机的端口映射才能从外部访问。
- **Host (主机)：** 容器直接使用宿主机的网络堆栈。容器没有独立的 IP 地址，它们共享宿主机的 IP 和端口。隔离性最弱，但性能最好。
- **Overlay (覆盖)：** 用于连接多个 Docker 主机上的容器。它构建在底层物理网络之上，用于 Docker Swarm 或 Kubernetes 等集群环境，使跨主机通信成为可能。

### Docker Volumes（卷）和 Bind Mounts（绑定挂载）有什么区别？

| 特性         | Docker Volume (卷)                                                     | Bind Mount (绑定挂载)                                            |
| :----------- | :--------------------------------------------------------------------- | :--------------------------------------------------------------- |
| **位置**     | 存储在宿主机文件系统的 Docker 管理区域内 (`/var/lib/docker/volumes`)。 | 存储在宿主机文件系统的**任意指定**位置。                         |
| **管理**     | 由 Docker 完全管理，更安全、更可移植。                                 | 依赖于宿主机的目录结构，可移植性较差。                           |
| **初始化**   | 可以在创建卷时预先填充数据。                                           | 宿主机目录的内容直接覆盖容器内目录的内容。                       |
| **使用场景** | 推荐的持久化存储方式，用于数据库数据、日志等。                         | 用于挂载配置（例如 Apache/Nginx 配置）或将代码挂载到开发容器中。 |

### Dockerfile 中的 `COPY` 和 `ADD` 命令有什么区别？应该何时使用它们？

- **`COPY`：** 用于将本地文件或目录从构建上下文复制到镜像文件系统中的指定路径。
- **`ADD`：** 除了具备 `COPY` 的功能外，还具有两个特殊功能：
    1. 如果源文件是本地可识别的压缩包（如 `.tar.gz`），它会自动解压到目标路径。
    2. 如果源文件是 URL，它会下载文件到目标路径。
- **使用建议：** 推荐使用 **`COPY`**，因为它更透明、更清晰，且不会触发意外的解压行为。只有当您明确需要自动解压本地压缩文件或从 URL 下载文件时，才使用 `ADD`。

### 如何在不停止服务的情况下更新正在运行的容器？

在生产环境中，这需要使用**容器编排工具**（如 Docker Swarm 或 Kubernetes）来实现**滚动更新 (Rolling Update)**：

1. **Swarm：** 定义一个服务（Service）并指定多个副本。当您更新镜像标签时，Swarm 会逐个停止旧容器，启动新容器，并在整个过程中保持所需数量的副本在线，从而实现零停机更新。
2. **Kubernetes：** 使用 Deployment 资源，它会自动管理滚动更新策略。

### 如何确保 Docker 容器是无状态的 (stateless)？

确保容器无状态意味着：

1. **不将持久数据存储在容器的文件系统内。** 所有需要持久化的数据都必须存储在外部存储（如 Docker Volumes 或外部数据库）中。
2. **配置通过环境变量或挂载的配置文件提供。** 不应在容器启动后进行修改。
3. **日志应该发送到 STDOUT/STDERR，** 然后由外部日志驱动程序（如 Fluentd, Splunk, ELK Stack）进行收集和处理。

### 如何优化 Docker 镜像以用于生产环境？

1. **使用多阶段构建 (Multi-Stage Builds)：** 仅将最终的运行时工件复制到最终镜像中。
2. **选择最小的基础镜像：** 使用 Alpine Linux 等轻量级基础镜像，以减小体积和攻击面。
3. **利用缓存：** 将变化频率较低的指令（如安装依赖）放在 Dockerfile 的前面，以利用 Docker 的构建缓存。
4. **合并 `RUN` 指令：** 将多个 `RUN` 命令合并为一个，以减少镜像层数。
5. **清理不必要的缓存和文件：** 在同一层中清理下载的包和临时文件。

### 什么是 Docker Swarm，它与 Kubernetes 有何不同？

- **Docker Swarm：** Docker 官方的原生编排工具，深度集成于 Docker 引擎。它**易于设置和使用**，适合简单的集群和快速部署。
- **Kubernetes (K8s)：** 社区中最流行的容器编排系统。它**功能强大、生态系统丰富、复杂性更高**。它提供了更高级的功能，如自动扩展、自我修复、更复杂的网络和存储管理。
- **总结：** Swarm 简单快捷；Kubernetes 功能强大，但学习曲线更陡峭，是大多数大型生产环境的首选。

### 什么是 Docker 标签 (tags)，为什么它们很重要？

Docker 标签用于为镜像的特定版本提供易于识别的别名。

- **重要性：** 标签使得用户可以区分同一应用的不同版本（例如 `myapp:v1.0` 和 `myapp:latest`）、不同架构或不同环境（例如 `myapp:prod` 和 `myapp:staging`）。它们对于版本控制、发布管理和确保部署的一致性至关重要。

### 如何将 Docker 容器的端口暴露给宿主机？

使用 `docker run` 命令中的 `-p` 或 `--publish` 标志进行端口映射。

```bash
docker run -p <host_port>:<container_port> <image_name>
# 示例：将容器的 80 端口映射到宿主机的 8080 端口
docker run -p 8080:80 nginx
```

### Docker 容器和 Docker Service（服务）有什么区别？

- **Docker 容器 (Container)：** 单个运行的应用实例。在单个 Docker 主机上运行。
- **Docker Service (服务)：** 仅存在于 Docker Swarm 或 Kubernetes 等编排工具中。Service 是您希望运行的容器副本的定义。它定义了所需的镜像、端口、网络和**所需的副本数量**。一个 Service 可以由多个容器实例（称为 Tasks 或 Replicas）组成，并提供负载均衡和高可用性。

### 如何保护 Docker 容器的安全？

1. **最小化基础镜像：** 使用 Alpine 或 Distroless 等最小化镜像以减少攻击面。
2. **非 Root 用户运行：** 在 Dockerfile 中使用 `USER` 指令，避免以 `root` 身份运行容器内进程。
3. **最小化权限：** 遵循最小权限原则，限制容器的 capabilities。
4. **扫描漏洞：** 使用 Snyk 或 Clair 等工具扫描镜像中的已知漏洞。
5. **只读文件系统：** 使用 `--read-only` 标志运行容器，以防止运行时写入。
6. **安全配置：** 使用 Seccomp/AppArmor/SELinux 等工具增强内核级的隔离。

### `docker exec` 与 `docker attach` 的目的是什么？

- **`docker exec`：** 在**运行中**的容器内**执行一个新的进程/命令**。它与容器的主进程是分离的，用于调试或运行新的 Shell 会话。
- **`docker attach`：** 将本地的标准输入、输出和错误流**连接到容器的主进程**（即容器启动时运行的命令）。当您退出时，如果主进程没有处理信号，容器可能会停止。

### 如何监控正在运行的 Docker 容器的性能？

1. **`docker stats`：** 实时查看 CPU、内存、网络 I/O 和块 I/O。
2. **`docker top`：** 查看容器内正在运行的进程。
3. **外部工具：** 使用 Prometheus/Grafana、Datadog 或 cAdvisor 等监控工具，收集和可视化容器的详细指标。

### 如何在 Docker Swarm 中执行滚动更新 (Rolling Updates)？

1. 首先，部署应用程序为一个 Swarm 服务 (`docker service create`)。
2. 当需要更新时，更新服务的镜像版本 (`docker service update --image <new_image> <service_name>`)。
3. Swarm 会根据服务定义中配置的更新策略（例如，一次更新一个副本，延迟几秒）自动逐个替换旧容器实例为新容器实例。

### 什么是 Docker Volume Driver（卷驱动程序），如何使用它？

卷驱动程序允许您将第三方存储系统（如网络文件系统、云存储）集成到 Docker 中，以满足更高级的持久化和共享存储需求。

- **使用：** 在创建卷时指定驱动程序，例如：

    ```bash
    docker volume create --driver <driver_name> --opt <key=value> <volume_name>
    ```

### 什么是 Docker Health Check（健康检查），如何配置它们？

健康检查是一种机制，允许 Docker 验证容器内的应用程序是否确实“健康”和可用，而不仅仅是容器进程是否在运行。

- **配置：** 在 Dockerfile 中使用 `HEALTHCHECK` 指令。

    ```dockerfile
    HEALTHCHECK --interval=30s --timeout=3s --retries=3 CMD curl --fail http://localhost/ || exit 1
    ```

    它指定了一个命令 (`curl`)，如果退出码为非 0，则认为容器不健康。

### 如何将宿主机目录挂载到 Docker 容器中？

使用 `docker run` 命令中的 `-v` 或 `--volume` 标志进行绑定挂载 (Bind Mount)。

```bash
docker run -v <host_path>:<container_path> <image_name>
# 示例：将宿主机的 /app/data 目录挂载到容器内的 /usr/share/app/data
docker run -v /app/data:/usr/share/app/data nginx
```

### 解释 Docker 容器编排 (Container Orchestration) 的概念

容器编排是指管理大量容器的生命周期、部署、联网和扩展的自动化过程。它解决了在生产环境中管理微服务应用程序的复杂性，包括：

- 集群管理
- 调度（将容器放置到合适的机器上）
- 服务发现和负载均衡
- 存储卷管理
- 故障恢复/自我修复
    **主要工具：** Kubernetes, Docker Swarm。

### 如何为容器创建自定义 Docker 网络？

使用 `docker network create` 命令。

```bash
docker network create --driver bridge my-custom-network
# 运行容器并连接到该网络：
docker run -d --network my-custom-network --name web-app web-image
docker run -d --network my-custom-network --name db-server db-image
```

连接到同一个自定义网络的容器可以通过名称互相解析和通信。

### 如何在 Docker 化环境中管理日志？

1. **容器日志标准：** 确保应用将日志发送到 **STDOUT** 和 **STDERR**。
2. **Docker Log Driver：** 使用 Docker 的日志驱动程序（例如 `json-file`、`syslog`、`fluentd`）来捕获这些流。
3. **集中式日志系统：** 将日志发送到集中式日志平台（如 ELK Stack, Splunk, Graylog），以便于搜索、分析和长期存储。

### 如何使用 Docker Compose 处理多容器环境？

1. **定义 `docker-compose.yml`：** 在其中定义应用程序的每个服务（例如 Web 应用程序、数据库、缓存），指定它们各自的镜像、端口、环境变量和依赖关系。
2. **一键启动：** 运行 `docker-compose up -d` 来启动和连接所有服务。
3. **服务发现：** 容器之间可以自动通过服务名称进行通信（例如 Web 容器可以通过名称 `db` 访问数据库容器）。

### 什么是 Dockerfile 构建参数 (build arguments)，如何使用它们？

构建参数 (`ARG`) 是在镜像构建时（即 `docker build` 阶段）传递给 Dockerfile 的变量，仅在构建阶段有效，不会保留在最终镜像中作为环境变量。

- **Dockerfile 中定义：** `ARG BUILD_VERSION=1.0`
- **构建时传递：** `docker build --build-arg BUILD_VERSION=2.0 -t myapp:2.0 .`

### 如何在 Docker 容器之间共享数据？

1. **Docker Volumes：** 创建一个卷，并将其挂载到需要共享数据的两个或多个容器中。这是最推荐的方式。
2. **Bind Mounts：** 将宿主机的某个目录挂载到多个容器中（可移植性较差）。
3. **自定义网络：** 如果是应用级数据（如 API 调用结果），容器可以通过连接到同一自定义网络，利用网络通信共享数据。

### 如何在 CI/CD 流水线中使用 Docker？

1. **构建阶段：** CI/CD 服务器签出代码，使用 `docker build` 命令根据 Dockerfile 构建应用的 Docker 镜像。
2. **测试阶段：** 运行新的镜像作为容器，执行单元测试、集成测试。
3. **发布阶段：** 使用 `docker tag` 为镜像打上版本标签，并使用 `docker push` 推送到 Docker Registry（如 Docker Hub 或私有 Registry）。
4. **部署阶段：** 编排工具（如 Kubernetes）从 Registry 拉取新镜像并部署到生产集群。

### `docker pull` 和 `docker push` 命令在 Docker Registry 中的意义是什么？

- **`docker pull`：** 从 Registry **下载**一个镜像到本地机器。
- **`docker push`：** 将本地构建或标记的镜像**上传**到 Registry，使其可供他人或部署环境使用。

### Docker 在微服务架构中的作用是什么？

Docker 是实现微服务架构的**基石**。

- **隔离性：** 每个微服务都可以被打包成一个独立的 Docker 容器，确保服务间的隔离。
- **部署：** 简化了微服务的部署和管理。
- **技术无关性：** 允许不同微服务使用不同的技术栈（语言、库），因为它们都被容器化了。
- **可扩展性：** 容器编排工具（如 K8s）可以轻松地单独扩展每个微服务。

### 如何对一个非启动 (non-starting) 的 Docker 容器进行故障排除？

1. **查看日志：** 使用 `docker logs <container_id_or_name>` 检查容器启动失败的原因。
2. **检查状态：** 使用 `docker ps -a` 确认容器的状态（如 `Exited (1)`）。
3. **检查配置：** 使用 `docker inspect <container_id>` 查看启动命令、环境变量、卷挂载等配置是否正确。
4. **交互式启动：** 尝试以交互模式运行容器 (`docker run -it --entrypoint /bin/bash <image_name>`)，手动执行容器的启动命令来重现错误。

### Docker Desktop 在本地开发中的作用是什么？

Docker Desktop 是一个适用于 Mac、Windows 和 Linux 的桌面应用程序，它提供了一个完整的 Docker 开发环境。

- **提供 Docker Engine：** 在本地运行 Docker 守护进程。
- **K8s 集成：** 内置 Kubernetes 单节点集群。
- **GUI：** 提供图形界面来管理容器、镜像、卷和设置。
- **文件共享：** 简化了宿主机和容器之间的文件共享配置（绑定挂载）。

### 解释 Docker 中的镜像层 (image layers) 概念

Docker 镜像是通过一系列只读层构建的。Dockerfile 中的每个指令（如 `FROM`, `RUN`, `COPY`）通常都会创建一个新层。

- **特点：** 这些层是只读的，可以共享，且利用缓存。
- **容器层：** 当容器启动时，Docker 在只读镜像层之上添加一个可写层（称为容器层），所有对容器的修改都写入这一层。

### 如何使用 Docker 管理容器日志？

Docker 提供了日志驱动程序 (Logging Drivers) 来管理日志。

1. **默认驱动 (json-file)：** 将日志存储在宿主机的 JSON 文件中。
2. **指定驱动：** 在 `docker run` 或 `docker-compose.yml` 中使用 `--log-driver` 标志来配置其他驱动，如：

    ```bash
    docker run --log-driver=syslog ...
    ```

### `docker-compose.override.yml` 文件是什么，如何使用它？

- **作用：** 它是一个可选的 Compose 文件，用于**覆盖或扩展**主 `docker-compose.yml` 文件中的配置。
- **用途：** 常用场景是在**本地开发**中覆盖生产配置，例如：使用不同的镜像标签、启用调试模式、或挂载本地代码进行热重载。
- **使用：** Compose 会自动查找并合并这两个文件。运行 `docker-compose up` 时，它会读取 `docker-compose.yml` 和 `docker-compose.override.yml`。

### `docker network create` 的作用是什么？

用于手动创建自定义网络。

- **优势：** 允许用户创建隔离的、命名清晰的网络，并将特定容器连接到这些网络。连接到同一自定义网络的容器可以通过它们的**服务名称**或**容器名称**互相通信，提供更好的服务发现和网络隔离。

### 如何向容器暴露环境变量？

1. **`docker run -e`：** 在启动容器时，使用 `-e <KEY>=<VALUE>` 标志。
2. **`--env-file`：** 从一个本地文件中读取环境变量列表。
3. **`docker-compose.yml`：** 在服务定义中使用 `environment:` 关键字。

### `docker inspect` 在调试容器中的作用是什么？

`docker inspect` 是调试容器的**瑞士军刀**

- **作用：** 它提供了容器或镜像的所有低级配置细节，帮助诊断配置错误。
- **常见检查点：** 网络设置（IP 地址、端口映射）、卷挂载、启动命令（CMD/ENTRYPOINT）、环境变量、健康检查状态和容器的当前状态。

### 如何移除 Docker 中未使用的镜像、容器和卷？

使用 `docker system prune` 命令

```bash
docker system prune
```

- 此命令会移除所有停止的容器、未使用的网络、悬挂的（dangling）镜像和构建缓存。
- 若要移除所有未使用的卷（包括未悬挂的），需使用：`docker volume prune` 或 `docker system prune --volumes`。

### Docker 容器状态有哪些，以及检查状态的命令是什么

- **常见状态：** `created`（已创建，未启动）、`running`（正在运行）、`paused`（已暂停）、`restarting`（正在重启）、`exited`（已退出）、`dead`（死亡）。
- **检查命令：**
  - `docker ps`：查看 **running** 状态的容器。
  - `docker ps -a`：查看 **所有** 状态的容器。
  - `docker inspect <container_id>`：获取容器的详细状态信息。

### 如何配置自动容器重启

在 `docker run` 命令中使用 `--restart` 标志。

- **`--restart=no`：** 默认，不自动重启。
- **`--restart=on-failure`：** 只有当容器以非零状态（即错误状态）退出时才重启。
- **`--restart=always`：** 无论容器如何退出，Docker 守护进程启动时都会尝试重启容器。
- **`--restart=unless-stopped`：** 行为与 `always` 类似，但如果用户手动停止容器，则不会在 Docker 守护进程重启时再次启动。

-----

### 如何在生产环境中管理 Docker 容器安全

采用纵深防御策略：

1. **镜像安全：** 使用经过验证的基础镜像，定期使用漏洞扫描工具（如 Clair, Snyk）扫描镜像。
2. **最小权限：** 容器以非 Root 用户运行；使用 Seccomp/AppArmor/SELinux 限制容器对内核资源的访问权限。
3. **主机安全：** 保持宿主机操作系统和 Docker 引擎版本更新；限制对 Docker Daemon Socket 的访问。
4. **网络隔离：** 实施严格的网络策略，使用自定义网络和网络分段，确保容器只能访问其所需的资源。
5. **Secrets 管理：** 使用 Docker Secrets (Swarm) 或 Kubernetes Secrets 来安全地存储和注入敏感数据（密码、密钥）。

### 如何配置Docker以实现高可用性(High Availability)和容错(Fault Tolerance)

- **编排工具：** 必须使用容器编排工具（Kubernetes 或 Docker Swarm）。
- **多副本：** 在 Service 定义中设置多个副本（Replicas \> 1），确保单个容器故障不会导致服务中断。
- **跨主机部署：** 将副本分散到多个物理或虚拟主机上，防止单个主机故障。
- **健康检查：** 配置 `HEALTHCHECK`，使编排器能够检测不健康的容器并自动替换它们。
- **持久化存储：** 将状态数据存储在集中式、高可用的外部存储系统（如云提供商的存储、分布式文件系统），而不是本地磁盘。

### Docker Registry的作用是什么，如何管理您的私有Registry

- **作用：** 注册中心用于存储、分发和版本控制 Docker 镜像。它充当了应用部署的单一可信来源 (Single Source of Truth)。
- **管理私有 Registry：**
    1. **自托管 (Self-Hosted)：** 使用 Docker Registry 官方镜像进行部署，并配置 TLS/SSL 和基本身份验证。
    2. **云服务 (Cloud Services)：** 使用云提供商的托管服务（如 AWS ECR, Google GCR, Azure ACR），它们通常提供更高的可用性、更好的安全性（IAM 集成）和自动漏洞扫描。

### 如何使用Docker和Kubernetes设置CI/CD流水线

1. **代码提交：** 开发者提交代码到 Git 仓库。
2. **CI 触发：** CI 服务器（如 Jenkins, GitLab CI, GitHub Actions）被触发。
3. **Docker 构建：** CI 服务器执行 `docker build` 创建新的应用镜像。
4. **推送到 Registry：** 新镜像使用版本标签进行标记，并使用 `docker push` 推送到 Registry。
5. **CD 部署：** CD 工具（如 Flux, ArgoCD, Spinnaker）或 CI 服务器本身执行 Kubernetes 部署：
      - 更新 Kubernetes Deployment YAML 文件中的镜像标签。
      - 应用更新后的 Deployment，Kubernetes 自动执行滚动更新，拉取新镜像，并替换旧 Pod。

### 解释Docker in Docker(DinD)的概念及其使用场景

- **概念：** DinD 意味着在一个 Docker 容器内部运行另一个完整的 Docker 环境（包括 Docker Daemon）。
- **实现方式：** 通常通过将宿主机的 `/var/run/docker.sock` 挂载到容器中来实现，允许容器内的 Docker 客户端直接与宿主机的 Docker Daemon 通信。
- **使用场景：** 主要用于 CI/CD 流水线中需要**构建 Docker 镜像**的场景。例如，Jenkins 容器需要构建应用程序镜像，然后推送到 Registry。

### 如何使用 Kubernetes vs Docker Swarm 管理和编排容器

| 特性                | Kubernetes (K8s)                                           | Docker Swarm                                 |
| :------------------ | :--------------------------------------------------------- | :------------------------------------------- |
| **核心抽象**        | Pod, Deployment, Service, Ingress, Volume                  | Service, Node, Task                          |
| **可扩展性/复杂性** | 高度可扩展，功能全面，但学习曲线陡峭。                     | 简单快速，原生集成，功能相对较少。           |
| **网络**            | 复杂，需要 CNI 插件（如 Calico），提供高级网络策略。       | 简单，Overlay 网络是内置的。                 |
| **自动扩展**        | 内置 HPA (Horizontal Pod Autoscaler)，支持复杂的扩展策略。 | 基于副本数量的简单扩展。                     |
| **适用场景**        | 大规模、复杂的微服务、多云/混合云环境。                    | 快速部署、小型应用、或刚开始使用编排的团队。 |

### 什么是 Docker 镜像漏洞，以及如何扫描 Docker 镜像中的安全漏洞

- **镜像漏洞：** 指 Docker 镜像中包含的基础操作系统库、软件包或应用程序依赖项中存在的已知安全缺陷。
- **扫描方法：** 使用专业的镜像漏洞扫描工具（集成在 CI/CD 流程中）：
    1. **Clair：** 开源工具，用于静态分析容器镜像中的已知漏洞。
    2. **Snyk：** 商业工具，可以扫描操作系统依赖和应用依赖中的漏洞。
    3. **Registry 集成：** Docker Hub、AWS ECR 等许多 Registry 都内置了基本或高级的漏洞扫描功能。

### 如何使用 Docker 实现蓝/绿部署 (Blue-Green Deployments)

蓝/绿部署是一种零停机部署策略：

1. **“蓝”环境 (Blue)：** 当前生产环境，运行着旧版本应用 V1。
2. **“绿”环境 (Green)：** 部署新环境，运行新版本应用 V2。
3. **测试：** 在“绿”环境中进行全面的自动化和手动测试。
4. **流量切换：** 使用负载均衡器或编排工具的 Ingress Controller，将所有生产流量从“蓝”环境**瞬间切换**到“绿”环境。
5. **保持旧环境：** 将“蓝”环境保留一段时间作为回滚（Rollback）环境。如果“绿”环境出现问题，可以立即将流量切回“蓝”环境。
    *在 Docker Swarm 或 Kubernetes 中，这通过管理 Service 或 Ingress 资源来实现。*
