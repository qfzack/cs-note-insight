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

- `-d`：后台运行，detached模式
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

[Docker底层原理](https://cloud.tencent.com/developer/article/2343808)
![Docker architecture](../resources/images/docker-arch.png)

Docker采用C/S架构，包括客户端和服务端，Docker守护进程（Daemon）作为服务端接受并处理来自客户端的请求（创建、运行、分发容器）

客户端为用户提供一系列的可执行命令，用户用这些命令与Docker守护进程进程交互

Docker核心原理就是为新创建的用户进程：

1. 启动Linux Namespace配置，创建隔离来决定进程能够看到和使用哪些东西
2. 设置指定的Cgroups参数，来约束进程对资源的使用
3. 切换进程的根目录（Change Root），重新挂载它的整个根目录，用来为容器提供隔离后的执行环境文件系统

### Root File System

> <https://blog.csdn.net/Geffin/article/details/109741226>

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

Namespace是一种把进程划分到不同隔离空间的机制，让每组进程看到的系统资源相互独立，这是Linux内核提供的一种轻量级虚拟化技术，Docker利用Namespace来实现容器的隔离效果

Namespace实现了:

- 进程隔离(PID Namespace):进程只能看到同一Namespace内的进程
- 网络隔离(Network Namespace):每个容器有独立的网络环境
- 文件系统隔离(Mount Namespace):每个容器有独立的文件系统视图
- 另外即使在同一个主机上,也可以有自己的hostname、user、IPC等

从而实现让多个轻量级虚拟环境运行在同一个OS内核上

**Linux的Namespace类型**

| Namespace 类型 | 作用                   | 示例                                  |
| -------------- | ---------------------- | ------------------------------------- |
| PID            | 进程号隔离             | 容器内的 PID 1 不等于宿主机的 PID 1   |
| NET            | 网络隔离               | 容器有自己的 eth0、IP、路由           |
| Mount (mnt)    | 文件系统结构隔离       | 每个容器有自己的 rootfs               |
| UTS            | 主机名、域名隔离       | 容器内有自己的 hostname               |
| IPC            | 进程间通信隔离         | 信号量、共享内存隔离                  |
| USER           | 用户/权限隔离          | 容器内 root ≠ 宿主机 root             |
| CGROUP         | 资源限制的目录视图隔离 | 限制 CPU、内存(常与 cgroups 配合使用) |
| TIME           | 时间隔离(较新)         | 容器看到自己的虚拟时钟                |

> Docker主要使用PID、NET、Mount、UTS、IPC、USER这6种Namespace来实现容器的隔离效果

- PID Namespace
  - 内核为每个PID namespace维护独立的PID映射表,容器内的进程只能看到同一namespace内的进程
- Net Namespace
  - 内核为每个新的net ns创建独立的网络堆栈,包括接口、路由表、防火墙规则等，每个容器有自己的`eth0`,`lo`,`routes`,`iptables`等
  - 本质是内核创建了独立的网络协议栈实例
- Mount Namespace
  - 内核为每个mount namespace维护独立的挂载点视图，每个容器有自己的rootfs视图和mount tree,可以独立挂载/卸载文件系统
- UTS Namespace
  - hostname是一个内核对象（结构体），UTS namespace存储了自己的hostname
  - 本质是每个namespace有自己的utsname结构体
- IPC Namespace
  - 内核的IPC对象（shm、sem、msg queues）属于某个IPC ns，不同namespace的进程无法访问对方的IPC对象
  - 本质是IPC对象被挂载到各自的namespace
- USER Namespace
  - 使用/proc/PID/uid_map，将容器内的用户ID映射到宿主机的不同用户ID，通过这种映射实现权限隔离
  - 本质是内核为每个user namespace维护独立的UID/GID

**Namespace工作原理**

Namespace通过修改内核为进程提供的资源视图来实现隔离，不同Namespace让不同的进程看到不同的系统资源对象，从而实现相互隔离，这不是通过资源拷贝实现的，而是靠内核为每个namespace维护独立的数据结构

当Docker启动容器时，会通过`clone()`系统调用创建一个新的进程，执行类似以下操作：

```
clone(CLONE_NEWPID | CLONE_NEWNET | CLONE_NEWNS | CLONE_NEWUTS | CLONE_NEWIPC | CLONE_NEWUSER, ...)
```

每个`CLONE_NEW*`标志告诉内核为新进程创建一个新的Namespace实例，然后内核会分配一个新的数据结构实例，并将其与创建该Namespace的进程关联起来，这样该进程及其子进程在访问系统资源时，会使用与其关联的Namespace数据结构，从而实现资源的隔离

内核中的每个进程（task_struct）都会关联指向多个Namespace的指针：

```
task_struct
 ├── nsproxy
       ├── pid_ns  #进程号，属于某个PID Namespace实例
       ├── uts_ns  #主机名，属于某个UTS Namespace实例
       ├── ipc_ns  #进程间通信，属于某个IPC Namespace实例
       ├── net_ns  #网络，属于某个NET Namespace实例
       ├── mnt_ns  #挂载点，属于某个Mount Namespace实例
       └── user_ns #用户，属于某个USER Namespace实例
```

不同进程的`nsproxy`指针可以指向不同的Namespace实例，进程访问资源的时候，内核会找到该进程对应的Namespace实例，从而决定该进程看到的资源视图

Namespace不是复制资源，而是复制资源视图，内核通过维护不同的Namespace实例，让不同的进程看到不同的资源对象，从而实现隔离

例如，当执行`ps -ef`时，容器进程会查`task_struct`找到所属的PID Namespace实例，然后通过该实例找到该Namespace内的进程列表，从而只显示容器内的进程

> Namespace相关的主要系统调用有：
>
> - `clone()`: 创建一个新的进程并分配新的隔离环境
> - `unshare()`: 使当前进程与父进程分离，进入到新的Namespace
> - `setns()`: 允许进程加入一个已经存在的Namespace

### Cgroups

Linux原本的资源控制是进程级别的，CPU和内存等资源是分配给进程的，无法对一组相关进程进行统一管理和控制，而Cgroups（Control Groups）是一种内核机制，可以将一组进程组织在一起，作为一个整体来进行：

- CPU资源限制（配额、优先级）
- 内存资源限制（上限、OOM）
- 磁盘IO限制（带宽、IOPS）
- 网络带宽限制（cgroups v2支持）
- 进程数量限制
- Device访问控制

cgroups是Linux做资源配额和资源隔离的核心能力，是容器的基础，其本质是一套内核中的Resource Controller Hook框架，每个资源控制器（如CPU、memory、blkiok）会在对应的内核代码路径中插入钩子，例如：进程调度位置（CPU controller）、页分配/回收位置（memory controller）、IO请求队列位置（blkio controller），当进程发生消耗CPU、分配内存、发起I/O，内核会调用对应的控制器钩子来检查和应用cgroups的限制策略

**cgroups配置文件**

cgroups的配置是通过虚拟文件系统`cgroupfs`来实现的，cgroupfs挂载在`/sys/fs/cgroup/<group>`目录下（cgroups v2），不同的资源控制器会有不同的子目录，每个子目录下可以创建多个cgroup，每个cgroup对应一组进程，可以通过向特定的控制文件写入参数来设置资源限制（主要文件）：

- CPU
  - cpu.max：限制CPU使用量`quota period`格式，例如`50000 100000`
  - cpu.weight：CPU权重（1-10000）
- Memory
  - memory.max：最大内存限制（字节）
  - memory.current：当前使用量
  - memory.high：高水位触发内存回收
  - memory.events：OOM、high等事件
- IO
  - io.max：IO限制（read/write bps或iops）
  - io.stat：IO统计数据
- PIDs
  - pids.max：最大允许进程数
- 通用
  - cgroup.procs：当前cgroup包含的进程PID
  - cgroup.subtree_control：启用/禁用子目录的controller

一个资源参数就是一个文件，即cgroups的核心设计理念：把资源控制能力以文件的形式暴露出来：

- 限制某个cgroup的内存使用上限为1G：

```shell
echo 1073741824 > /sys/fs/cgroup/my_cgroup/memory.max
```

- 将进程的CPU使用限制为50%：

```shell
echo "50000 100000" > /sys/fs/cgroup/my_cgroup/cpu.max
```

- 限制最大进程数为100：

```shell
echo 100 > /sys/fs/cgroup/my_cgroup/pids.max
```

> cgroups文件是动态的，不是保存在磁盘的，内核会实时从内核结构体生成这些文件的内容，用户空间可以通过读取这些文件来获取当前的资源使用情况和限制参数

### 容器创建过程

当执行Docker命令启动一个容器时：

1. 准备容器的文件系统rootfs
   - 容器是独立的rootfs（一堆文件）加上主机内核，因此一开始容器运行时（Docker）会从镜像仓库拉取或使用本地镜像
   - 运行时会创建一个可写的容器层，叠加在只读的镜像层上
   - 这些层通过OverlayFS叠加形成容器的rootfs
2. 创建新的Namespaces隔离环境
   - Docker调用`clone()`系统调用创建一个新的进程，并指定需要创建的Namespace类型（PID、Network、Mount、UTS、IPC、User等），以此来隔离容器
3. 设置Cgroups资源限制
   - 容器启动时会创建一个新的cgroup目录`/sys/fs/cgroup/<container_id>`，并向对应的控制文件写入资源限制参数，实际是调用内核的cgroups接口来应用资源限制
4. 执行容器主进程
   - 如果有mount目录，Docker会使用`mount()`将宿主机的目录挂载到容器的rootfs中，不会使用COW，数据也不会写到容器层，不会随容器删除，是属于宿主机的文件系统

   ```bash
   # docker run -v /data/log:/var/log ...
   mount("/data/log", "/var/log", NULL, MS_BIND, NULL) # 没有复制和同步，就是同一个目录
   ```

   - 使用chroot/pivot_root切换到容器的rootfs作为新的根目录，然后执行容器的入口命令（ENTRYPOINT/CMD）
  
   ```bash
   # 切换到容器的rootfs作为根目录
   chroot /var/lib/docker/overlay2/merged

   # 或使用pivot_root更彻底地切换根目录
   pivot_root /var/lib/docker/overlay2/merged /var/lib/docker/overlay2/merged/old_root

   # 执行容器的启动命令(如 /bin/bash 或应用程序)
   exec /bin/sh -c "your-application"
   ```

5. 进程在容器内部执行，看到的PID是1（PID Namespace内），只能看到容器的rootfs文件系统，只能访问分配给他的网络、CPU、内存等资源，与宿主机其他进程完全隔离

## 容器接口

### Docker和Containerd

Docker是一个完整的容器平台，提供了从镜像下载、镜像构建、容器运行到管理的全套工具和服务，为了实现标准化和解耦，Docker拆分为多个组件：

- Docker Engine（dockerd）：提供REST API、用户认证、镜像构建（Buildkit）、网络管理等高级功能
- Containerd：处于中间层，是一个工业级标准的容器运行时，负责镜像的分发、传递、管理容器的生命周期（创建、启动、停止、删除）
- Runc：处于最底层，是一个符合OCI标准的轻量级工具，通过调用Linux内核API（如Namespace、Cgroups）来创建和运行容器

因此Docker和Containerd的区别是：

- Docker（dockerd）是一个面向开发者和运维者的产品，包含了镜像层级构建、复杂网络堆栈、Volumn存储管理等，是一套完整的容器解决方案
- Containerd是一个面向机器的基础设施组件，剔除了Docker中非运行必须的功能（如镜像构建、Swarm集群模式），专为K8s等上层调度系统服务

在K8s中使用Docker的调用路径是`kubelet -> Docker shim -> dockerd -> containerd -> Runc`，经过多次封装转换导致性能损耗大，而使用Containerd作为K8s的容器运行时，调用路径是`kubelet -> CRI插件 -> containerd -> Runc`，减少了中间层，直接通过grpc交互，性能更好

### Dockershim是什么

K8s早期是直接使用Docker的，后面为了规范化制定了CRI标准，但是当时Docker并不支持CRI，因此引入了一个适配层`Dockershim`，负责将kubelet的CRI指令转换为Docker API调用

### containerd-shim是什么

containerd-shim是每个容器的父进程，以守护进程运行在后台，其存在的目的是：

- 解耦：允许containerd守护进程重启或升级，而不会导致容器停止
- 维护IO：保持容器的标准输入输出打开，及时containerd挂掉，日志和流也不会丢失
- 状态上报：负责容器进程的退出，并把状态码报给containerd

shim进程的作用是：

- 子进程管理：当容器内的`runC`完成初始化任务并退出后，容器的主进程会成为shim的子进程，shim负责处理容器进程退出后的清理工作，防止僵尸进程产生
- 维持IO文件描述符：shim一直运行并持有容器的标准输入、输出（stdin/stdout/stderr），当执行`kubectl logs`本质是containerd去找这个shim进程获取日志数据
- 提供通信接口：监听一个Unix Domain Socket，containerd通过这个Socket与shim通信，下达停止容器、获取容器状态等指令

虽然containerd-shim是由containerd创建的，但在容器启动完后，containerd-shim的父进程（PPID）通常会变成1（systemd），目的是让shim进程独立于containerd守护进程运行，避免containerd重启时影响容器的生命周期

### CRI、CNI和CSI是什么

CRI、CNI和CSI是Kubernetes生态系统中的三个重要接口标准，本质是为了实现K8s的生态解耦而定义的标准

- 容器运行时接口CRI（Container Runtime Interface）
  - 定义了K8s如何控制容器的生命周期（拉取镜像、创建容器、启停容器）
  - 主流的实现有containerd、CRI-O等
  - K8s本身不负责运行容器，只是通过CRI协议发命令给容器运行时（如containerd）来管理容器
- 容器网络接口CNI（Container Network Interface）
  - 定义了如何给Pod分配IP、配置网卡、实现Pod之间的跨节点通信
  - 主流的实现有Calico、Flannel、Cilium等
  - 所有的网络配置都是在CNI插件里完成的，K8s只负责调用CNI插件来实现网络功能
- 容器存储接口CSI（Container Storage Interface）
  - 定义了K8s如何挂载外部存储卷（云盘、NAS、本地磁盘）到Pod中
  - 主流实现是云厂商的存储插件
  - CSI解决了存储设备和K8s核心代码的解耦问题，支持动态扩所容和快照

### 如何实现CRI、CNI和CSI

CRI是Kubelet与容器运行时之间的gRPC通信标准，实现CRI需要实现CRI proto中定义的两个服务：

- RuntineService：处理`RunPodSanbox`（创建Pod环境）、`CreateContainer`、`StartContainer`、`StopContainer`等
- ImageService：处理`PullImage`、`ListImage`、`RemoveImage`等

CNI的实现和CRI、CSI不同，不是常驻的服务，而是一个可执行的二进制文件，Kubelet或容器运行时通过环境变量和标准输入（stdin）将JSON配置传递过来，从标准输出（stdout）获取结果，需要处理的核心逻辑：

- ADD：当Pod创建，Kubelet调用时，需要创建虚拟网卡堆（Veth pair），将一段插入容器Network Namespace，然后给容器配置IP、路由
- DEL：当Pod销毁时，释放IP地址，清理网卡

CSI的实现涉及存储的生命周期管理（创建、挂载、格式化），需要实现三个gRPC服务：

- Identity Service：告诉K8s插件的名称和功能
- COntroller Service：在控制面运行，负责CreateVolumn（云端创建硬盘）、ControllerPublishVolumn（将硬盘挂载到指定服务器节点）
- Node Service：在每个节点运行，负责NodeStageVolumn（格式化磁盘）、NodePublishVolumn（把磁盘mount到容器的具体目录）

在实现CSI的时候，K8s内部逻辑非常复杂，涉及如何监控PVC、如何调度节点、如何失败重试等，因此K8s采用Sidecar模式，将通用的K8s逻辑做成几个标准的Sidecar容器，这样存储厂商可以专注开发CSI Driver与自己的硬件交互的逻辑，然后将这个Driver与Sidecar容器运行在同一个Pod里

## 常见面试题

- [Docker Interview Questions](https://www.wecreateproblems.com/interview-questions/docker-interview-questions)
- [100+ must know Docker interview questions and answers 2025](https://www.turing.com/interview-questions/docker)

### 什么是Docker

Docker 是一个开源的平台，用于开发、发布和运行应用程序

通过使用容器（Containers）技术，将应用及其所有依赖项打包在一起，确保应用在不同环境中的行为一致，并且容器环境是隔离的，只共享宿主机的内核资源

Docker 的核心优势是可移植性。一旦创建了 Docker 镜像，它就可以在任何支持 Docker 的系统上执行，确保跨环境的一致性。由于能够简化应用程序部署和扩展，Docker 在 DevOps、持续集成/持续部署 (CI/CD) 流程和云计算中被广泛使用

### Docker中的容器是什么

Docker容器是镜像的运行实例，在轻量级虚拟化环境中作为隔离程序执行，容器包含了应用程序执行所需的程序代码、系统工具、库和设置，容器允许开发人员以标准化的方式在不同环境中构建、打包和运行应用程序

主要特性是：

- **轻量级**：容器共享主机的 OS 内核，因此比需要完整 OS 的 VM 更轻量
- **可移植**：容器可以在任何安装了 Docker 的系统上执行
- **隔离**：每个容器在自己的隔离环境中执行
- **快速启动**：容器可以在几秒钟内启动

### Docker与虚拟机(Virtual Machines)有何不同

Docker和虚拟机都提供了隔离应用程序的方法，但它们的方式根本不同。虚拟机是物理硬件的抽象，每个VM都是在主机OS之上执行完整的操作系统，这意味着每个VM都包含自己完整的OS，以及应用程序及其依赖项，相比之下，Docker容器虚拟化OS本身而不是硬件，直接在主机的OS内核上执行应用程序

主要区别：

- **资源使用**：容器更轻量，与主机共享OS内核；VM 需要为每个实例执行完整的OS
- **启动时间**：容器可以在几秒钟内启动；VM需要几分钟来启动完整的OS
- **可移植性**：容器高度可移植；VM较不可移植，受hypervisor和底层硬件限制
- **隔离**：容器提供OS级隔离；VM提供更强的硬件级隔离
- **性能**：容器开销较小，性能更好；VM由于完整OS开销较大

总结：Docker容器适用于需要快速启动、可移植性和效率的场景，如微服务、云原生应用程序和CI/CD工作流程。VM则更适合需要完整OS级隔离或执行旧版软件的应用程序

### Docker镜像的用途是什么

Docker镜像（Image）是用于创建Docker容器的只读模板，它包含了容器运行时所需的文件系统、代码、依赖项和配置信息，本质上镜像是环境的快照，可以确保应用在不同环境中的一致性

镜像的主要目的是为执行应用程序提供一致且可重现的环境，Dockerfile定义了构建镜像所需的步骤和指令，用户可以通过Docker Hub等注册中心共享和分发镜像

镜像不可变，一旦创建就无法更改，只能重新构建，这保证了Docker镜像的可靠性和一致性

### 什么是Dockerfile

Dockerfile是一个文本文件，包含一系列用于构建Docker镜像的指令，用于自动化创建Docker镜像

Dockerfile的主要目标是为Docker镜像创建可重现的构建流程，确保每次构建镜像时都遵循相同的步骤

### Docker守护进程 (Docker Daemon) 的作用是什么

Docker Daemon（也称为`dockerd`）是Docker的核心组件，运行在宿主机上，负责监听Docker API请求，并管理Docker对象，例如镜像、容器、网络和存储卷，是Docker引擎的控制中心

主要功能：

- 监听来自Docker CLI或API的请求
- 管理Docker对象（镜像、容器、网络、卷）
- 处理容器生命周期（启动、停止、重启容器）
- 管理镜像构建和缓存
- 促进容器之间的网络连接

### 什么是 Docker Hub

Docker Hub是Docker官方提供的公共注册中心（Registry），允许用户和团队存储、共享和管理Docker镜像，它是一个大型的公共镜像仓库，包含数百万个社区和官方镜像

### 什么是Docker Volume（卷）

Docker Volume是一种持久化存储机制，用于存储容器生成或使用的数据，卷独立于容器的生命周期存在，存在主机文件系统上，即使容器被删除，数据也不会丢失

Volume的作用：

- **数据持久性**：即使容器停止或删除，数据也会保留
- **在容器之间共享数据**：多个容器可以挂载同一个卷
- **性能**：卷比绑定挂载更高效
- **备份和恢复**：卷可以轻松备份和恢复

要在 Docker 中创建和使用卷，可以使用 `docker volume` 命令：

```bash
docker volume create my_volume

docker run -v my_volume:/data my_image
```

### 如何在Docker容器中管理数据

主要有三种方式：

1. **Volume(卷)：** 推荐的方式，由Docker管理，独立于容器
2. **Bind Mount(绑定挂载)：** 直接将宿主机上的文件或目录挂载到容器内
3. **Tmpfs Mount(内存挂载)：** 将数据临时存储在宿主机的内存中，不写入磁盘

```bash
docker run --mount type=volume,source=my_volume,target=/container/path my_image  # 使用卷
docker run -v /host/path:/container/path my_image  # 绑定挂载
docker run --tmpfs /container/path my_image  # 内存挂载
```

### Docker Compose的用途是什么

Docker Compose是一个用于定义和执行多容器Docker应用程序的工具，通过一个YAML文件（通常是 `docker-compose.yml`），可以配置应用的所有服务、网络和存储卷，然后使用一个命令`docker-compose up`来启动整个应用栈

Docker Compose特别适用于处理需要多个容器的应用程序，如具有前端、后端和数据库的Web应用程序，以及可能的其他服务，如缓存、消息代理等，支持在一个地方定义容器的配置、依赖项和连接来简化管理多个容器

主要功能和优势：

- **简化配置**：在单个 YAML 文件中定义所有服务
- **易于扩展**：轻松扩展服务
- **网络**：自动为服务创建网络
- **卷管理**：在服务之间定义和共享卷
- **环境管理**：使用环境变量配置服务

```yaml
version: '3'
services:
  web:
    image: nginx
    ports:
      - "8080:80"
  db:
    image: mysql
    environment:
      MYSQL_ROOT_PASSWORD: example
```

### 什么是Docker Network

Docker网络是一个虚拟网络，允许Docker容器彼此通信以及与宿主机和外部世界通信，Docker提供了多种网络驱动，如Bridge（默认）、Host、Overlay等

有几种类型的 Docker 网络：

- **Bridge(桥接)：** **默认网络**，Docker在宿主机上创建一个私有内部网络，容器连接到此网络，容器之间可以相互通信，但需要通过宿主机的端口映射才能从外部访问
- **Host(主机)：** 容器直接使用宿主机的网络堆栈，容器没有独立的IP地址，它们共享宿主机的IP和端口，隔离性最弱，但性能最好
- **Overlay(覆盖)：** 用于连接多个Docker主机上的容器，它构建在底层物理网络之上，用于Docker Swarm或Kubernetes等集群环境，使跨主机通信成为可能
- **None**：禁用容器的网络
- **Macvlan**：为容器分配MAC地址，使其在网络上显示为物理设备

```bash
docker network create my_bridge_network # 创建默认桥接网络(无需额外参数)

# 进阶配置：指定子网/网关/IP段/标签
docker network create \
  --driver bridge \
  --subnet 172.25.0.0/16 \
  --gateway 172.25.0.1 \
  --ip-range 172.25.5.0/24 \
  --label env=dev \
  my_bridge_network

# 查看网络详情(IPAM、已连接容器等)
docker network inspect my_bridge_network

# 运行容器并加入网络（自动分配IP）
docker run -d --name web --network my_bridge_network nginx

# 指定容器的静态IP(需在子网范围内且未被占用)
docker run -d --name app --network my_bridge_network --ip 172.25.5.10 myimage

# 将已存在容器连接到网络
docker network connect my_bridge_network existing_container

# 从网络断开容器
docker network disconnect my_bridge_network existing_container

# 在同一自定义bridge网络内可用容器名称做DNS解析
docker run -it --network my_bridge_network busybox ping web

# 清理与删除（需无挂载容器）
docker network rm my_bridge_network
docker network prune  # 删除未使用的网络

# 说明：
# 1. bridge适用于单主机容器间通信，跨主机请使用overlay。
# 2. --ip-range用于限制可动态分配的IP池（可选）。
# 3. 仅自定义bridge网络支持自动DNS解析（默认bridge较弱）。

docker run --network my_bridge_network my_image
```

### 如何查找正在运行的容器的IP

获取Docker网络系统分配给容器的IP地址，如果容器附加到特定网络，Docker会在该网络范围内为其分配IP地址

```bash
docker inspect -f '{{range .NetworkSettings.Networks}}{{.IPAddress}}{{end}}' <container_id_or_name>
```

查看更详细的网络信息，可以省略 `-f` 标志并检查整个容器：

```bash
docker inspect my_container
```

### `docker run`和`docker exec` 有什么区别

- `docker run`：**创建并启动**一个新的容器
- `docker exec`：在**已经运行**的容器内执行一个新的命令，通常用于调试或进入正在运行的容器（例如：`docker exec -it <container_name> /bin/bash`）

### 使用Docker的优势是什么

1. **可移植性**：容器在任何安装了Docker的系统上一致执行
2. **一致性**：确保开发、测试和生产环境相同
3. **隔离**：容器彼此隔离，减少冲突
4. **效率**：容器轻量且快速启动
5. **可扩展性**：轻松扩展应用程序
6. **版本控制**：镜像可以版本化和回滚
7. **资源优化**：容器比VM使用更少的资源
8. **DevOps 集成**：与CI/CD流程无缝集成
9. **微服务支持**：非常适合微服务架构

### 什么是Docker Swarm

Docker Swarm是Docker官方提供的原生容器编排工具，它允许用户将多个Docker主机（节点）组成一个虚拟的集群，并以服务（Service）的形式管理和部署应用

Docker Swarm的主要功能：

- **集群管理**：将多个Docker主机组合成一个集群
- **服务部署**：在集群中部署和管理服务
- **负载平衡**：在容器之间自动分配流量
- **扩展**：轻松扩展或缩减服务
- **自我修复**：自动替换失败的容器
- **滚动更新**：在不停机的情况下更新服务

```bash
docker swarm init # 初始化Swarm集群
docker swarm join --token <token> <manager_ip>:2377 # 加入节点
docker service create --name my_service --replicas 3 my_image # 创建服务
docker service scale my_service=5 # 扩展服务
docker service update --image new_image my_service # 滚动更新服务
```

### 什么是多阶段构建

多阶段Docker构建是一种通过减少镜像大小和提高构建效率来优化Docker镜像的技术，通过在单个Dockerfile中定义多个阶段，每个阶段都有自己的基础镜像和一组指令，关键思想是可以将构件从一个阶段复制到另一个阶段，允许将构建环境与运行时环境分开

Dockerfile中可以定义多个`FROM`语句，每个`FROM`指令都代表一个新的构建阶段，其核心思想是：利用第一个或中间阶段来编译代码、运行测试等，然后将最终需要的少量制品（如编译后的二进制文件或最终的运行代码）复制到最终的、更精简的基础镜像中，这极大地减小了最终生产镜像的大小，提高了安全性

```dockerfile
# 阶段 1：构建阶段
FROM golang:1.16 AS builder
WORKDIR /app
COPY . .
RUN go build -o myapp .

# 阶段 2：最终镜像
FROM alpine:latest
WORKDIR /root/
COPY --from=builder /app/myapp .
CMD ["./myapp"]
```

### 如何在不停止服务的情况下更新正在运行的容器

在生产环境中，这需要使用**容器编排工具**（如Docker Swarm或Kubernetes）来实现**滚动更新(Rolling Update)**：

1. **Swarm：** 定义一个服务（Service）并指定多个副本。当您更新镜像标签时，Swarm会逐个停止旧容器，启动新容器，并在整个过程中保持所需数量的副本在线，从而实现零停机更新
2. **Kubernetes：** 使用Deployment资源，它会自动管理滚动更新策略

### 如何确保Docker容器是无状态的(stateless)

确保容器无状态意味着：

1. **不将持久数据存储在容器的文件系统内**：所有需要持久化的数据都必须存储在外部存储（如Docker Volumes或外部数据库）中
2. **配置通过环境变量或挂载的配置文件提供**：不应在容器启动后进行修改
3. **日志应该发送到STDOUT/STDERR**：然后由外部日志驱动程序（如Fluentd, Splunk, ELK Stack）进行收集和处理

### 如何优化Docker镜像的构建

1. **使用多阶段构建 (Multi-Stage Builds)：** 仅将最终的运行时工件复制到最终镜像中
2. **选择最小的基础镜像：** 使用Alpine Linux等轻量级基础镜像，以减小体积和攻击面
3. **利用缓存：** 将变化频率较低的指令（如安装依赖）放在 Dockerfile 的前面，以利用 Docker 的构建缓存
4. **合并 `RUN` 指令：** 将多个 `RUN` 命令合并为一个，以减少镜像层数
5. **清理不必要的缓存和文件：** 在同一层中清理下载的包和临时文件

### Docker Swarm与Kubernetes有何不同？

- **Docker Swarm：** Docker官方的原生编排工具，深度集成于Docker引擎，**易于设置和使用**，适合简单的集群和快速部署
- **Kubernetes (K8s)：** 社区中最流行的容器编排系统，**功能强大、生态系统丰富、复杂性更高**，提供了更高级的功能，如自动扩展、自我修复、更复杂的网络和存储管理。
- **总结：** Swarm简单快捷；Kubernetes功能强大，但学习曲线更陡峭，是大多数大型生产环境的首选

### 如何保护Docker容器的安全

在生产环境中管理Docker容器安全性需要最佳实践、配置管理和工具的组合，以最小化漏洞并确保容器被隔离和安全，主要策略包括：

**1. 使用最小基础镜像**：
使用最小基础镜像（如Alpine Linux）减少攻击面：

```dockerfile
FROM alpine:latest
```

**2. 以非 root 用户执行容器**：
避免以root执行容器，在Dockerfile中创建并使用非特权用户：

```dockerfile
RUN adduser -D myuser
USER myuser
```

**3. 扫描镜像漏洞**：
使用工具扫描镜像中的已知漏洞：

- Docker Scan
- Trivy
- Clair
- Snyk

```bash
docker scan my-image
trivy image my-image
```

**4. 限制容器功能**：
使用`--cap-drop`和`--cap-add`移除不必要的Linux功能：

```bash
docker run --cap-drop ALL --cap-add NET_BIND_SERVICE my-image
```

**5. 使用只读文件系统**：
当可能时，使用只读文件系统执行容器：

```bash
docker run --read-only my-image
```

**6. 实施资源限制**：
限制容器可以使用的 CPU 和内存：

```bash
docker run --memory="512m" --cpus="1.0" my-image
```

**7. 使用Docker Secrets**：
对于敏感数据，使用Docker Secrets（在Swarm中）或Kubernetes Secrets：

```bash
echo "mysecret" | docker secret create my_secret -
docker service create --secret my_secret my-image
```

**8. 启用 Docker Content Trust**：
启用 Content Trust 以确保镜像的真实性：

```bash
export DOCKER_CONTENT_TRUST=1
```

**9. 网络隔离**：
使用自定义网络隔离容器并限制不必要的通信

**10. 定期更新**：
保持Docker、基础镜像和依赖项更新以修补安全漏洞

**11. 使用安全扫描器**：
集成安全扫描到 CI/CD 流程：

```bash
# 在 CI 流程中
docker build -t my-image .
trivy image my-image
```

**12. 实施日志记录和监视**：
使用日志记录和监视工具跟踪容器行为并检测异常

### `docker exec`与`docker attach`的作用

- **`docker exec`：** 在**运行中**的容器内**执行一个新的进程/命令**，与容器的主进程是分离的，用于调试或运行新的Shell会话
- **`docker attach`：** 将本地的标准输入、输出和错误流**连接到容器的主进程**（即容器启动时运行的命令），当退出容器时，如果主进程没有处理信号，容器可能会停止

### 如何监控正在运行的Docker容器的性能

1. **`docker stats`：** 实时查看CPU、内存、网络I/O和块I/O
2. **`docker top`：** 查看容器内正在运行的进程
3. **外部工具：** 使用Prometheus/Grafana、Datadog或cAdvisor等监控工具，收集和可视化容器的详细指标

### 什么是Docker Volume Driver（卷驱动程序）

卷驱动程序允许将第三方存储系统（如网络文件系统、云存储）集成到Docker中，以满足更高级的持久化和共享存储需求

可以在创建卷时指定驱动程序

```bash
docker volume create --driver <driver_name> --opt <key=value> <volume_name>
```

### 什么是Docker Health Check（健康检查）

健康检查是一种机制，允许Docker验证容器内的应用程序是否确实“健康”和可用，而不仅仅是容器进程是否在运行

在Dockerfile中使用`HEALTHCHECK`指令

```dockerfile
HEALTHCHECK --interval=30s --timeout=3s --retries=3 CMD curl --fail http://localhost/ || exit 1
```

指定了一个命令 (`curl`)，如果退出码为非 0，则认为容器不健康

### 容器编排(Container Orchestration)是什么

容器编排是指管理大量容器的生命周期、部署、联网和扩展的自动化过程，解决了在生产环境中管理微服务应用程序的复杂性，包括：

- 集群管理
- 调度（将容器放置到合适的机器上）
- 服务发现和负载均衡
- 存储卷管理
- 故障恢复/自我修复
- 滚动更新和回滚

### 如何在Docker化环境中管理日志

1. **容器日志标准：** 确保应用将日志发送到**STDOUT**和**STDERR**，即打印到终端，以便Docker可以捕获这些输出流
2. **Docker Log Driver：** 使用Docker的日志驱动程序（例如 `json-file`、`syslog`、`fluentd`）来捕获这些流
3. **集中式日志系统：** 将日志发送到集中式日志平台（如 ELK Stack, Splunk, Graylog），以便于搜索、分析和长期存储

### 如何在Docker容器之间共享数据

1. **Docker Volumes：** 创建一个卷，并将其挂载到需要共享数据的两个或多个容器中，这是最推荐的方式
2. **Bind Mounts：** 将宿主机的某个目录挂载到多个容器中（可移植性较差）
3. **自定义网络：** 如果是应用级数据（如API调用结果），容器可以通过连接到同一自定义网络，利用网络通信共享数据

### 如何在CI/CD流水线中使用Docker

Docker 在 CI/CD 流程中被广泛用于一致、可重复的建构、测试和部署。以下是 Docker 如何融入 CI/CD 流程：

**1. 建构阶段**：

- 开发人员将程式码提交到版本控制系统（如 Git）
- CI 工具（Jenkins、GitLab CI、CircleCI）触发建构
- Docker 镜像从 Dockerfile 建构，确保一致的环境

**2. 测试阶段**：

- 从建构的镜像创建容器
- 在容器内执行自动化测试
- 容器提供隔离的测试环境

**3. 推送阶段**：

- 成功的建构被标记并推送到 Docker 注册表（Docker Hub、私有注册表）
- 镜像被版本化以便追踪

**4. 部署阶段**：

- 镜像从注册表拉取到生产环境
- 容器使用编排工具（Kubernetes、Docker Swarm）部署
- 可以实现滚动更新以实现零停机时间

**5. 监视和回滚**：

- 监视容器的健康和效能
- 如果出现问题，轻松回滚到以前的镜像版本

### Docker在微服务架构中的作用是什么

在微服务架构中，应用程式被分解为更小的独立服务，每个服务都有自己的功能和资料库，Docker在促进微服务的开发、部署和扩展方面发挥著关键作用：

**1. 隔离**：
每个微服务在自己的容器中执行，确保隔离和独立性。这允许不同的服务使用不同的技术堆叠

**2. 可携性**：
Docker容器可以在任何环境中一致执行，使微服务易于在开发、测试和生产之间移动

**3. 可扩展性**：
单个微服务可以独立扩展，如果一个服务遇到高流量，你可以扩展该服务的容器实例，而不影响其他服务

**4. 快速部署**：
容器启动速度快，允许快速部署和更新微服务

**5. 版本控制**：
每个微服务可以独立版本化和更新，无需重新部署整个应用程式

**6. 编排**：
Docker 与编排工具（如 Kubernetes 和 Docker Swarm）配合良好，这些工具有助于大规模管理微服务，确保自动化部署、扩展和监视

### 如何对一个非启动 (non-starting) 的Docker容器进行故障排除

1. **查看日志：** 使用 `docker logs <container_id_or_name>` 检查容器启动失败的原因
2. **检查状态：** 使用 `docker ps -a` 确认容器的状态（如 `Exited (1)`）
3. **检查配置：** 使用 `docker inspect <container_id>` 查看启动命令、环境变量、卷挂载等配置是否正确
4. **交互式启动：** 尝试以交互模式运行容器 (`docker run -it --entrypoint /bin/bash <image_name>`)，手动执行容器的启动命令来重现错误

### 解释Docker中的镜像层layers概念

Docker镜像是通过一系列只读层构建的，Dockerfile中的每个指令（如 `FROM`, `RUN`, `COPY`）通常都会创建一个新层

- **特点：** 这些层是只读的，可以共享，且利用缓存
- **容器层：** 当容器启动时，Docker 在只读镜像层之上添加一个可写层（称为容器层），所有对容器的修改都写入这一层

### 如何使用Docker管理容器日志

Docker提供了日志驱动程序(Logging Drivers)来管理日志

1. **默认驱动 (json-file)：** 将日志存储在宿主机的JSON文件中
2. **指定驱动：** 在 `docker run` 或 `docker-compose.yml` 中使用 `--log-driver` 标志来配置其他驱动，如：

    ```bash
    docker run --log-driver=syslog ...
    ```

### `docker-compose.override.yml` 文件是什么

- **作用：** 是一个可选的Compose文件，用于**覆盖或扩展**主 `docker-compose.yml` 文件中的配置
- **用途：** 常用场景是在**本地开发**中覆盖生产配置，例如：使用不同的镜像标签、启用调试模式、或挂载本地代码进行热重载
- **使用：** Compose会自动查找并合并这两个文件，运行`docker-compose up`时，它会读取`docker-compose.yml`和`docker-compose.override.yml`

### 如何向容器暴露环境变量

1. **`docker run -e`：** 在启动容器时，使用 `-e <KEY>=<VALUE>` 标志
2. **`--env-file`：** 从一个本地文件中读取环境变量列表
3. **`docker-compose.yml`：** 在服务定义中使用 `environment:` 关键字

### 如何移除 Docker 中未使用的镜像、容器和卷

使用`docker system prune`命令

```bash
docker system prune
```

- 此命令会移除所有停止的容器、未使用的网络、悬挂的（dangling）镜像和构建缓存
- 若要移除所有未使用的卷（包括未悬挂的），需使用：`docker volume prune` 或 `docker system prune --volumes`

### Docker容器状态有哪些

- **常见状态：** `created`（已创建，未启动）、`running`（正在运行）、`paused`（已暂停）、`restarting`（正在重启）、`exited`（已退出）、`dead`（死亡）
- **检查命令：**
  - `docker ps`：查看 **running** 状态的容器
  - `docker ps -a`：查看 **所有** 状态的容器
  - `docker inspect <container_id>`：获取容器的详细状态信息

### 如何配置自动容器重启

在`docker run`命令中使用`--restart`标志

- **`--restart=no`：** 默认，不自动重启
- **`--restart=on-failure`：** 只有当容器以非零状态（即错误状态）退出时才重启
- **`--restart=always`：** 无论容器如何退出，Docker守护进程启动时都会尝试重启容器
- **`--restart=unless-stopped`：** 行为与`always`类似，但如果用户手动停止容器，则不会在Docker守护进程重启时再次启动

### 如何在生产环境中管理Docker容器安全

采用纵深防御策略：

1. **镜像安全：** 使用经过验证的基础镜像，定期使用漏洞扫描工具（如Clair, Snyk）扫描镜像
2. **最小权限：** 容器以非Root用户运行；使用Seccomp/AppArmor/SELinux限制容器对内核资源的访问权限
3. **主机安全：** 保持宿主机操作系统和Docker引擎版本更新；限制对Docker Daemon Socket的访问
4. **网络隔离：** 实施严格的网络策略，使用自定义网络和网络分段，确保容器只能访问其所需的资源
5. **Secrets管理：** 使用Docker Secrets (Swarm)或Kubernetes Secrets来安全地存储和注入敏感数据（密码、密钥）

### 如何配置Docker以实现高可用性和容错

- **编排工具：** 必须使用容器编排工具（Kubernetes或Docker Swarm）
- **多副本：** 在Service定义中设置多个副本（Replicas > 1），确保单个容器故障不会导致服务中断
- **跨主机部署：** 将副本分散到多个物理或虚拟主机上，防止单个主机故障
- **健康检查：** 配置`HEALTHCHECK`，使编排器能够检测不健康的容器并自动替换它们
- **持久化存储：** 将状态数据存储在集中式、高可用的外部存储系统（如云提供商的存储、分布式文件系统），而不是本地磁盘

### 如何使用Docker和Kubernetes设置CI/CD流水线

1. **代码提交：** 开发者提交代码到 Git 仓库。
2. **CI 触发：** CI 服务器（如 Jenkins, GitLab CI, GitHub Actions）被触发。
3. **Docker 构建：** CI 服务器执行 `docker build` 创建新的应用镜像。
4. **推送到 Registry：** 新镜像使用版本标签进行标记，并使用 `docker push` 推送到 Registry。
5. **CD 部署：** CD 工具（如 Flux, ArgoCD, Spinnaker）或 CI 服务器本身执行 Kubernetes 部署：
      - 更新 Kubernetes Deployment YAML 文件中的镜像标签。
      - 应用更新后的 Deployment，Kubernetes 自动执行滚动更新，拉取新镜像，并替换旧 Pod。

### 解释Docker-in-Docker和Docker-outside-of-Docker

Docker in Docker (DinD) 和 Docker outside of Docker (DoD) 是两种在容器化环境中使用Docker的不同方法：

- **Docker-in-Docker (DinD)：** 在一个Docker容器内部运行另一个完整的Docker环境（包括Docker Daemon）
  - **实现方式**：通过在容器内安装Docker引擎，并启动一个独立的Docker Daemon，优势是完全隔离的Docker环境，但缺点是性能开销较大，且存在安全风险（需要privileged mode）
  - **使用场景：** 主要用于CI/CD流水线中需要完全隔离的Docker环境，或是需要可复现的构建环境
- **Docker-outside-of-Docker (DoD)：** 容器内的Docker客户端直接与宿主机的Docker Daemon通信，而不是在容器内运行一个独立的Docker实例
  - **实现方式：** 通常通过将宿主机的 `/var/run/docker.sock` 挂载到容器中来实现，允许容器内的Docker客户端直接与宿主机的Docker Daemon通信，优势是避免了DinD的复杂性和性能开销，但是与宿主机共享Docker环境，存在安全风险
  - **使用场景**：适用于需要管理宿主机Docker资源的场景，如部署工具或监控工具，以及CI/CD流水线中需要与宿主机Docker交互的情况

### 什么是Docker镜像漏洞，如何扫描Docker镜像中的安全漏洞

- **镜像漏洞：** 指 Docker 镜像中包含的基础操作系统库、软件包或应用程序依赖项中存在的已知安全缺陷
- **扫描方法：** 使用专业的镜像漏洞扫描工具（集成在 CI/CD 流程中）：
    1. **Clair：** 开源工具，用于静态分析容器镜像中的已知漏洞
    2. **Snyk：** 商业工具，可以扫描操作系统依赖和应用依赖中的漏洞
    3. **Registry 集成：** Docker Hub、AWS ECR 等许多 Registry 都内置了基本或高级的漏洞扫描功能

### 如何使用Docker实现蓝/绿部署

蓝/绿部署是一种零停机部署策略：

1. **“蓝”环境 (Blue)：** 当前生产环境，运行着旧版本应用V1
2. **“绿”环境 (Green)：** 部署新环境，运行新版本应用V2
3. **测试：** 在“绿”环境中进行全面的自动化和手动测试
4. **流量切换：** 使用负载均衡器或编排工具的 Ingress Controller，将所有生产流量从“蓝”环境**瞬间切换**到“绿”环境
5. **保持旧环境：** 将“蓝”环境保留一段时间作为回滚（Rollback）环境。如果“绿”环境出现问题，可以立即将流量切回“蓝”环境
    *在 Docker Swarm 或 Kubernetes 中，这通过管理 Service 或 Ingress 资源来实现*
