# Golang Web 后端

## [Golang基础](./golang基础.md)

- 语言基础
  - 并发编程：goroutine、channel、select、sync包的熟练使用
  - 内存管理：GC机制理解、内存优化、性能分析
  - 接口设计：interface的合理使用、组合模式
  - 错误处理：error handling最佳实践
  - 反射和范型：适当场景下的高级特性使用
- 标准库掌握
  - net/http、context、datastore/sql
  - encoding/json、fmt、log
  - sync、time、os等

## 微服务架构

- [设计模式](./微服务设计.md)
  - 微服务架构设计、开发、维护，包括创建松耦合的服务，支持独立开发、部署和扩展
  - 服务拆分：领域驱动设计、业务边界划分
  - API设计：RESTful API、gRPC、GraphQL
  - 服务通信：同步/异步通信、消息队列
  - 服务治理：服务注册发现、配置管理、熔断降级
- [框架和工具](./web框架.md)
  - Web框架：Gin、Echo、Fiber、Beego
  - RPC框架：gRPC、go-micro、go-kit
  - 路由和中间件：请求处理、认证授权、日志处理

## [数据库和存储](./数据库.md)

- 关系型数据库
  - MySQL/PostgreSQL：SQL优化、事务处理、连接池
  - ORM框架：Gorm、Ent、SQLx
  - 数据库设计：表结构设计、索引优化、分库分表
- NoSQL数据库
  - Redis：缓存策略、分布式锁、数据结构
  - MongoDB：文档数据库操作、聚合查询
  - Elasticsearch：搜索引擎、日志分析

## [消息队列和流处理](./消息队列.md)

- 消息中间件
  - Kafka：消息发布与订阅、流处理
  - RabbitMQ：消息队列、任务分发
  - Redis Stream：轻量级流处理
- 异步处理
  - 任务队列：Celery、Machinery
  - 事件驱动架构：事件溯源、CQRS模式

## 监控和可观测性

- 监控系统
  - Prometheus+Grafana：指标收集和可视化
  - Jaeger/Zipkin：分布式链路追踪
  - ELK Stack：日志收集和分析
- 性能优化
  - 性能分析：pprof使用、性能优化
  - 压力测试：ab、wrk、JMeter
  - 代码质量：静态分析、代码审查

## DevOps实践

- CI/CD
  - 版本控制：git、代码审查
  - 持续集成：jenkins、github actions
  - 自动化部署：蓝绿发布、灰度发布
- 测试
  - 单元测试：testing包、mock框架
  - 集成测试：API测试、数据库测试
  - 压力测试：性能基准测试

## 安全和合规

- 应用安全
  - 认证授权：JWT、OAuth2、RBAC
  - 数据加密：TLS、数据库加密
  - 安全扫描：漏洞检测、依赖安全
- 接口安全
  - API安全：限流、防爬、参数验证
  - 跨域处理：CORS配置
  - SQL注入防护：参数化查询

## [分布式系统](./分布式系统.md)

- 分布式概念
  - CAP理论：一致性、可用性、分区容错
  - 分布式事务：两阶段提交、Saga模式
  - 分布式锁：Redis锁、etcd锁
- 高可用架构
  - 负载均衡：Nginx、HAProxy
  - 故障转移：主从切换、多活架构
  - 容灾备份：数据备份恢复策略

## 业务理解和软技能

- 业务能力
  - 需求分析：业务建模、系统设计
  - 架构设计：技术选型、架构评审
  - 问题解决：故障排查、性能优化
- 团队协作
  - 代码审查：代码质量把控
  - 技术分享：知识传递、团队提升
  - 项目管理：敏捷开发、时间管理

---

# Kubernetes

## 1.Kubernetes 平台工程师 / SRE (站点可靠性工程师)

### 核心职责：
- 设计、部署、运维、调优大规模 Kubernetes 生产集群。
- 开发自动化工具（CI/CD流水线、集群生命周期管理、监控告警、自愈系统）提升平台稳定性和效率。
- 定义和实施 SLO/SLI/SLA，进行容量规划、故障演练（Chaos Engineering）。
- 保障平台的高可用性、可扩展性、安全性和性能。

### 核心技能要求：
- 精通 Kubernetes: 核心概念（Pod, Deployment, Service, Ingress, ConfigMap, Secret, PV/PVC, StatefulSet, DaemonSet等）、网络（CNI, Service Mesh）、存储（CSI）、调度、安全（RBAC, NetworkPolicy, PodSecurityPolicy/Admission Controllers）、多集群管理。
- Linux 系统: 深入理解（内核、网络、存储、性能调优）。
- 网络: TCP/IP, DNS, HTTP, Load Balancing, 云网络（VPC, Security Groups）。
- 基础设施即代码 (IaC): Terraform, Pulumi。
- CI/CD: GitLab CI, Jenkins, Argo CD, Flux CD。
- 监控与可观测性: Prometheus, Grafana, Alertmanager, Loki, ELK Stack, OpenTelemetry, 指标/日志/链路追踪。
- 编程/脚本能力: Go (必备) 用于开发Operator/控制器/工具， Python/Shell 用于自动化脚本。
- 云平台: 至少精通一个主流公有云（AWS, GCP, Azure）或私有云方案（OpenStack, VMware）。
- SRE 理念与实践: 错误预算、自动化、减少琐事、事故响应。

