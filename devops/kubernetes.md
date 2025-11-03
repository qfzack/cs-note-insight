## Kubernetes

### 简述什么是K8s，K8s的架构是什么

K8s是一个开源容器编排平台，用于自动化容器化应用的部署、扩缩容、负载均衡和故障恢复，目的是实现自动部署和调度容器、实现资源利用最大化、高可用和自愈能力以及易于扩展和管理的能力

K8s是一个主从（Master-Worker）架构：

- Master节点：
  - API server：集群的统一入口，所有组件通过它通信
  - Controller Manager：管理控制循环，确保声明的目标状态达成
  - Scheduler：负责将Pod调度到合适的节点
  - ETCD：分布式数据库，存储所有的状态信息
  - Kubelet：负责与API server通信，管理本地容器生命周期
  - Kube Proxy：负责Service网络代理和负载均衡
- Worker节点：
  - Kubelet
  - Kube Proxy
  - Container（CRI）：Pod内运行的容器

> control plane包括api-server、etcd、scheduler、controller-manager

核心机制：

- 控制器模式：监控资源当前状态，并使其趋向于期望状态
- 声明式API：通过YAML表示期望状态，然后交由控制器调整状态更新
- 资源调度：使用调度策略（资源需求、亲和性、反亲和性、污点、容忍）将Pod分配到合适的节点
- 事件驱动与watch机制：使用etcd+watch实时感知资源变化
- 自愈能力：容器或节点异常自动恢复
- 扩展机制（CRD+Controller）

> 核心机制可以简述为：**声明式状态管理+控制循环**

### 简述K8s和docker的关系

- docker是容器引擎，而k8s是容器编排平台
- 早期k8s使用docker作为默认的容器运行时（CRI实现），docker负责启动容器，k8s负责调度
- 现在k8s引入了CRI，解耦了与docker的绑定，目前主流的运行时是containerd、CRI-O

### 简述K8s中什么是Heapster、Minikube、Kubectl、Kubelet

- Heapster是k8s早期用于性能监控与指标采集的组件，主要用于收集各个节点和容器的CPU、内存、网络等指标，已经在1.13中被废弃，使用Metrics Server + Prometheus代替
- Mimikube：一个轻量级的本地k8s集群，适用于开发与测试
- kubectl：k8s的命令行工具，用于操作集群资源、查看状态、调试问题等，实际是通过调用API server的REST接口进行通信
- kubelet：运行在每个工作节点上的核心服务，负责接收API server下发的Pod信息、监控容器状态、与容器运行时交互、报告节点健康、Pod状态到控制平面

### K8s常见的部署模式

- 单节点部署（All-in-One）：用于本地开发/测试，所有组件部署在一个主机上，简单但不具有高可用性
- 标准集群部署（Master+Worker）：用于生产/企业环境，控制面与工作节点分开，具备扩展性和基本高可用能力
- 高可用集群（HA）：用于金融/大规模系统，多个Master节点+etcd集群+VIP/负载均衡器，保证容错和稳定新
- 云托管部署（Managed K8s）：用于快速上线/降低运维成本，如AWS EKS、GKE、ACK，控制面由云厂商托管，用户只管Worker节点
- 边缘部署（k3s/kubeEdge）：用于IoT/边缘计算，轻量化、适配低资源设备，简化组件、节省资源

### 容器和主机部署应用的区别是什么

主机部署（裸机部署/传统部署）：应用直接运行在物理机或者操作系统上，共享整个主机环境

容器部署（基于容器的部署）：应用运行在独立的容器中，容器由容器运行时（如docker、containerd）管理

主要区别：

- 隔离性：主机部署是进程级别隔离，多个应用共享系统资源，而容器通过namespace、cgroups实现高隔离
- 启动速度：主机部署启动慢，需要加载整合操作系统，容器部署启动快，秒级启动，仅包含应用和依赖
- 资源占用：主机部署占用资源较高，容器占用资源小（共享宿主机内核）
- 部署方式：主机部署通过手动配置或者脚本管理，容器部署通过容器镜像和编排系统
- 可移植性：应用受限于运行环境差异，镜像封装一切依赖，任意平台运行一致
- 运维管理：更新/扩缩容繁琐容易出错，容器镜像和编排系统可以实现自动化管理
- 安全性：难以限制进程权限，出错影响整机，容器有隔离但是共享内核，安全可控但是仍需额外加固
- 日志/网络：依赖传统syslog、服务配置，容器有标准化日志输出、网络插件等机制

### K8s如何实现集群的管理，简述K8s的优势、适应场景及其特点

k8s采用控制平面（Control Plane）+ Worker节点的架构，使用核心组件协同完成集群管理：

- 用户通过kubectl或者ci/cd工具向API server提交资源定义（如Pod，deployment）
- scheduler决定哪个节点运行这些Pod
- kubelet监听调度到本节点的Pod并调用容器运行时启动容器
- controller manager保证系统状态和用户期望一致
- 所有状态写入etcd，供系统其他组件读取

k8s的优势

- 弹性伸缩：支持基于资源使用的自动扩容/缩容（如HPA、VPA、cluster autoscaler）
- 自愈能力：Pod异常自动重启、重新调度，保持高可用
- 负载均衡与服务发现：cluster/nodeport/loadbalance机制+DNS自动解析
- 声明式管理：所有资源使用YAML声明式配置，利于版本控制和可追溯
- 自动部署与滚动更新：支持无停机部署、回滚等能力
- 生态丰富：有丰富的云原生工具可以集成
- 跨平台支持：支持公有云、私有云、本地环境部署，平台无关性强

适用场景：

- 微服务架构部署：服务数量多、生命周期变更频繁，k8s可以统一管理
- devops持续交付：搭配gitops/cicd实现自动化部署
- 混合云/多云部署：管理多个不同环境下的工作负载，保持一致性
- 大数据/AI作业调度：可以调度GPU/TPU资源，完成批处理任务、分布式训练
- 边缘计算场景：通过k3s、kubeEdge等适配边缘计算环境
- 高可用、弹性伸缩要求强的业务：电商促销、视频直播等瞬时高并发业务

### K8s的缺点或当前的不足之处

- 学习曲线陡峭
- 集群运维复杂：自建集群需要配置高可用的组件、证书、网络插件等，控制平面的升级、etcd的备份恢复也对经验要求高
- 资源消耗大：控制平面组件会消耗较多资源，默认部署监控、日志、服务网格后资源占用迅速增加
- 存储与网络配置复杂：k8s自身不提供存储与网络方案，需要借助CSI/CNI插件，网络调试困难
- 故障排查难度大：问题可能发生在多个层级，排查复杂

> 实际项目中可以通过合理选型、增强工具链（如监控日志集成）、规范权限管理等来规避不足，充分发挥其在云原生架构中的价值

### K8s的资源类型有哪些

K8s原生支持的资源类型，即Kind字段中可以直接使用的有：

- 工作负载类
  - Pod
  - Deployment
  - Replicaset
  - StatefulSet
  - DaemonSet
  - Job
  - Cronjob
- 服务发现与负载均衡
  - Service
  - Ingress
  - EndpointSlice
  - Endpoint
- 配置与存储
  - ConfigMap
  - Secret
  - PersistentVolume (PV)
  - PersistentVolumeClaim (PVC)
  - StorageClass
- 集群资源
  - Namespace
  - Node
  - APIServer：用于将集群扩展API注册到主API Server
- 元数据
  - Event
  - LimitRange
  - ResourceQuota
  - HorizontalPodAutoscaler
  - PodTemplate
  - Lease
- 访问控制
  - ServiceAccount
  - Role
  - ClusterRole
  - RoleBinding
  - ClusterRoleBinding
- 扩展机制
  - CustomResourceDefinition (CRD)：实现自定义的资源类型

### API Server的作用是什么

apiserver是k8s的核心组件，是唯一直接与etcd直接交互的组件，主要作用是负责接收k8s的请求、鉴权、存储和通知变更信息：

- 统一入口：所有的组件（kubectl、controller、scheduler、kubelet、operator）都是通过apiserver来读写资源对象，apiserver是k8s的REST API服务器
- 鉴权与认证：对接入的请求进行认证、授权、准入控制
- 数据库存储代理：apiserver不直接存储数据，而是作为代理把对象存入etcd，并实现对etcd的封装
- watch通知：对外提供资源变化的watch流，供controller、client-go、kubectl watch等订阅，通知变更事件
- 数据校验和默认值填充：在资源创建时会自动补全默认值和进行字段合法性校验

### API Server的架构

- 认证（Authentication）：支持Token、Client Certificate、Webhook、OIDC等，返回UserInfo，供后续鉴权使用
- 鉴权（Authorization）：判断用户是否有权限操作资源，支持RBAC、ABAC、Webhook、Node角色等
- 准入控制器（Admission Controller）：在资源写入etcd之前进行检查（拒绝、修改、审计），控制插件有namespaceLifecycle、LimitRanger、PodSecurity、MutatingAdmissionWebhook
- 请求处理：
  - HTTP服务器（REST API handler）：支持K8s资源的标准REST接口
  - 路由和版本管理：管理不同资源组（core、apps、batch）和版本（v1、v1beta1），路由到对应的资源处理器
  - 序列化和反序列化：使用protobuf或json编解码请求体与etcd存储体
  - 存储接口：所有资源都转换为键值对写入etcd
  - 聚合层（API Aggregation Layer）：支持通过注册APIServer资源把外部API接入K8s API路径，比如Metrics server、Custom API Server

### API Server如何保证与其他组件的消息的及时同步

一般来说实现消息同步有两种方式：1.客户端轮询获取最新的状态，2.apiserver通知客户端
list-watch机制可以较低apiserver的请求压力，其本质就是客户端监听k8s资源的变化并执行相应的处理逻辑（生产者消费者），并且需要满足：

