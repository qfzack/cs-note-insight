- 框架和工具
  - Web框架：Gin、Echo、Fiber、Beego
  - RPC框架：gRPC、go-micro、go-kit
  - 路由和中间件：请求处理、认证授权、日志处理

---

# 网络分层架构

> [OSI和TCP/IP网络分层模型详解](https://javaguide.cn/cs-basics/network/osi-and-tcp-ip-model.html#%E5%BA%94%E7%94%A8%E5%B1%82-application-layer)

- 应用层
  - 应用层
  - 表示层
  - 会话层
- 传输层
  - 传输层
- 网络层
  - 网络层
- 网络接口层
  - 数据链路层
  - 物理层

## HTTP版本对长连接的支持

- HTTP/1.0
  - 默认短连接：每个请求后关闭连接
  - `Connection:keep-alive`是非官方扩展
  - 需要服务器和客户端都支持才能工作

- HTTP/1.1
  - 原生支持长连接，连接默认保持打开
  - `Connection: keep-alive`成为正式标准
  - 通过`COnnection: close`关闭连接
  - 特点
    - 串行处理：必须等前一个请求处理完才能发送下一个
    - 队头阻塞问题：一个慢请求会阻塞后续请求

```http
# 请求
GET /api/data1 HTTP/1.1
Host: example.com
Connection: keep-alive

# 响应  
HTTP/1.1 200 OK
Connection: keep-alive
Keep-Alive: timeout=60, max=100

# 同一连接上的第二个请求
GET /api/data2 HTTP/1.1
Host: example.com
```

- HTTP/2
  - 多路复用：一个连接可以同时并发处理多个请求
  - 二进制分帧：将HTTP消息分解为帧，多个流的帧可以交错发送，解决队头阻塞问题
  - 流控制：每个流独立的流量控制
  - 服务器推送：主动推送资源

## HTTP/2

### HTTP/1.1的问题
> https://zhuanlan.zhihu.com/p/161577635

1. 冗余文本多导致传输体积大
   - 每个请求都会带上冗余重复的Header，导致很多空间被消耗

2. 并发能力差，网络资源利用率低
   - HTTP/1.1是基于文本的协议，请求的内容打包在header/body中，内容通过\r\n来分割，同一个TCP连接中，无法区分request/response是属于哪个请求，因此无法通过一个TCP连接并发地发送多个请求
   - HTTP/1.1中请求方可以并发多个request，但是服务端需要对应的response按照request排序，因此如果第一请求没有返回，会阻塞后面的请求

### HTTP/2的改进（头部压缩和多路复用）

1. HTTP/2没有改变HTTP的语意（GET/POST等），只是在传输上做了优化
2. 引入帧、流的概念，在TCP连接中，可以区分出多个request/response
3. 一个域名只会有一个TCP连接，借助帧、流可以实现多路复用，降低资源消耗
4. 引入二进制编码，降低header带来的空间占用

### 头部压缩

HTTP/2头部压缩提供两种方式来降低header的传输占用空间：
1. 将高频使用的header编成一个静态表
   - 每个header对应一个数组索引，每次只传输这个索引
   - 如传3表示“POST”，传28表示“content-length”
2. 支持动态地在表中增加header
   - 添加header到动态表表中后就只需要传对应的索引

静态表和动态表是请求方和服务方共同维护的，后续的请求复用，连接断开后，动态表也会销毁

### 多路复用

HTTP/1.1无法区分response属于哪个请求，对于这个问题HTTP/2提出了`流`的概念：每一次请求对应一个流，有唯一的ID来区分不同的请求

基于`流`，将请求的数据分以`帧`来分割数据并进行传输，每个帧都是唯一属于某一个`流`的ID，将`帧`通过流ID进行分组，就可以分离出不同的请求，这样同一个TCP连接中就可以同时发起多个请求，不同的数据帧可以穿插在一起，从而提高TCP连接的利用率

HTTP/2中几乎所有数据交互都是以帧为单位进行的，包括header、body、约定配置，因此约定了以下的帧类型：
- HEADERS：帧仅包含HTTP header信息
- DATA：帧包含消息的所有或部分请求数据
- PRIORITY：指定分配给流的优先级，服务方可先处理高优先级请求
- RST_STREAM：错误通知：一个推送承诺遭到拒绝，终止某个流
- SETTINGS：指定连接配置（用于配置，流ID为0）
- PUSH_PROMISE：通知一个将资源推送到客户端的意图
- PING：检测信号的往返时间（流ID为0）
- GOAWAY：停止为当前连接生成流的停止通知
- WINDOW_UPDATE：用于流控制，约定发送窗口的大小
- CONTINUATION：用于继续传送header片段序列

## RPC（remote procedure call）

RPC是一种编程模型和通信范式，让程序可以像调用本地函数一样调用远程服务器上的函数，RPC可以基于多种传输协议实现，包括HTTP、TCP、UDP等，例如gRPC基于HTTP2实现，传统RPC可能使用TCP（RESTful API大体上可以看作是RPC的一种形式）

gRPC和RESTful API都是服务间的通信协议/风格
- gRPC是通信协议框架，基于HTTP/2+Protobuf，RESTful API是一种架构风格，主要基于HTTP/1.1+JSON
- 都是用于应用层通信，且可以相互替代
- gRPC的性能更高（序列化快+压缩+HTTP/2），RESTful API相对慢（json序列化+无多路复用）
- gRPC的接口定义是通过.proto明确定义+生成代码，RESTful API没有强约束，可以自由定义API URL+JSON格式
- gRPC主要用于微服务之间的通信，RESTful API主要用于前后端通信和第三方API开发

---

# 面试问题

## 1.web框架

主流的web框架对比
- Gin：轻量级、高性能（基于httprouter），适合API服务
- Echo：模块化设计，中间件生态丰富，易扩展
- Beego：全栈框架（含ORM、MVC），适合快速开发但较重

Gin如何处理HTTP请求，路由匹配的原理是什么
- 基于Radix（前缀树）实现高效路由匹配，减少内存占用
- 上下文（Context）池化复用，降低GC的压力

中间件middleware的作用是什么
- 中间件是一种拦截器模式，用于在HTTP请求处理过程中指定自定义的代码，例如身份验证、授权、和请求日志记录等，而无需修改程序本身

解释中间件的执行顺序（如c.Next()和c.Abort()的作用）
- 洋葱圈模型：中间件链式调用，c.Next()进入下一层，c.Abort()中断

如何实现全局认证授权、日志处理等中间件

动态路由（如/user/:id）如何实现参数解析
- 框架通过路由匹配提取参数，底层以来路径分段与哈希映射

如何处理高并发下的资源竞争
- 避免使用全局变量：请求级状态通过Context传递而非全局变量
- 同步机制：互斥锁（sync.Mutex）、读写锁（sync.REMutex）或channel协调并发

如何优化web服务的响应时间
- 连接池：数据库/HTTP客户端复用长连接（如sql.DB的SetMaxOepnConns）
- 缓存策略：Redis缓存热点数据，减少DB查询
- JSON优化：使用jsoniter替代标准库提升序列化速度

如何对Gin路由编写单元测试
- 使用net/http/httptest模拟请求

goroutine泄漏的场景有哪些，如何排查
- 阻塞的channel、没有关闭的time.Ticker
- 使用go tool pprof分析goroutine堆栈


## 2.gRPC

> [gRPC官方中文文档](https://doc.oschina.net/)
> [quickstart](https://grpc.io/docs/languages/go/quickstart/)
> [gRPC example](https://github.com/grpc/grpc-go/tree/master/examples/helloworld)
> https://github.com/Bingjian-Zhu/go-grpc-example

gRPC是什么，它的主要优势是什么
- gRPC是一个基于HTTP/2的现代、高性能、开源的通用RPC框架
- 其优势在于：
  - 高性能：二进制protobuf编码、HTTP/2多路复用/头部压缩/流式
  - 强类型接口：由.proto定义
  - 跨语言支持、内置流式支持、丰富的生态（拦截器、健康检查、负载均衡等）

gRPC和RESTful API的区别是什么
- 协议：HTTP/2和HTTP/1.1
- 数据格式：二进制protobuf和文本JSON/XML
- 接口定义：强类型.proto和弱类型OpenAPI/Swagger
- 通信模式：更灵活的单向/双向流式和请求-响应模式
- 性能：gRPC更高效（序列化快+压缩+HTTP/2），RESTful API相对慢（json序列化+无多路复用）
- 浏览器支持：RESTful API原生支持浏览器，gRPC需要使用gRPC-Web或代理转换

protocal buffers是什么，为什么gRPC要使用它作为IDL和序列化协议
- protocal buffers是google开发的语言中立、平台中立、可扩展的序列化机制（IDL+编译器+库）
- 优势是二进制格式高效（体积小、序列化/反序列化快）、强类型、可扩展（向后/向前兼容）、代码生成（简化开发）、清晰的接口定义文档

gRPC支持哪几种通信模式/流类型
- gRPC的服务定义在*.proto文件中，可以使用的服务（或方法）类型有：
  - 单向RPC：客户端发送请求到服务端并等待响应，就像普通的函数调用一样
  - 服务端流式RPC：客户端发送请求到服务器，拿到一个流读取返回的消息序列，直到流里面没有任何消息
  - 客户端流式RPC：客户端写入一个消息序列并发送到服务器，当客户端写入完成，则会等待服务端返回响应
  - 双向流式RPC：服务端和客户端使用读写流发送和接收消息序列
- 流式请求使用stream关键字来声明，是边发送、边接收、边处理的机制

gRPC为什么使用HTTP/2作为传输层协议
- HTTP/2提供了高性能的基础：
  - 二进制分帧层（高效编码）
  - 多路复用（单个TCP连接上并行处理多个请求/响应，避免队头阻塞）
  - 头部压缩（显著减小开销）
  - 服务器推送（gRPC没有使用，但是HTTP/2支持）
  - 流（天然支持gRPC的流式RPC）

解释gRPC请求/响应的基本消息结构（帧类型）
- 数据通过HTTP/2数据帧传输，重要的帧类型有：
  - HEADERS帧：包含gRPC的状态（HTTP状态码+grpc-status trailer）和用户自定义元数据（Headers/Trailers）
  - DATA帧：包含序列化的protobuf消息体（可能被分片）
  - TRAILERS帧：用于传输最终的gRPC状态（grpc-status，grpc-message）和Trailers元数据，通常在响应结束时发送

gRPC拦截器是什么
- 拦截器是gRPC的中间件，允许在RPC调用执行前后注入逻辑（类似HTTP中间件）
- 可以用于日志记录、认证/授权、指标收集、错误处理、链路追踪、超时控制、请求验证等

gRPC怎么传递自定义元数据
- 可以使用metadata包来在RPC调用的过程中传递一些额外的信息，比如身份验证的token、请求ID、用户信息等

*.pb.go文件是什么
- *.pb.go文件是通过protoc编译器生成的Go语言代码文件，其中包含：
  - 所有用于填充、序列化和获取我们请求和响应消息类型的protocal buffer代码
  - 一个为客户端调用定义在服务的方法的接口类型
  - 一个为服务端使用定义在服务的方法去实现的接口类型

gRPC如何保证请求的安全性
- 主要使用TLS/SSL加密通信

如何实现gRPC服务的负载均衡
- 客户端负载均衡是推荐的模式
  - 客户端存根维护可用服务器列表和负载均衡策略，根据策略选择目标服务器
- 代理负载均衡
  - 如Nginx、Envoy、Linkerd等代理会在客户端和服务端之间进行负载均衡

gRPC的健康检查协议是什么
- 标准化的健康检查协议（grpc.health.v1.Health），服务端实现该服务，客户端可以调用Check或者Watch来查询服务状态（SERVING、NOT_SERVING、UNKNOWN、SEVICE_UNKNOWN）

如何进行gRPC服务的版本管理和兼容性
- 主要利用gRPC的向后/向前兼容规则
  - 不删除字段，只标记reserved或者废弃（depreceted）
  - 不更改现有字段的编号或类型
  - 添加新字段：使用新的唯一编号，新字段应该有合理的默认值或者标记为optional
  - 服务/方法：添加新方法通常是安全的，删除或更改现有方法签名破坏性大，可能需要新服务定义或者版本号（通过报名、服务名前缀或元数据传递）
  - 使用oneof或者包装消息类型处理重大变更

gRPC网关是什么
- 是一个插件，可以从.proto文件生成反向代理的代码，将RESTful HTTP/JSON API调用转换为gRPC调用
- 可以提供REST接口给不支持gRPC的客户端，便于API管理，渐进式迁移

proto中删除一个字段后可以重复使用其编号吗？
- protocal buffers在编码时只发送字段编号和字段值，解码时根据字段编号决定解析的数据，因此proto文件中被删除的字段编号不能被重复使用，否则可能导致：
    - 解码失败（类型不匹配）
    - 数据错误（解码成乱码）
    - 程序崩溃（gRPC解码错误）
- 永远不要使用之前使用过的字段编号，如果字段被删除可以使用reserved关键字来标记

proto编号的使用规范
- 合法的编号范围是1~2^31-1，其中19000~19999是protobuf内部保留使用的，用户不能使用
- protobuf编码时唯一标识是字段的ID，字段名不会出现编码结果中，只会传递编号和变量值
- 小编号（1~15）给常用的字段使用，编码体积小只需要一个字节，如id，name，status，16~2047会占用两个字节
- 当一个字段发布使用某个编号，就不能再修改类型和复用这个编号，可以使用reserved标记
- 字段编号不能重复

如何监控和追踪gRPC的性能
- 指标：使用拦截器收集RPC延迟、错误率、吞吐量等，集成Prometheus或者OpenTelemetry
- 链路追踪：使用拦截器在gRPC调用间传播和创建Trace Span，集成Jaeger、Zipkin、OpenTelemetry
- 日志：使用拦截器记录RPC元信息、请求/响应
- Profiling：使用pprof分析CPU、内存、阻塞、Goroutine等

gRPC调用超时（DeadlineExceeded）或不可用（Unavailable）错误可能的原因是什么
- DeadlineExceeded：客户端设置的Deadline太短，或者服务器处理耗时过长，或者网络延迟
- Unavailable：服务器进程崩溃/未启动，服务器过载（资源耗尽、线程池满），网络分区，负载均衡器故障或者后端无健康实例

在流式RPC中，如何优雅地关闭流
- 客户端发送流：调用stream.ClosedSend()告知服务器客户端不再发送消息，服务器在Recv()返回io.EOF
- 服务器发送流：在发送完所有消息后，返回nil或调用stream.SendAndClose()，客户端Recv()返回io.EOF
- 双向流：双方都可以独立关闭自己的发送端（CloseSend()），接收端在对方关闭发送端且所有消息接收完毕后会收到io.EOF，通常需要应用层协议来协商流的结束
- Context取消：context取消或者超时会导致流终止

使用过哪些gRPC相关的工具库
- grpcurl：类似curl的命令行工具用于测试gRPC服务
- grpcui：gRPC服务的Web UI（类似Postman）
- prototool：Protobuf文件的Lint、格式化和管理工具
- bloomrpc：图形化gRPC客户端
- otelgrpc：OepnTelemetry的gRPC拦截器
- grpc-gateway：生成RESTful网关
- grpc-middleware：提供常用的拦截器链
