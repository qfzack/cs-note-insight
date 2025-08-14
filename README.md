# Golang云原生

## [Golang基础](./golang-note.md)

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

- [设计模式](./micro-service.md)
  - 微服务架构设计、开发、维护，包括创建松耦合的服务，支持独立开发、部署和扩展
  - 服务拆分：领域驱动设计、业务边界划分
  - API设计：RESTful API、gRPC、GraphQL
  - 服务通信：同步/异步通信、消息队列
  - 服务治理：服务注册发现、配置管理、熔断降级
- [框架和工具](./web-framework.md)
  - Web框架：Gin、Echo、Fiber、Beego
  - RPC框架：gRPC、go-micro、go-kit
  - 路由和中间件：请求处理、认证授权、日志处理

## [数据库和存储](./database.md)

- 关系型数据库
  - MySQL/PostgreSQL：SQL优化、事务处理、连接池
  - ORM框架：Gorm、Ent、SQLx
  - 数据库设计：表结构设计、索引优化、分库分表
- NoSQL数据库
  - Redis：缓存策略、分布式锁、数据结构
  - MongoDB：文档数据库操作、聚合查询
  - Elasticsearch：搜索引擎、日志分析

## [消息队列和流处理](./message-queue.md)

- 消息中间件
  - Kafka：消息发布与订阅、流处理
  - RabbitMQ：消息队列、任务分发
  - Redis Stream：轻量级流处理
- 异步处理
  - 任务队列：Celery、Machinery
  - 事件驱动架构：事件溯源、CQRS模式

## 容器化技术

- Docker核心能力
  - 镜像管理：镜像分层优化、多阶段构建、私有仓库集成
  - 容器操作：网络模式（Bridge/Overlay）、存储卷管理、资源限制（CPU/Memory）
  - 编排工具：Kubernetes、Docker Compose
- 容器底层技术
  - Linux内核机制：Namespace隔离、Cgroups资源控制、UnionFS文件系统
  - eBPF技术：网络流量分析、性能调优

## Kubernetes

- 架构与组件
  - 核心组件作用：API Server调度流程、etcd一致性协议（Raft）、kube-proxy流量转发
  - 集群管理：高可用部署、节点扩缩容、证书轮换
- 资源对象与运维
  - 工作负载：Deployment滚动更新策略、StatefulSet有状态服务管理、Operator开发
  - 网络与存储：Service四层负载、Ingress七层路由、PV/PVC动态供给
  - 故障排查：Pod状态异常（CrashLoopBackOff）、网络策略失败、资源竞争分析

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

## [分布式系统](./distributed-system.md)

- 分布式概念
  - CAP理论：一致性、可用性、分区容错
  - 分布式事务：两阶段提交、Saga模式
  - 分布式锁：Redis锁、etcd锁
- 高可用架构
  - 负载均衡：Nginx、HAProxy
  - 故障转移：主从切换、多活架构
  - 容灾备份：数据备份恢复策略

## 安全和合规

- 应用安全
  - 认证授权：JWT、OAuth2、RBAC
  - 数据加密：TLS、数据库加密
  - 安全扫描：漏洞检测、依赖安全
- 接口安全
  - API安全：限流、防爬、参数验证
  - 跨域处理：CORS配置
  - SQL注入防护：参数化查询

---

# 云原生方向

## IaaS基础设施层

- 虚拟化与容器技术
  - KVM、Xen、Firecracker（轻量级虚拟化）
  - 容器运行时优化（containerd、gVisor、Kata Containers）
- 云网络
  - SDN（软件定义网络）
  - Overlay网络（VXLAN、Geneve）
  - 云边协同网络（边缘节点高速互联）
- 云存储
  - 对象存储（S3、Ceph RGW）
  - 分布式文件系统（CephFS、Lustre、GlusterFS）
  - 块存储优化（NVMe-oF、CSI）
- 硬件加速与异构计算
  - GPU/TPU调度
  - FPGA云服务
  - 智能网卡（SmartNIC/DPU）

## PaaS平台层

- 云原生数据库与数据服务
  - 分布式SQL（TiDB、CockroachDB）
  - 流处理平台（Flink、Kafka Streams）
  - OLAP 云化（ClickHouse Cloud、Snowflake）
- 大数据与AI平台
  - 云原生AI训练平台（Kubeflow、MLFlow on K8s）
  - 自动机器学习（AutoML）
- 多云与混合云管理
  - 统一API（Crossplane、Cluster API）
  - 云资源联邦（Karmada、Federation v2）
- 云安全平台
  - 租户隔离
  - 云安全扫描（CSPM/CWPP）
  - 零信任架构

## SaaS应用层

- 云原生应用框架
  - 微服务框架（Spring Cloud、Dapr、Service Mesh）
  - API网关（Kong、Envoy、Istio Gateway）
- DevOps与GitOps
  - ArgoCD、FluxCD
  - 基础设施即代码（Terraform、Pulumi）
- 边缘计算与IoT云平台
  - KubeEdge、OpenYurt
  - IoT 设备云接入
- 可观测性与运维
  - 分布式追踪（OpenTelemetry）
  - 统一监控（Prometheus、Thanos、Loki）