- 实时性：当资源变更，相关的组件要尽快感知
- 消息的顺序性：消息要按照先后发生的顺序被发送
- 保证信息不丢失或者可靠的重新获取机制

list-watch机制是k8s中各个组件从apiserver获取资源状态并持续监听变化的标准模式，其中list是通过apiserver获取全部资源，watch是基于list返回结果中资源的resourceVersion请求apiserver并启动持续监听（基于http长连接）

informer是client-go的一个组件，实现了对list-watch的封装用于自动管理资源的监听、缓存和事件分发：

- 初始化阶段：使用list获取所有资源并填充缓存
- 持续监听：通过watch监听后续变化
- 缓存更新：将watch到的事件同步到本地缓存
- 事件分发：触发注册的事件处理方法

### client-go是什么

client-go是k8s官方提供的go语言SDK，用于与k8s apiserver通信的客户端库，是开发k8s应用的标准工具包

client-go提供了完整的k8s交互能力：
- clientset：访问所有k8s资源的客户端集合
- informer：监听资源变化的高级封装
- workqueue：处理事件的工作队列
- restclient：底层http客户端
- discovery client：发现api资源信息

### K8s各模块如何与API server通信

Kubernetes的各个组件（例如kubelet、kube-proxy、scheduler、controller-manager）都会与API Server进行通信

API server的作用：

- 统一接口：提供RESTful API接口
- 认证授权：验证客户端身份和权限
- 数据验证：验证API对象的格式和内容
- 数据持久化：与etcd交互存储集群状态
- 事件通知：通过watch机制推送资源变更

- kubelet：
  - 主动向API server拉取信息，并定期上报状态
  - 监听自己所在节点的pod资源（watch pod），上报pod状态（心跳、资源使用等），创建或删除容器后上报容器状态
  - 通过kubeconfig文件中的凭证，通过HTTPS请求API server（/api/v1/nodes、/api/v1/pods）
- controller-manager：
  - 通过informer/watch主动监听资源变化，并更新状态
  - 主要是deployment、replicaset、node、pod状态等资源的监控与控制，例如deploymentController监控deployment对象并创建replicaset
  - 使用go-client+informer/watch机制与API server通信
- scheduler：
  - watch未调度的pod，对其绑定Node
  - 监听状态为pending且未指定Node的pod，使用调度策略计算后，调用API server的/binding API更新pod的spec.nodeName
  - 基于client-go访问API server，通过HTTP PUT/POST提交调度结果
- kubectl：
  - 用户通过kubectl向API server发起命令请求
  - 用于查询、创建、删除资源，实际是将命令翻译成对应的API server的REST请求
  - 本地使用kubeconfig中的集群地址、认证凭据等信息，发起HTTPS请求到API server
- etcd：
  - API server与etcd通信，其他模块不直接访问etcd
  - API server作为唯一客户端，读写集群的所有状态数据
  - 通过gRPC over TLS进行通信
- CoreDNS、Ingress Controller、CRI/O、CNI等插件
  - 这些组件直接与API server交互：
    - CoreDNS watch service和endpoints的信息
    - Ingress Controller watch ingress资源，根据规则配置负载均衡
    - 网络/存储插件可能通过kubelet调用API server，间接同步信息

### scheduler的作用及实现原理

核心职责：

- 监听所有pending状态的pod
- 根据设定的调度策略和集群当前的状态，选择一个最合适的节点
- 将调度结果写回API server，更新Pod.spec.nodeName字段

详细流程：

1. watch未调度的pod：监听API server，获取所有处于pending且`spec.nodeName=="`的pod
2. 调度策略：
   - filtering（预选阶段）：筛选出可运行的pod节点集合，过滤掉资源不足、不满足调度条件的节点（NodeReady、Taint/Toleration等）
   - scoring（优选阶段）：通过筛选的节点打分排序，选择分数最高的那个节点，打分标准包括节点的负载均衡程度、节点的亲和/反亲和权重、自定义调度策略
3. 绑定pod到节点：将决策结果通过Bind API提交到API server，设置Pod.spec.nodeName的值（会被kubelet watch并执行创建操作）

### kubelet的作用

kubelet是运行在每个节点上的关键组件，主要负责管理该节点上Pod和容器的生命周期，核心作用是：

- **管理Pod生命周期**：保证Pod按照定义被创建、运行、重启、终止
- **与容器运行时CRI通信**：通过CRI与底层容器引擎containerd/CRI-O通信来创建、删除和监控容器
- **健康检查**：负责执行Liveness、Readiness、Startup探针，报告容器是否健康
- **资源监控与报告**：定期将容器资源使用情况（CPU、内存等）和节点状态汇报给API server
- **volumn、secret、configMap管理**：负责挂载和卸载Pod所需的存储卷（如PVC、hostPath、configMap、Secret等volumn资源），也负责和CSI交互管理动态卷
- **Pod日志管理**：管理日志路径，日志收集器通常基于kubelet输出收集日志

### 如何保证集群的安全性

API server的安全机制

- 认证：使用证书、token、OIDC等方式对用户和组件身份进行认证
- 授权：基于RBAC控制不同角色的访问权限
- 准入控制：使用NamespceLifecycle、LimitRanger、PodSecurity、ImagePolicyWebhook等admission plugin控制资源创建流程

网络安全

- 网络策略（NetPolilcy）：限制pod与pod、pod与外部之间的网络访问，默认隔离、最小权限
- service mesh（如istio）：提供细粒度的流量加密（mTLS）、访问控制、审计等功能
- 边界防护：配置防火墙规则，限制访问API server、etcd等敏感端口

容器运行时安全

- 使用只读根文件系统、去除特权模式、限制CAPABILITY权限
- 使用PodSecurity来限制容器权限（如hostPID、hostNetwork）
- 开启AppArmor或seccomp profile限制系统调用

镜像安全

- 只使用可信的镜像源
- 使用容器镜像扫描工具（Trivy、Clair等）进行漏洞扫描
- 禁止使用latest标签，要求使用固定版本

ETCD安全

- ETCD保存所有的敏感数据，因此可以开启TLS加密通信，设置访问权限，仅允许API server访问
- 对ETCD数据进行定期备份

日志审计与监控

- 开启Audit Log审计API操作行为
- 配置Prometheus和Grafana进行监控
- 使用Falco、OPA Gatekeeper等工具进行运行时行为检测和策略控制

### K8s的准入机制

k8s的准入机制是指在用户请求通过认证和授权后，在写入ETCD之前，由一组Admission Controllers（准入控制器）来执行拦截、修改、校验步骤，用于：

- 拒绝非法资源（安全控制）
- 自动补充字段（默认策略）
- 强制执行组织策略（合规管控）

k8s有两类准入控制器：

- MutatingAdmissionWebhook：可以修改资源对象，比如自动加标签、自动注入sidecar
- ValidatingAdmissionWebhook：只验证资源是否合法，不能修改对象

此外还有内置有一些核心Admission Plugin：

- NamespaceLifecycle：阻止在终止中的命名空间创建资源
- LimitRanger：强制资源限制（CPU/Memory）
- PodSecurity：限制pod权限
- ServiceAccount：绑定默认的service account

### PodSecurityPolicy机制是什么，能实现哪些安全策略

PodSecurityPolicy是k8s的一种集群级别的资源对象，它定义了允许Pod拥有什么样的安全配置，在1.25被正式移除，建议使用PodSecurity admission代替

PSP的机制：

- 当用户创建Pod，API server会调用PSP的准入控制器
- 系统查找用户（或其绑定的ServiceAccount）所拥有的PSP
- 找出符合该pod的PSP（通过RBAC授权）
- 检查是否满足PSP中的各项安全要求
- 判断是否允许创建pod

能实现的安全策略

- 特权限制：是否允许使用`privileged:true`
- 容器用户：runAsUser、runAsGroup、是否必须非root运行
- Linux Capabilities：允许或禁止某些Linux能力（如NET_ADMIN）
- 主机资源访问：是否允许挂载hostPath、使用HostNetwork、hostPID等
- 文件系统权限：是否强制使用只读根文件系统
- 卷类型限制：限制只允许某些类型的volumn（如禁止nfs、hostPath）

### PodSecurity Admission是什么

PodSecurity Admission是1.23引入，并在1.25取代PodSecurityPolicy的内建安全控制机制，PSA是运行在API server内的准入控制器，用于控制命名空间中Pod的安全性配置的合规性，例如：

- 是否允许特权容器
- 是否允许hostNetwork、hostPID等
- 容器运行用户是否必须非root
- 能否挂载HostPath等危险Volume

PSA通过在命名空间打标签来启用不同的安全策略级别：

- privileged：最宽松，无限制
- baseline：中等限制，禁止明显危险行为
- restricted：最严格，遵循最小权限原则

可以为命名空间设置的三中操作模式：

- `pod-security.kubernetes.io/enforce`：拒绝不合规 Pod
- `pod-security.kubernetes.io/warn`：仅警告（不拦截）
- `pod-security.kubernetes.io/audit`：记录审计日志（不拦截）

大多数版本的K8s都默认开启了PSA，可以给Namespace打上标签来设置restricted策略和拦截非法Pod：

```shell
kubectl label ns default \
  pod-security.kubernetes.io/enforce=restricted \
  pod-security.kubernetes.io/enforce-version=latest
```

加上警告和审计：

```shell
pod-security.kubernetes.io/warn=restricted
pod-security.kubernetes.io/audit=restricted
```

这样当创建一个违规的Pod就会收到报错提示：

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: nginx-privileged
spec:
  containers:
    - name: nginx
      image: nginx
      securityContext:
        privileged: true