### 发展前景： 极好
随着K8s成为事实标准，几乎所有上云或数字化转型的企业都需要专业的K8s平台/SRE团队来支撑其核心基础设施。复杂度高，价值大。

### 薪资水平 
(2024年，中国一线/新一线城市，年薪范围)：
- 中级 (3-5年经验)：35万 - 65万人民币
- 高级 (5-8年经验)：60万 - 100万+人民币
- 专家/架构师/经理：80万 - 150万+人民币 (头部大厂/核心岗位)
数据来源参考： 主流招聘平台（猎聘、BOSS直聘、拉勾）、脉脉薪资爆料、行业猎头信息。薪资受公司规模、行业、具体技术栈深度、个人绩效影响很大。

> 核心： 稳定性、可观测性、自动化。
> 技能：
> - 深入Linux: 性能调优（perf, bpftrace）、网络抓包分析（tcpdump, Wireshark）
> - IaC大师： Terraform（模块化、状态管理最佳实践）
> - CI/CD/GitOps专家： Argo CD/Flux CD 深度实践，构建企业级流水线。
> - 可观测性栈： Prometheus生态（Thanos, Cortex, VictoriaMetrics）、Grafana、Loki、Tempo/Jaeger 的部署、调优和告警管理。
> - SRE实践： 错误预算管理、容量规划、混沌工程（Chaos Mesh, LitmusChaos）。
> - 安全加固： K8s安全基线、OPA/Gatekeeper策略编写。


## 2.云原生开发工程师 / Kubernetes 应用开发者

### 核心职责：
- 设计和开发运行在Kubernetes上的云原生应用（微服务、Serverless函数）。
- 编写符合12-Factor App原则的应用。
- 开发Kubernetes Operator/Controller来管理复杂有状态应用。
- 集成Service Mesh (Istio, Linkerd)、Serverless框架（Knative, OpenFaaS）。
- 优化应用在K8s环境下的性能、资源利用率和可观测性。

### 核心技能要求：
- 精通 Go: 这是核心开发语言。 深入理解并发模型（goroutine, channel）、标准库、常用框架（Gin, Echo）。
- 精通 Kubernetes: 不仅会部署应用，更要理解其API、CRD、Operator模式、Client-go库。了解控制器工作原理。
- 云原生应用设计模式: Sidecar, Init Container, Operator, Service Mesh, 声明式API。
- 微服务架构: 设计、开发、通信（gRPC, REST）、服务发现、容错（熔断、限流、降级）。
- 容器化: Dockerfile最佳实践、镜像构建优化。
- API 设计: RESTful, gRPC/protobuf。
- 可观测性: 在代码中集成指标、日志、链路追踪（OpenTelemetry）。
- 基础了解: CI/CD流程、基本的K8s运维知识、云服务。

### 发展前景： 非常好
企业需要大量能够构建真正“云原生”应用的开发者，而不仅仅是把传统应用塞进容器。Operator开发是深度需求

### 薪资水平 
(2024年，中国一线/新一线城市，年薪范围)：
- 中级 (3-5年经验)：40万 - 70万人民币 (Go深度和K8s开发能力是关键溢价点)
- 高级 (5-8年经验)：65万 - 110万+人民币
- 专家/架构师：85万 - 150万+人民币
数据来源参考： 同上。具备Operator开发经验和复杂云原生应用构建能力的人才溢价明显

> 核心： 云原生应用设计、开发模式、扩展K8s。
> 技能：
> - Operator SDK/Kubebuilder精通： 熟练开发健壮的生产级Operator。
> - 深入 client-go: 理解其机制，能高效、正确地与K8s API交互。
> - Service Mesh集成： 理解Istio API，能在应用中利用网格特性（如流量管理、安全）。
> - Serverless体验： 了解Knative/OpenFaaS原理和使用。
> - 分布式系统设计： 解决Operator或微服务中的状态管理、一致性、容错问题。
> - API设计： 设计良好的gRPC和RESTful API。


## 3.服务网格工程师

### 核心职责：
- 评估、部署、配置、运维和管理服务网格（如 Istio, Linkerd, Consul Connect）。
- 利用服务网格实现流量管理（金丝雀发布、蓝绿部署、A/B测试）、安全（mTLS、策略）、可观测性。
- 解决服务网格引入的性能开销和复杂性挑战。
- 与开发团队协作，指导他们使用网格特性。

