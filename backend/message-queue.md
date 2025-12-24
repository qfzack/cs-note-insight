- 消息中间件
  - Kafka：消息发布与订阅、流处理
  - RabbitMQ：消息队列、任务分发
  - Redis Stream：轻量级流处理
- 异步处理
  - 任务队列：Celery、Machinery
  - 事件驱动架构：事件溯源、CQRS模式

---

# 消息队列

## 消息队列的作用

消息队列是一种用于异步通信的组件，生产者把消息放进队列，消费者从队列中取出消息进行处理，即把系统之间的调用，从同步等待变为异步处理

消息队列的作用：

- 解耦：生产者和消费者不直接通信，通过消息队列进行解耦，降低系统间的依赖性
- 削峰填谷：通过消息队列缓冲高峰期的请求，平滑处理流量
- 异步处理：将耗时操作异步化，提高系统响应速度
- 可靠传输：消息队列通常支持持久化，保证消息不丢失、不重复、有序消费
- 广播：消息队列可以实现一对多的消息分发，支持多消费者同时处理同一消息

## 消息队列选型

- Kafka
  - 高吞吐量、天然支持分布式，主要面向日志处理、实时大数据任务，不适合大量单条消息的实时业务（延迟较高）
  - 使用场景：吞吐量第一，延迟不是很敏感，适合大数据场景（日志收集、实时数据分析、大数据处理）
- RabbitMQ
  - 支持AMQP协议，功能丰富，支持复杂路由、事务、确认机制，吞吐量中等
  - 使用场景：需要复杂路由、事务支持、可靠投递、较低延迟的业务场景（订单处理、任务调度、通知系统）
- RocketMQ
  - 支持高吞吐量、低延迟，支持集群和水平扩容，支持延时消息和事务消息，适合java生态
  - 使用场景：需要高吞吐量、低延迟、分布式特性的业务场景（电商交易系统、实时数据处理、大规模消息传递）
- Redis Streams
  - 基于Redis的流数据结构，支持持久化和消费者组，适合轻量级消息队列需求
  - 使用场景：已有Redis部署，轻量级消息队列需求，适合日志收集、简单任务调度、实时数据处理

总结：

- Kafka：高吞吐、日志、大数据
- RabbitMQ：业务系统首选、可靠、路由灵活
- RocketMQ：延时消息、事务消息、金融业务
- Redis Stream：轻量级、高性能、非核心消息

## 如何避免消息重复消费

生产端为了保证消息发送成功，可能会重复推送，因此重复消息不可避免，必须在消费端处理重复消息的问题

重复发送的原因：

- 消费者处理慢，导致ACK超时，生产者重发
- 消费者处理消息后崩溃，未能发送ACK，生产者重发
- 网络抖动，ACK丢失，生产者重发
- 消费者手动重试

避免重复消费的方法：

- 业务层实现幂等性
  - 设计业务逻辑时，确保多次处理同一消息不会产生副作用
  - 使用业务唯一标识（如订单ID、支付流水号）来判断消息是否已处理
  - 用数据库的唯一索引约束来防止重复插入
- 消息去重缓存
  - 在消费者端维护一个缓存（如Redis、内存HashSet）来记录已处理的消息ID
  - 每次处理消息前，先检查缓存中是否存在（SETNX）该消息ID，存在则跳过处理
  - 适合高性能高并发的场景
- 使用消息队列的去重功能
  - 部分消息队列（如RocketMQ）提供了消息去重功能，可以配置消息ID来实现去重
  - 最终都要结合业务幂等性设计，确保万无一失

常用方案是：Redis缓存+业务幂等性设计+消息唯一ID，既能提高性能，又能保证数据一致性

## 如何避免消息丢失

消息队列的使用分为三部分：生产者、消息队列、消费者，每个环节都可能导致消息丢失：

- 生产者->MQ
  - 网络异常，消息未发送成功
  - 发送成功但未收到ACK，生产者认为消息发送失败
  - 生产者崩溃但消息未持久化
- MQ存储
  - 消息写入内存但未持久化，服务器宕机导致消息丢失
  - 主从复制延迟，消息未同步到从节点
- MQ->消费者
  - 消费者提前回复ACK，但是消息未处理成功

避免消息丢失的方法：

- 生产者端
  - 开启消息确认机制，确保消息发送成功后再继续
  - 消息表模式，先写入数据库消息表，再发送消息，确保消息不丢失