```

```shell
Error from server: pods "nginx-privileged" is forbidden: violates PodSecurity "restricted:latest": privileged container is not allowed
```

### Namespace是什么

Namespace是K8s的资源隔离机制，允许将集群资源划分为多个虚拟子集，主要作用是：

- 资源隔离：把不同环境（开发、生产、测试）或者不同团队的资源分开管理
- 权限管理：可以基于namespace配置RABC权限策略，控制namespace内的权限控制
- 限制资源：配合ResourceQuota使用，可以限制namespace使用的CPU、内存等资源

### RBAC是什么，有什么特点和优势

RBAC是基于角色的访问控制，是K8s中用于控制用户或服务账户的资源访问权限的机制

RBAC的核心资源

- Role：定义在命名空间级别的用户
- ClusterRole：定义在集群级别的用户
- RoleBinding：将Role绑定给User/Group/ServiceAccount（命名空间级），从而赋予这些用User/Group/ServiceAccount对指定资源的操作权限
- ClusterRoleBinding：将ClusterRole绑定给User/Group/ServiceAccount（集群级），从而赋予这些User/Group/ServiceAccount对指定资源的操作权限

RBAC工作机制

- 用户发起请求，如创建Pod
- API server经过验证后，进入RBAC授权阶段
- RBAC根据绑定关系判断是否允许操作

RBAC的特点

- 细粒度权限控制：控制到资源类型、动作为止（如get、create、list）
- 可组合性强：Role和RoleBinding分离，可以灵活组合
- 支持服务账户权限管理：可用于管理CI/CD、Controller、Pod等用户
- 内置预定义ClusterRoles：如admin、view、edit，方便快速授权

RBAC的优势

- 最小权限原则：只授权用户/服务账户所需的最小权限
- 清晰的权限边界：明确区分命名空间级和集群级权限
- 增强安全性：限制误操作或攻击面（如拒绝非授权的删除操作）
- 方便审计与合规：权限显示、绑定关系清晰，易于审查和追踪
- 与cloud provider认证集成：可与OIDC、LDAP、GCP、Azure AD等配合使用

### secret的作用

Secret是用于存储敏感信息的资源对象，例如密码、token、docker镜像拉取凭据和SSH密钥等，可以被pod挂载或作为环境变量使用，主要作用：

- 保护敏感信息：Secret将敏感信息与Pod的配置分离，避免将敏感信息直接写入YAML文件中
- pod内注入信息：pod可以通过挂载文件或环境变量的方式访问secret中的内容
- 提高安全性：secret存储时是base64编码，支持与KMS（密钥管理系统）集成实现加密存储
- 授权与访问控制：结合RBAC实现对secret的访问权限控制，保护敏感数据
- 自动TLS配置：与kubelet结合自动为ingress或webhook等服务提供TLS证书

> secret默认是base64编码（不是加密），建议开启etcd加密机制（EncryptionConfig），并使用RBAC限制Secret访问权限

### secret有哪些使用方式

**Volume挂载**：将Secret作为Volume挂载到Pod中，容器可以通过文件系统访问Secret中的数据，如TLS证书、SSH密钥等

```yaml
volumes:
  - name: mysecret-volume
    secret:
      secretName: mysecret

volumeMounts:
  - name: mysecret-volume
    mountPath: "/etc/secret"
    readOnly: true
```

**环境变量注入**：将Secret中的数据注入到容器的环境变量中，通常用于传递数据库密码、API token等数据

```yaml
env:
  - name: DB_PASSWORD
    valueFrom:
      secretKeyRef:
        name: db-secret
        key: password
```

**用于Ingress的TLS证书**：使用Ingress处理HTTPS的时候，可以使用secret存储TLS证书

```yaml
tls:
  - hosts:
      - mydomain.com
    secretName: tls-secret
```

**用于镜像拉取凭证**：配置在`imagePullSecrets`使在镜像拉取时能够使用正确的认证信息

```yaml
imagePullSecrets:
  - name: myregistrykey
