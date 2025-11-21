# 环境配置

## Ubuntu

```bash
sudo apt update
sudo apt install build-essential gdb

g++ -v # 查看g++版本
```

build-essential是C/C++多个包组合起来的工具链，安装build-essential会自动安装：

- gcc：C编译器
- g++：C++编译器
- make：构建工具（执行makefile）
- libc6-dev：C语言运行所需的头文件和库
- binutils：链接器、汇编器等工具

gbd是GNU调试器，用于断点调试、单步执行等

## 编译运行

```cpp
#include <iostream>
using namespace std;
int main()
{
    cout << "Hello, world!" << endl;
    return 0;
}
```

```bash
g++ hello.cpp -o hello
./hello
```

# C++基础

## 数据类型

- 字符类型

| 类型     | 描述         | 大小     | 示例                 |
| -------- | ------------ | -------- | -------------------- |
| char     | 字符类型     | 1字节    | char ch = 'A';       |
| wchar_t  | 宽字符类型   | 2或4字节 | wchar_t wch = L'A';  |
| char16_t | 16位字符类型 | 2字节    | char16_t c16 = u'A'; |
| char32_t | 32位字符类型 | 4字节    | char32_t c32 = U'A'; |

- 整数类型

| 类型      | 描述     | 大小     | 示例                    |
| --------- | -------- | -------- | ----------------------- |
| short     | 短整型   | 2字节    | short int s = 100;      |
| int       | 整型     | 4字节    | int i = 1000;           |
| long      | 长整型   | 4或8字节 | long int l = 100000;    |
| long long | 长长整型 | 8字节    | long long ll = 1000000; |

- 浮点类型

| 类型        | 描述           | 大小           | 示例                     |
| ----------- | -------------- | -------------- | ------------------------ |
| float       | 单精度浮点型   | 4字节          | float f = 3.14f;         |
| double      | 双精度浮点型   | 8字节          | double d = 3.1415926535; |
| long double | 扩展精度浮点型 | 10、12或16字节 | long double ld = 3.14L;  |

- 其他类型

| 类型      | 描述       | 大小           | 示例                    |
| --------- | ---------- | -------------- | ----------------------- |
| bool      | 布尔类型   | 1字节          | bool flag = true;       |
| void      | 空类型     | 0字节          | void func();            |
| nullptr_t | 空指针类型 | 与指针大小相同 | nullptr_t np = nullptr; |

> auto和decltype用于类型推导，auto根据初始化表达式推导类型，decltype根据变量或表达式的类型推导

## 类型修饰符

| 修饰符       | 描述                                     | 示例                    |
| ------------ | ---------------------------------------- | ----------------------- |
| signed       | 指定有符号类型                           | signed int si = -10;    |
| unsigned     | 指定无符号类型                           | unsigned int ui = 10;   |
| short        | 指定短整型                               | short int s = 100;      |
| long         | 指定长整型                               | long int l = 100000;    |
| const        | 表示常量，值不可修改                     | const int b = 5;        |
| static       | 表示静态存储期，变量在程序生命周期内存在 | static int a = 0;       |
| volatile     | 表示变量可能被意外修改，禁止编译器优化   | volatile int c = 10;    |
| mutable      | 表示类成员可以在 const 对象中被修改      | mutable int counter;    |
| extern       | 表示变量或函数在其他文件中定义           | extern int d;           |
| thread_local | 表示变量为线程局部存储                   | thread_local int t_var; |

## 派生数据类型

| 数据类型 | 描述                                   | 示例                             |
| -------- | -------------------------------------- | -------------------------------- |
| 数组     | 相同类型元素的顺序集合                 | int arr[5] = {1,2,3,4,5};        |
| 指针     | 保存变量(或对象)的内存地址             | int* p = &x;                     |
| 引用     | 变量的别名(必须初始化,不可更换指向)    | int& r = x;                      |
| 枚举     | 用户定义的命名整数常量集合             | enum Color { RED, GREEN, BLUE }; |
| 函数     | 函数类型(仅有返回类型与参数类型的签名) | int func(int a, int b);          |
| 结构体   | 聚合类型,成员默认 public               | struct Point { int x; int y; };  |
| 类       | 自定义类型,支持封装/继承/多态          | class MyClass { /*...*/ };       |
| 联合体   | 多成员共享同一内存,一次仅有效一个成员  | union Data { int i; float f; };  |

