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

- Golang语法规范 https://github.com/xxjwxc/uber_go_guide_cn?tab=readme-ov-file

---

# Golang内存分配与垃圾回收

## 栈分配与堆分配

堆分配负责处理生命周期短、作用域明确的变量，堆分配负责处理需要跨函数访问、生命周期较长的对象，go的GC主要关注堆上的对象，但是需要扫描栈来找到根引用

栈内存的分配和释放遵循后进先出的原则，分配速度很快，只需要一定栈指针即可，释放时也是批量释放，当函数返回时，整个栈帧都被回收
栈分配是堆分配的高效替代方案，当编译器判断某个变量可以安全地分配在栈上时，就不会使用堆分配机制

栈分配的条件：
- 变量的生命周期不超过函数的作用域
- 变量不会在函数外部被引用
- 变量大小在编译时可以确定且不会过大
- 没有通过指针、interface{}、slice、map、channel等方式逃逸
逃逸到堆上的场景：
- 方法返回局部变量的指针
- 变量被赋值给interface{}
- 变量被发送到channel
- 变量被存储到slice、map等动态数据结构中
- 变量太大（通常超过64KB）
- 在闭包中被捕获且闭包逃逸
> **闭包**：一个函数值（函数变量），捕获了其定义时所在的作用域的变量，即使这些变量已经超出了原始作用域，也依然可以访问，即闭包=函数+环境变量（我理解函数参数/返回值+直接使用外部变量）
> 比如下面这个方法outer()已经完成了，但是x依然能被闭包访问
```
func outer() func() {
    x := 10
    return func() {
        fmt.Println(x)  // 这个函数就是闭包
    }
}
```

堆内存分配对于不同大小的对象有不同的分配策略：
- 微小对象（<16B）：使用tiny allocator，多个微小对象可以共享一个16字节的内存块，减少内存碎片
  - Processor的mcache中会维护一个16B的内存缓冲区，专门用于分配小于16B且不包含指针的对象
  - 而指针类型、interface{}、包含指针的结构体、需要特殊对齐的对象，如果小于16B也会通过size class分配
- 小对象（16B-32KB）：使用size class机制，
  - 预定义了67个不同大小（size class）的类别，每个类别对应固定大小的内存块已经存在于mcache中，分配时选择最接近且大于请求大小的size class
  - 然后根据size class从mcache找到对应的mspan，如果没有mspan则向mcentral哪一个新的mspan
  - 如果mcentral也没有，则向mheap请求分配一批page来构造mspan
- 大对象（>32KB）：直接从mheap分配，使用页为单位（8KB）进行管理

## 堆内存的划分

堆内存的划分可以看作是page+mspan+size class的分层结构
- page是堆最小的物理分配单元，每个page大小为8KB，go runtime使用page bitmap来管理堆的哪些page是空闲的
- span/mspan是一组连续的page，每个mspan专门用于存放同一种size class的对象，span的分配来自mcentral/mheap，使用完会回收到mcentral/mheap
- size class是将堆上的小对象按照大小划分为8B～32KB不等的类（67个），每个size对应一个mcentral[sizeclass]，每个mcentral中存放一组mspan（被拆成N个对象槽）
- 此外还有Tiny Allocator和Large Object分别处理微小对象（<=16B）和大对象（>32KB）的内存分配，大对象直接通过mheap分配连续的多个page

## 分配器架构

go的内存分配器借鉴了Google的TCMalloc，采用多级缓存的思想来减少锁竞争和提高分配效率

Go使用一个三层的内存分配器架构：
- mcache：每个Processor有一个本地缓存，用于小对象的快速分配
- mcentral：全局的中央缓存，管理特定大小类的内存块
- mheap：全局堆管理器，负责大对象分配和向OS申请内存

堆内存是若干页（8KB）组成，mspan是一组连续的页并划分为等大小的对象槽，用于存放某个特定大小（size class）的对象，每个mspan管理一种size class，并负责对象分配、空闲管理和GC跟踪

size class是一组预设的对象大小值（从8B到32KB有67个大小），用来提升内存分配的效率，更大的对象需要从mheap通过page级别分配

## 内存管理单元

- mspan：基本的内存管理单元，包含若干页，同一个mspan中的对象大小相同，mspan维护了空闲对象的位图，支持快速的分配和释放
- 页管理：go使用8KB的页作为内存管理的基本单位，通过位图来跟踪页的使用状态

## 垃圾回收机制

go的垃圾回收（GC）是一个并发、三色标级清除+混合写屏障的高性能垃圾回收器，在程序运行时异步地找出不再被引用的堆对象并释放内存，目的是在低停顿时间和高吞吐量之间取得平衡

GC的触发条件
- 内存分配达到一定的阈值（GOGC环境变量控制，默认100%，表示堆增长到上次GC后的100%触发）
- 手动调用runtime.GC()
> https://cloud.tencent.com/developer/article/1900650

GC的过程包括四个阶段：
- STW（stop the world）：GC初始化
  - 准备工作：分配专门的标记goroutine，初始化标记队列和工作缓存队列，设置GC相关的全局状态
  - 第一次STW：停止所有用户goroutine，启用写屏障，扫描全局变量和goroutine栈，找到GC root，将根对象标记为灰色（已标记但未扫描）并放进工作队列
- 并发标记（Concurrent Marking）
  - GC与用户代码并发运行，GC goroutine遍历灰色对象的指针字段，将其引用的对象也标记为灰色（未扫描）或黑色（已扫描）
  - 使用三色标记算法标记所有遍历的对象，为了防止对象逃逸被误删，使用写屏障机制来追踪正在使用的对象
  - 第二次STW：停止所有用户goroutine，检查是否有为标记的灰色对象（灰色对象引用的对象还没有被扫描，因此是待处理的）
- 并发清除（Concurrent Sweep）
  - 并发标记完成后，未被标记的白色对象就被认为是垃圾
  - GC开始清理这些对象所属的mspan，将其回收到mcentral/mheap
  - 清除阶段也与程序并发运行（非STW）
- 重新分配：下一轮GC
  - GC不会释放内存给操作系统，而是留在堆中供下次使用
  - 后续新的对象可以重新使用这些回收的mspan

## 三色标记算法

GC把堆上的所有对象分为三类：
1. 白色：尚未访问的对象，GC会清理它，除非在之后被标记为灰色/黑色
2. 黑色：已经标记并扫描了其中的所有引用，不会被清除
3. 灰色：已经标记但还没有扫描其引用的字段，等待进一步处理

GC的目标是把所有从根可达的对象都标记为黑色，其余的白色就是可回收的垃圾

标记过程：
1. 初始状态：堆上所有对象都是白色的，GC启动会把根对象（如全局变量、当前方法的栈、寄存器中的引用）标记为灰色，并放入灰色对象队列
2. 处理灰色对象：不断从灰色队列中取出对象，将其设为黑色，然后扫描该对象的所有字段，找到引用的对象：
   - 如果引用对象是白色，则标记为灰色并加入灰色队列
   - 如果引用对象是黑色/灰色，则跳过
