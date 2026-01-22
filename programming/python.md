## Python语言特性

### 1. 数据类型和函数参数传递

#### 常见数据类型

1. 不可变类型（Immutable）
   - 数字（Number）
     - int：整数类型，支持任意精度的整数表示
     - float：浮点数类型，表示实数，通常使用双精度
     - complex：复数类型，表示实数和虚数组成的数
     - bool：表示True和False两种值，是int的子类
   - 字符串（str）：不可变的字符序列，支持Unicode字符
   - 元组（tuple）：有序的不可变序列，可以包含不同类型的
   - 冻结集合（frozenset）：不可变的集合类型，支持集合操作但不能修改内容
2. 可变类型（Mutable）
   - 列表（list）：有序的可变序列，可以包含不同类型的元素
   - 字典（dict）：无序的键值对集合，键必须是不可变类型
   - 集合（set）：无序的不重复元素集合，支持集合操作

#### 参数传递机制

python的参数传递方式不是传统的值传递，也不是单纯的引用传递，而是对象引用传递或赋值传递，python中的一切都是对象，变量只是指向这些对象的引用

- 不可变对象
  - 在传递int、str、tuple、float等不可变对象时，表现类似值传递，在函数内部修改参数不会影响外部变量
  - 原理是因为对象不可变，任何修改操作都会创建一个新的对象，并将函数内的局部变量指向新对象，原来对象不变
- 可变对象
  - 在传递list、dict、set等可变对象时，表现类似于引用传递，在函数内部修改参数会影响外部变量
  - 原理是外部和内部变量指向同一个内存地址，直接修改对象内容会影响外部变量

> 对比go是值传递，即永远为变量创建一个副本传递，基本类型拷贝值，引用类型拷贝引用地址，指针类型则拷贝指针地址
> Python中所有变量都是引用，不区分值变量和指针变量，传递的都是引用地址，但不可变对象的修改会创建新对象，从而表现出类似值传递的效果
> Go坚持显式的按值传递，通过指针副本实现对原数据的修改；而Python是隐式的对象引用传递，行为差异是由对象的不可变性（Immutability）决定的

#### 参数类型与顺序

函数参数的定义顺序：

1. 必选参数
   - 调用时按顺序传递，数量必须完全匹配。例如`def func(a, b, c):`
2. 默认参数
   - 定义时指定默认值，调用时可省略，省略时使用默认值。例如`def func(a, b=2, c=3):`
3. 可变参数（*args）
   - 用于传递任意数量的位置参数，函数内部以元组形式接收

    ```python
    def func(a, b=2, *args):
        return a + b + sum(args)

    print(func(1, 4, 5, 6))  # 输出16
    ```

4. 关键字参数（**kwargs）
   - 用于传递任意数量的关键字参数，函数内部以字典形式接收

    ```python
    def func(a, **kwargs):
        return a + sum(kwargs.values())
    
    print(func(1, b=4, c=5))  # 输出10
    ```

#### 函数默认参数

定义时求值：默认参数只在函数定义执行时求值一次，而不是每次调用时求值
`my_list`这个引用指向的列表对象被存储在函数定义时的内存地址中（`__default__`属性中），只要函数对象不销毁，列表就会一直存在并被复用

```python
def append_to_list(val, my_list=[]):
    my_list.append(val)
    return my_list

print(append_to_list(1))
print(append_to_list(2))  # 注意输出 [1,2]
```

标准做法是使用None作为默认值，并在函数内部进行惰性初始化

```python
def append_to_list(val, my_list=None):
    if my_list is None:
        my_list = []
    my_list.append(val)
    return my_list

print(append_to_list(1))
print(append_to_list(2))  # 注意输出 [2]
```

#### 关键字参数

关键字参数允许在函数调用时通过参数名来传递参数，顺序可以任意

```python
def func(a, b=2, c=3):
    return a + b + c

print(func(1, c=4))  # 输出7
```

仅限关键字参数允许在函数定义时指定某些参数只能通过关键字传递，`*`放在参数列表中，`*`后面的参数必须使用关键字传递

```python
def func(a, *, b=2, c=3):
    return a + b + c

print(func(1, b=4))  # 输出7
print(func(1, 2, 3)) # ERROR
```

`*args`本身就起到了分隔符的作用，因此`*args`后面的参数默认就是仅限关键字参数

### 2. 面向对象编程

### 封装继承和多态

#### self和cls

`self`和`cls`是Python类中常用的约定关键字，分别用于表示实例对象和类对象，`self`指向实例，而`cls`指向类

