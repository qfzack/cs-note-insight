# Redis

## 数据类型

**String(字符串)**

- 可以是字符串、整数或者浮点数
- 用于缓存对象、计数器（INCR）、分布式锁（SET NX EX）、共享session信息

```vbnet
SET key value                 // 设置key的值
GET key                       // 获取key的值
INCR key                      // 将key的值加1
DECR key                      // 将key的值减1
MSET key1 value1 key2 value2  // 批量设置key的值
GETRANGE key start end        // 获取key值的子串
SETEX key seconds value       // 设置key的值并设置过期时间（秒）
```

```vbnet
//分布式锁
SET lock_key unique_value NX EX 10  // 尝试加锁，10秒后过期
// 解锁
if GET lock_key == unique_value then
    DEL lock_key
end if
```

**List（列表）**

- 双向链表，链表上每个节点包含一个字符串
- 用于消息队列（简单版）、时间线（微博、朋友圈）

```vbnet
LPUSH key value          // 从左侧插入元素
RPUSH key value          // 从右侧插入元素
LPOP key                 // 从左侧弹出元素
RPOP key                 // 从右侧弹出元素
LRANGE key start end     // 获取指定范围内的元素
BLPOP key timeout        // 阻塞式从左侧弹出元素，timeout秒后超时
BRPOP key timeout        // 阻塞式从右侧弹出元素，timeout秒后超时
```

**Hash（哈希）**

- 包含键值对的无序哈希表
- 用于小型结构化对象存储，比如用户信息、商品信息

```vbnet
HSET key field value        // 设置哈希表key中field的值
HGET key field              // 获取哈希表key中field的值
HDEL key field              // 删除哈希表key中的field
HGETALL key                 // 获取哈希表key中的所有字段和值
HMSET key field1 value1 ... // 批量设置哈希表key中的字段和值
HMGET key field1 field2 ... // 批量获取哈希表key中的字段值
```

**Set（集合）**

- 字符串的无序不重复的集合
- 用于聚合计算（并集、交集、差集），比如点赞、共同关注

```vbnet
SADD key member            // 向集合key中添加元素member
SREM key member            // 从集合key中删除元素member
SISMEMBER key member       // 判断member是否是集合key的成员
SMEMBERS key               // 获取集合key中的所有成员
SRANDMEMBER key [count]    // 随机获取集合key中的count个成员
SUNION key1 key2 ...       // 获取多个集合的并集
SINTER key1 key2 ...       // 获取多个集合的交集
SDIFF key1 key2 ...        // 获取多个集合的差集
```

**Zset（有序集合）**

- 有序的集合，跳表实现，每个元素都会关联一个分数（score）
- 用于排序场景，如排行榜、延时队列

```vbnet
ZADD key score member                  // 向有序集合key中添加元素member，分数为score
ZINCRBY key score member               // 增加有序集合key中元素member的分数score
ZREM key member                        // 从有序集合key中删除元素member
ZSCORE key member                      // 获取有序集合key中元素member的分数
ZRANGE key start end [WITHSCORES]      // 获取有序集合key中指定范围内的元素，按分数从低到高排序
ZREVRANGE key start end [WITHSCORES]   // 获取有序集合key中指定范围内的元素，按分数从高到低排序
ZRANGEBYSCORE key min max [WITHSCORES] // 获取有序集合key中分数在min和max之间的元素
```

**Bitmaps（位图）**

- 二值状态统计，即0和1
- 用于签到、在线状态

```vbnet
SETBIT key offset value    // 设置位图key中offset位置的值为value
GETBIT key offset          // 获取位图key中offset位置的值
BITCOUNT key [start end]   // 计算位图key中值为1的位数
```

**HyperLogLog（基数统计）**

- 不精确但是节省空间的唯一值计数，内存占用固定为12KB
- 用于统计访客数（UV）、独立IP数

```vbnet
PFADD key element1 element2 ...  // 向HyperLogLog key中添加
PFCOUNT key1 key2 ...            // 获取HyperLogLog key中唯一元素的近似数量
PFMERGE destkey sourcekey1 ...   // 合并多个HyperLogLog到destkey
```

**GEO（地理信息）**

- 存储地理坐标、计算距离、范围查询
- 用于位置服务、附近的人

```vbnet
GEOADD key longitude latitude member        // 向地理空间索引key中添加地理位置
GEOPOS key member1 member2 ...              // 获取地理空间索引key中成员的位置
GEODIST key member1 member2 [unit]          // 计算地理空间索引key中两个成员之间的距离
GEORADIUS key longitude latitude radius unit [WITHCOORD] [WITHDIST] [WITHHASH] [COUNT count] [ASC|DESC] // 查询指定范围内的成员
```

**Stream（流）**

- 消息队列，相比于list可以自动生成唯一ID，支持持久化和消费者组
- 用于日志收集、消息队列（可持久化、可回溯）