3. 循环直到灰色队列为空：这意味着所有从根出发可达的对象都被标记为黑色，剩下的白色对象是不可达的，需要被回收

三色标记不变性：黑色对象不能引用白色对象，否则白色对象会被错误清除（实际情况就是可能出现对象被标记为黑色，然后后面又引用了一个新增的白色对象）
为了保证不出现这种情况，就需要在并发阶段使用写屏障

## 并发标记的写屏障

并发标记阶段程序孩还在运行的时候，可能会有指针写入操作，这就需要写屏障来保证三色标记不变性：
- 插入写屏障
  - 当指针被修改时，将新指向的对象标记为灰色
  - 保证新建立的引用关系不会违反三色不变性
- 删除写屏障
  - 当指针被修改时，将原来指向的对象标记为灰色
  - 保证原有引用关系在断开前被正确处理
可以理解为写屏障用于保证新引用的对象不会被误清理，通过将这些对象标记为灰色，使得它们及其引用关系能被GC扫描

---

# 面试问题

## golang面向对象

什么是面向对象
- 面向对象（OOP，object-oriented programming）是一种设计思想，通过对象来组织代码，强调将数据（状态）与行为（方法）绑定，并通过类、继承、多态、封装等机制实现灵活和可维护的程序结构
- 核心思想：一切皆对象
  - 对象（object）：现实事物的抽象，对象可以有各种行为（方法）
  - 类（class）：对象的模板
  - 封装（encapsulatuion）：将数据和方法绑定在一起，并隐藏内部的细节，仅对外提供接口调用
  - 继承（inheritance）：子类继承父类的属性和行为，实现代码的复用
  - 多态（polymorphism）：相同的接口可以有不同的实现，提高扩展性
- golang不是纯粹的面向对象语言，但是支持面向对象的特性，并以简洁、组合优先的方式实现面向对象：
  - 对象：结构体（struct）的实例
  - 类：结构体（struct）
  - 封装：属性的访问权限通过首字母大小写来通知，首字母大写是公共可以被外部访问的，首字母小写是私有的
  - 继承：不支持继承，但是可以通过结构体嵌套来实现组合
  - 多态：不支持继承，但是可以通过interface定义方法，不同实例有不同的实现，从而达到多态（和java的接口实现多态是一样的）

## golang基础

Go的特点和优势
- 简洁高效，语法清晰：没有类继承、多重继承、异常机制，语法易读易维护
- 原生支持高并发：提供goroutine和channel实现并发编程模型，性能优于线程池模型
- 编译速度快，可以静态编译为单个二进制文件，部署方便，执行性能接近C
- 静态类型可以在编译期发现错误，接口隐式实现，减少代码耦合，增强扩展性
- 与云原生/devops深度结合，k8s、docker、prometheus、etcd等云原生核心项目都是go写的
- 适合开发CLI工具、API网关、Operator、微服务等

Go的缺点和不足
- 1.18之前没有泛型（[]int,[]string需要各写一份逻辑），现在虽然支持但是语法比较负责
- 面向对象支持薄弱，只能用组合实现继承，没有构造函数，需要手动定义，没有方法重载，接口实现是隐式的
- 异常处理机制较弱，没有try-catch-finally机制，需要使用if err!=nil进行判断
- 没有提供很多的语法糖，map/reduce/filter等，没有lambda表达式
- 第三方库和框架没有java/python丰富和成熟
- 语言风格过于简化可能在复杂场景下被限制

Go中make和new的区别
- new(T)创建的是指向零值的指针，适用于所有类型
  - 适用于所有类型，int、struct、array或者自定义类型
  - 返回指针，返回的是*T类型，指向类型的零值
  - 不做初始化，只分配内存并赋予默认的零值，不调用任何构造逻辑
> 一般需要获取类型的指针值的时候使用new
- make(T)用于初始化slice、map、chan等内建的引用类型，返回的是值本身而不是指针
  - 只用于slice/map/chan三种内建的引用类型
  - 返回的是值不是指针，返回[]int, map[string]int, chan int等
  - 会进行初始化，返回的值可以直接使用
> 使用new创建的map没有初始化，不能直接使用
> var和new有些类似，都是分配内存和零值，并且是强类型的，返回的slice/map/chan都不能直接使用，只是new返回的是指针，var返回的就是实际地址

for-range的地址会发生变化吗
- for-range的循环变量是复制而不是引用
- 对于`for _, v := range list`，其中v是循环内被复用的变量，v的地址不变，只是值在变
- 当循环遍历完v的值是list最后一个，如果v被闭包捕获，这个值就会是最后一个
- 如果在for-range中创建goroutine，需要复制一个变量作为参数传入

defer的作用与执行顺序，底层数据结构是什么，什么情况会修改返回值
- defer的执行顺序是后进先出，先定义的defer最后执行
- 当定义了`defer f(x)`，编译器会把x的值复制到一块内存上（栈或者堆上），然后创建_defer结构体并压入当前goroutine的defer链表中，在方法返回前，遍历_defer链表，以后进先出的顺序执行每个defer的函数指针和参数副本，然后释放defer占用的资源
- defer参数值的确定：
  - defer的参数在defer调用的地方就已经复制了，不是等到方法执行完才计算的
```
func f() {
    a := 1
    defer fmt.Println(a) //这里输出的结果是1
    a = 2
}
```
- defer修改返回值
  - 当方法有命名的返回值，go会在栈上分配这个变量，defer可以访问并修改它
```
func f() (x int) {
    defer func() {
        x = 5
    }()
    return 3  //先执行赋值x=3，然后执行defer
}
```

panic/recover机制是什么
- defer-recover是go错误处理机制，一般和panic搭配使用，可以优雅地拦截运行时异常、防止程序崩溃、起到异常恢复机制的作用，实现类似try-catch的效果
- panic：触发运行时错误，终止当前方法并展开调用栈
- defer：注册延迟调用的方法，在返回前或panic展开前执行
- recover：用于在defer中捕获panic并恢复流程，且只能在defer中调用
```
func safeDivide(a, b int) (result int) {
    defer func() {
        if r := recover(); r != nil {
            fmt.Println("Recovered from panic:", r)
            result = -1
        }
    }()
    return a / b  // b=0 时会触发panic("runtime error: integer divide by zero")
}
```

golang的基础类型有哪些，unit类型溢出的问题
- 布尔类型：
  - bool
- 有符号整型
  - int, int8, int16, int32, int64
- 无符号整型
  - unit, uint8(byte), uint16, uint32, uint64, uintptr
- 浮点型
  - float32, float64
- 复数
  - complex64, complex128
- 字符串
  - string
- 字符
  - rune(int32的别名)
- 类型溢出是指一个变量超出了它的类型所能表示的最大/最小范围，如int8最大是127，再加1就到-128了