```

> 当pod使用service account时，k8s会自动将对应的secret（类型为service-account-token）注入到容器，用于pod内部访问k8s API

### K8s中共享存储的作用

共享存储在K8s中的作用是支持多个Pod或容器访问同一份持久化数据，实现数据共享与持久保存

- 共享存储是指一种可以被多个Pod同时挂载并访问的存储系统
- 通常由外部存储系统（如NFS、GlusterFS、Ceph、CSI插件等）提供
- 它是K8s持久化存储（Persistent Volumn）机制的一部分

作用：

- 数据持久化：默认Pod重启会丢失数据，共享存储可以将数据保存到外部系统，即使Pod被删除也不会丢失
- 多个Pod数据共享：多个Pod可以同时挂载一个共享卷，实现一个Pod写数据另一个Pod收集的生产者消费者模型
- 支持有状态服务：数据库、分拣服务、分布式缓存等
- 支持弹性伸缩场景：多个副本访问同一个数据目录，无需每个副本独立维护存储

### 持久化存储的方式有哪些

- **PV和PVC**：k8s提供的标准持久化机制，跨云平台、支持共享和独享存储
- **EmptyDir**：Pod创建时在宿主机临时创建的目录，生命周期与Pod绑定，只在Pod容器之间共享
- **HostPath**：HostPath挂载宿主机目录，可以直接访问宿主机文件，Pod之间可以共享，Pod删除数据可以保留，但是数据与节点绑定，迁移困难

- 使用共享存储系统：如NFS、CephFS、AWS EFS等，支持多个Pod同时挂载使用，实现数据共享，支持跨节点共享、数据集中管理，适用于日志收集、Web内容共享、任务协同等
- 使用云存储对象：将数据写入云存储，如AWS S3、阿里云OSS、MinIO等，常用于备份、镜像存储、大文件或静态文件存储，容量弹性大，适合非结构化数据
- 使用statefulset+PVC：statefulset可以使用volumeClaimTemplates为每个pod创建独立的PVC，适用于有状态的服务

> volumeClaimTemplates是statefulset独有的，对于deployment可以先创建PVC再挂载

### PV和PVC是什么

- Persistent Volume (PV)：集群管理员或者storage class创建的持久化存储卷，用于提供存储资源，并描述存储的容量、访问模式、存储类型，是集群级别的资源
- Persistent Volume Claim (PVC)：用户对PV的请求，Pod可以通过PVC声明对存储资源的需求，是namespace级别的资源

### PV生命周期内的阶段

- Available：可用状态，PV尚未被绑定到PVC，等待PVC的请求
- Bound：已绑定状态，PV已经绑定到PVC，不能被其他PVC使用
- Released：已释放状态，PVC已经被删除，但PV尚未被回收，可以再次使用
- Failed：失败状态，PV无法被回收或删除，需要手动处理

> PV保留策略persistentVolumeReclaimPolicy可以是Retain（保留数据）、Delete（自动删除后端存储资源，清理PV）

### K8s支持的存储供应模式有哪些

- 静态供应（Static Provisioning）：集群管理员提前手动创建PV，用户创建PVC后绑定合适的PV，适用于对接传统存储，但是维护成本高、效率低
- 动态供应（Dynamic Provisioning）：用户创建PVC，K8s根据PVC中指定的StorageClass自动创建PV，完成PV-PVC的绑定，自动化程度高、支持弹性扩容

### K8s的CSI模型

CSI（Container Storage Interface）模型是一套由CNCF推出的容器存储接口标准，用于统一容器编排系统与各类存储系统之间的对接方式

为什么需要CSI

- 早期的K8s的存储插件都是内嵌的，每新增一种存储后都需要重新发布，扩展性差、维护成本高、安全风险大
- 引入CSI后，存储插件被解耦成了独立的组件，以容器形式运行，便于第三方开发和维护

CSI的核心组件

- External Provisioner：控制器组件，负责监听PVC的创建请求，并调用CSI驱动的CreateVolumn接口创建卷
- External Attacher：控制器组件，当Pod绑定PV之后，调用CSI驱动的ControllerPublishVolume进行卷的挂载
- Node Plugin（Node Driver）：驻留在每个节点上，实现NodePublishVolume等接口，负责将卷挂载到实际的容器路径
- External Snapshotter：控制器组件，实现快照功能，调用CreateSnapshot等接口
- External Resizer：控制组件（可选），实现PVC扩容能力，调用ControllerExpandVolume
- CSI Driver Regisrar：负责将驱动注册到kubelet，便于kubelet管理CSI插件

CSI工作流程

- 用户创建PVC
- CSI external-provisioner监听PVC的创建，调用CSI驱动创建卷
- Pod创建时绑定PVC
- CSI external-attacher负责attach卷到Node
- kubelet调用Node Plugin，将卷挂载到容器中

CSI模型的优势

- 解耦核心代码：不需要把驱动编译进k8s
- 跨平台统一接口：CSI是一个跨容器平台的标准，不仅限于k8s
- 支持更多高级功能：如快照、扩容、拓扑感知等
- 更好维护性和独立发布周期

### Worker节点加入集群的过程

worker节点是实际运行pod的节点，必须与集群的control plane通信，才能被调度管理，加入集群的过程是通过kubeadm向master节点注册，并启动必要组件（如kubelet、kube-proxy）

node注册到集群

- kubelet启动后会使用TLS向kube-apiserver注册自己（发送CSR）
- controller-manager的node-controller会审批并创建该Node对象
- Node进入ready状态后，可以接收调度任务

注册流程：

1. 安装kubelet和 kube-proxy：在Worker节点上安装kubelet和kube-proxy组件
2. 配置kubelet：配置kubelet连接到API Server的地址
3. 启动kubelet：启动kubelet服务
4. 自动注册：Kubelet会自动向API Server注册节点信息
5. 批准节点：如果启用了节点自动批准功能，API Server会自动批准节点否则，需要手动批准节点

### Metric Service是什么

Metrics Server是Kubernetes中用于收集、聚合和暴露集群资源使用情况的组件，供k8s系统或者外部系统（如Prometheus、HPA）进行调度决策、自动扩缩容和可观测性分析，其主要作用是：

- 提供资源指标：Metrics Server收集节点的CPU、内存、网络和磁盘等指标，并将这些指标暴露给kubernetes API，可以使用kubectl top命令查看
- 支持Horizontal Pod Autoscaler（HPA）：HPA可以使用Metrics Server提供的指标自动调整Pod的副本数量实现水平自动扩缩容

> metrics server定期从每个节点的kubelet获取summary API的数据，然后聚合并暴露给k8s API

### 如何使用ELK实现日志的统一管理

使用ELK实现统一日志管理的核心思路是：应用产生的日志通过Logstash或Filebeat收集，传输到Elasticsearch进行集中存储与索引，最后通过Kibana提供可视化界面实现日志检索、分析和警告

主要组件：

- Elasticsearch：分布式搜索与分析引擎，存储和索引日志数据
- Logstash：日志处理管道，负责收集、过滤、解析、转发日志
- Kibana：Web UI用于展示和查询日志
- Filebeat：轻量级日志收集器，部署在节点上监控日志文件并转发给Logstash/Elasticsearch

实现方案：

- 日志采集：
  - 部署Filebeat/Logstash到每个节点作为DaemonSet运行
  - Filebeat配置路径：收集容器日志、系统日志、应用日志等
- 日志过滤、解析：
  - 可选，进行日志格式的转换、标签添加处理等
  - 使用Grok、正则、JSON解码等filter插件清洗数据
- 日志存储
  - 日志通过Logstash/Filebeat发往Elasticsearch
  - Elasticsearch会创建索引（通常按天或应用划分）
- 日志展示
  - 使用Kibana创建索引模式，如filebeat-*
  - 提供搜索、过滤、图表分析、告警等功能

### 如何进行优雅的节点关机维护

1. 标记节点不可调度（cordon）：
   - 防止新的pod被调度到该节点，使用 `kubectl cordon <node_name>` 命令将节点标记为不可调度
2. 驱逐节点上的pod（drain）：
   - 使用 `kubectl drain <node_name> --ignore-daemonsets` 命令将节点上的Pod驱逐到其他节点，`--ignore-daemonsets` 参数用于忽略DaemonSet Pod
3. 等待pod被调度到其他的节点：
   - 监控Deployment/StatfulSet等资源副本状态恢复
4. 维护节点：
   - 对节点进行维护操作，例如升级操作系统、更换硬件等
5. 恢复节点（uncordon）：
   - 维护完成后，使用`kubectl uncordon <node_name>`命令将节点标记为可调度

### K8s的集群联邦是什么

Kubernetes Federation是一种机制，允许用户在多个k8s集群中统一部署、调度、配置和监控资源，实现跨集群的高可用、灾难恢复和地理分布式部署

集群联邦的目的：

- 跨区域部署（如多地部署服务
- 提高服务可用性（一个集群宕机有其他集群可使用）
- 健康检查和服务切换（有集群宕机时自动将流量切换到其他集群）
- 地理亲和性调度（用户请求可以命中位置最近的集群（GSLB））

架构组成

- Host Cluster（联邦控制集群）：承载Federation Controller的集群
- Member Cluster（成员集群）：被联邦管理的目标集群
- Federation API server：提供跨集群资源定义的如露
- Sync Controller：负责将联邦资源同步到各个成员集群

使用场景

- 多地部署：跨多个云厂商部署服务实例，实现低延迟访问
- 灾备容灾：保证一个区域宕机不影响整体服务
- 监管合规：某些数据必须部署在特定地区的数据中心
- 混合云：同时在私有云和公有云部署不同组件

### Helm是什么，优势是什么

Helm是Kubernetes的包管理工具，类似于Linux的apt或yum，主要作用是通过helm chart快速查看、可配置地部署k8s应用

helm chart是一个应用模板包，包含了所有的k8s资源（如deployment、service、ingress等）的定义，可以方便快速地完成应用地部署

主要优势：

- 简化部署：一条命令部署整个应用
- 版本管理：像git一样管理部署的版本，可以进行版本回滚
- 参数化配置：通过values.yaml进行灵活配置，适配不同的环境
- 应用封装：把通用的k8s应用打包成chart，提高协作效率
- 生态丰富：社区和厂商提供了大量优秀的helm chart
- gitops集成：适配argoCD、flux等工具，便于CICD自动化

### 标签与标签选择器的作用是什么

标签是以键值对的形式给k8s中的对象打上标记（元数据），标签选择器是根据标签筛选资源的机制，控制器等组件通过它来选择目标资源

标签的主要作用：

- 资源分类与分组：给资源打上标签，例如：env=prod、app=nginx，便于后续查询和管理
- 资源选择器的基础：很多控制器通过标签选择器来匹配具体的Pod
- 实现灵活的调度策略：可以结合Node的标签进行Pod调度（通过NodeSelector、Node Affinity）
- 服务发现和流量控制：service通过标签选择对应的pod，实现服务发现和负载均衡
- 方便监控与告警：监控系统（如Prometheus）可以通过标签进行筛选和聚合

标签选择器的主要作用：

- 服务发现：service通过selector匹配pod的标签，来确定后端服务实例
- 控制器管理：deployment、replicaset、job等控制器通过selector管理它们的pod
- 调度相关：结合affinity、nodeselector等机制，实现资源约束或亲和性调度

常见的标签分类有哪些

- 应用维度：app=nginx,name=my-app，标识应用名称、模块等
- 环境维度：env=prod,env=staging，区分不同的部署环境
- 架构维度：tier=frontend,tier=backend，表示服务在系统架构中的角色
- 自定义标签：根据实际需求自定义的标签

### 有几种查看标签的方式

- `kubectl get <resource_type> <resource_name> --show-labels`： 查看资源的标签
- `kubectl describe <resource_type> <resource_name>`： 查看资源的详细信息，包括标签
- `kubectl get <resource_type> -l <label_selector>`： 根据标签选择器选择资源（如`kubectl get pods -l app=nginx`）

### 添加、修改、删除标签的命令

- `kubectl label <resource_type> <resource_name> <label_key>=<label_value>`： 添加或修改标签
- `kubectl label <resource_type> <resource_name> <label_key>-`： 删除标签

### 对Job资源对象的了解

job是K8s的核心工作负载资源之一，主要用于一次性任务的执行和成功管理

使用场景：

- 数据处理任务：执行ETL、批量导入、转换等
- 定时任务的执行体：通常与cronjob配合使用
- 数据初始化：比如初始化数据库结构、填充配置等
- 自动化测试：运行某个阶段的自动化测试后退出
- 脚本式操作：执行清理任务、生成报告

Job的特点：

- 一次性运行：与deployment、replicaset等长期运行不同，job只关注任务运行一次病成功完成
- 成功即结束：job结束条件是其pod成功退出（exit code=0）达到期望次数
- 失败自动重试：默认支持失败重试，可以配置backoffLimit（最大重试次数）
- 并行或批处理：支持配置并发执行多个pod，常见策略有：非并发、固定数量并发、带索引并发
- 可控的完成策略：job可以通过completions和parallelism控制并发和任务总数
- 自动清理：可设置TTL策略让job在完成后自动清理资源

与cronjob的关系：

- cronjob是在特定时间周期自动创建job的控制器
- cronjob不直接运行pod，只是按照调度规则周期性地创建job，每个job再启动Pod完成任务

## ETCD

### 简述ETCD及其特点

etcd是一个开源、高可用的分布式键值存储系统，是K8s的核心组件之一，主要负责存储集群中所有的状态数据，如Pod、Service、ConfigMap、Secrets等，并且使用Raft一致性算法来保证分布式系统中的数据一致性和可靠性，主要特点是：

- 分布式架构：etcd采用分布式设计，支持集群部署，通常以奇数个节点运行，确保高可用性和容错能力
- 强一致性：使用Raft算法确保多节点间的数据一致，读写顺序严格
- 高可用性：支持多节点部署，Raft实现leader-follower架构，可以在部分节点宕机的情况下继续提供服务
- watch机制：支持客户端监听某个key或目录下的变更，实现事件驱动、服务发现等功能
- 事务支持（Txn）：提供原子性操作，可以通过事务一次执行多个操作，确保操作的一致性
- 性能优秀：在高并发、高负载下仍能够保持良好的响应时间和吞吐率
- 数据持久化：支持将数据落到磁盘，防止数据丢失

### ETCD如何保证数据一致性

Raft算法是一个用于构建**分布式一致性系统**的共识算法，目标是在一组节点中保证状态的一致性，即使部分节点宕机或者通信失败仍能保证系统可用性，其核心是：

- 领导者选举
- 日志复制
- 日志一致性和故障恢复

Raft中每个节点都处于三种角色之一：**Leader**、**Follower**、**Candidate**，每个etcd节点启动的时候是**Follower**，超时未收到Leader的心跳（AppendEntries）就会：

- 将自己变为Candidate
- 发起RequestVote请求给其他节点
- 如果获得了多数节点的投票，就成为新的Leader

投票规则是每个任期（term）内，每个节点只能投票一次，并且倾向于投票给日志比自己更完整的节点（index更新，term更高，日志结构为`<term, index, command>`）

当Leader被选举出来后，客户端发送的写请求处理流程为：

- 请求被etcd的Leader接收，或者从Follower重定向过来
- Leader将请求日志追加到自己的**预写日志**Write-Ahead Log（WAL）确保宕机之后可恢复（uncommitted）
- 通过AppendEntries发送给Follower（心跳携带日志），Follwer将日志写入WAL
- 一旦超过半数的Follower确认日志写入并响应，Leader将日志标记为已提交（commitIndex更新）
- Leader和Follwer将提交该日志并应用到状态机（更新真实数据）
- 向客户端返回成功响应

通过Raft算法保证分布式系统强一致性：

- **多数仲裁（Quorum）机制**：任意时刻只要超过半数节点一致，就能保证系统继续运行，即使部分节点宕机，只要多数节点存活，就可以保证一致性
- **写入流程**：通过apiserver将写入请求发送到Leader，Leader将操作日志（每次对系统状态变更的操作日志）复制到Followers，当多数Followers确认日志写入，数据才会被Leader提交到key-calue存储并向apiserver返回成功
- **读操作的一致性**：默认是从Leader读取，保证强一致性，也可以配置为从Follower读（性能高但是可能不是最新的数据，弱一致性）

### 脑裂是什么

脑裂是指在一个分布式系统中，由于网络分区等原因，集群被分裂成了多个互相无法通信的子集，每个子集都认为自己是唯一的主节点或者主集群，导致数据不一致

Raft协议中规定只有得到半数以上的投票才能成为Leader，当集群被分区，不会出现多个Leader，并且总有一个分区有半数以上的节点（奇数个总节点数），可以选举出Leader

当etcd出现脑裂无法选举出Leader时，etcd集群不可写入数据，从而避免数据不一致，但是可以提供读服务（弱一致性），只有选举出Leader后才能正常提供写服务，当etcd集群恢复后，Followers会自动同步Leader的日志

### 复制到Followers的日志有什么作用

- 保证数据一致性
  - Raft协议中，系统状态不是直接同步的，而是通过复制日志来同步的，如果日志不同步，状态也一定不同
  - 所有的状态变更必须先写到日志中，才能被提交和应用
- 容错恢复
  - Leader和Followers有一致的日志副本，当Leader宕机或崩溃，Follower可以快速替换成新的Leader
  - 新的Leader会和落后的Followers对比日志的索引和term，发现冲突就回滚，到一致为止（日志重写）
- 投票选举
  - Raft中日志越完整的节点越有可能成为Leader
  - 选举过程中，每个节点都会告诉其他节点自己最新的日志位置（term和index），每个节点都只会投票给不落后于自己的节点，来保证日志不后退
- 实现线性一致性
  - 日志是有序的操作序列，可以保证所有节点在相同顺序下应用相同的操作，可以得到相同的状态

### 简述ETCD适应的场景

> https://juejin.cn/post/6844904162791014407?searchId=20250731212430E43FAA7ABA321B575AB8

- 键值对存储：etcd本质是一个键值存储数据库
- 服务注册与发现：基于Raft算法的etcd是一个强一致性、高可用的存储服务，可以用于注册服务和查找服务
- 消息发布与订阅：可以作为分布式系统中的消息共享中心，实现消息的分布与订阅
- 分布式通知与协调：类似消息发布订阅，构建一个配置共享中心，当有消息发布时提醒订阅者
- 分布式锁：同样基于Raft算法保持数据的强一致性，可以用于实现分布式锁

### 为什么选择Raft而不是Paxos

Paxos是一个强一致性算法，和Raft的相同点：

- 都是为了在分布式环境中实现强一致性，确保多个节点对同一个值达成共识
- 都要超过半数节点同意才能达成共识，这是保证一致性的核心机制
- 都能容忍少于半数的节点故障
- 都可以实现分布式状态机，确保个节点按相同顺序执行相同操作

但是有以下缺点：

- 实现复杂
- 只解决一致性问题，不包含leader选举、日志复制等操作
- 系统故障时难以排查

etcd选择Raft是为了实现可读性强、易于维护、且更工程化的一致性算法

### 如何排查etcd的性能问题

etcd的性能问题通常体现在延迟高、写入慢、集群不稳定，排查方向为：

- 检查leader的状态：使用etcdctl命令
- 检查Raft日志复制的延迟：查看raftIndex、appliedIndex是否同步，follower是否滞后较多，可能是网络或者磁盘慢
- 检查watch和lease压力：过多的watch会导致CPU和内存占用增加，租约（lease）数量过多也会拖慢etcd
- 检查满请求日志（关键）：`journalctl -u etcd | grep "took too long"`定位具体的慢写操作
- 使用metrics+grafana监控：使用etcd暴露的prometheus指标可以监控请求速率、WAL写入延迟、DB fsync延迟、leader选举频率

## Pod

### Pod是什么

微服务架构中出于单一职责的考虑，一个容器只运行一个进程，为了将多个容器绑定到一起并将它们作为一个整体进行管理，K8s引入了Pod这一更高级的资源对象，一个Pod中的容器可以共享资源并协同工作，但是不能跨多个节点运行，Pod的主要特点是：

- 每个Pod会分配唯一的IP地址，像独立的机器一样运行
- Pod是K8s最小的部署单元
- Pod可以包含一个或多个容器，通常一个容器运行一个进程
- 一个Pod只能运行在单个节点上
- 每个Pod有一个**根容器**（pause容器）负责管理其他业务容器
- Pod中的容器共享网络命名空间和IP，因此可能出现端口冲突

### K8s的Pause容器是什么

Pause容器是一个基础容器，是每个Pod中默认启动的第一个容器，其主要作用是：

- **作为共享网络栈的主容器**：每个Pod中所有容器共享一个网络命名空间（Network Namespace），Pause容器会持有这个网络命名空间，后续启动的容器都会加入这个网络命名空间，从而实现容器的网络共享
- **作为容器生命周期的锚点**：Pause容器一旦创建，其PID就称为整个Pod生命周期的基础，如果Pause容器挂了，Pod就必须被重建

其实主要工作就是创建一个空进程，常驻不退出（比如执行pause或者sleep infinity），保持网络空间不被销毁

### K8s的初始化容器是什么（init container）

Init容器是在Pod初始化阶段（调度到节点后）运行的特殊容器，它们可以包含一些实用工具或脚本，用于在主容器启动之前执行一些初始化任务，例如：**设置网络**、**下载文件**、**生成配置文件**、**等待其他服务启动**

一个Pod可以包含多个Init容器，它们会按照定义的顺序依次执行，只有当所有的Init容器都执行成功后，Pod的主容器才会启动

### K8s中的是静态Pod是什么

静态pod是由kubelet直接管理、不经过API server创建的pod，常用于集群中关键系统组件的部署（api servevr、etcd等控制平面组件），部署配置文件是直接存储在节点的本地文件系统中（/etc/kubernetes/manifests/目录）

工作原理：

- kubelet启动时，通过--pod-manifest-path=/etc/kubernetes/manifests参数指定目录
- kubelet定期扫描这个目录
- 发现YAML文件则会创建对应的pod
- 这些pod是本地的、静态的，不会被控制平面调度
- 如果manifest里的文件被修改，kubelet会重启对应地pod

kubelet会把静态pod的信息同步给API server，生成一个只读的**Mirro Pod**（用于展示和查询），静态Pod可以在master或者worker节点上

### K8s中Pod可能处于哪些状态，pod的生命周期

pod在其生命周期中可能会经历以下几个状态：

- pending（待调度）：pod已经被创建但是还没有被调度到节点上，可能在等待调度器分配节点或者在拉取镜像
- running（运行中）：pod已被调度到节点上，至少有一个容器正在运行，或者正在启动或重启过程中
- succeeded（成功）：pod中所有容器都已成功终止，且不会重启，通常出现在job或者cronjob中
- failed（失败）：pod中所有容器都已终止，且至少有一个容器因失败而终止（退出码非0或被系统终止）
- unknow（未知）：因为某些原因无法取得pod的状态，通常是因为与pod所在节点的通信失败

Pod的生命周期：

- 创建阶段：用于提交pod的定义后，api server验证并存储到etcd中，调度器选择合适的节点
- 调度节点：调度器根据资源需求、节点选择器、亲和性等规则将pod分配到具体节点
- 拉取镜像：kubelet在目标节点上拉取所需的镜像容器
- 容器启动：按照定义的顺序启动init容器（如果有），然后启动容器，执行postStart钩子（如果定义）
- 运行阶段：容器正常运行，kubelet定期执行健康检查（Liveness和Readiness探针）
- 终止阶段：当pod被删除，会发送SIGTERM信号给容器，执行PreStop钩子，等待优雅终止期（30s），最后发送SIGKILL强制终止

容器的状态：

- waiting：容器未运行，可能在拉取镜像或等待
- running：容器正在正常运行
- terminated：容器已终止运行

生命周期钩子：

- PostStart：容器启动后立即执行
- PreStop：容器终止前执行，用于优雅关闭

```yaml
spec:
  containers:
  - name: myapp
    image: busybox
    command: ["sh", "-c", "echo Hello && sleep 3600"]
    lifecycle:
      postStart:
        exec:
          command: ["sh", "-c", "echo PostStart hook running >> /tmp/hook.log"]
      preStop:
        exec:
          command: ["sh", "-c", "echo PreStop hook running >> /tmp/hook.log"]