```vbnet
XADD key ID field1 value1 [field2 value2 ...]             // 向流key中添加消息，ID可以是*表示自动生成
XREAD [COUNT count] [BLOCK milliseconds] STREAMS key ID   // 读取流key中的消息，ID表示从哪个ID开始读取
XGROUP CREATE key groupname ID                            // 创建消费者组
XREADGROUP GROUP groupname consumer [COUNT count] [BLOCK milliseconds] STREAMS key ID  // 从消费者组中读取消息
XACK key groupname ID1 [ID2 ...]                          // 确认消息已被消费
```

对数据的操作都是原子性的，不存在并发竞争问题

支持事务、持久化、Lua脚本、多种集群方案（主从复制、哨兵、切片集群）、发布订阅、内存淘汰、过期删除

## 底层结构

**String（字符串）**

Redis的String看起来只有一种，但是内部会自动选择三种encoding：

- int：当value是整数，底层用整数存储，节省内存
- embstr：字符串长度小于等于39字节，key和value会分配在同一块内存中，减少内存碎片
- raw：字符串长度大于39字节，key和value分配在不同内存中

**List（列表）**

Redis 3.2之后list改为quicklist结构，quicklist是多个listpack（旧的ziplist）的集合，全局由双向链表连接，避免一次性分配过大内存

即紧凑存储+双向链表的结构

**Hash（哈希）**

Hash类型底层有两种实现：

- 小hash用紧凑结构的ziplist存储，连续内存，节省内存开销
- 大hash用哈希表存储，数据量增大时会自动转换，渐进式rehash避免阻塞

**Set（集合）**

Set类型底层有两种实现：

- values小于等于512个且每个value小于等于64字节时，使用intset存储，节省内存
- values较大时升级为使用哈希表存储

**Zset（有序集合）**

Zset类型底层有两种实现：

- 小集合使用listpack紧凑保存member和score
- 大集合或者数据变大时使用跳表+哈希表的结构，跳表按score排序，哈希表用于快速查找member和score

**Bitmap**

Bitmap底层是用String类型存储的，位操作通过位运算实现

**HyperLogLog**

**Stream**

底层使用radix tree（基数树）存储消息ID和消息内容，ID有序，消费者组偏移存储在另一套结构中

## 内存优化

Redis 内存优化主要从几方面入手：

1. 减少key数量（合并key）
   - 每个key的RedisObject元数据开销大概50字节，因此减少key数量可以节省大量内存
   - 可以把多个key合并到一个Hash/List/Set/Zset中，避免元数据开销过大
2. 减少key/field/value字符串长度
   - key和field尽量短一些
   - value如果是字符串，尽量使用短字符串或者数字
3. 使用小型encoding（listpack、intset、embstr）
   - 尽量使用小型encoding的数据结构，减少内存开销
4. 避免大对象，大Hash，大ZSet
5. 给缓存设置TTL，及时删除过期数据
6. 使用value压缩（snappy、zstd）
7. 合理maxmemory+LRU/LFU剔除
8. 关闭或优化AOF
9. 使用Redis 7的active defrag与jemalloc调优

核心思想就是：减少metadata+减少高层结构+减少大字段。

## 线程模型

单线程：接收客户端请求、解析请求、进行数据读写、发送数据给客户端等都是由一个线程完成的

Redis的瓶颈在于机器的网络IO和内存，而不是CPU，单线程IO多路复用可以避免多线程竞争和提高请求处理能力

如果想充分发挥CPU多核能力，可以部署多个Redis节点采用分片或者读写分离

但是会启动多个线程，其他的用于关闭文件、AOF刷盘、释放内存（各自有任务队列），避免主线程阻塞

> 为什么单线程Redis可以做到数万的QPS <https://mp.weixin.qq.com/s/oeOfsgF-9IOoT5eQt5ieyw>

6.0开始引入多个线程，但是命令的执行还是单线程，网络读写和解析/序列化可以多线程

## 持久化

**AOF日志（Append Only File）**

- 每次执行一个命令都追加写入到一个磁盘文件中（先执行再写日志），恢复数据时逐一执行命令
- 服务器宕机可能导致执行成功但日志写入失败，从而数据丢失
- 写日志也是主线程执行的，会阻塞后续操作
- 日志是先追加到缓冲区，然后再写入AOF文件，有三种策略：
  - Always（每次操作都把缓冲区日志写到硬盘）
  - Everysec（每秒把缓冲区写到硬盘）
  - No（操作系统决定何时把缓冲区写到硬盘）
- AOF重写机制：
  - 为了避免AOF文件持续增大，当大小超过阈值会读取所有键值对，每个用一条命令记录到新的AOF文件然后替换（后台子进程完成），重写缓冲区和AOF缓冲区一起用

**RDB快照（Redis Database ）**

- 将某一时刻的内存数据（实际数据而不是执行的命令），以二进制的方式写入磁盘，数据恢复效率比AOF快
- save命令（主线程）和bgsave命令（子进程，写时复制Copy-On-Write，COW）

**混合持久化**