rune类型是什么，和byte的关系
- byte不是字符类型，是uint8的别名，常用于表示单个原始字节
- rune是字符类型（Unicode码点），是int32的别名，一个字符可能需要多个字节来表示
- 一般处理字符串含义时用的rune，处理存储/传输用的byte
- 字符串处理：
  - `for i := 0; i < len(s); i++`是按照byte遍历字符串的，也就是s[i]的结果是byte
  - `for _, r := range s`是按照rune遍历字符串的，r是rune类型
> Unicode字符集几乎给世界上所有的字符都分配了一个唯一编号，这个编号就是Unicode码点，golang中的rune就是用来

tag是怎么解析的，反射是什么，反射的原理是什么
（实际应用gorm json yaml protobuf gin.Bind()）
- tag是结构体字段后的一段字符串，提供字段的元信息，可以通过反射机制读取，go不会处理tag，而是提供给第三方库解析或者自定义解析逻辑
- tag的常见应用：
  - 用于JSON编码/解码
  - 用于数据库字段的映射
  - 用于表单数据绑定、校验
```
import "reflect"

type User struct {
	Name string `json:"name" db:"user_name"`
}

func main() {
	t := reflect.TypeOf(User{})
	field, _ := t.FieldByName("Name")
	fmt.Println(field.Tag.Get("json")) // 输出: name
	fmt.Println(field.Tag.Get("db"))   // 输出: user_name
}
```
- go的反射是一种在运行时检查类型和值的机制，核心原理基于go的类型系统和运行时表示
- go的反射是基于类型（reflect.Type）和值（reflect.Value）实现的，底层是通过接口的运行信息（type-description和data pointer）来动态操作类型和值
  - go的接口在底层是由两部分组成的：类型信息（指向具体类型的元数据）和数据指针（指向实际值的指针）
  - 类型信息：类型名称、类型大小、内存对齐信息、方法集合、字段信息
  - 当把任何值传入interface{}，编译器会自动生成一个接口值结构：包括这个值的类型信息（type descriptor）和数据指针
  - 例如：执行`t := reflect.TypeOf(x)`及时参数`x:=10`，编译器在调用reflect.TypeOf的时候会将x转换为interface{}，然后拿到x的类型信息和数据指针

调用Go方法时，传的是值还是指针
- 值传递：将参数的副本传递给方法，方法内部对参数的修改不会影响原始的变量
- 指针传递：将参数的地址传递给方法，方法内部可以通过地址来修改原始变量的值
- go中所有的方法参数传递都是值传递，对于指针、切片、map、channel、interface等引用类型的值，它们看起来像是默认引用传递，因为它们本身就是引用类型

单引号双引号反引号的区别
- 单引号：表示单个字符（rune，实际上是int32），表示一个Unicode字符
- 双引号：表示字符串（string）
- 反引号：原始字符串字面量（string），不处理任何的转义字符，原样保留所有内容，包括换行、制表符等，常用于多行字符串、正则表达式、JSON等不想转义的内容

什么情况下会出现panic
- go中panic表示程序遇到了不可恢复的错误，它会导致当前的函数停止执行，沿调用栈向上传递，直到main函数或者goroutine的顶层，如果没有被recover()捕获，程序就会崩溃
- 常见的出现panic的场景：
  - 显示调用panic()方法，这是开发者手动抛出panic
  - 空指针解引用
  - 数组或者切片越界访问
  - 使用未初始化的map进行写入
  - 类型断言失败（没有使用,ok判断结果）
  - 整数除以0
  - 写入已关闭的channel（如果是nil channel会永远阻塞）
- 一般来说go推荐使用error返回值处理可预期的错误，panic仅用于无法恢复的程序错误

Go如何实现set
- go不提供set类型，但是可以使用map实现set，`map[string]struct{}`中空结构体不占用内存

Go如何实现类似java中的继承
- go中使用结构体的组合（嵌入匿名字段）来实现继承
- 通过interface定义方法，在struct实现来达到多态

如何复用一个接口的方法
- interface也可以嵌入到其他的interface中，从而实现接口

go里面`_`的使用场景
- go里的`_`是一个特殊的标识符，被称为空白标识符，主要用于忽略不需要的值：
  - 忽略函数的返回值（类型断言`value, _ := i.(string)`）
  - 占位变量，for-range中使用_替换不需要使用的变量
  - 导入包但是不使用，相当于执行包的init方法
  - 检查类型是否实现了指定接口，`var _ io.Reader = (*MyReader)(nil)`

goroutine的参数传递有什么需要注意的
- 显示传递参数优于闭包引用外部参数
- 避免共享引用类型
- 福哦个goroutine共享变量时需要注意同步

如何写go的单元测试

Go的依赖管理
> https://www.cnblogs.com/niuben/p/16182001.html

golang如何单步调试

导入golang工程后有些依赖找不到怎么办

golang的深拷贝和浅拷贝的区别
- 浅拷贝与深拷贝的区别在于值复制的是偶时候会复制引用的数据：
  - 浅拷贝：只复制数据本身，不复制其引用指向的数据，多个对象共享同一个引用数据
  - 深拷贝：不仅复制对象本身，还会递归复制其引用指向的数据，两个对象完全独立
- golang中，以下类型的变量本身是值，但是底层数据是引用或者指针：
  - slice
  - map
  - channel
  - interface{}
  - pointer
  - function
- 对于chan、func不能直接深拷贝

golang中不同的类型如何比较是否相等
- 可以直接使用==比较的类型：
  - 基本数据类型，值相等
  - 指针类型，指向同一个地址
  - 数组，前提是数组元素可比较
  - struct，前提是所有字段类型可比较
  - interface：前提是动态类型和动态值都相同
  - chan，比较底层地址
- 不可使用==比较的类型
  - slice，底层是引用
  - map，是引用类型
  - function

init方法的特征
- init方法是一个特殊的函数，用于在程序运行前初始化包的状态，是每个包中自动执行初始化的方法，在main之前前由go运行时自动调用，没有方法参数
- 主要使用场景有：
  - 初始化变量：加载默认配置，设置常量值
  - 注册插件：如HTTP路由、数据库驱动等
  - 校验依赖环境：检查必要的系统变量、环境设置
  - 与import配合触发，如`_ "net/http/pprof"`启用性能分析模块
- 执行顺序：
  - 一个文件中的多个init，按照出现的顺序执行
  - 一个包的多个文件的init，按照文件编译顺序执行
  - 多个包的顺序：
    - 先初始化被依赖的包（import的包）
    - 再初始化当前的包
    - 每个包内部：先全局变量初始化，再执行init方法

golang的多返回值怎么实现的
> https://tiancaiamao.gitbooks.io/go-internals/content/zh/03.2.html
- java中的方法只能有一个返回值，而go的方法可以有多个返回值
- go编译器在函数调用和栈布局上做了特别支持：
  - 多个返回值在调用者栈帧上连续分配空间
  - 被调用函数直接把结果写到这块栈空间
  - 编译器生成的调用指令会约定返回值的位置和数量