```

### K8s中Pod的健康检查方式

探针的三种类型：

- LivenessProbe（存活探针）：
  - 检查容器中服务是否可用，失败kubelet会重启容器
  - 用于可能会死锁但是进程还在，检测是否需要重启
- ReadinessProbe（就绪探针）：
  - 检查容器是否准备好接收流量，失败则从service的endpoints中移除
  - 应用需要加载配置、缓存、依赖服务等，没准备好不能接收请求
- StartupProbe（启动探针）：
  - 检查容器是否已经启动完成，在此之前不执行livenessProbe
  - 容器启动时间较长，避免被liveness误杀

探针的执行方式：

- HTTP请求探针：向容器内某个端口发送HTTP请求，返回2xx和3xx判定成功
- 命令执行探针：在容器内执行命令，退出码为0则成功
- TCP端口探针（tcpSocket）：检查容器端口是否能被成功建立tcp连接

> 使用liveness刚启动pod就被杀，可以搭配startupProbe
> 有服务暴露给外部，要配置readinessProbe，避免未就绪时流量进来
> 使用exec探针注意脚本或命令要可靠，不能误判
> HTTP探针更推荐，Liveness和Readiness都建议使用HTTP探针

```yaml
startupProbe:
  httpGet:
    path: /startup
    port: 8080