> 此外还可以算上类型别名、模板类型、auto和decltype推导类型

## 常用数据结构

### 数组array

- 基本类型

```cpp
int arr[5] = {1, 2, 3, 4, 5}; //创建数组
std::cout << arr[0]; //访问元素
arr[1] = 10; //修改元素

//多维数组
int matrix[2][3] = {{1, 2, 3}, {4, 5, 6}};
std::cout << matrix[1][2]; //访问多维数组元素

//遍历数组
for (int i = 0; i < 5; i++) {
    std::cout << arr[i] << " ";
}

//获取数组大小
size_t size = sizeof(arr) / sizeof(arr[0]);
```

- std::array

```cpp
std::array<int, 5> arr = {1, 2, 3, 4, 5}; //创建 std::array
std::cout << arr[0]; //访问元素
arr[1] = 10; //修改元素 

//遍历 std::array
for (size_t i = 0; i < arr.size(); i++) {
    std::cout << arr[i] << " ";
}

//获取数组大小
size_t size = arr.size();
```

### 字符串string

```cpp
std::string str = "hello"; //创建字符串
str += " world"; //字符串拼接

std::cout << str.length(); //获取字符串长度
std::cout << str.substr(0, 5); //子字符串

//访问字符
char ch = str[0]; 
//遍历字符串
for (char c : str) {
    std::cout << c << " ";
}

//查找字串
size_t pos = str.find("ll");

//string转int
int num = std::stoi("123");
//string转long
long lnum = std::stol("1234567890");
//string转float
float fnum = std::stof("3.14");
//string转double
double dnum = std::stod("3.14159");
//int转string
std::string numStr = std::to_string(456);
```

### 动态数组vector

```cpp
std::vector<int> vec = {1, 2, 3}; //创建动态数组
std::vector<std::vector<int>> matrix = {{1, 2, 3}, {4, 5, 6}}; //二维动态数组

vec.push_back(4); //添加元素到末尾
vec.pop_back(); //删除最后一个元素
std::cout << vec.size(); //获取大小
vec.clear(); //清空动态数组

//访问元素
int first = vec[0];
//遍历动态数组
for (int v : vec) {
    std::cout << v << " ";
}

//插入元素
vec.insert(vec.begin() + 1, 10); //在索引1位置插入10
//删除元素
vec.erase(vec.begin() + 2); //删除索引2位置的元素
//查找元素
auto it = std::find(vec.begin(), vec.end(), 3);
if (it != vec.end()) {
    std::cout << "Element found at index: " << std::distance(vec.begin(), it) << std::endl;
}

// 获取子向量
std::vector<int> subVec(vec.begin() + 1, vec.begin() + 4); // 从索引1开始，取3个元素

// 排序
std::sort(vec.begin(), vec.end());
// 降序排序
std::sort(vec.begin(), vec.end(), std::greater<int>());
// 自定义排序
std::sort(vec.begin(), vec.end(), [](int a, int b) {
    return a > b; // 降序排序
});
```

### 哈希表unordered_map

```cpp
std::unordered_map<std::string, int> hashmap; //创建哈希表

hashmap["apple"] = 1; //插入键值对
hashmap.erase("apple"); //删除键值对
std::cout << hashmap["apple"]; //访问值
std::cout << hashmap.size(); //获取大小

//遍历哈希表（只读）
for (const auto& pair : hashmap) {
    std::cout << pair.first << ": " << pair.second << std::endl;
}

//判断键是否存在
if (hashmap.find("apple") != hashmap.end()) {
    //键存在
}
if (hashmap.count("apple") > 0) {
    //键存在
}
if (hashmap.contains("apple")) {
    //键存在
}
```

> std::map是有序的，遍历时按键排序；std::unordered_map是无序的，遍历顺序不确定但插入和查找更快，使用方法类似

### 集合unordered_set

```cpp
std::unordered_set<int> hashset; //创建哈希集合
hashset.insert(1); //插入元素
hashset.erase(1); //删除元素
std::cout << hashset.size(); //获取大小

//检查元素是否存在
if (hashset.find(1) != hashset.end()) {
    //元素存在
}
if (hashset.count(1) > 0) {
    //元素存在
}
if (hashset.contains(1)) {
    //元素存在
}

//遍历哈希集合
for (const int& val : hashset) {
    std::cout << val << " ";
}
```