unitptr和unsafe.Pointer的区别
- unsafe.Pointer
  - 特殊类型的指针，可以转换为任意类型的指针，或者从任意类型的指针转换过来
  - 作用是在不同指针类型之间进行转换，但不做运算，GC会跟踪
  - 使用场景：类型间的强制转换、传入syscall或一些需要底层操作的地方
- uintptr
  - go的一种整数类型，本质上是足够大的无符号整数，可以存放一个指针的值（在32位平台上是uint32，在64位平台上是uint64）
  - 用于将指针转换为整数做运算，如地址偏移等，GC不会跟踪，因为只是一个数字
  - 使用场景：指针地址加减偏移量等底层操作（如内存对齐、手写内存管理等）、和unsafe.Pointer配合使用
- 实际使用：
```
addr := uintptr(unsafe.Pointer(&s)) + offset  //获取unsafe.Pointer转换为uintptr做地址偏移
p := (*someType)(unsafe.Pointer(addr))  //偏移结果转换为unsafe.Pointer，再转为具体指针类型
```

## Slice

数组和切片的区别
- 数组是固定长度的值类型，而切片是可变长度的引用类型，具体区别是：
  - 数组是固定长度的（`[N]T`）,长度在编译期固定，slice是不带长度的（`[]T`），长度和容量可变
  - 数组是值类型，复制会拷贝所有元素，slice是引用类型，复制后多个引用共享底层数组
  - 数组初始化所有元素为零值，slice初始化为nil或者空slice
  - 内存结构：数组元素直接存储在数组中，slice有三个字段：指针、长度、容量
  - 作为函数参数时，数组默认按值传递，slice默认按引用传递（底层数组共享），因此可以在函数中修改slice
  - 数组不可扩容，slice可以通过append扩容
  - 数组可以通过索引进行切片，切片的结果时slice，slice也支持切片
> `[3]int`和`[4]int`不是同一类型的，因为对于数组类型，长度也是类型的一部分，因此如果有这两个变量，不能相互赋值

slice的底层数据结构，扩容策略是什么
- slice是对数组的轻量级抽象，slice自身并不存储数据，而是通过slice header结构，引用底层数组的一部分
- 切片的底层数据结构可以理解为：
```go
type slice struct {
  array unsafe.Pointer //指向底层数组中起始元素的指针
  len   int            //当前切片的长度
  cap   int            //切片容量（从ptr当数组末尾能容纳多少元素）
}
```
- slice的扩容是在使用append()方法，当容量大于cap的时候自动发生的，扩容涉及内存重新分配、数据复制和容量增长策略
- 扩容的行为：
  - 分配一个更大的数组
  - 将原数组的数据拷贝到新的数组
  - 返回指向新数组的slice header
  - 原来的slice不变，和新的slice不共享数据
- 扩容策略（1.18之前）：
  - 当容量小于1024时，新容量=旧容量*2
  - 当容量大于等于1024时，每次增长25%，新容量=旧容量*1.25
  - 扩容序列为1-2-4-8-16-32-64-128-256-512-1024--1280-1600-2000...
- 扩容策略（1.18+采用平滑过渡算法）
  - 容量小于256时，新容量=旧容量*2
  - 容量大于等于256时，新容量=旧容量+(旧容量+3*256)/4
  - 特殊情况当期望容量大于当前容量的两倍，会直接使用期望容量
  - 扩容序列为1-2-4-8-16-32-64-128-256--512-848-1280-1792-2560...(考虑内存对齐)，增长比例从2逐渐向1.25递减
- 旧的扩容算法的问题：
  - 内存使用不够平滑，1024之前翻倍，之后急剧下降到1.25倍，长度1000的slice发生扩容会增长到2048，而1100长度的slice扩容只增长25%到1408
  - 256-1024之间大小的slice可能造成空间浪费，减小阈值可以一定程度减少浪费
- 新的扩容算法的作用：
  - 在小的slice上快速增长，减少扩容次数
  - 中等slice上避免过度分配
  - 大的slice上提供稳定的增长率
  - 最终保证更好的内存使用率
> https://juejin.cn/post/7136774425415794719

使用数组和slice作为参数的区别，slice作为参数传递有什么问题
- 数组和slice作为函数参数传递时：
  - 都是作为值传递，但是数组会进行数组拷贝，slice会拷贝slice header
  - 数组不共享底层数组，而切片传递的是slice header，因此共享底层数组
  - 函数中修改数组副本不会影响原来的数组值，但是修改slice会影响底层数组
  - 数组作为参数传递时消耗较大（复制数组），slice只复制header
- 切片的共享机制
  - 当多个副本共享底层数组，只要没发生扩容，一个副本修改元素会影响所有的
  - 当切片发生扩容，并超出容量，会创建一个新的底层数组，并拷贝旧的元素，返回新的slice header，因此与旧的slice不共享内存

从数组中获取一个相同大小的slice有成本吗
```go
arr := [5]int{1,2,3,4,5}
slice := arr[:]
```
- 这个操作的成本非常低，因为slice可以和原数组共享底层数组，并且只是创建一个slice头指向数组，只需要：
  - 设置ptr指针指向数组首地址
  - 设置len和cap为数组长度
  - 分配这个slice头结构体（对于64位系统，slice header实例是24字节，unsafe.Pointer是8个字节，可以表示64位的任意内存地址）
- 但是需要注意的是：
  - 内存共享：对slice的修改会影响原数组
  - 生命周期：slice会持有对整个数组的引用，可能影响GC
  - 容量固定：从数组创建的slice容量无法超过原数组（扩容会新建数组）

## map

哪些类型可以作为map的key
- golang中map的key必须是可比较的（comparable）
- 可以作为key的类型有：
  - 基本类型：bool、int、int8、int16、int32、int64、uint、uint8、uint16、uint32、uint64、uintptr、float32、float64、complex64、complex128、string
  - 复合类型：*T、chan T（比较的是底层的地址）、interface{}（只要动态值可比较）、数组[n]T（元素类型T必须可比较）、结构体类型（所有字段必须可比较）
- 不能作为key的类型：
  - 切片：[]T
  - map[k]V
  - 函数：func
  - 包含不可比较字段的结构体
> 在底层，interface包含两个部分：动态类型信息（Type）、动态值（Value）
> interface{}是空接口，是所有类型的超类型，可以存放任何值（基本类型、struct、slice、函数等）
> 使用interface{}作为key时，比较的是两个interface的动态类型和值，当动态类型的是可比较的，它的值就是可比较的
```go
m := make(map[interface{}]string)
m["hello"] = "string"
m[12] = "int"

key := []int{1,2,3}
m[key] = "slice"  //会报错：invalid map key type []int
```