- 消息队列端
  - 开启消息持久化，确保消息写入磁盘
  - 配置主从复制，确保消息在多个节点间同步
- 消费者端
  - 处理完消息后再发送ACK，确保消息已成功处理

## 如何保证消息的可靠性和顺序性

- 保证消息可靠性
  - 消息持久化：开启消息队列的持久化功能，确保消息写入磁盘，防止服务器宕机导致消息丢失
  - 消息确认机制：生产者发送消息后等待ACK，消费者处理完消息后再发送ACK，确保消息被成功处理
  - 重试机制：生产者和消费者实现重试机制，处理失败的消息进行重发或重新消费
- 保证消息顺序性
  - 有序消息处理场景识别：明确哪些业务场景需要保证消息顺序性，如订单处理、支付流水等
  - 消息队列对顺序性的支持：部分消息队列本身提供了对顺序性的保证，如Kafka可以通过将消息划分到同一个分区（Partition）来保证消息在分区内是有序的，消费者按照分区读取消息可以保证消息顺序
  - 消费者端顺序处理：消费者在处理消息时，应该避免并发处理导致顺序混乱，可以使用单线程处理或者基于消息的顺序标识进行排序处理

# Kafka

> https://javaguide.cn/high-performance/message-queue/kafka-questions-01.html#%E4%BB%80%E4%B9%88%E6%98%AF-producer%E3%80%81consumer%E3%80%81broker%E3%80%81topic%E3%80%81partition

## Kafka的架构

Kafka是一个分布式流式处理平台，主要由以下几个核心组件组成：

1. Producer：负责将消息发送到Broker
2. Broker：独立的kafka示例，负责存储和转发消息，多个Broker组成Kafka集群
3. Consumer：负责从Broker订阅并消费消息
   - Consumer Group：消费者组，多个消费者可以组成一个消费者组
4. Topic：消息的类别或频道，Producer将消息发送到特定的Topic，Consumer通过订阅Topic来消费消  
   - Partition：每个Topic可以分为多个Partition，同一个Topic下的Partition可以分布在不同的Broker上
5. Zookeeper：用于管理Kafka集群的元数据，协调Broker和Consumer的状态

## Kafka的工作模型是什么

Kafka的工作模型是基于发布-订阅（Publish-Subscribe）的拉取模型（Pull-based Model）

在分布式消息系统中，通常有两种数据传输方式：

1. 推送（Push）：Broker收到数据后，立即主动发送给Consumer
2. 拉取（Pull）：Consumer根据自己的处理能力，主动向Broker请求数据

Kafka的核心工作方式是拉取而不是推送，即消息是由消费者Consumer主动从服务器Broker拉取的，这样设计的原因在于：

- 自适应消费速率：不同的Consumer处理能力不同，如果是push，Broker很难知道每个Consumer的负载情况，而拉取模式允许Consumer根据自己的处理能力来决定拉取的速率
- 便于批量处理：Consumer可以一次拉取多条消息，进行批量处理，提高处理效率和吞吐量，如果是push只能一条条推送以保证实时性
- 简化Broker设计：Broker不需要维护每个Consumer的消费状态，只要负责存储和提供查询，由Consumer来记录偏移量（Offset）

## Kafka的工作流程

**消息发送：**

1. Producer启动后会向Kafka请求：
   - 获取Topic的元数据信息，包括Partition数量和Leader分布，并缓存和定期更新
2. 选择Partition
   - Producer发送消息时，如果指定了key，则通过hash算法选择Partition，否则采用轮询或粘性分区等方式选择Partition
3. 发送消息到Partition Leader
   - Producer只和Partition的Leader进行交互，发送消息到Leader
   - Leader将消息顺序追加到日志文件，并分配一个唯一的偏移量（Offset）
4. 副本同步
   - Follower Partition从Leader拉取数据，只有ISR（In-Sync Replica）中的副本才被认为是同步成功
   - acks返回配置有三种模式：
     - 0：不等待确认，最快但不可靠
     - 1：等待Leader写入成功，较快但可能丢失数据
     - all：等待所有ISR副本写入成功，最可靠但延迟较高
5. Producer收到ACK
   - 确认消息发送成功，写入流程完成

**消息存储：**

Partition的内部结构是：(待补充)