> std::set是有序的，遍历时按元素排序；std::unordered_set是无序的，遍历顺序不确定但插入和查找更快，使用方法类似

### 栈和队列

```cpp
// 栈
std::stack<int> stk; //创建栈
stk.push(1); //入栈
stk.pop(); //出栈
std::cout << stk.top(); //访问栈顶元素
std::cout << stk.size(); //获取栈大小

// 队列
std::queue<int> que; //创建队列
que.push(1); //入队
que.pop(); //出队   
std::cout << que.front(); //访问队头元素
std::cout << que.size(); //获取队列大小
```

## 标准库方法

### iostream

- cin
- cout
- clog
- cerr

```cpp
#include <iostream>

int x;
std::cin >> x; //输入
std::cout << x << std::endl; //输出
std::clog << "Log message" << std::endl; //日志输出
std::cerr << "Error message" << std::endl; //错误输出
```

### algorithm

- sort
- reverse
- for_each
- find
- max
- min

```cpp
#include <algorithm>
#include <vector>
std::vector<int> vec = {3, 1, 4, 1, 5};

std::sort(vec.begin(), vec.end()); //排序
std::reverse(vec.begin(), vec.end()); //反转
std::for_each(vec.begin(), vec.end(), [](int v) {
    std::cout << v << " ";
}); //for-each 循环遍历
auto it = std::find(vec.begin(), vec.end(), 4); //查找元素

int maxVal = std::max(a, b); //获取最大值
int minVal = std::min(a, b); //获取最小值
```

### cmath

- sqrt
- pow
- round
- floor
- ceil
- abs

```cpp
#include <cmath>

double result = std::sqrt(16.0); //平方根
double power = std::pow(2.0, 3.0); //幂
double rounded = std::round(3.6); //四舍五入
double floored = std::floor(3.6); //向下取整
double ceiled = std::ceil(3.2); //向上取整
double absolute = std::abs(-5.0); //绝对值
```

### fstream

- ifstream
- ofstream

```cpp
#include <fstream>

std::ofstream outFile("output.txt"); //写文件
outFile << "Hello, file!" << std::endl;
outFile.close();

std::ifstream inFile("input.txt"); //读文件
std::string line;
while (std::getline(inFile, line)) {
    std::cout << line << std::endl;
}
inFile.close();
```

## 指针

指针和引用的用法：

- *：表示指针所指向的值
  - `*p`表示p指向的值
- &：表示变量的地址
  - `&x`表示变量x的地址

```cpp
int x = 10;
int *p = &x; //p是指向x的指针
```

> `int *p`和`int* p`是等价的，*绑定在变量名上更符合C++的语法习惯

- 指针作为函数参数

```cpp
void increment(int* p) {
    (*p)++; //通过指针修改值
}
```

- 函数返回指针

```cpp
int* createArray(int size) {
    return new int[size]; //动态分配数组
}
```

## 函数

### 函数定义

```cpp
// 返回类型 函数名(参数类型 参数名) {
//     // 函数体
// }

int add(int a, int b = 0) { // b有默认值0
    return a + b;
}
```

- Lambda表达式

```cpp
// [捕获列表](参数列表) -> 返回类型 { 函数体 };
auto sum = [](int a, int b) -> int {
    return a + b;
};

// 捕获列表是指定外部变量如何在Lambda中使用
int x = 10;
auto lambda1 = [x](int y) { return x + y; }; //按值捕获x
auto lambda2 = [&x](int y) { return x + y; }; //按引用捕获x
auto lambda3 = [=](int y) { return x + y; }; //按值捕获所有外部变量
auto lambda4 = [&](int y) { return x + y; }; //按引用捕获所有外部变量
```

### 函数类型

- 构造函数
  - 使用场景: 当创建类的对象时，会自动调用构造函数来初始化对象的成员变量
  - 例如:

    ```cpp
    class MyClass {
    public:
        MyClass() {
            // 构造函数的实现
        }
    };
    MyClass obj; // 创建对象时调用构造函数
    ```

- 拷贝构造函数
  - 使用场景: 当一个对象以值传递的方式传递给函数，或从函数返回一个对象时，会调用拷贝构造函数来创建一个新的对象副本
  - 例如:

    ```cpp
    class MyClass {
    public:
        MyClass() {
            // 构造函数的实现
        }
        MyClass(const MyClass& other) {
            // 拷贝构造函数的实现
        }
    };

    void func(MyClass obj) { // 传值调用，会调用拷贝构造函数
        // ...
    }

    MyClass createObject() {
        MyClass obj;
        return obj; // 返回对象时，会调用拷贝构造函数
    }
    ```