map的底层数据结构（hmap，bucket，解决哈希冲突的方法，负载因子）
- map的底层结构是一个hmap结构体：
```go
type hmap struct {
  count     int    //当前存储的键值对的数量
  flags     uint8  //map的状态，指导读写、扩容等操作
  B         uint8  //2^B个bucket，即bucket的数量
  noverflow uint16
  hash0     uint32 //哈希函数的随机种子（防止DOS攻击）

  buckets    unsafe.Pointer //指向bucket数组
  oldbuckets unsafe.Pointer //扩容时旧的bucket
  nevacute   uintptr        //扩容过程中记录迁移进度
  extra      *mapextra      //存储溢出的bucket
}
```
- 桶（bucket）结构是bmap（动态定义的，因为key-value大小不固定）：
  - 每个bucket会存储最多8个键值对
  - 一个map是由2^B个bucket组成的数组
```go
type bmap struct {
  tophash  [8]uint8     //每个键的哈希高8位，用于快速判断是否存在
  keys     [8]KeyType
  values   [8]ValueType
  overflow *bmap        //溢出桶指针
}
```
- 哈希函数与桶定位
  - go使用一种稳定的哈希函数（根据key类型而定），将key转换为一个64位或者32位整数
  - 然后使用哈希值的低B位来定位bucket：`bucketIndex = hash & ((1 << B) - 1)`
- 冲突处理
  - 每个bucket最多存储8个键值对（通过tophash和key比较定位）
  - 超过8个会分配溢出桶（overflow bucket）
  - 溢出桶通过链地址法，形成一个链表结构，但go为了避免链表太长，扩容时会打散这些溢出桶
- map扩容机制
  - 当下面任一条件满足，会触发map的扩容：
    - 元素数量增长太多（负载因子超过6.5，即map元素数量超过0.65*桶数量）触发增量扩容，桶数量翻倍，重新哈希分布所有键值对
    - 溢出桶太多（>=2^min(B,15)）触发等量扩容，桶数量不变，重新整理数据，减少溢出桶
  - 扩容都是渐进式的，扩容期间读操作需要检查新旧两个桶，写操作触发渐进式迁移
- 因为map的哈希表结构设计动态分配、扩容、溢出桶、迁移等复杂操作，并且这些操作没有加锁，因此并发写时会造成结构不一致，最终导致运行时崩溃（panic）


使用map需要注意的点，是否并发安全
- golang的map不是并发安全的，如果有多个goroutine同时对一个map进行读写操作，会导致race condition，程序可能会panic或产生不可预期的结果
- 使用注意：
  - map需要先使用make或者:=初始化才能使用，否则是nil
  - map的key必须是可比较的类型
  - 在遍历的时候修改map是安全的，但是新添加的元素可能不会访问到
  - map的扩容会有性能开销，因此可以先预分配容量
  - map的并发安全问题可以使用sync.Mutex互斥锁或者sync.RWMutex读写锁来解决，或者使用sync.Map

map中删除一个key，它的内存会释放吗（内存标记与垃圾回收）
- 如果key-value时直接存储在map中的基本类型（如int、string等），删除后这些内存会标记为可回收
- 如果value是引用类型，删除key后，指针指向的对象是否释放取决于是否有其他引用
> 标记为可回收后需要等待GC扫描
> map的内部结构不会自动shrink（缩容），因此即使删除了很多元素，map的底层内存结构可能并不会减小
> 如果想要释放map的内存，需要重新分配一个map或者置为nil

map为nil和map为空的区别是什么（初始状态和内存占用，对增删改查的影响）
- map初始化的区别
  - 使用var声明一个map的值为nil，占用0字节（仅仅是一个nil指针），没有分配任何底层数据结构，不能直接使用
  - 使用make或:=创建的是一个空map，但是分配了hmap结构体（约48字节），并初始化bucket数组，可以直接使用
- 初始化过程（使用make创建长度为0的map）
  - 创建hmap结构体，，但是buckets的值为nil
  - B值为0（2^B=bucket数组长度）
  - 第一次插入元素时会分配初始的bucket数组
- 首次分配
  - 分配1个bucket（2^0=1）
  - 每个bucket可以存储最多8个key-value对
  - 每个bucket是一个包含8个槽位的数据结构

map的插入过程
- 前置检查
  - 检查h.flags是否有写标志（flags的值为0x01）
  - 如果有说明发生并发写入，触发panic
  - 否则设置h.flags为写标志，禁止并发访问
- 初始化检查
  - 如果buckets为nil，分配初始bucket数组
- 计算哈希值和bucket位置
  - go对于不同类型的key使用不同的哈希函数
  - 计算bucket的位置
```go
bucketMask := (1 << h.B) - 1  //数组长度为2^B
bucketIndex := hash & bucketMask  //取hash的低B位
```
- 判断是否需要扩容
  - 判断是否：负载因子>6.5（元素数量/bucket的数量）或者overflow bucket过多（哈希冲突严重）
  - 如果需要，则先执行扩容操作
- 查找插入位置
  - 遍历bucket的8个槽位，遍历的时候先根据tophash快速过滤不匹配的key
  - 当tophash值相等，再比较key相等，找到相同的key更新value
- 寻找空闲槽位
  - 如果没找到相同的key，则遍历bucket的槽位寻找空闲的位置
- 处理overflow bucket
  - 如果当前的bucket槽位都满了，则创建新的overflow bucket
  - 在新的bucket插入key-value，将map的count加一，并清除写标志

查找的过程
- 使用类型特定的哈希函数计算key的哈希值
- 使用哈希值的低B位确定bucket的编号，定位到对应的bucket
- 如果map正在扩容：
  - 如果旧的bucket没有完成迁移，先迁移当前桶，再进行查找
  - 如果已经完成迁移，在新的bucket中查找
- 计算tophash，将hash值的高8位作为tophash，遍历bucket的槽（8个）使用tophash快速过滤，然后再判断key相等，找到则返回value
- 如果没有找到对应的key，且overflow不为空，则继续遍历overflow指向的下一个bucket

map的渐进式扩容
- go的map的渐进式扩容不会一次把所有旧数据迁移到新的buckets中，而是边读写边迁移，避免卡顿
- 一次性迁移中，如果map很大（百万计），一次迁移要花较长时间，带来明显的延迟
- 触发扩容：
  - 负载因子过高（超过6.5）
  - 溢出桶过多
- 渐进式迁移机制：
  - 创建一个新的bucket数组（大小为原来的两倍）
  - 将原来的buckets指针保存到oldbuckets
  - 新数组赋值给buckets，设置nevacuate=0
  - 此时新旧buckets并存，并且每个桶有一个迁移标记记录该桶是否已经完成迁移
  - 接下来对每一次map的读写操作：
    - 优先检查操作对应的旧bucket是否已经迁移
    - 如果没有迁移，则触发该bucket的evacuate（迁移）操作
    - 将该bucket以及overflow中所有key/value重新计算hash，插入到新的桶中
    - 设置旧的bucket为已迁移（通过设置tophash的值为<4,正常的tophash>4），并将nevacuate++
    - 执行真正的读写操作
  - 当nevacuate等于旧的bucket的数量，则完成迁移，将oldbuckets置为nil，map扩容结束