### 核心技能要求：
- 深入理解服务网格原理: Sidecar代理（Envoy）、控制平面和数据平面、xDS API。
- 精通至少一种主流服务网格: Istio（最主流）或 Linkerd。
- 精通 Kubernetes: 服务网格深度依赖K8s。
- 网络: TCP/IP, HTTP/2, mTLS原理。
- 可观测性: 利用网格提供的指标、日志、链路追踪。
- 安全: 理解零信任网络、策略执行。
- 编程/脚本能力: Go/Python/Shell用于自动化和管理。了解Envoy配置（xDS）。

### 发展前景： 好，且专业化程度高
随着微服务架构的普及和复杂度的提升，服务网格成为管理微服务通信的重要基础设施。需求集中在大型互联网公司和金融科技等复杂系统领域。

### 薪资水平： 
通常介于平台工程师和云原生开发者之间，或接近高级平台工程师水平。具备Istio等深度经验的专家非常抢手。

> 核心： Istio/Linkerd 原理与实践。
> 技能：
> - 深入Envoy配置(xDS)、控制平面架构、性能调优、多集群网格、安全策略(mTLS, AuthZ)。


## 4.容器运行时/基础设施工程师 (更底层)

### 核心职责：
- 研究、开发或维护容器运行时（containerd, CRI-O）、镜像构建工具（BuildKit）、安全容器技术（Kata Containers, gVisor）。
- 优化容器底层基础设施（Linux内核、虚拟化）。
- 参与上游开源社区（如CNCF项目）。

### 核心技能要求：
- 极强的系统编程能力: 精通 Go 和 C/C++。
- 深入理解操作系统原理: Linux内核（命名空间、cgroups、文件系统、网络栈）、虚拟化技术。
- 精通容器原理: OCI标准、runc、容器运行时架构。
- 安全: 容器隔离、安全沙箱技术。
- 网络与存储: 底层实现原理。
- 开源社区协作经验。

### 发展前景： 非常好，但门槛极高
需求主要来自大型云厂商（AWS, GCP, Azure, 阿里云, 腾讯云, 华为云）、容器技术提供商（Docker, Red Hat）和对底层有极致需求的公司。岗位数量相对前几个少，但对技术深度要求极高。

### 薪资水平： 顶尖水平
具备深厚底层功力的专家是稀缺资源，薪资对标甚至超过高级平台工程师/架构师的上限。

## 5.DevOps 工程师 (云原生方向)

### 核心职责
更侧重于打通开发与运维的流程自动化，在云原生背景下，其工作与K8s平台工程师/SRE有大量重叠，核心是使用云原生技术栈实现DevOps实践。

### 核心技能要求
- 是上述平台工程师/SRE和云原生开发工程师技能的子集或组合，特别强调自动化、CI/CD流水线设计、工具链整合（GitOps）和协作沟通能力。Go是加分项，Python/Shell更常用。

### 发展前景： 好 
持续的需求，尤其在传统企业转型过程中。

### 薪资水平： 范围较广
具备扎实云原生技能（特别是K8s和自动化）的DevOps工程师薪资向平台工程师靠拢。

## 6.云原生安全工程师

### 核心职责：
- 保障Kubernetes集群、容器镜像、容器运行时、微服务间通信的安全。
- 实施安全策略（Pod Security, NetworkPolicy, mTLS）、镜像扫描、运行时安全监控、合规审计。
- 使用Falco, OPA/Gatekeeper, Trivy, kube-bench等工具。

### 核心技能要求：
- 扎实的安全基础: 网络安全、应用安全、密码学基础。
- 精通 Kubernetes 安全机制: RBAC, NetworkPolicy, Pod Security Standards/Admission Controllers, Secrets管理（如Vault集成）
- 了解容器安全: 镜像漏洞扫描、运行时保护、供应链安全。
- 熟悉云原生安全工具链。
- 一定的编程/脚本能力（Go/Python）。

### 发展前景： 快速增长且紧缺
云原生环境的安全挑战巨大，专业人才缺口明显。

### 薪资水平：
与平台工程师相当或略高，尤其是具备实战经验和认证（CKS）的专家。

---

| 方向           | 关键技术栈                              | 代表岗位           | 平均薪资（年）    |
| -------------- | --------------------------------------- | ------------------ | ----------------- |
| K8s运维开发     | Operator SDK/CRD/Helm                   | K8s平台工程师       | 60-90万           |
| 云原生可观测性  | OpenTelemetry/PromQL/Grafana            | 可观测性架构师      | 70-110万          |
| 服务网格治理    | Istio/Envoy/gRPC                        | 服务网格工程师      | 80-130万          |
| 平台工程        | Backstage/Crossplane/KubeVela           | 平台产品经理        | 90-150万          |
| 边缘计算        | K3s/KubeEdge/eBPF                       | 边缘云架构师        | 75-120万          |
| 安全合规        | OPA/Gatekeeper/Confidential Containers  | 云安全专家          | 85-140万          |
| Serverless架构  | Knative/OpenFaaS/WasmEdge               | Serverless工程师    | 70-110万          |