当定义一个普通实例方法的时候，第一个参数必须是`self`，表示调用该方法的实例对象，调用该方法时，Python会自动将实例对象作为第一个参数传递给方法

```python
class MyClass:
    def __init__(self, value):
        self.value = value

    def instance_method(self):
        return "This is an instance method"

obj = MyClass(10)
print(obj.instance_method())  # 通过实例调用
```

当定义一个类方法的时候，第一个参数必须是`cls`，表示调用该方法的类对象，调用类方法时，Python会自动将类对象作为第一个参数传递给方法

#### 实例变量和类变量

实例变量是属于某个具体对象的数据：

- 通常在`__init__`方法中通过`self.`定义
- 每个对象都有自己独立的内存空间，存储在实例的`__dict__`属性中

```python
class MyClass:
    def __init__(self, value):
        self.instance_variable = value  # 实例变量
```

类变量是属于类本身的数据：

- 在类体内、方法体外定义，不使用`self.`，通过类名或实例访问
- 所有实例共享同一个类变量，存储在类的`__dict__`属性中

```python
class MyClass:
    class_variable = 0  # 类变量
    def __init__(self, name):
        self.instance_variable = name  # 实例变量
        MyClass.class_variable += 1  # 访问类变量
```

#### 静态方法和类方法

静态方法：

- 在类命名空间中的函数，使用`@staticmethod`装饰器定义，不接收`self`也不接收`cls`参数
- 静态方法的调用不依赖于类实例，可以通过类名或实例调用，不能访问类或实例的属性和方法

```python
class MyClass:
    @staticmethod
    def static_method():
        return "This is a static method"

print(MyClass.static_method())  # 通过类名调用
```

类方法：

- 与类绑定的方法，使用`@classmethod`装饰器定义，第一个参数是`cls`，表示类本身（而不是实例`self`）
- 可以访问和修改类属性，但不能访问实例属性

```python
class MyClass:
    class_variable = 0

    @classmethod
    def class_method(cls):
        cls.class_variable += 1
        return cls.class_variable

print(MyClass.class_method())  # 输出1
print(MyClass.class_method())  # 输出2
```

区别在于：

- 静态方法不接收类或实例作为参数，不能访问类或实例的属性和方法
- 类方法接收类`cls`作为第一个参数，可以访问和修改类属性，但不能访问实例属性

### Python自省

#### 自省机制

自省（Introspection）就是程序在运行时能够知道自己是什么、拥有哪些属性和方法的能力，作用是在程序运行时：

- 检查对象是否有某个属性或方法
- 检查函数接收的参数
- 在运行时动态地给类增加方法

常用的自省函数和方法：

- 基础检查
  - `type(obj)`：获取对象类型
  - `id(obj)`：获取对象的唯一标识符（内存地址）
  - `isinstance(obj, Class)`：检查对象是否是某个类的实例
- 属性检查
  - `dir(obj)`：列出对象的所有属性和方法
  - `hasattr(obj, 'attr')`：检查对象是否有某个属性
  - `getattr(obj, 'attr', default)`：获取对象的属性值
  - `setattr(obj, 'attr', value)`：设置对象的属性值
  - `delattr(obj, 'attr')`：删除对象的属性
- 其他检查
  - `obj.__dict__`：获取对象的属性字典
  - `obj.__class__`：获取对象的类
  - `callable(obj)`：检查对象是否可调用（函数或方法）

### 和go反射的对比

相似之处都是在编写代码时，不知道对象的具体类型和属性，但在程序运行时，可以动态地去检查和操作，常用在序列化/反序列化、依赖注入等场景

区别在于：

- Python是动态执行（解释型语言）的，编译为字节码由PVM解释执行，为了支持动态特性必须在运行时保留完整的元数据，自省是对在内存中已经存在对象，可以直接检查和操作对象的属性和方法
- Go是静态编译的，在编译成二进制文件后，变量的名称、字段的结构等信息会被丢弃，反射是通过特殊的机制（类型描述符）把编译时丢掉的信息在运行时重新关联起来

---

字典推导式

单下划线和双下划线

字符串格式化

迭代器和生成器

`*args`和`**kwargs`

面向切面编程AOP和装饰器

鸭子类型

新式类和旧式类

`__new__`和`__init__`的区别

单例模式

python中的作用域

GIL线程全局锁

协程

闭包

lambda函数

函数式编程

python的拷贝

垃圾回收机制

python的List

`is`和`==`

read、readline和readlines的区别

super init

range和xrange的区别
