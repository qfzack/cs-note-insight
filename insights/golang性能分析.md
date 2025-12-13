# Golang性能分析

本文介绍常用的Go性能与内存分析工具，涵盖其功能、使用方式以及适用场景与优势，帮助定位CPU、内存、阻塞和协程等方面的瓶颈

## 常见工具

### pprof

- **功能**：CPU/内存/阻塞/堆栈采样分析
- **使用**：在服务中引入`net/http/pprof`，通过HTTP或`go tool pprof`分析；也可用`runtime/pprof`离线生成
- **场景与优势**：适合生产环境快速定位热点；生态成熟，支持交互式图形、火焰图

### trace

- **功能**：go runtime收集的收集调度、GC、系统调用、网络事件等全局跟踪数据
- **使用**：`go test -trace`、pprof的`/debug/pprof/trace`接口或`runtime/trace`输出trace文件，再用`go tool trace`可视化
- **场景与优势**：对协程调度、GC暂停等细粒度问题定位效果好，可结合pprof使用

### runtime/metrics

- **功能**：暴露运行时指标（GC次数、堆大小、协程数等）
- **使用**：通过`runtime/metrics.Read`定期采集，常结合Prometheus监控
- **场景与优势**：轻量级监控，适合持续观察趋势或设置告警

### go-torch / pprof 火焰图

- **功能**：将pprof数据转为火焰图
- **使用**：`go tool pprof -raw`输出后用`go-torch`或`speedscope`渲染
- **场景与优势**：直观展示函数调用栈及热点，易于发现性能瓶颈

### Delve (dlv)

- **功能**：Go调试器，支持断点、变量检查、堆栈查看
- **使用**：`dlv exec`/`debug` 调试，可与IDE集成
- **场景与优势**：在性能调优中用于精确查看运行状态、协程，配合采样数据验证推断

### Gops

- **功能**：实时查看Go进程状态，如goroutine数、GC、堆使用等
- **使用**：`gops`命令行检测运行中的Go服务
- **场景与优势**：生产环境快速巡检，零侵入部署

### Prometheus + Grafana

- **功能**：指标采集与可视化
- **使用**：结合`prometheus/client_golang`暴露指标，在Grafana搭建看板
- **场景与优势**：适合长期监控、趋势分析，并与告警系统联动

## 选型建议

- **热点函数定位**：优先pprof+火焰图
- **调度与GC问题**：优先trace
- **实时监控**：runtime/metrics+Prometheus
- **深度调试**：Delve
- **生产巡检**：Gops

通过上述工具组合，可对Go服务性能问题实现从宏观监控到微观定位的全链路分析

## trace

### 什么是trace

trace可以用来分析Go程序在一段时间到底干了什么，可以用来分析调度、阻塞、GC、系统调用等问题，pprof是基于采样的分析工具，而trace是基于事件的分析工具，能够还原程序的真实执行顺序

### 如何使用trace

trace有三种常用的使用方式：

1. 使用`go test -trace`命令运行测试并生成trace文件，例如：

    ```bash
    go test ./... -trace trace.out
    ```

2. 使用pprof的HTTP接口`/debug/pprof/trace`生成trace文件，例如生成10秒的trace文件：

    ```bash
    curl http://localhost:6060/debug/pprof/trace?seconds=10 > trace.out
    ```

3. 使用`runtime/trace`包在代码中手动生成trace文件：

    ```go
    import "runtime/trace"
    func main() {
        f, _ := os.Create("trace.out")
        defer f.Close()
        trace.Start(f)
        defer trace.Stop()

        // ...要分析的逻辑...
    }
    ```

trace文件会记录程序在运行期间的各种事件，可以使用`go tool trace`命令进行分析和可视化：

```bash
go tool trace trace.out
```

展示的结果包括：

- view trace：时间线视图，展示goroutine的调度、阻塞和唤醒事件
- goroutine analysis：分析goroutine的创建、阻塞和运行时间
- network blocking profile：分析网络IO阻塞情况
- syschronous blocking profile：分析系统调用阻塞情况
- syscall profile：分析系统调用的时间分布
- scheduler latency profile：分析调度延迟情况

## pprof

### 什么是pprof

pprof是golang内置的性能分析工具，支持CPU、内存、阻塞等多种分析，主要有两个相关的包：