> 对于写操作，除了迁移当前的bucket，还会额外迁移下一个连续的未迁移的bucket，来推进迁移的进度

如何保证所有的bucket都能被迁移
- 读操作会迁移当前的bucket，而写操作不仅迁移当前的bucket，还会顺序推进nevacute指向的下一个未迁移的bucket
- 跳跃式推进：
  - nevacute会跳过已经迁移的bucket，指向下一个未迁移的bucket
- 双重迁移保障
  - 每次会迁移当前访问的bucket（可以是任意编号）
  - 以及迁移nevacute指向的bucket，保证顺序覆盖

可以对map里的一个元素取地址吗
- 不能安全地对map中的元素取地址
- map是一个动态数据结构，元素在内存中消失或者重新分配：
  - map自动扩容，导致bucket重新分配，因此map元素的地址不是稳定的
  - map中的key/value不一定实际留在某个固定位置，而是可能被复制或移动

sync.Map是什么，它的锁机制和使用map加锁有区别吗
- sync.Map是go标准库中专门为并发读多写少的场景设计的并发安全的Map，不是简单的使用Mutex包围map，而是采用了分段锁（sharded locking）和无锁优化读
```go
type Map struct {
  mu     Mutex
  read   atomic.Value          //读缓存：map[interface{}]entry
  dirty  map[interface{}]entry //写缓存：只有在写入或者冲突时才用
  misses int
}
```
- read：一个只读的map，用原子操作访问，大多数读操作都命中这里，完全无锁
- dirty：可写map，在read命中失败时使用，写入、删除等操作都先写入这里
- mu：用户保护dirty和升级read（将新数据搬进来）
- 读流程：
  - 先从read查找，如果命中则返回（读操作大多数命中read）
  - 如果没命中则加锁访问dirty，如果命中则miss计数，miss过多则升级dirty->read（将dirty map替换成新的read）
- 写流程：
  - 加锁（mu.Lock()），修改dirty（写操作解锁，但是不会影响只读路径）
  - 如果key原本只在read中命中，会将其标记“已删除”（value有更新），然后复制到dirty

## interface

go语言和鸭子类型的关系
- 鸭子类型的核心理念：如果一只鸟走起来像鸭子，叫起来也像鸭子，那它就是鸭子
- 对于golang就是：一个类型实现了某个接口中定义的所有方法，就可以被视为实现了该接口

值接收者和指针接收者的区别，分别在什么时候使用
- go中接受者（receiver）是方法定义中的一个重要概念，是方法签名中类型名称前面的参数，指定了哪个类型可以调用这个方法
- 值接收者
  - 方法接收的是类型值的副本
  - 方法内部对接受者的修改不会影响原始值
  - 调用时会发生值拷贝
  - 适合只读操作或不需要修改原始数据的场景
- 指针接收者
  - 方法接收的是类型值的指针
  - 方法内部对接收者的修改会影响原始值
  - 避免了值拷贝，性能更好
  - 适合需要修改原始数据的场景
- 值类型接收者可以调用指针类型接收者的方法，go会自动取地址
- 指针类型接收者可以调用值类型接收者的方法，go会自动解引用
> 但是对于接口类型赋值会有问题：指针类型接收者可以使用值接收者的方法，反之不行，即：
> 值类型T方法的方法集，只包含值接收者的方法
> 指针类型*T的方法集，包含值接收者和指针接收者的所有方法

iface和eface的区别是什么
- go中的iface和eface是两种不同的接口内部表示结构，主要区别是：
- eface（empty interface）
  - 表示空接口interface{}
  - 结构简单，只包含两个字段:
    - _type：指向具体类型的指针
    - data：指向实际数据的指针
  - 由于空接口没有方法约束，所以不需要存储方法表信息
  - 常用于泛型编程、容器类型、JSON序列化等
- iface（interface with methods）
  - 表示包含方法的接口
  - 结构更复杂，包含：
    - tab：指向接口表（itab）的指针，包含类型信息和方法表
    - data：指向实际数据的指针
  - itab结构包含：
    - 接口类型信息
    - 具体类型信息
    - 方法调用表（虚函数表）
  - 常用于多态和抽象、中间件、依赖注入等
- 性能差异
  - eface更轻量，不需要维护方法表
  - iface需要额外的方法查找和调用开销
  - 类型断言时，eface只需要检查类型，iface还需要检查方法实现
- 这种设计可以让go高效地处理不同类型的接口，用于不同的场景
```go
type eface struct {
  _type *_type         //动态类型
  data  unsafe.Pointer //指向动态值
}

type iface struct {
  tab *itab           //包含动态类型和方法表
  data unsafe.Pointer //指向动态值
}
```

接口的动态类型和动态值
- 动态类型和动态值共同构成了接口的运行时表示
- 动态类型
  - 接口变量当前实际存储的具体类型
  - 在运行时确定，可以改变
- 动态值
  - 接口变量当前实际存储的具体值
  - 与动态类型对应的实际数据
- 动态类型可能是int、string、struct等类型，动态值可能是具体的int、string、struct实例等值
- nil接口（只用var声明）的动态类型和动态值都是nil

编译器自动检测类型是否实现接口
- go编译器会在编译时检查类型是否实现了接口
- 也可以显示地检查接口实现，`var _ Writer = (*MyFile)(nil)`或者`var _ Writer = MyFile{}`可以检查*MyFile或MyFile是否实现了Writer接口

类型转换和断言的区别
- 类型转换是在编译时进行的，用于在已知的类型之间进行转换
  - `T(value)`用于把value转换为类型T
- 类型断言是在运行时进行的，用于从接口类型中提取具体的类型
```go
// 将接口类型值value中提取为类型T
value, ok := value.(T) //安全断言
value := value.(T) //不安全断言，失败会panic
```

如何使用接口实现多态
```go
type Animal interface {
    Speak() string
    Move() string
}

// 定义Dog实现Animal
// 定义Cat实现Animal
// 定义Bird实现Animal

func MakeAnimalSpeak(animal Animal) {
  animal.Speak()
  animal.Move()
}

func main() {
  MakeAnimalSpeak(Dog{})
  MakeAnimalSpeak(Cat{})
  MakeAnimalSpeak(Bird{})
}
```

go的接口的特点
- 隐式实现：golang的接口实现是隐式的，不需要显示声明实现某个接口，只要类型实现了接口中定义的所有方法，就自动实现了该接口
- Duck Typing：遵循“如果它走起来像鸭子，叫起来像鸭子，那它就是鸭子”的原则，关注的是行为而不是类型声明
- 组合型：接口可以嵌入到其他的接口中，形成新的接口，这种组合比继承更灵活
- 零值：接口的零值是nil，可以用来判断接口是否被赋值（赋值后即使value是nil，但是type不是nil）
- 动态类型：接口在运行时可以持有任何实现了该接口的具体类型
- 接口比较：接口的比较基于动态类型和动态值，且值的类型必须可比较，当动态类型和动态值相等时接口相等