---
readinessProbe:
  httpGet:
    path: /ready
    port: 8080
  initialDelaySeconds: 5
  periodSeconds: 3
  timeoutSeconds: 2
  successThreshold: 1
  failureThreshold: 3
```

### K8s中Pod的重启策略

pod的重启策略是控制容器故障恢复行为的重要机制：

- **Always**：总是重启（默认），无论容器以何种方式退出，都会重启容器
  - 用于长期运行的服务（Web服务、API服务等），deployment、daemonSet等工作负载
- **OnFailure**：失败时重启，当容器以非0退出码退出时才会重启
  - 批处理任务，一次性任务，job工作负载
- **Never**：无论容器以何种方式退出，都不会重启
  - 用于一次性任务，数据迁移脚本，初始化任务

> deployment/replicaset/daemonset只能使用Always，job/cronjob只能使用OnFailure或Never
> 重启延迟机制：第一次立即重启，后面每次分别10秒、20秒、40秒最大5分钟重启

### K8s Pod常见的调度方式

**默认调度**

- k8s调度器 (scheduler) 会根据Pod的资源需求、节点资源可用性、以及预定义的调度策略（如Taints和Tolerations、Node Affinity等）自动将Pod调度到合适的节点上

**手动调度（Node Selector）**

- 通过在pod spec中指定节点名称，可以强制调度到指定的节点
- 通过在pod的YAML文件中指定`nodeSelector` 字段，可以指定Pod必须运行在具有特定标签的节点上

**亲和性调度（Affinity/Anti-Affinity）**

- Node Affinity： 类似于`nodeSelector`，但提供了更灵活的匹配规则，可以使用`requiredDuringSchedulingIgnoredDuringExecution`（硬性要求）和 `preferredDuringSchedulingIgnoredDuringExecution`（软性要求）
- Pod Affinity/Anti-Affinity： 可以基于Pod之间的关系进行调度，例如，将两个Pod调度到同一个节点上（亲和性），或者避免将两个Pod调度到同一个节点上（反亲和性）

**污点与容忍（Taints&Tolerations）**

- 节点设置了污点（Taints），表示默认拒绝调度pod上来，除非pod设置了对应的Toleration才能调度上来

**优先级与抢占调度（Preemption）**

- 设置`priorityClassName`(使用自定义的`PriorityClass`资源，然后在Pod中使用)，当高优先级pod没有资源时，可能抢占低优先级pod所在的节点资源，用于保留核心服务

拓扑分布调度

- 使用`TopologySpreadConstraints`控制不同拓扑域（如可用区、节点）间的分布，防止节点/区域宕机导致误服不可用

自定义调度器

- 使用`schedulerName`指定自定义的调度器，实现自定义调度逻辑

### Pod如何实现对节点的资源控制

- Requests：
  - Pod声明需要的最小资源量（CPU和内存）Scheduler会根据Requests调度Pod到有足够资源的节点上
- Limits：
  - Pod声明可以使用的最大资源量（CPU和内存）Kubelet会限制Pod使用的资源量，防止Pod占用过多资源
  - 如果容器使用的资源超过了limits：pod超过CPU limit不会被杀死，但是会被限制CPU的使用，如果超过Memory limit，pod会被杀掉（出现OOMKilled状态）

### K8s的镜像下载策略是什么，image的状态有哪些

镜像拉取策略（imagePullPolicy）

- Always：每次都尝试拉取镜像
- IfNotPresent：如果本地不存在镜像，则拉取
- Never：从不拉取镜像，只使用本地镜像

镜像状态

- pending：待处理
- ImagePullBackOff：镜像拉取失败回退
- ErrImagePull：镜像拉取错误

容器状态相关

- imageInspectError：镜像检查错误
- imagePullSecretError：镜像拉取密钥错误

### Pod的创建过程

K8s的pod是最小的调度单元，其中通常运行一个或者多个容器
Pod的创建过程：
1. 用户提交请求（kubectl或者rest api），请求包含pod中容器的镜像、资源限制、环境变量、存储卷、端口等pod配置
2. apiserver接收到用户的请求后，先进行权限鉴定确保用户有权限创建pod，然后验证配置的正确性并补全默认的配置（一系列准准入控制器），最后将pod配置保存到etcd中，状态为pending
3. scheduler通过list-watch监控到未调度的pod（pending且spec.nodeName为空），然后根据调度算法选择合适的node来运行pod,更新spec.nodeName后将pod信息写回apiserver，主要考虑的因素有：
   - 请求资源：pod请求的CPU和memory
   - node资源：node当前的负载和可用资源
   - 亲和性/反亲和性：pod对节点的亲和性和反亲和性规则
   - 污点和容忍度：node是否有污点以及pod能否容忍污点
4. kubelet启动容器：
   - 调度到指定node上后，node上的kubelet通过watch机制监听到分配的pod，从apiserver获取pod配置
   - kubelet调用CNI插件（如calico）为pod分配IP地址并配置网络，根据pod定义来挂载所需的存储卷，创建Pause容器实现pod内网络和存储的共享
   - 拉取容器镜像并启动容器（如果有init容器先启动init容器）
5. 健康检查：通过就绪性探针（readiness probe）检查容器是否准备好接收流量，通过存活性探针（liveness probe）监控容器健康状态，根据探针结果更新pod状态
6. 状态更新：整个过程kubelet持续向apiserver汇报pod状态：
  - pending：pod已经调度但是尚未创建
  - containerCreating：正在拉取镜像和创建容器
  - running：所有容器都已成功启动
  - ready：pod通过了就绪性检查，可以接收流量
7. 服务发现和负载均衡：
   - kubeproxy更新iptables或IPVS规则
   - DNS记录会被更新以包含新的pod ip
   - pod成为server负载均衡的后端endpoint

如果是创建deployment来创建pod，因为deplyment是更高级的抽象，因此会有些不同：
- 单个pod创建没有controller参与，创建deploment时deployment controller会参与调度
- 创建deployment会间接创建replicaset，然后replicaset再创建pod，所以与apiserver的交互次数增多

### Pod的销毁过程

1. 用户通过kubectl或者api发起删除请求
2. apiserver接收到删除请求，验证用户权限和请求合法性，将etcd中pod对象标记为删除状态，设置deletionTimestamp字段，如果pod有finalizers，会等待这些finalizers被清理
3. kubelet监听到删除删除事件，向pod中每个容器发送sigterm信号，开始计算优雅终止时间（默认30s）
4. 容器中的应用程序捕获sigterm信号并开始优雅关闭，完成正在处理的请求，关闭数据库连接、文件句柄等资源，清理临时文件和缓存
5. kubeproxy更新iptables规则，将pod从service的endpoint中移除，新的流量不再路由到该pod
6. 如果优雅终止容器没有自主退出，kubelet发送sigkill信号强制终止容器进程
7. CRI（如containerd）清理容器资源，删除容器系统文件，释放网络资源
8. kubelet卸载pod的存储卷，清理网络配置（如ip地址分配）
9. kubelet向apiserver报告pod已终止，apiserver从etcd删除pod对象记录

### 哪些情况pod删除会被卡住

1. 如果finalizers无法被清理会导致pod无法被删除，比如operator添加了finalizers但是没有正确清理掉
2. PVC卸载失败，比如存储端异常导致PVC无法正常卸载或者存储卷被其他进程占用
3. 应用无法响应sigterm信号，比如忽略了信号，进入死循环或死锁状态，或正在等待外部资源，或是僵尸进程
4. 网络相关问题（CNI插件异常）或者节点问题（kubelet停止运行）

## Deployment/DaemonSet/StatefulSet

### K8s deployment升级的过程和升级策略是什么

升级过程

1. 更新Deployment的YAML配置，修改镜像版本或其他配置
2. 执行`kubectl apply -f <deployment.yaml>`命令，将更新后的配置应用到集群中
3. Deployment Controller会创建一个新的ReplicaSet，并逐渐将流量从旧的ReplicaSet转移到新的ReplicaSet，并逐步减少旧版本pod的数量

升级策略（.spec.strategy）

- **滚动更新（RollingUpdate）**：默认策略，逐步替换旧的Pod，实现平滑升级，减少停机时间,可以通过`maxSurge`(最多允许超出期望副本数)和`maxUnavailable`（最多允许不可用的数量）参数控制升级的速度和可用性
- **重建（Recreate）**： 在创建新的Pod之前，先删除所有旧的Pod，会导致短暂的停机时间，适合无状态服务、开发环境、数据库迁移等

> 可以使用`kubectl rollout undo deployment <name>`回滚到上一版本，deployment会自动记录历史版本（默认10条）

### DaemonSet类型的资源特性是什么

DaemonSet确保在每个（或某些）节点上运行一个Pod的副本：

- 每个节点运行一个副本：当有新节点加入集群时，DaemonSet会自动在该节点上部署一个Pod副本
- 节点选择器：可以通过`nodeSelector`、`nodeAffinity`或`Taint/Toleration`限制DaemonSet Pod运行的节点范围
- 适用于系统级应用：常用于部署集群级别的守护进程，例如日志收集器（Fluentd）、监控代理（Prometheus Node Exporter）等
- 升级策略（.spec.updateStrategy）支持RollingUpdate（默认）和OnDelete（删除pod才创建新的）

> master默认带有污点防止普通的pod调度上去占用控制平面的资源，保障调度、管理组件运行稳定，可以设置toleration来容忍这个污点

### K8s RC的机制是什么

RC（ReplicationController）是K8s中最早用于控制Pod副本数量的控制器，其职责是确保指定数量的Pod副本在集群中运行

核心机制：

- 通过informer注册对Pod的增删改事件进行监听（使用list-watch机制），一旦发现变化，触发回调逻辑
- 周期性或者事件触发时执行控制循环，对比期望状态和实际状态
- 如果需要新建副本，会使用自身`spec.template`创建新的Pod定义，并通过API server发起请求（新的Pod会带上RC的label，以便被RC管控，Pod的OwerReference会指向RC，实现级联删除）
- 选择器匹配：RC会使用spec.selector中定义的标签选择器来识别哪些Pod是自己管理的
- 一致性保障：即使Pod被删除、所在节点宕机、Pod崩溃等，RC都会监测到副本数量减少，并重新创建，保证副本数量稳定（体现了核心理念：期望状态驱动+最终一致性控制）

RC的问题在于：

- 不支持滚动更新：无法在不停机的情况下平滑升级应用版本
- 只支持v1 API：无法使用现代的扩展机制（如strategy、lifecycle hook）

ReplicaSet是RC的增强版本，支持复杂的selector、滚动更新等
Deployment是管理ReplicaSet的高级控制器，支持回滚、滚动更新

### K8s的自动扩容机制是什么

**Horizontal Pod Autoscaler(HPA)**

- 根据Pod的CPU利用率或其他指标自动调整Pod的副本数量
- 适用于deployment、replicaset、statefulset等，需要安装`Metrics Server`

```yaml
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: demo-app-hpa
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: demo-app
  minReplicas: 1
  maxReplicas: 10
  metrics:
  - type: Resource
    resource:
      name: cpu
      target:
        type: Utilization
        averageUtilization: 60