- 移动构造函数
  - 使用场景: 当一个对象以右值引用的方式传递给函数，或从函数返回一个临时对象时，会调用移动构造函数来“窃取”资源，而不是复制资源，从而提高性能
  - 例如:

    ```cpp
    class MyClass {
    public:
        MyClass() {
            // 构造函数的实现
        }
        MyClass(MyClass&& other) noexcept {
            // 移动构造函数的实现
        }
    };
    ```

- 析构函数
  - 使用场景: 当对象生命周期结束时，会自动调用析构函数来释放对象占用的资源
  - 例如:

    ```cpp
    class MyClass {
    public:
        ~MyClass() {
            // 析构函数的实现
        }
    };
    ```

- 成员函数
  - 使用场景: 定义类的行为，通过成员函数操作对象的状态
  - 例如:

    ```cpp
    class MyClass {
    private:
        int value;
    public:
        void setValue(int val) { value = val; } // 成员函数
        int getValue() const { return value; } // 成员函数
    };
    ```

- 静态成员函数
  - 使用场景: 定义与类相关但不依赖于具体对象的行为，可以通过类名直接调用
  - 例如:

    ```cpp
    class MyClass {
    public:
        static int staticVar; // 静态成员变量
        static void staticFunction() { // 静态成员函数
            // 静态函数的实现
        }
    };

    MyClass::staticVar = 10; // 访问静态成员变量
    MyClass::staticFunction(); // 调用静态成员函数
    ```

- 运算符重载函数
  - 使用场景: 当需要自定义类对象之间的运算符行为时，可以重载运算符函数
  - 例如:

    ```cpp
    class MyClass {
    private:
        int value;
    public:
        MyClass(int val) : value(val) {}
        MyClass operator+(const MyClass& other) { // 重载加法运算符
            return MyClass(this->value + other.value);
        }
    };

    MyClass obj1(10);
    MyClass obj2(20);
    MyClass obj3 = obj1 + obj2; // 使用重载的加法
    ```

- 友元函数: 可以访问类的私有成员的函数
  - 使用场景: 当需要让一个非成员函数访问类的私有成员时，可以将该函数声明为类的友元函数
  - 例如:

    ```cpp
    class MyClass {
    private:
        int privateVar;
    public:
        MyClass(int val) : privateVar(val) {}
        friend void friendFunction(MyClass& obj); // 声明友元函数
    };

    void friendFunction(MyClass& obj) {
        // 访问 MyClass 的私有成员
        std::cout << "Private variable: " << obj.privateVar << std::endl;
    }
    ```

- 内联函数: 提高性能的小型函数
  - 使用场景: 当函数体非常小且频繁调用时，可以将其定义为内联函数，以减少函数调用的开销，**类内定义的成员函数默认会被编译器视为内联函数**
  - 例如:

    ```cpp
    class MyClass {
    public:
        inline int getValue() const { return value; } // 内联函数
    private:
        int value;
    };
    ```

- 虚函数: 支持多态的成员函数
  - 使用场景: 当需要通过基类指针或引用调用派生类的重写函数时，使用虚函数实现运行时多态（父类引用指向子类对象时，调用子类重写的方法）
  - 例如:

    ```cpp
    class Base {
    public:
        virtual void show() { // 虚函数
            std::cout << "Base class show function" << std::endl;
        }
    };
    class Derived : public Base {
    public:
        void show() override { // 重写虚函数
            std::cout << "Derived class show function" << std::endl;
        }
    };
    ```

- 纯虚函数: 抽象类中的虚函数, 没有实现
  - 使用场景: 当需要定义一个接口类，强制派生类实现某些函数时，使用纯虚函数
  - 例如:

    ```cpp
    class AbstractBase {
    public:
        virtual void pureVirtualFunction() = 0; // 纯虚函数
    };
    class ConcreteDerived : public AbstractBase {
    public:
        void pureVirtualFunction() override { // 实现纯虚函数
            std::cout << "ConcreteDerived implementation" << std::endl;
        }
    };
    ```

## 结构体和类

### 结构体struct