```pgsql
Partition
 ├── Log Segment 000000.log
 ├── Log Segment 000001.log
 ├── index 文件
 └── timeindex 文件
```

存储特点是顺序写磁盘、消息不可以修改、不可以删除、只能靠retention策略删除

**消息消费：**

1. Consumer加入Consumer Group
   - Consumer启动后会向Kafka请求加入指定的Consumer Group，并触发Rebalance机制，处理Consumer加入或离开
2. Partition分配
   - Kafka通过协调器（Coordinator）分配Partition给Consumer，确保一个Partition在Consumer Group中只被一个Consumer消费
3. Consumer拉取消息
   - Consumer会维护offset，指定从哪个Offset开始拉取

## Kafka的多分区和多副本机制

- 多分区：Kafka通过将每个分区Partition的数据复制到多个Broker上来实现高可用性和容错性
- 多副本：每个Partition有一个Leader和多个Follower副本，消息会被发送到Leader，然后Follower会从Leader中拉取消息进行同步

生产者与消费者只与Partition的Leader进行交互，Follower的作用是为了保证消息存储的安全性，当Leader发生故障时会从Follower中选举出一个Leader继续提供服务

多分区和多副本机制的好处：

- 通过给特定Topic指定多个Partition，而各个Partition可以分布在不同的Broker上，可以提供更高的吞吐量和并发处理能力
- Partition可以指定对应的副本数，提高了数据存储的安全性和容灾能力，但也增加了存储开销

## Kafka的分区机制

为什么一个分区只能由消费者组的一个消费者来消费，为什么这样设计

## 如何保证消息的顺序消费

**生产者保证消息顺序：**

消息在被添加到Partition的时候是在尾部追加的，并且每条消息都有一个唯一的偏移量Offset，消费者按照Offset顺序拉取消息进行处理，因此在一个Partition里可以保证消息的顺序消费，但是如果让一个Topic只有一个Partition会影响吞吐量

Kafka消息在发送的时候可以指定发送的topic、partition、key、data四个参数，可以直接指定消息需要进入到那个Partition，但是Patition数量变更会导致硬编码的风险，因此通常会通过key来决定消息进入哪个Partition，Kafka会对key进行hash计算，然后根据Partition数量取模来决定消息进入哪个Partition，这样相同key的消息会进入同一个Partition，从而保证了相同key的消息顺序消费

**消费者顺序消费：**

## 如何保证消息不丢失

**生产者确保消息发送成功：**

生产者丢失消息通常是因为发送过程中网络波动或者Broker故障，可以使用以下方式来保证消息发送成功：

- `asks=all`：要求Partition的Leader把消息写入本地日志，并且还要等待所有同步副本（ISR）都写入成功才返回确认
- `retries>0`：配置重试次数（比如设置为3或更大的值），当发送失败生产者会自动重试
- 使用callback回调机制：使用`send(msg)`之后应该使用回调函数来确认消息是否发送成功，如果失败可以进行日志记录或者补偿处理

**集群Broker确保消息可靠持久化：**

Broker丢失消息通常是因为单点故障或磁盘损坏，可以使用以下方式来保证消息可靠持久化：

- `replication.factor>=3`：副本数量至少设置为3（即1个Leader和2个Follower），确保即使两个Broker宕机，消息仍然有一个副本存活
- `min.insync.replicas=2`：与`acks=all`配合使用，表示至少有两个副本写入成功才返回确认
- `unclean.leader.election.enable=false`：防止没有完全同步的副本被选为Leader，避免缺失的数据永久丢失

**消费者确保消息处理完才提交：**

消费者丢失消息最常见的原因是消息还没处理完，就提前提交了offset，可以使用以下方式来保证消息处理完才提交：

- `enable.auto.commit=false`：关闭自动提交offset，确保只有在消息处理成功后才手动提交offset
- 手动提交offset：在处理完消息后调用`commitSync()`或`commitAsync()`来提交offset，确保消息被成功处理后才更新消费位置，这可能导致消息重复消费，因此下游业务要实现幂等性

## 如何保证消息不重复消费

## Kafka的重试机制

消费失败会怎样？默认重试多少次？如何自定义重试机制

## 消息积压怎么办

---

如果有一个topic和一个group，topic有10个分区，消费线程数和分区数是什么关系

消息中间件如何做到高可用

Kafka和RabbitMQ的消息确认有什么区别

Kafka和RabbitMQ的broker架构有什么区别