```

**Vertical Pod Autoscaler(VPA)**

- 自动调整Pod的资源请求（CPU 和内存），以优化资源利用率
- 对于副本数量固定的服务（如数据库）比较有用，默认会重启pod来更新资源，需要安装VPA组件

```yaml
apiVersion: autoscaling.k8s.io/v1
kind: VerticalPodAutoscaler
metadata:
  name: nginx-vpa
spec:
  targetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: nginx
  updatePolicy:
    updateMode: "Off"  # 只生成推荐，不实际修改Pod，**Auto**会自动更新Pod
```

Cluster Autoscaler(CA)

- 自动调整集群中节点的数量，以满足Pod的资源需求
- 比如有pod无法调度时，自动扩容节点，节点资源长期空闲，自动缩容节点，一般用在云平台

### 版本回滚的相关命令

- `kubectl rollout undo deployment <deployment_name>`： 回滚到上一个版本
- `kubectl rollout history deployment <deployment_name>`： 查看 Deployment 的历史版本
- `kubectl rollout undo deployment <deployment_name> --to-revision=<revision_number>`： 回滚到指定版本
- `kubectl annotate deployment <deployment_name> kubernetes.io/change-cause="Update to nginx 1.19"`设置deployment的变更原因
- `kubectl rollout status deployment <deployment-name>`查看回滚状态

### deployment怎么实现版本回退的

deployment通过Revision（修订版本）管理机制实现回滚功能

核心机制：

- 每次变更deployment（如更新对象、环境变量）时，都会生成一个新的replicaset，称为一个新Revision
- 旧版本的replicaset不会被删除，而是被保留在集群中（通过.spec.revisionHistoryLimit设置，默认最多10个）
- 回滚就是将当前deployment指向先前某一个replicaset，并调整副本数量来恢复旧版本的pod

## Kube-proxy

### kube-proxy的作用

kube-proxy是k8s中网络代理的组件，运行在每个Node节点上，负责将service请求转发到后端pod，实现service的通信和负载均衡，通过维护iptables和ipvs规则，实现高性能的四层转发，是K8s的核心组件之一

主要作用：

- **实现service的访问代理**：service提供了统一的访问入口（clusterIP、nodePort、loadBalancer），kube-proxy负责根据service的规则，将请求转发到后端的Pod上（即Endpoints）
- **实现负载均衡**：当一个server有多个pod时，kube-proxy会根据一定的策略（如round-robin）将请求负载均衡地分发到这些pod，从而实现集群内的L4（TCP/UDP）负载均衡
- **维护网络转发规则**：kube-proxy会监听k8s API server的service和endpoints的变更，从而动态修改本节点的iptables规则（或ipvs规则），实现服务转发

kube-proxy的三种模式：

- userspace：早期模式，用于socket转发，性能较差
- iptables：通过iptables规则实现转发，无需用户态干预，性能较好
- ipvs：基于Linux IPVS（内核级负载均衡），性能最佳

### kube-proxy iptables的原理是什么

iptables是linux系统内核提供的用户空间命令行工具，用于配置内核的Netfilter框架，实现网络数据包的过滤（防火墙）、数据包的NAT转发、数据包的记录与丢弃，是**kube-proxy的默认模式**

kubeproxy使用iptables模式时，会监听service和endpoint的变更，自动生成一系列的NAT和转发规则，实现集群内service到后端pod的负载均衡

- kube-proxy监听资源变化：监听k8s的service、endpoint等资源变更，通过API server获取变更信息
- 动态生成iptables规则：根据监听到的资源，生成一组iptables NAT规则，写入以下几个自定义的链：
  - KUBE-SERVICES：匹配所有服务流量入口
  - KUBE-SVC-xxxx：每个service对应一条链
  - KUBE-SEP-xxxx：每个pod（endpoint）对应一条链
- 数据包转发过程：
  - 请求进入->PREROUTING->KUBE-SERVICES（匹配service IP）->KUBE-SVC-xxxx（跳转到对应的service链）->KUBE-SEP-xxxx（随机选择一个后端pod链）->DNAT到pod的IP:Port
- 负载均衡实现：KUBE-SVC-xxxx中使用`-m statistic --mode random`或`nth`模式实现随机转发，并且规则动态更新

缺点：iptables是链表结构，规则较多时查找和更新效率低，可观测性和调试复杂
> ipvs需要额外的内核模块支持（如ip_vs,ip_vs_rr等），可能有些系统默认没有加载或编译这些模块，iptables是Linux的标准组成部分，很早的内核版本就支持

### kube-proxy ipvs的原理是什么

ipvs（IP Virtual Server）是Linux内核中的四层（L4）负载均衡框架，在内核中维护连接表并基于调度算法将请求高效的转发到后端pod上

工作机制：

- kube-proxy监听资源变化：监听service和endpoints的变化，当service或pod有更新会更新内核中的ipvs转发表
- 动态编写ipvs的规则：
  - 不适用iptables，而是调用内核API（netlink）直接配置ipvs转发表
  - 每个service（VIP+Port）会映射成一个虚拟服务（virtual service），VS是外界访问的入口
  - 每个后端pod（endpoints）会注册成一个真实服务器（real server）挂在VS上
- 连接跟踪：
  - ipvs内部维护一个连接表（Connection Table）
  - 首次请求选定目标RS
  - 后续请求直接从连接表中取出目标pod，无需重新调度
- 支持多种负载均衡调度算法：Round Robin（轮询/默认）、Least Connection（最少连接）、Weight Round Robin（加权轮询）、Destination Hashing（基于目标地址哈希）、Source Hashing（基于源地址哈希）

### kube-proxy ipvs和iptables的异同点

kube-proxy的iptables模式通过生成Netfilter规则链来转发service流量，而ipvs模式基于内核级的IP Virtual Server框架，实现连接跟踪和高性能的四层负载均衡

相同点：

- 都是用于service到pod的流量转发
- 都会监听API server的service和endpoints的变更
- 都由kube-proxy在每个Node节点本地运行
- 都使用DNAT（目标地址转换）把service ip映射到pod ip
- 都支持TCP、UDP，支持cluster IP、NodePort、LoadBalancer等类型
- 都只工作在L4层（不能做HTTP等应用层的转发）

不同点：

- 实现方式：iptables使用Metfilter规则链和DNAT做转发，ipvs使用Linux IPVS框架，维护虚拟服务和连接表
- 数据结构：iptables是链表结构，规则越多越慢，ipvs是基于哈希表，查找效率高
- 转发机制：iptables每次匹配规则链+随机选择pod，ipvs第一次调度后进入连接表，后续直接查表
- 负载均衡策略：iptables是固定的轮询，ipvs支持多种调度算法
- 服务更新：iptanles更新全套iptables规则，规模大时较慢，ipvs仅更新差异部分，效率高
- 性能：iptables规则多时性能下降，ipvs性能更高，适合大集群
- 系统依赖：iptables是Linux默认支持，ipvs需要内核加载ip_vs模块
- 可观测性：iptables查看规则`iptables -L -t nat`，ipvs查看规则`ipvsadm -Ln`

## Service/Ingress

### Service类型是什么

Service是Kubernetes中用于暴露应用程序的抽象概念吗，它通过标签选择器（LabelSelector）关联后端的一组Pod，并提供了一个稳定的IP地址和DNS名称，使得客户端可以通过Service访问Pod，主要解决：

- 负载均衡：在多个pod副本之间分发流量，由kube-proxy负责
- 服务发现：为动态变化的pod提供稳定的访问入口
- 网络抽象：屏蔽底层pod的IP变化，提供不变的服务端点

service的类型（.spec.type）：

- **ClusterIP**：默认类型，在集群内部创建一个虚拟IP地址，只能在集群内部访问，用于集群内服务通信
- **NodePort**：在每个节点上打开一个端口，外部可以通过`NodeIP:NodePort`访问Service，同时也会创建clusterIP，适用于开发环境
- **LoadBalancer**：使用云提供商的负载均衡器将Service暴露给外部，自动配置外部IP，同时会创建clusterIP和NodePort，通常用于公有云环境
- **ExternalName**：将Service映射到一个外部DNS名称，用于在集群内访问集群外部的服务
- 特殊类型**Headless**：使用`clusterIP: None`，不分配clusterIP，DNS查询直接返回Pod IP，每个Pod会有一个固定的DNS名称，用于statefulSet等有状态的应用

```yaml
apiVersion: v1
kind: Service
metadata:
  name: my-service