- 主要用于组合不同类型的数据
- 默认成员访问权限为**public**
- 可以有方法、构造函数和析构函数

```cpp
struct Point {
    int var; //成员变量
    void setVar(int val) { var = val; } //公有成员函数
private:
    void privateFunc() {} //私有成员函数
};

// struct的继承
struct ColoredPoint : public Point {
    std::string color; //新增成员变量
};
```

### 类class

- 用于面向对象编程，封装数据和行为
- 默认成员访问权限为**private**
- 可以继承，支持多态

```cpp
class MyClass {
private:
    int privateVar; //私有成员变量
public:
    MyClass(int val) : privateVar(val) {} //构造函数
    MyClass(const MyClass& other) : privateVar(other.privateVar) {} //拷贝构造函数
    ~MyClass() {} // 析构函数
    int getVar() const { return privateVar; } //公有成员函数
    void setVar(int val) { privateVar = val; } //公有成员函数
};

// class的继承
class DerivedClass : public MyClass {
public:
    DerivedClass(int val) : MyClass(val) {} //调用基类构造函数
};
```

> struct和class的主要区别在于默认访问权限不同，struct默认public，class默认private，其他方面基本相同

### 抽象类和接口

- 抽象类: 包含至少一个纯虚函数的类，不能实例化，只能作为基类使用
  - 纯虚函数: 在基类中声明但不定义的函数，必须在派生类中实现
  - 例如:

    ```cpp
    class AbstractBase {
    public:
        virtual void pureVirtualFunc() = 0; // 纯虚函数
    };
    ```

- 接口: 只包含纯虚函数的类，用于定义行为规范
  - 例如:

    ```cpp
    class Interface {
    public:
        virtual void method1() = 0;
        virtual void method2() = 0;
    };
    ```

### 访问修饰符

- public: 公有成员, 可在类外访问
- private: 私有成员, 只能在类内访问
- protected: 受保护成员, 可在类内和派生类中访问

| 访问范围 | public | protected | private |
| -------- | ------ | --------- | ------- |
| 同一个类 | yes    | yes       | yes     |
| 派生类   | yes    | yes       | no      |
| 外部的类 | yes    | no        | no      |

### 继承规则

- 公有继承 (public): 基类的public和protected成员在派生类中保持不变
  - 例如: `class Derived : public Base { };`
- 保护继承 (protected): 基类的public和protected成员在派生类中变为protected
  - 例如: `class Derived : protected Base { };`
- 私有继承 (private): 基类的public和protected成员在派生类中变为private
  - 例如: `class Derived : private Base { };`
- 多重继承: 一个类可以继承多个基类
  - 例如: `class Derived : public Base1, protected Base2 { };`

### 运算符和方法重载

- 运算符重载: 自定义类对象之间的运算符行为
  - 例如:

    ```cpp
    class MyClass {
    private:
        int value;
    public:
        MyClass(int val) : value(val) {}
        MyClass operator+(const MyClass& other) { // 重载加法运算符
            return MyClass(this->value + other.value);
        }
    };
    MyClass obj1(10);
    MyClass obj2(20);
    MyClass obj3 = obj1 + obj2; // 使用重载的加法
    ```

- 方法重载: 同一类中定义多个同名但参数不同的方法，包括参数类型、数量或顺序不同
  - 例如:

    ```cpp
    class MyClass {
    public:
        void display(int a) {
            std::cout << "Integer: " << a << std::endl;
        }
        void display(double b) {
            std::cout << "Double: " << b << std::endl;
        }
    };
    MyClass obj;
    obj.display(10);    // 调用第一个 display 方法
    obj.display(3.14);  // 调用第二个 display 方法
    ```

# C++编译

## 头文件和模块

C++是“静态编译 + 无统一模块系统 + 头文件机制”，没有像Go那样的模块系统，也没有像Python的运行时import机制，C++是通过头文件（.h/.hpp）和源文件（.cpp）来组织代码

每个.cpp文件是独立编译的单元，编译器会将.cpp文件和它包含的.h文件一起处理，生成目标文件（.o/.obj），最后通过链接器将多个目标文件和库文件链接成可执行文件

如何要使用另外一个.cpp文件中的函数或类，必须在当前.cpp文件中通过`#include`指令包含对应的.h文件

因此C++的编译过程可以分为预处理、编译、汇编和链接四个阶段，这是历史设计原因 + 性能需求导致的，而在C++20中引入了模块（modules）机制，试图解决头文件带来的诸多问题：