- `net/http/pprof`：提供HTTP接口，可以在运行时通过HTTP访问，基于`runtime/pprof`实现，会自动把profile（采样数据）暴露在`/debug/pprof`路径下
  - 暴露的接口有：
    - `/debug/pprof/profile`：CPU profile
    - `/debug/pprof/heap`：内存堆 profile
    - `/debug/pprof/goroutine`：goroutine profile
    - `/debug/pprof/mutex`：互斥锁 profile
    - `/debug/pprof/block`：阻塞 profile
    - `/debug/pprof/trace`：trace profile

  ```go
  import _ "net/http/pprof"

  go func() {
      http.ListenAndServe(":6060", nil)
  }()
  //访问 http://localhost:6060/debug/pprof/
  ```

- `runtime/pprof`：提供程序内采样和分析功能，是go runtime提供的更底层的接口，用于手动控制profile的采集与输出
  - 可以使用CLI和API两种方式来使用

  ```go
  import "runtime/pprof"
  func main() {
      f, _ := os.Create("cpu.pprof")
      _ = pprof.StartCPUProfile(f)
      defer pprof.StopCPUProfile()

      // ...要分析的逻辑...
  }
  ```

### net/http/pprof的使用

通过浏览器访问`/debug/pprof`路径，可以看到所有可用的profile列表，进入具体的profile路径得到的是当前采样数据的快照，并不能直接看出结果，需要借助`go tool pprof`命令行工具进行分析和可视化

而使用`go tool pprof`会向服务请求对应的profile数据，然后解析采样数据提供交互式的分析界面

例如，获取CPU profile的30秒采样结果：

```bash
go tool pprof http://localhost:6060/debug/pprof/profile?seconds=30 #采集30秒CPU profile
#如果不使用参数seconds，profile默认采集30秒CPU数据，goroutine/heap/block/mutex返回当前快照数据，allocs返回累计分配数据
#使用参数-http=:8080可以启动一个web服务器，访问http://localhost:8080查看图形化界面
```

然后会进入交互式界面，可以使用各种命令进行分析，常用交互命令：

- `top`：查看占用最高的函数
- `topN`：查看占用最高的前N个函数
- `top -cum`：按累计时间排序，查看调用链上最耗时的函数
- `list <func>`：看某个函数的源码级热点
- `web`：生成调用图并打开浏览器查看
- `peek <func>`：查看函数调用的上下游
- `callers <func>`：查看调用该函数的上游函数
- `callees <func>`：查看该函数调用的下游函数
- `traces`：查看调用栈信息
- 对于heap还可以使用：
  - `inuse_space`：（默认）切换到当前存活内存大小
  - `inuse_objects`：切换到当前存活对象数
  - `alloc_space`：切换到累计分配内存大小
  - `alloc_objects`：切换到累计分配对象数

例如：

- 分析CPU热点
  ```bash
  top
  top -ignore=runtime
  list main.handle
  callers runtime.mallocgc
  web
  ```

- 排查内存问题
  ```bash
  top
  top -ignore=runtime
  alloc_space  #切换到按分配内存排序
  top
  list main.handle
  callers runtime.mallocgc
  web
  ```

输出结果的主要指标：

- flat: 函数自身执行时间(不包括调用其他函数)
- flat%: flat占总时间的百分比
- sum%: 累积百分比
- cum: 累积时间(包括调用的其他函数)
- cum%: cum占总时间的百分比

flat和cum是分析的核心指标，flat高说明函数本身耗时多，cum高说明函数调用链上耗时多

### runtime/pprof的使用

runtime/pprof提供了更底层的API，可以在代码里手动控制profile的采集和输出，适合短时间运行的程序或者基准测试，其使用方式为：

1. 对于CPU profile这类需要持续采样的profile：

```go
f, _ := os.Create("cpu.pprof")
pprof.StartCPUProfile(f)
defer pprof.StopCPUProfile()

// 想分析的代码
```

2. 对于heap/goroutine/block/mutex/threadcreate这类快照式的profile：

```go
f, _ := os.Create("heap.pprof")
defer f.Close()
pprof.Lookup("heap").WriteTo(f, 0) // 0表示写入全部内容
```

然后程序会生成对应的.pprof文件，用于`go tool pprof <type>.pprof`进行分析，而不用创建单独的http端口，后面的交互命令和`net/http/pprof`一样

### metrics和trace、pprof的区别

- runtime/metrics是轻量级的指标采集，适合持续监控和趋势分析，数据粒度较粗，指标数据来自runtime的统计信息
- trace是事件驱动的全局跟踪工具，适合分析调度、GC、系统调用等复杂问题，数据粒度细，能够还原程序的真实执行顺序，数据来自事件日志
- pprof是采样分析工具，适合定位具体的性能瓶颈，数据粒度较细，指标数据来自采样的调用栈信息