接口的构造过程是怎样的

接口转换的原理

## go runtime

go runtime是什么
- go的运行时系统（runtime）是go的核心组成部分，负责管理goroutine的调度（GMP）、垃圾回收、内存分配、系统调用等底层操作

使用goroutine的注意事项
- 内存泄漏和生命周期管理：goroutine不会被自动回收，如果创建的goroutine没有正常退出，会导致内存泄漏，因此
  - 确保goroutine有明确的退出条件
  - 避免创建永远不会结束的goroutine
  - 使用context.Context来控制goroutine的生命周期
- 并发安全：多个goroutine访问共享数据时需要同步
  - 使用sync.Mutex、sync.RWMutex等锁机制
  - 优先使用channel进行通信而不是共享内存
  - 避免数据竞争
- Panic处理：goroutine中的panic不会被主程序捕获，因此需要额外处理
- 控制goroutine的数量：避免无限制地创建goroutine
  - 使用工作池模式
  - 使用带缓冲的channel控制并发数
  - 考虑使用semaphore限制并发
- 正确使用waitgroup：等待goroutine完成时要正确使用sync.WaitGroup
- 避免闭包的陷阱：在for-range中启动goroutine需要注意变量捕获
- 使用select处理多个channel，避免goroutine阻塞

## GMP

进程、线程、协程之间的区别
- 进程
  - 操作系统资源分配的最小单位
  - 每个进程拥有独立的内存空间、文件描述符、堆栈、代码段等资源
  - 不同进程之间不直接共享内存
  - 创建/切换的成本较高
- 线程
  - CPU调度的基本单位
  - 线程属于某个进程，同一个进程的多个线程共享进程的资源（内存、文件等）
  - 创建/切换的成本比进程小，但是仍需要操作系统管理（上下文切换、栈、寄存器等）
- 协程
  - 用户态的轻量级线程，不由操作系统调度，而是由语言自身调度器（go runtime）管理
  - 每个协程有自己的栈
  - 切换成本极低，不涉及内核态操作，适合大规模并发
  - 可以主动让出控制权（非抢占式，也可以抢占）

GMP模型是什么，GMP如何工作的
- GMP模型是go实习爱你并发调度的核心机制，包括：
  1. Goroutine：使用go func()创建的轻量级线程（协程），代表一个要执行的并发任务
     - 每个Goroutine有自己的栈和相关的上下文信息
     - Goroutine的创建销毁由GMP模型负责管理
  2. Machine：真正的内核线程（OS thread），由Go runtime创建或复用，是调度器中的执行线程，负责将Goroutine映射到操作系统线程上
     - Machine负责执行Goroutine，但是不能独立调度，需要Processor的支持
     - 一个Machine只能绑定一个Processor才能执行Goroutine
     - Machine与操作系统直接打交道，例如阻塞系统调用、网络I/O等
  3. Processor：逻辑处理器，包含调度Goroutine所需的上下文和运行队列，负责组织、调度、管理Goroutine的运行（到Machine上运行），控制最大并发度
     - 每个Processor维护一个Goroutine的本地队列，调度器从这里获取Goroutine给Machine执行
     - 启动go程序时，会设置GOMAXPROCS来决定P的数量（默认为CPU核数）
     - Processor不能多于GOMAXPROCS，数量决定并发能力
- GMP完整的调度流程为：
  1. 开始执行时，Go创建多个Processor（数量为GOMAXPROCS）
  2. 每个Processor拥有一个Goroutine的本地队列
  3. Machine获取一个可用的Processor
  4. Machine从Processor的本地队列中取出一个Goroutine并开始执行
  5. 如果当前Machine在执行的Goroutine被阻塞（比如系统调用），该Machine会解绑Processor，其他空闲的Machine可以继续使用这个Processor
  6. Goroutine被执行完后，Machine会继续获取下一个Goroutine执行
  7. 如果Processor本地队列为空，Processor会尝试从其他Processor那里偷来Goroutine（work stealing）来保持高利用率

什么是Goroutine的抢占式调度，它是如何实现的
- 抢占式调度是指调度器在运行中能强制中断正在执行的Goroutine，把执行权交给其他的Goroutine，而不是一直等当前的Goroutine让出CPU
- 为什么需要抢占：
  - 如果某个goroutine一直占用CPU（如死循环），不会主动让出CPU，会导致其他goroutine得不到调度，系统整体响应变差
- 抢占式调度的机制：
  - 当一个goroutine主动调用了一个可能阻塞的操作（如channeld的读写），运行时系统会在这个时间点进行抢占
  - 当一个Goroutine的时间片用尽，即执行时间超过了一定的阈值，运行时系统会中断该goroutine的执行，切换到其他可运行的Goroutine的上继续执行
  - 当一个Goroutine主动调用runtime.Gosched()方法，它会主动让出当前Goroutine的执行权

goroutine的窃取机制是什么，怎么实现的
- goroutine窃取机制是go调度器来让所有的Processor的负载均衡，当一个Processor的本地队列空了，而全局队列也没有goroutine时，就会去其他Processor的队列中窃取一半的goroutine来执行，保证CPU利用率和负载均衡

gorontine在什么情况下会阻塞
- channel操作阻塞
  - 发送阻塞：goroutine在往无缓冲通道或满缓冲通道发送数据时，没有接收者
  - 接收阻塞：从空通道接收数据时，没有发送者
- 锁竞争阻塞
  - 如果一个goroutine尝试获取一个已经被其他goroutine持有的锁，就会阻塞等待
```
var mu sync.Mutex

func criticalSection() {
    mu.Lock()
    defer mu.Unlock()
    // 临界区
}

func main() {
    go criticalSection()
    go criticalSection() // 如果上面还没释放锁，这里会阻塞
}
```
- 条件变量等待阻塞
  - 当goroutine调用cond.Wait()时，它会阻塞直到被cond.Signal()或者cond.Broadcast()唤醒
- select中的case阻塞
  - 当select中的所有channel都无法进行时，select会阻塞


## channel

CSP模型是什么，golang中如何使用的
-  CSP（Communicationg Sequential Processes）是一种并发编程模型，主要描述多个独立进程之间如何通过通信进行协作，其思想是进程之间不共享内存，而是通过通信来共享信息
-  CSP模型的核心概念：
   -  进程：独立执行的逻辑单元，类似goroutine、线程等
   -  通道：进程之间通信的媒介，允许发送/接收数据
   -  通信：进程之间通过通道发送或接收数据，实现同步与协作