- 头文件
  - 头文件是给编译器看的说明书，包含函数声明、类定义等
  - #include指令本质是把头文件内容替换到源文件中，链接阶段会找到方法实现
  - 头文件add.h:

    ```cpp
    int add(int a, int b); // 函数声明
    ```

  - 源文件add.cpp:

    ```cpp
    #include "add.h" // 包含头文件
    int add(int a, int b) { // 函数定义
        return a + b;
    }
    ```

  - 使用add.cpp中的add函数:

    ```cpp
    #include "add.h" // 包含add函数的声明

    int main() {
        int result = add(3, 5); // 调用add函数
        return 0;
    }
    ```

- 模块
  - C++20引入了模块（modules）机制，试图替代传统的头文件机制
  - 模块通过`export module`和`import`关键字来定义和使用模块
  - 模块add.cpp:

    ```cpp
    export module add; // 定义模块，类似go的package
    export int add(int a, int b) { // 导出add函数
        return a + b;
    }
    ```

  - 使用add模块:

    ```cpp
    import add; // 导入add模块
    int main() {
        int result = add(3, 5); // 调用add函数
        return 0;
    }
    ```

模块机制的优势：

- #include复制头文件内容，导致编译时间长、重复定义等问题
- 每个编译单元需要重新处理头文件，增加编译时间，模块只需编译一次，其他文件通过import使用，减少重复编译
- 模块有明确的接口和实现分离，export避免了头文件中不必要的暴露，提高封装性
- 模块支持更好的名称空间管理，export导出减少命名冲突的风险

但目前支持的编译器和工具链还不够广泛，实际项目中仍然大量使用传统的头文件机制

## 编译过程

1. 预处理 (Preprocessing): 处理以`#`开头的预处理指令，如`#include`、`#define`等，生成.i文件
   - 本质是把`.h`文件内容插入到`.cpp`文件中
2. 编译 (Compilation): 将预处理后的代码转换为汇编代码，生成.s文件
   - 进行语法分析、类型检查、模板展开、生成中间代码和优化
3. 汇编 (Assembly): 将汇编代码转换为机器码，生成.o目标文件
4. 链接 (Linking): 将多个目标文件和库文件链接成可执行文件
   - 符号解析：找出函数、变量的最终实现
   - 地址重定位：给所有代码分配真正的内存地址

## 编译工具

GNU是一个包含编译、汇编、链接、调试、构建的软件工具链，包含：

- GCC/g++（C/C++编译器）
- GBD（GNU Debugger）
- Make（构建自动化工具）
- libstdc++（C++标准库实现）
- Binutils（汇编器as和链接器ld）
- Coreutils（基本命令行工具）

LLVM是一个模块化的编译器基础设施，包含：

- Clang/Clang++（C/C++编译器）
- LLVM中间语言IR（Intermediate Representation）和优化器opt
- LLD（LLVM链接器）
- libc++（C++标准库实现）
- LLDB（LLVM调试器）

g++/clang++会调用GNU/LLVM工具链中的预处理器、编译器、汇编器和链接器来完成C++代码的编译和链接

如果使用gcc编译C++代码，可能会导致链接错误，因为gcc默认使用C链接器，而C++代码需要C++链接器来处理名称修饰和标准库链接等问题

GNU/g++和LLVM/clang++是目前主流的C++编译器选择，命令行的用法高度兼容

- LLVM的优势在于安全检测、现代化工具链、快速链接、跨平台
- GNU的优势在于成熟稳定、广泛支持、丰富的优化选项

## GNU/g++

GNU包含C/C++的常见编译器GCC和g++：

- gcc: GNU C Compiler，主要用于编译C代码，也可以编译C++但是不会自动链接C++标准库
- g++: GNU C++ Compiler，主要用于编译C++代码

> 命令行使用的gcc/g++是前端驱动程序，会调用实际的编译器组件（cpp、cc1/cc1plus、as、ld）来完成编译和链接过程

1. 预处理：处理`#include`、`#define`等预处理指令，使用组件cpp（C PreProcessor）

    ```bash
    g++ -E source.cpp -o source.i # -E表示只进行预处理，-o指定输出文件
    ```

    - 会处理#include、#define等预处理指令，将头文件的内容插入到源文件中，生成预处理后的代码文件source.i