- 开启之后，AOF重写日志时，fork的子进程会先将主线程共享的内存数据以RDB方式写入AOF文件，然后主线程的操作记录在重写缓冲区，以AOF形式写入AOF文件
- 混合持久化的AOF文件前面是RDB格式的全量数据，后面是AOF格式的增量数据

> AOF是最安全的持久化方式，但是文件体积较大、恢复速度慢；RDB恢复速度快、文件体积小，但是可能丢失数据。混合持久化结合了两者的优点

## 过期删除和内存淘汰

惰性删除+定期删除

- 对key设置了过期时间后，会把key存储到一个过期词典中，读取key时会判断是否过期
- 不主动删除过期key，访问到的时候如果过期则删除，定期（默认10s）也会取出一定量的key，删除其中过期的key
- RDB文件生成的时候，会对key进行过期检查，过期的key不会保存到RDB文件中，主服务器加载的时候也不会加载过期的key
- AOF文件中如果key过期删除会追加删除的命令，AOF重写的时候会检查过期的key不会写到新的AOF文件中

Redis内存到达阈值后会触发内存淘汰：

1. noeviction：（默认）不淘汰数据，返回报错
2. volatile-random：随机淘汰设置过期时间的数据
3. volatile-ttl：优先淘汰设置过期时间中快要过期的数据
4. volatile-lru：淘汰设置过期时间中最久未使用的数据
5. volatile-lfr：淘汰设置过期时间中最少使用的数据
6. allkeys-random：随机淘汰任意数据
7. allkeys-lru：淘汰最久没使用的数据
8. allkeys-lfu：淘汰最少使用的数据

## 运行模式

- 单机模式（Standalone）
  - 只有一个Redis实例，没有高可用，简单性能好但是容易单点故障
- 主从复制（Master-Slave Replication）
  - 主服务器负责读写操作，从服务器负责读取主服务器的数据进行同步
  - 没有自动故障转移功能，主服务器宕机需要手动提升从服务器为主服务器
- 哨兵模式（Sentinel）
  - 有哨兵监控主从服务器状态，提供自动故障转移功能，自动选举新的主服务器
- 切片集群（Cluster）
  - 数据分布在多个节点上，提高读写性能，支持自动故障转移
  - 一个切片集群有16384个哈希槽，每个键值对会映射到一个槽，创建集群的时候会均匀分配槽位，或者手动分配



## 缓存设计

缓存雪崩

- 大量缓存数据同一时间过期，此时如果有大量请求，会导致数据库压力过大
- 解决方案：缓存实效时间打散、设置缓存不过期

缓存击穿

- 热点数据过期，导致大量请求直接访问数据库
- 解决方案：互斥锁保证及时重建缓存、设置热点数据不过期

缓存穿透

- 请求的数据不在缓存中，也不在数据库中（数据被误删）
- 解决方案：限制非法请求、设置空返回值或默认值、使用布隆过滤器快速判断数据是否存在

## 大key的处理

大key是string的值大于10KB，或者hash、list、set、zset类型的元素个数超过5000个

大key会导致客户端超时阻塞、网络阻塞、阻塞工作线程、内存分布不均匀

查找大key：redis-cli --bigkeys、使用SCAN命令扫描、使用RdbTools

删除大key：要分批次或异步删除

## 管道

是为了解决多个命令执行时的网络等待，把多个命令整合到一起发送到服务器端处理之后统一返回给客户端

## 事务回滚

redis事务不支持回滚，即不保证事务的原子性

## 分布式锁

redis可以作为一个共享存储系统被多个客户端共享，可以用来保证分布式锁

SET命令的NX参数是key不存在时才插入，因此：

- 当key不存在，显示插入成功，表示加锁成功
- 当key存在，显示插入失败，表示加锁失败

加锁需要通过EX/PX参数设置过期时间，而解锁的过程就是把key删除

## 为什么Redis这么快

1. 内存存储：所有数据都存储在内存中，读写速度远快于磁盘
2. 单线程模型：避免了多线程的上下文切换和锁竞争，提高了执行效率
3. 高效的数据结构：基于键值对存储数据，使用紧凑的数据结构（如ziplist、intset、skiplist）节省内存和提高访问速度
4. IO多路复用：使用epoll等IO多路复用技术同时处理多个客户端请求，减少等待时间

## 为什么Redis使用单线程

1. 避免锁竞争：多线程环境下，多个线程同时访问共享数据需要加锁，导致性能下降，而单线程避免了锁竞争问题
2. 对于内存数据库，CPU通常不是瓶颈，单线程足以处理大部分请求，实际的瓶颈在于网络IO和内存带宽
3. 单线程具有更简单的编程模型，减少了复杂性和潜在的并发问题
4. Redis不是完全单线程，后台有辅助线程处理AOF重写、内存释放等任务，避免主线程阻塞

> 对于复杂SQL/分析型数据库，CPU消耗较大，多线程更合适，而Redis作为内存键值数据库，单线程足以满足高性能需求