-  CSP模型的优点：
   -  没有共享内存，避免了传统共享内存并发中的锁竞争和数据一致性问题
   -  模型简答清晰，并发实体只需要处理自己的逻辑和通信协议，不用关注全局状态和锁机制
   -  CSP提供了可以形式化建模的框架，可以进行并发系统的验证，如检测是否可能发生死锁和通信错误
   -  便于测试和推理
   -  易于扩展和维护
   -  支持形式化验证
-  CSP模型的缺点：
   -  通信通常是同步阻塞的，容易出现性能瓶颈
   -  如果通信顺序不当，仍然可能出现死锁
   -  如果多个进程频繁共享大数据，传输效率低

channel的底层原理
> https://juejin.cn/post/6844903821349502990
- 代码中创建的`ch := make(chan int)`中，`ch`是一个引用类型，其底层的结构体是`runtime.hchan`（heap channel，分配在堆上），主要包括：
  - `qcount`：当前缓冲区元素的数量
  - `datasiz`：缓冲区的容量
  - `buf`：用于有缓冲的channel，用来存储缓冲数据，是循环数组
  - `elemsize`：每个元素的大小
  - `close`：标识channel是否已经关闭（1）
  - `elemtype`：元素类型指针，管理GC数据
  - `sendx`/`recvx`：发送/接收时使用的`buf`数组索引，用于实现环形缓冲区
  - `recvq`/`sendq`：分别是接收和发送goroutine的等待队列（阻塞在channel上的协程）
  - `lock`：互斥锁，保护channel的并发安全性
- 缓冲机制：环形队列
  - 发送数据时，将数据放入`buf[sendx]`，然后`sendx=(sendx+1)%dataqsiz`
  - 接收数据时，从`buf[recvx]`取出数据，然后`recvx=(recvx+1)%dataqsiz`
- 无缓冲channel：dataqsiz为0，所有的发送必须等待接收，即同步channel
- 等待队列机制：阻塞协程
  - `recvq`和`sendq`是链表结构（waitq）
  - 如果缓冲区满了，发送协程就会被挂入`sendq`
  - 如果缓冲区空了，接收协程就会被挂入`recvq`

channel是否线程安全，锁用在什么地方
- channel是并发安全的，可以使用多个goroutine同时对同一个chan进行读写，且不用额外加锁
- chan加锁的情况（slow-path）
  - 缓冲区满的时候会加锁阻塞发送
  - 缓冲区为空的时候会加锁阻塞接收
  - 多个发送者或者接收者同时操作会加锁
  - channel关闭会加锁，确保没有写入冲突
- 不加锁的情况（fast-path）
  - 无缓冲的channel，且只有一个发送者和接收者
  - 有缓冲的channel，在缓冲没满时发送
  - 有缓冲的channel，在缓冲非空的时候接收
  - channel只在一个goroutine中使用
- channel会先尝试走fast-path：
  - 是否有可用缓冲
  - 是否有等待的goroutine
  - 是否数据可以直接交换
- fast-path不满足才会进入slow-path

nil、关闭的channel、有数据的channel，再进行读、写、关闭会怎么样
- channel为nil（`var ch chan int`）：
  - 发送数据会永远阻塞
  - 接收数据会永远阻塞
  - 关闭会导致panic
- 已经关闭的channel：
  - 发送会导致panic
  - 接收会立即返回零值和ok=false
  - 再次关闭会panic
- 有数据的channel：
  - 发送成功或者阻塞
  - 读取成功或者阻塞
  - 可以正常关闭

向channel发送数据和读取数据的流程是什么
- 发送数据的流程
  1. 判断channel是否为nil
  2. fast-path
     - 缓冲区未满，写入缓冲，返回
     - 无缓冲且有等待的接收者，唤醒接收者
  3. slow-path
    - 加锁
    - 检查channel close
    - 检查recvq是否匹配，是则传值，唤醒接收者
    - 否则判断阻塞，如果阻塞则把当前goroutine封装为sudog，挂入sendq，挂起调度
    - 解锁
- 读取数据的流程
  1. 判断channel是否为nil
  2. fast-path
     - 缓冲区非空，从buf取值
     - 无缓冲且sendq非空，与发送者配对，直接拿值
  3. slow-path
     - 加锁
     - 检查closed且无数据，返回零值和ok=false
     - 检查sendq，有则配对拿值
     - 缓冲区非空，从buf拿值
     - 否则判断如果允许阻塞，挂入recvq，挂起goroutine
     - 解锁

channel在什么情况下会引起资源泄露
- channel阻塞，goroutine被永久挂起（发送的数据没有接收者）
- 接收端永远等待数据，导致goroutine阻塞
- 未关闭的channel导致下游goroutine阻塞
- select阻塞在没有发送或者关闭的channel
- 无缓冲的channel在发送或接收异常退出（如主gorouotine退出，子goroutine永远挂起）

select的原理和一些特性（项目中怎么使用的select）
- select是一个专门用于处理多个channel操作的控制结构，类似于switch，是专门为channel设计的，可以使用select同时监听多个channel的读写操作，一个某个操作可以继续执行，就会执行响应的分支
- select的规则：
  - 并发监听多个channel，select会阻塞直到某个case准备好，如果有多个case可以执行，会随机选择一个
  - 如果所有的case都没准备好，但存在default，会立即执行default，可以用来实现非阻塞的操作
  - 添加一个case使用time.After可以实现超时控制

有缓存的channel和无缓存的channel

channel的读写特性

channel的底层实现原理（数据结构）

## context

context是什么，为什么需要context，context的结构是什么
- go中context是用来在多个goroutine之间传递取消信号、超时控制、截止时间和请求范围内的共享数据的一种标准机制
- 多个goroutine处理同一个请求时，就需要：
  - 统一取消所有关联的goroutine（如请求超时或者用户取消）
  - 传递截至时间（deadline）
  - 传递请求相关的元数据（如身份认证信息、Trace ID）
  - 避免goroutine泄露（内存泄漏）
- Context是一个interface，包含以下方法：
  - `Deadline() (deadline time.Time, ok bool)`返回截至时间
  - `Done() <-chan struct{}`返回一个channel，关闭代表取消信号
  - `Err() error `取消原因
  - `Value(key interface{}) interface{}`传递的键值对数据

context有哪些使用场景和用途，有哪些常用的方法
- 使用场景
  - 控制HTTP请求的生命周期
  - 数据库查询超时控制
  - 微服务RPC通信的trace和取消传递
  - 并发任务取消
  - 信号相应和服务优雅关闭
- 常用方法：
  - `context.Background()`生成空的用不取消的context，通常作为顶层context
  - `context.TODO()`临时使用的context
  - `context.WithCancel(parent)`可取消的context
  - `context.WithTimeout(parent, timeout)`带超时的context
  - `context.WithDeadline(parent, deadline)`带截止时间的context
  - `context.WithValue(parent, key, val)`带键值对数据的context

## 内存分配与垃圾回收

垃圾识别算法
- 引用计数法
- 可达性分析法

垃圾清理算法
- 标记清除法
- 标记复制法
- 标记压缩法

## 内存优化

## 性能分析