## 实战问题

### 定位堆内存增长点

**问题场景**：程序运行一段时间后，发现堆内存持续增长，怀疑有内存泄漏

**可能原因**：

- 对象被意外持有引用，导致GC无法回收
- 大量临时对象分配，导致堆内存膨胀
- goroutine泄漏，导致栈上变量无法回收

可以通过分析两个时间点的heap profile的差异，即先导出两次heap profile数据：

```bash
go tool pprof -output=heap_before.pprof http://localhost:6060/debug/pprof/heap
# 触发流量 / 跑压测
go tool pprof -output=heap_after.pprof http://localhost:6060/debug/pprof/heap
```

然后用pprof做对比分析（pprof支持diff）：

```bash
go tool pprof -base heap_before.pprof heap_after.pprof
```

再使用相关的查询命令，重点关注`inuse_space`和`inuse_objects`指标，分析找到在这段时间内新增的堆内存分配点，帮助定位内存泄漏或增长的代码位置

### 分析程序阻塞问题

**问题场景**：程序响应变慢，但是CPU使用率不高，即CPU低，QPS也低

**可能原因**：

- goroutine因为channel操作、IO操作等阻塞无法继续执行
- 多个goroutine争抢同一把锁，导致等待时间过长
- 死锁等严重阻塞问题

1. 查看goroutine profile分析goroutine数量和阻塞情况

运行`go tool pprof http://localhost:6060/debug/pprof/goroutine`，查看goroutine的数量是否持续增长，如果goroutine数量异常高，说明有大量goroutine阻塞未退出，并且新的请求还在不断创建新的goroutine

使用`top`命令查看阻塞最多的函数调用，结合`list <func>`和`traces`命令查看源码和调用栈，分析是哪些操作导致大量goroutine阻塞

2. 查看block profile分析阻塞时间

运行`go tool pprof http://localhost:6060/debug/pprof/block`，查看方法执行的阻塞时长，使用`top`重点关注阻塞时间长的函数调用，结合`list <func>`命令查看源码，分析是哪些操作导致阻塞，如果是channel导致的阻塞可以定位到具体位置

3. 查看mutex profile分析锁竞争情况

运行`go tool pprof http://localhost:6060/debug/pprof/mutex`，查看锁竞争的等待时间，使用`top`重点关注竞争时间长的锁，结合`list <func>`命令查看源码，分析是哪些锁导致了严重的竞争，从而影响程序性能

4. 使用trace分析调度与阻塞链路

通过执行：

```bash
curl http://localhost:6060/debug/pprof/trace?seconds=10 > trace.out
go tool trace trace.out
```

查看程序的调度、阻塞和唤醒事件，结合trace的时间线视图，分析goroutine的调度与阻塞关系，帮助定位性能瓶颈

> pprof的trace是唯一基于时间线的分析工具，可以还原goroutine、channel、IO、GC的真实执行顺序，非常适合分析复杂的调度与阻塞问题

### 其他常见问题

1. CPU飙高，响应变慢
   - 问题表现是CPU使用率持续高企，QPS下降，响应延迟增加
   - 典型原因是热点函数执行时间过长，导致CPU资源被耗尽
   - 解决思路是使用pprof的CPU profile定位热点函数，优化算法或减少不必要的计算
2. GC频繁，CPU占用高
   - 问题表现是GC次数频繁，CPU使用率高，请求抖动
   - 典型原因是短生命周期对象（比如临时变量、字符串拼接、map/切片扩容增加垃圾）过多
   - 解决思路是使用heap profile分析内存分配热点，并使用`GODEBUG=gctrace=1`观察GC日志，优化内存分配策略
3. STW时间长，响应延迟偶尔飙高
   - 问题表现是GC STW时间长，p99（最慢的1%的请求延迟）飙高，CPU无异常
   - 典型原因是堆内存过大，以及存在大对象，导致GC扫描和标记时间长，即延迟抖动看STW
   - 解决思路是使用trace分析GC暂停时间，结合gctrace日志定位大对象分配点，优化内存使用
4. 程序OOM但是heap内存不高
   - 问题表现是程序被操作系统杀死，但是堆内存使用率不高
   - 典型原因是栈内存过大（goroutine泄漏导致大量栈分配），或者cgo调用导致的内存泄漏（OOM是RSS，即进程当前占用内存超出限制，RSS包括heap、goroutine栈、mmap、runtime元数据等）
   - 解决思路是使用goroutine profile分析goroutine数量和栈大小，结合OS工具或proc文件系统查看进程内存使用详情，定位栈分配点或cgo调用点