spec:
  type: ClusterIP      # 默认类型，可省略
  selector:
    app: my-app
  ports:
    - protocol: TCP
      port: 80          # Service 端口
      targetPort: 8080  # Pod 容器端口
---
apiVersion: v1
kind: Service
metadata:
  name: my-headless-svc
  namespace: default
spec:
  clusterIP: None
  selector:
    app: my-app
  ports:
    - port: 80
      targetPort: 80
```

### service分发到后端的策略是什么

kube-proxy负责将Service的请求转发到后端的Pod，分发策略有：

- iptables的策略是随机分发
- ipvs的策略有rr（轮询）、lc（最少连接）、dh（目标哈希）、sh（源哈希，可实现会话粘性）等
- Session Affinity：基于客户端IP地址的会话保持，确保来自同一个客户端的请求始终被转发到同一个Pod

```yaml
apiVersion: v1
kind: Service
metadata:
  name: my-service
spec:
  selector:
    app: my-app
  ports:
    - port: 80
      targetPort: 8080
  sessionAffinity: ClientIP    # 开启基于客户端IP的会话亲和
```

### 外部如何访问集群内的服务

- **NodePort**：通过`NodeIP:NodePort`开启，可以让每个节点开放一个指定范围（30000-32767）的端口
- **LoadBalancer**：通过云提供商的负载均衡器提供的IP地址或域名访问
- **Ingress**：通过Ingress Controller（如Nginx、Traefik、Istio）提供的域名或URL路径访问，基于HTTP/HTTPS七层协议，支持域名路由、TLS、重定向等高级功能

### ingress是什么

Ingress是Kubernetes中用于管理外部访问集群内服务的资源对象，允许将外部请求路由到集群内部的不同Service，提供HTTP/HTTPS路由规则，是七层（应用层）负载均衡解决方案

ingress的作用：

- 统一入口：为多个service提供统一的外部访问入口
- 域名和路径路由：可以根据域名和URL路径将请求路由到不同的Service
- SSL/TLS termination：集中处理HTTPS证书和SSL终结
- 成本优化：避免为每个服务创建LoadBalancer类型的Service

ingress组件架构：

- ingress资源对象：即定义路由规则的YAML配置
- ingress controller：执行路由规则的控制器，与`IngressClass`资源配合使用

### 负载均衡器是什么

负载均衡器是一种网络设备或软件，用于将客户端请求分发到多个服务器上，以提高系统的可用性和性能

核心作用：

- 流量分发：避免单一服务器过载，提高系统整体处理能力
- 高可用性：自动检测健康状态、实现故障转移
- 性能优化：提高并发能力，优化资源利用率

按照网络层级分类

- 四层负载均衡（L4）：基于TCP/UDP协议进行转发，例如kube-proxy的IPVS模式
- 七层负载均衡（L7）：基于HTTP/HTTPS协议进行转发，可以根据URL、Header等信息进行路由，例如Ingress Controller

### K8s怎么进行服务注册的

K8s服务注册与传统的微服务架构的注册中心（如consul、eureka）不同，它是自动完成的额，不用开发者手动注册

服务注册机制：

- Pod注册阶段：Pod启动过程中自动注册到ETCD中（通过kubelet上报到API server）
- Service注册阶段：Service创建指定selector匹配Pod标签，k8s自动维护与该service匹配的pod集合，写入endpoints对象
- DNS注册阶段：CoreDNS通过API server监听的service变化，为新service自动创建DNS记录，如`mysvc.default.svc.cluster.local`，应用可以通过DNS名称解析service IP进行访问
- Endpoints Controller自动将匹配的Pod列表写入到Endpoints对象中

> k8s的服务注册是自动完成的，Pod和Service都是由控制面组件负责注册和维护，还有一种服务注册的方式是自动环境变量注入（不推荐）

### K8s的网络模型是什么

Kubernetes使用扁平化的网络模型：

- 每个Pod都拥有一个独立的IP地址（Pod网络）
- 同一个节点或者不同节点之间的Pod都可以直接相互通信，无需NAT
- Pod可以与service通信，service提供负载均衡入口
- kubelet、coreDNS、kube-proxy等组件也可以访问Pod和service

网络模型的核心组成

- Pod网络：Pod之间相互通信（跨主机也不需要NAT）
- Service网络：ClusterIP类型的服务虚拟API，用于服务发现和负载均衡
- Node网络：节点之间的网络通信（Pod和外部世界通信）

k8s本身不实现网络功能，但是规定了网络模型，具体由CNI插件实现，常见的有Calico、Flannel，CNI插件负责：

- 给每个Pod分配IP
- 设置路由规则
- 建立主机间、Pod间的通信

网络模型的关键特性：

- 统一扁平的IP空间：Pod间可以互通，每个Pod有唯一的IP
- 服务发现和负载均衡：通过kube-procy实现clusterIP和VIP
- 容器网络和主机网络隔离：Pod网络与Node网络逻辑隔离
- 兼容多种CNI插件：网络抽象解耦、灵活部署

### K8s的网络策略及其原理

网络策略（NetworkPolicy资源类型，需要CNI插件支持）是用于控制Pod网络访问的资源对象，用于定义哪些pod可以相互通信，哪些网络流量被允许或拒绝，允许用户通过申明式的方式，限制pod之间及pod与外部的网络访问，实现细粒度的网络隔离

网络策略的控制对象：

- PodSelector：通过标签选择目标Pod，指定规则作用对象
- Ingress：允许进入目标Pod的流量规则
- Egress：允许目标Pod发出的流量规则
- NamespaceSelector：限制跨namespace的通信
- IPBlock：支持基于CIDR的访问控制
- port/protocol：精确控制端口和协议（TCP/UDP）

工作原理

- 默认行为：如果没有定义网络策略，Pod之间默认可以相互通信（开放），一旦定义了至少一个针对Pod的网络策略，只有满足策略的流量被允许，其他流量被阻止
- 规则匹配：网络插件负责解析NetworkPolicy资源，插件根据规则动态配置底层网络设置来实现流量的过滤
- 策略执行过程：接收流量时，网络插件会检查流量源和目标pod的标签是否符合策略，不符合则丢弃

```yaml
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: db-allow-backend
  namespace: default
spec:
  podSelector:
    matchLabels:
      app: database         # 作用目标是database Pod
  ingress:
    - from:
        - podSelector:
            matchLabels:
              app: backend  # 仅允许backend Pod访问，屏蔽frontend Pod
```

### K8s中flannel的作用

Flannel是一种K8s网络插件（CNI插件），用于为Pod提供跨主机通信的虚拟网络，主要作用是：

- 为每个Pod分配独立的IP：保证集群中Pod之间不冲突，避免使用端口映射，提高网络透明性
- 实现Pod跨主机通信：Pod分布在不同的Node上时，Flannel负责封装、转发流量，在节点之间建立虚拟网络，Pod能通过IP互相访问
- 与K8s网络模型兼容：满足k8s的网络要求：Pod之间可以直接通信、Pod和宿主机可以通信

工作原理：

- 每个Node会被分配一个子网段（如10.224.1.0/24）
- Pod创建时会从这个子网段中分配IP
- Pod之间通信时，Flannel将数据封装在UDP、VXLAN或host-gw等方式中
- 把封装的数据通过主机网络传输到目标节点
- 目标节点Flannel解封转后，将数据转发到对应的Pod

后端模式：

- vxlan：默认常用，封装在UDP中，支持跨主机通信
- host-gw：性能高，不封装，要求节点网络可达
- udp：简单，适用于小型集群，但性能较差

### Calico网络组件的实现原理

Calico是一个功能强大的k8s网络方案，既是CNI插件，又提供了丰富的网络安全策略支持，其主要特点是：

- 提供Pod网络互通功能（类似Flannel）
- 同时支持网络策略（NetworkPolicy）控制Pod通信
- 支持BGP路由或IPIP/VXLAN隧道
- 可用于大规模生产环境，兼顾性能、安全、可扩展性

实现原理

- 使用BGP协议进行路由分发
  - 每个node上的Calico组件（如calico/node）会将本节点Pod的子网，通过BGP协议通告给其他节点
  - 其他Node收到路由后，可将数据包直接发送给目标Pod所在的节点
  - 没有使用overlay封装，性能高、开销小，因为是原生三层网络
  - （要求节点之间能直接互通）
- 支持IPIP/VXLAN隧道
  - 如果节点之间不能直连（如跨VPC），可以开启IPIP（或者VXLAN模式）
  - 此时Calico会将数据封装为隧道，保证跨主机Pod通信
  - （默认启用IPIP模式，BGP和overlay二选一）
- 实现k8s网络策略（NetworkPolicy）
  - Calico原生支持K8s的NetworkPolicy资源
  - 还能扩展出更高级的策略（如全局策略、DNS策略）
  - 它使用Linux的iptables或eBPF来实现策略规则下发