2. 编译：将预处理后的代码转换为汇编代码，使用组件cc1/cc1plus（C/C++ 前端编译器）

    ```bash
    g++ -S source.i -o source.s # -S表示只进行编译，生成汇编代码
    ```

    - 会进行语法分析、类型检查、模板展开等，将预处理后的代码转换为汇编代码，生成source.s文件，会使用GNU的汇编器as进行汇编
3. 汇编：将汇编代码转换为机器码，生成目标文件（.o），使用组件GNU as（GNU assembler）

    ```bash
    g++ -c source.s -o source.o # -c表示只进行汇编，生成目标文件
    ```

4. 链接：将目标文件和库文件链接成可执行文件，使用组件GNU ld（linker）

    ```bash
    g++ source.o -o executable # 链接生成可执行文件
    ```

以上的步骤可以通过单个g++命令完成：

```bash
g++ source.cpp -o executable # 直接编译并链接生成可执行文件
```

> 对于多文件构建可以将每个.cpp文件分别编译成.o目标文件，然后再链接生成最终的可执行文件
> 这样可以避免每次修改一个源文件时都重新编译所有文件，提高构建效率

常用的g++编译选项：

- `-std=c++11`、`-std=c++14`、`-std=c++17`、`-std=c++20`：指定C++标准版本
- `-Wall`：开启所有警告信息，帮助发现潜在问题
- `-Wextra`：开启额外的警告信息
- `-Werror`：将警告视为错误，强制修正所有警告
- `-O0`、`-O1`、`-O2`、`-O3`：优化级别，`-O0`无优化，便于调试，`-O3`最高优化
- `-g`：生成调试信息，便于使用gdb调试
- `-pg`：生成用于性能分析的代码，配合gprof使用
- `-l<lib>`：链接指定的库文件，例如`-lm`链接数学库libm
- `-I<dir>`：指定头文件搜索路径
- `-L<dir>`：指定库文件搜索路径

## 构建管理工具

当项目规模增大，直接使用g++命令行编译变得繁琐，通常会使用构建管理工具来简化编译和链接过程：

- Make: 通过Makefile定义编译规则和依赖关系，使用make命令自动化构建
- CMake: 跨平台的构建系统生成工具，通过CMakeLists.txt定义项目结构，生成Makefile或其他构建文件
- Ninja: 高效的构建系统，通常与CMake配合使用，专注于快速增量构建
- Meson: 现代化的构建系统，注重易用性和性能，通常与Ninja配合使用
- Bazel: Google开发的构建工具，支持大规模项目和多语言构建，强调可重复性和可扩展性

Makefile是最传统的构建管理方式，定义了目标文件、依赖关系和构建规则，可以通过make命令自动化构建过程，但是需要手动编写Makefile，维护依赖关系较为复杂，并且跨平台支持有限

CMake是目前最流行的跨平台构建系统生成工具，通过CMakeLists.txt文件定义项目结构和构建选项，CMake可以生成适用于不同平台和编译器的构建文件（如Makefile、Ninja文件、Visual Studio解决方案等），大大简化了跨平台构建的复杂性

## CMake

- 项目结构：

    ```
    MyApp/
    ├─ CMakeLists.txt     # 顶层配置
    ├─ src/
    │  ├─ CMakeLists.txt  # 子目录配置
    │  ├─ main.cpp
    │  └─ foo.cpp
    └─ include/
    └─ foo.h
    ```

- 顶层CMakeLists.txt：

    ```cmake
    cmake_minimum_required(VERSION 3.20)  # 指定CMake最低版本
    project(MyApp)                        # 定义项目名称

    set(CMAKE_CXX_STANDARD 17)            # 设置C++标准
    include_directories(include)          # 添加头文件搜索路径

    add_subdirectory(src)                 # 添加子目录
    ```

- src/CMakeLists.txt：

    ```cmake
    # 收集源文件
    file(GLOB SOURCES "*.cpp")

    # 定义可执行目标
    add_executable(app ${SOURCES})

    # 链接库（可选）
    # target_link_libraries(app pthread)
    ```

- 构建项目：

    ```bash
    mkdir build
    cd build
    cmake ..               # 生成构建文件
    make                   # 编译项目，-j$(nproc)执行并行编译
    ./src/app                  # 运行可执行文件
    ```

CMake提供的方法：

- TODO
