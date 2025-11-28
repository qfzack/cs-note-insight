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

## 常用容器

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
vec.emplace_back(5); //原地构造元素，效率更高
vec.pop_back(); //删除最后一个元素
std::cout << vec.size(); //获取大小
vec.clear(); //清空动态数组

//访问元素
int first = vec[0];
//获取最后一个元素
int last = vec.back();
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

### 双向链表list

```cpp
std::list<int> lst; //创建双向链表
lst.push_back(1); //在末尾添加元素
lst.push_front(0); //在开头添加元素
lst.pop_back(); //删除末尾元素
lst.pop_front(); //删除开头元素
std::cout << lst.size(); //获取大小

//访问元素（只能通过迭代器访问）
for (const int& val : lst) {
    std::cout << val << " ";
}
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

## 容器方法

C++ STL容器有一些通用且常用的方法，涵盖vector/string/list/map/set/unordered_map等

有些方法是多态实现，因此会有不同的参数

### 容量

- size
  - 获取容器大小

    ```cpp
    std::vector<int> vec = {1, 2, 3};
    size_t size = vec.size(); // size = 3
    ```

- empty
  - 检查容器是否为空

    ```cpp
    std::vector<int> vec;
    bool isEmpty = vec.empty(); // isEmpty = true
    ```

- capacity
  - 获取容器容量（仅适用于vector/string）

    ```cpp
    std::vector<int> vec;
    size_t cap = vec.capacity(); // 获取当前容量
    ```

### 访问元素

- at
  - 访问指定索引的元素，带边界检查

    ```cpp
    std::vector<int> vec = {1, 2, 3};
    int val = vec.at(1); // val = 2
    ```

- front
  - 访问容器的第一个元素

    ```cpp
    std::vector<int> vec = {1, 2, 3};
    int first = vec.front(); // first = 1
    ```

- back
  - 访问容器的最后一个元素

    ```cpp
    std::vector<int> vec = {1, 2, 3};
    int last = vec.back(); // last = 3
    ```

### 修改元素

- push_back
  - 在容器末尾添加元素（适用于vector/list/string）

    ```cpp
    std::vector<int> vec;
    vec.push_back(1); // vec = {1}
    ```

- emplace_back
  - 在容器末尾原地构造元素（适用于vector/list/string）

    ```cpp
    std::vector<std::pair<int, int>> vec;
    vec.emplace_back(1, 2); // vec = {(1, 2)}
    ```

- push_front
  - 在容器开头添加元素（适用于list/deque）

    ```cpp
    std::list<int> lst;
    lst.push_front(1); // lst = {1}
    ```

- emplace_front
  - 在容器开头原地构造元素（适用于list/deque）

    ```cpp
    std::list<std::pair<int, int>> lst;
    lst.emplace_front(1, 2); // lst = {(1, 2)}
    ```

- insert
  - 在指定位置插入元素，省略位置表示在末尾插入

    ```cpp
    std::vector<int> vec = {1, 2, 3};
    vec.insert(vec.begin() + 1, 10); // vec = {1, 10, 2, 3}
    ```

- emplace
  - 在指定位置原地构造元素

    ```cpp
    std::vector<std::pair<int, int>> vec;
    vec.emplace(vec.begin(), 1, 2); // vec = {(1, 2)}
    ```

### 查找

- find
  - 查找元素，返回迭代器

    ```cpp
    std::vector<int> vec = {1, 2, 3};
    auto it = std::find(vec.begin(), vec.end(), 2);
    if (it != vec.end()) {
        // 找到元素
    }
    ```

- count
  - 统计元素出现次数（适用于set/map/unordered_set/unordered_map）

    ```cpp
    std::unordered_set<int> hashset = {1, 2, 3, 2};
    size_t cnt = hashset.count(2); // cnt = 1
    ```

### 其他

- swap
  - 交换两个容器的内容

    ```cpp
    std::vector<int> vec1 = {1, 2, 3};
    std::vector<int> vec2 = {4, 5, 6};
    vec1.swap(vec2); // 交换vec1和vec2的内容
    ```

- begin / end
  - 获取容器的起始和结束迭代器

    ```cpp
    std::vector<int> vec = {1, 2, 3};
    for (auto it = vec.begin(); it != vec.end(); ++it) {
        std::cout << *it << " ";
    }
    ```

- rbegin / rend
  - 获取容器的反向起始和结束迭代器

    ```cpp
    std::vector<int> vec = {1, 2, 3};
    for (auto it = vec.rbegin(); it != vec.rend(); ++it) {
        std::cout << *it << " ";
    }
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
- swap

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
std::swap(a, b); //交换值
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

### 其他

- rand

```cpp
#include <random>
#include <cstdlib>
#include <ctime>

std::random_device rd; //获取随机数种子
std::mt19937 gen(rd()); //初始化随机数生成器
std::uniform_int_distribution<> dis(1, 100); //定义均匀分布范围
int randomNum = dis(gen); //生成随机数

// 使用 C 风格的 rand()
std::srand(std::time(nullptr)); //设置随机数种子
int cRandomNum = std::rand() % 100 + 1; //生成1到100的随机数
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

- 指定最低版本要求
  
    ```cmake
    cmake_minimum_required(VERSION 3.20)
    ```

- 定义项目名称和编程语言
  
    ```cmake
    project(MyApp CXX) # 定义C++项目
    ```

- 执行要生成的可执行文件和其源文件
  
    ```cmake
    # add_executable(<target> <source_files> ...)
    add_executable(app main.cpp foo.cpp)
    ```

- 创建一个库及其源文件

    ```cmake
    add_library(mylib STATIC lib.cpp) # 静态库
    add_library(mylib SHARED lib.cpp) # 动态库
    ```

- 链接目标文件与其他库
  - 作用是将指定的库文件链接到目标文件中，使得目标文件可以使用这些库中的函数和资源

    ```cmake
    target_link_libraries(app mylib pthread)
    ```

- 添加头文件搜索路径
  - 作用是告诉编译器在指定的目录中查找头文件，以便在源代码中使用`#include`指令包含这些头文件

    ```cmake
    include_directories(<dirs> ...)
    ```

- 设置变量的值

    ```cmake
    set(VAR_NAME value)
    ```

- 安装目标文件和库

    ```cmake
    install(TARGETS app DESTINATION bin) # 安装可执行文件到bin目录
    install(TARGETS mylib DESTINATION lib) # 安装库文件到lib目录
    install(FILES foo.h DESTINATION include) # 安装头文件到include目录
    ```

- 条件语句

    ```cmake
    if(CONDITION)
        # 条件为真时执行的命令
    else()
        # 条件为假时执行的命令
    endif()
    ```

# 常见面试题

## 什么是指针

指针是一个变量，它存储了另一个变量的内存地址，通过指针可以直接访问和操作内存中的数据

在64位系统中，指针通常占用8个字节（64位），而在32位系统中，指针占用4个字节（32位）

```cpp
#include <iostream>
using namespace std;

class Test {
  public:
    int add (int a, int b) {
      return 0;
    }
}

int main() {
  int* p = nullptr; // 定义一个空指针
  int a = 10;
  p = &a; // 将指针指向变量a的地址
  cout << a << endl; // 输出变量a的值
  cout << *p << endl; // 通过指针访问变量a的值
  cout << &a << endl; // 输出变量a的地址
  cout << p << endl; // 输出指针p的值（变量a的地址）

  // 指向函数的指针
  Test obj;
  int (Test::*funcPtr)(int, int)； // 定义一个指向成员函数的指针
  funcPtr = &Test::add; // 将指针指向成员函数add
  cout << (obj.*funcPtr)() << endl; // 通过指针调用
  return 0;
}
```

指针可以指向不同类型的数据，包括基本数据类型、数组、结构体和函数等

this指针是C++中一个隐含的指针参数，编译器会在每个非静态成员函数中自动添加一个this指针，指向调用该成员函数的对象本身

指针的`p->member`运算符用于访问指针所指向的对象的成员，相当于先解引用指针再访问成员，等价于`(*ptr).member`

## 野指针和悬空指针

悬空指针: 指向已经被释放或无效内存的指针
野指针: 未初始化或指向未知内存地址的指针

```cpp
#include <iostream>
using namespace std;

int main() {
  int* p; // 野指针，未初始化
  cout << *p << endl; // 未定义行为

  int* q = new int(10); // 动态分配内存
  delete q; // 释放内存
  cout << *q << endl; // 悬空指针，未定义行为

  return 0;
}
```

## 指针和引用的区别

1. 定义方式不同: 指针使用`*`符号定义，引用使用`&`符号定义
2. 初始化要求不同: 指针可以在定义后赋值，引用必须在定义时初始化
3. 空值处理不同: 指针可以指向空值（nullptr），引用必须引用一个有效的对象
4. 语法使用不同: 访问指针需要解引用操作符`*`，引用可以直接使用
5. 内存地址不同: 指针变量本身有自己的内存地址，引用没有独立的内存地址
6. 修改指向不同: 指针可以改变指向的对象，引用一旦绑定后不能改变指向
7. 数组和函数参数传递不同: 指针可以用于数组和函数参数传递，引用更适合用于函数参数传递以避免拷贝开销

```cpp
#include <iostream>
using namespace std;

int a = 10;
int* p = &a; // 指针
int& r = a;  // 引用

void modifyPointer(int* p) {
  *p = 20; // 修改指针指向的值
}

void modifyReference(int& r) {
  r = 20; // 修改引用指向的值
}
```

## 值、引用和指针参数传递

值传递: 传递变量的副本，函数内对参数的修改不会影响原始值
指针传递: 传递指针的副本，因此本质也是值传递，函数内可以通过指针修改指向的原始值，但不能改变指针本身的地址
引用传递: 传递变量的别名，不会复制原变量，函数内对引用的修改会直接影响原始值

## 常量指针和指针常量

常量指针: 指向常量的指针，指针所指向的值不能被修改，但指针本身可以改变指向
指针常量: 指针本身是常量，指针的值（地址）不能被修改，但可以通过指针修改所指向的值

```cpp
#include <iostream>
using namespace std;
int main() {
  int a = 10;
  int b = 20;

  // 常量指针
  const int* p1 = &a; // 指向常量的指针
  // *p1 = 15; // 错误，不能修改指向的值
  p1 = &b; // 可以改变指针的指向

  // 指针常量
  int* const p2 = &a; // 指针常量
  *p2 = 15; // 可以修改指向的值
  // p2 = &b; // 错误，不能改变指针的指向

  return 0;
}
```

## 指针函数和函数指针

指针函数: 返回指针类型的函数
函数指针: 指向函数的指针，可以用来调用函数

```cpp
#include <iostream>
using namespace std;

// 指针函数
int* getPointer(int& a) {
  return &a; // 返回变量a的地址
}

// 函数指针
int add(int a, int b) {
  return a + b;
}

int main() {
  int x = 10;
  int* p = getPointer(x); // 调用指针函数
  cout << *p << endl; // 输出变量x的值

  // 定义函数指针
  int (*funcPtr)(int, int) = add; // 指向函数add
  cout << funcPtr(5, 10) << endl; // 通过函数指针调用函数

  return 0;
}
```

## 全局变量定义在头文件有什么问题

当全局变量定义在头文件中，头文件被多个源文件包含时，每个源文件都会创建一个独立的全局变量副本，这会导致重复定义，因此不能在头文件中定义全局变量，只能声明全局变量，定义放在源文件中

## extent C的作用是什么

当cpp程序需要调用C语言的函数时，需要使用`extern "C"`来告诉编译器按照C语言的方式进行链接，避免C++的名称修饰（name mangling）导致链接错误

```cpp
extern "C" {
#include <stdio.h>
void c_function(); // 声明C语言函数
}
void c_function() {
  printf("Hello from C function!\n");
}
int main() {
  c_function(); // 调用C语言函数
  return 0;
}
```

## struct和class的区别

struct和class的主要区别在于默认的访问权限和继承方式

1. 默认访问权限: struct的成员默认是public的，而class的成员默认是private的
2. 默认继承方式: struct的继承默认是public的，而class的继承默认是private的

```cpp
#include <iostream>
using namespace std;

struct MyStruct {
  int x; // 默认public
};
class MyClass {
  int y; // 默认private
};

struct BaseStruct {
};
struct DerivedStruct : BaseStruct { // 默认public继承
  // ...
};

class Base {
};
class Derived : Base { // 默认private继承
  // ...
};
```

struct通常用于简单的数据结构，而class用于更复杂的对象和封装，保留struct的目的是为了兼容C语言和提供更简单的语法

## struct和union的区别

`union`是c/cpp中的一种特殊复合数据类型，允许多个成员共享一段内存，所有成员从同一地址开始存储，但只能同时存储一个成员的值，访问其他成员可能导致未定义行为

因此union通常用于节省内存空间，适用于只需要存储一个成员的场景，union的大小取决于最大成员的大小

```cpp
#include <iostream>
using namespace std;
union MyUnion {
  int i;
  float f;
  char c;
};
int main() {
  MyUnion u;
  u.i = 10; // 设置整数值
  cout << u.i << endl; // 输出整数值
  u.f = 3.14; // 设置浮点值
  cout << u.f << endl; // 输出浮点值
  // cout << u.i << endl; // 未定义行为，访问了未设置的整数值
  return 0;
}
```

struct和union的主要区别在于内存布局和成员访问方式

1. 内存布局：
   - struct的每个成员都有自己的内存空间，结构体的大小是所有成员大小之和
   - union的所有成员共享同一块内存空间，union的大小是最大成员的大小
2. 成员访问方式：
   - struct的每个成员都可以独立访问
   - union的成员只能访问最后一次赋值的成员，访问其他成员可能导致未定义行为

## static的作用是什么

静态变量主要用于在程序的生命周期内保持变量的值不变，静态函数用于限制函数的作用域，使其只能在定义它的文件内可见

`static`关键字在C++中有多种用途，主要用于控制变量和函数的生命周期和作用域

1. 静态局部变量: 在函数内部使用`static`声明的变量在函数调用结束后仍然保留其值，下次调用时继续使用上次的值
2. 静态全局变量: 在文件作用域内使用`static`声明的全局变量只能在当前文件内可见，其他文件无法访问
3. 静态成员变量: 在类中使用`static`声明的成员变量属于类本身而不是类的实例，所有实例共享同一个静态成员变量，派生类也共享基类的静态成员变量
4. 静态成员函数: 在类中使用`static`声明的成员函数可以在没有类实例的情况下调用，只能访问静态成员变量和静态成员函数

```cpp
#include <iostream>
using namespace std;

static int globalVar = 0; // 静态全局变量，只能在当前文件内访问

class MyClass {
public:
  static int staticVar; // 静态成员变量 
  static void staticMethod() { // 静态成员函数
    cout << "Static Method called" << endl;
  }
};

int MyClass::staticVar = 0; // 静态成员变量初始化
int main() {
  // 静态局部变量
  static int count = 0;
  count++;
  cout << "Count: " << count << endl; // 每次调用main时count值会增加

  MyClass::staticVar = 10; // 访问静态成员变量
  cout << "Static Var: " << MyClass::staticVar << endl;

  MyClass::staticMethod(); // 调用静态成员函数

  return 0;
}
```

## const的作用是什么

`const`关键字用于定义常量，表示变量的值不可修改，可以用于变量、指针、成员函数等

1. 常量变量: 使用`const`声明的变量在初始化后不能被修改
2. 常量指针: 指向常量的指针，指针所指向的值不能被修改
3. 指针常量: 指针本身是常量，指针的值（地址）不能被修改
4. 常量成员函数: 在类中使用`const`声明的成员函数不能修改类的成员变量
5. 常量引用: 使用`const`声明的引用不能通过引用修改所引用的对象

```cpp
#include <iostream>
using namespace std;

int main() {
  const int a = 10; // 常量变量
  // a = 20; // 错误，不能修改常量变量

  const int* p1 = &a; // 指向常量的指针
  // *p1 = 20; // 错误，不能修改指向的值

  int b = 20;
  int* const p2 = &b; // 指针常量
  *p2 = 30; // 可以修改指向的值
  // p2 = &a; // 错误，不能改变指针的指向

  class MyClass {
  public:
    void constMethod() const { // 常量成员函数
      // memberVar = 10; // 错误，不能修改成员变量
    }
  private:
    int memberVar;
  };

  const int& r = a; // 常量引用
  // r = 20; // 错误，不能通过引用修改所引用的对象

  return 0;
}
```

## define和const的区别

define是预处理指令，用于定义宏，在编译前进行文本替换，就是简单的文本替换，而const是C++关键字，用于定义常量变量，具有类型检查和作用域

1. 类型安全: `const`具有类型检查，编译器会检查类型是否匹配，而`#define`只是简单的文本替换，没有类型检查
2. 作用域: `const`遵循C++的作用域规则，可以定义在类、函数或命名空间内，而`#define`在预处理阶段进行替换，没有作用域概念
3. 调试信息: `const`变量在调试时可以查看其值，而`#define`宏在预处理后无法查看原始定义
4. 内存占用: `const`变量在内存中有实际的存储空间，而`#define`宏在编译时被替换，不占用内存
5. 可调试性: 使用`const`变量更容易调试和维护代码，而`#define`宏可能导致难以追踪的问题

```cpp
#include <iostream>
using namespace std;

#define PI 3.14 // 宏定义
const double pi = 3.14; // 常量定义
int main() {
  cout << "Macro PI: " << PI << endl; // 使用宏
  cout << "Const pi: " << pi << endl; // 使用常量
  return 0;
}
```

## define和typedef的区别

`#define`是预处理指令，用于定义宏，在编译前进行文本替换，而`typedef`是C++关键字，用于为已有类型创建新的类型别名

1. 作用不同: `#define`用于定义宏，可以定义常量、函数等，而`typedef`用于创建类型别名
2. 类型检查: `typedef`具有类型检查，编译器会检查类型是否匹配，而`#define`只是简单的文本替换，没有类型检查
3. 作用域: `typedef`遵循C++的作用域规则，可以定义在类、函数或命名空间内，而`#define`在预处理阶段进行替换，没有作用域概念
4. 可读性: 使用`typedef`可以提高代码的可读性，尤其是对于复杂类型，而`#define`宏可能导致代码难以理解

```cpp
#include <iostream>
using namespace std;

// typedef实例
typedef unsigned int uint; // 类型别名
int main() {
  uint count = 10; // 使用类型别名
  cout << "Count: " << count << endl;
  return 0;
}
```

## volatile的作用是什么

`volatile`关键字用于告诉编译器该变量的值可能会在程序的其他部分被修改，防止编译器对该变量进行优化，确保每次访问该变量时都从内存中读取最新的值

`volatile`不具有原子性，不能替代锁机制来保证多线程环境下的同步，因此在多线程编程中，`volatile`只能确保变量的可见性，但不能保证操作的原子性，可以和const一起使用，表示变量的值可能会被外部修改，但程序不能修改该值

主要使用场景：

1. 多线程编程: 当多个线程可能同时访问和修改同一个变量时，使用`volatile`可以确保每个线程都能看到变量的最新值
2. 硬件寄存器访问: 在嵌入式编程中，访问硬件寄存器时，使用`volatile`可以防止编译器优化对寄存器的访问，确保每次读取都是最新的硬件状态
3. 信号处理: 在处理异步信号时，使用`volatile`可以确保信号处理函数能够正确访问和修改共享变量
4. 防止优化: 当变量的值可能在程序的其他部分被修改时，使用`volatile`可以防止编译器对该变量进行优化，确保每次访问都是最新的值

```cpp
#include <iostream>
using namespace std;

volatile int flag = 0; // 声明一个volatile变量
void threadFunction() {
  while (flag == 0) {
    // 等待flag变为非零
  }
  cout << "Flag changed!" << endl;
}

int main() {
  flag = 1; // 修改volatile变量
  return 0;
}
```

## 虚函数和纯虚函数的区别

- 虚函数: 在基类中使用`virtual`关键字声明的成员函数，可以在派生类中重写，实现动态绑定，根据对象的实际类型调用相应的函数版本
  - 只有虚函数才能被重写，如果基类中的函数不是虚函数，派生类中定义同名函数不会覆盖基类的函数，而是隐藏它（重载也要基于虚函数，否则同名方法会被隐藏）

  ```cpp
  class Base {
  public:
    void func() { cout << "Base func" << endl; }
  };
  class Derived : public Base {
  public:
    void func() { cout << "Derived func" << endl; } // 隐藏基类的func
  };

  Base* obj = new Derived();
  obj->func(); // 调用Base的func，输出"Base func"

  Derived* derivedObj = new Derived();
  derivedObj->func(); // 输出"Derived func"
  ```

- 纯虚函数: 在基类中声明但不提供实现的虚函数，使用`= 0`语法，派生类必须重写纯虚函数，否则派生类也成为抽象类，不能实例化
  - 抽象类: 包含至少一个纯虚函数的类，不能直接实例化，只能通过派生类来实现纯虚函数后实例化，cpp中使用纯虚函数来定义接口，强制派生类实现特定的功能
  - 纯虚函数用于定义接口，强制派生类实现特定的功能

  ```cpp
  class AbstractBase {
  public:
    virtual void pureVirtualFunc() = 0; // 纯虚函数
  };
  class ConcreteDerived : public AbstractBase {
  public:
    void pureVirtualFunc() override { cout << "ConcreteDerived implementation" << endl; }
  };
  AbstractBase* obj = new ConcreteDerived();
  obj->pureVirtualFunc(); // 输出"ConcreteDerived implementation"
  ```

## 动态绑定和静态绑定的区别

静态绑定: 在编译时确定函数调用的具体实现，基于对象的静态类型进行绑定，适用于非虚函数调用，编译器根据指针或引用的类型决定调用哪个函数版本
动态绑定: 在运行时根据对象的实际类型确定函数调用的具体实现，适用于虚函数调用，通过虚函数表实现，根据对象的实际类型调用相应的函数版本

静态类型： 指变量在编译时的类型，由变量的声明决定
动态类型： 指变量在运行时的实际类型，由对象的创建决定

cpp的多态发生在运行时，通过动态类型决定虚函数的调用，但是编译器的类型检查是基于静态类型的，一般情况下，静态类型决定了可以调用哪些成员函数，而动态类型决定了实际调用哪个版本的虚函数

## 虚函数表和虚指针

虚函数表（vtable）

- 每个包含虚函数的类都有一个虚函数表，存储该类的虚函数地址，用于实现动态绑定
- 虚函数表就是一个指针数组，数组中的每个元素都是一个虚函数的地址，当通过基类指针调用虚函数时，程序会查找虚函数表，根据对象的实际类型找到对应的虚函数地址并调用

虚指针（vptr）

- 每个包含虚函数的对象都有一个隐藏的指针，指向该对象所属类的虚函数表，用于在运行时查找虚函数的地址，实现动态绑定

## 虚函数的调用过程

当通过基类指针或引用调用虚函数时，程序会执行以下步骤:

1. 通过对象的虚指针（vptr）找到对应的虚函数表（vtable）
2. 在虚函数表中查找对应的虚函数地址
3. 调用找到的虚函数地址，实现动态绑定

## 析构函数为什么设置为虚函数

析构函数是类的一种特殊成员函数，用于在对象生命周期结束时执行清理操作，如释放资源、关闭文件等，析构函数的名称与类名相同，前面加上波浪号`~`，不接受参数且没有返回值

虚函数是一种允许在派生类中重写基类函数的机制，通过在基类中将函数声明为`virtual`，可以实现动态绑定，根据对象的实际类型调用相应的函数版本

将析构函数设置为虚函数的主要原因是为了确保在通过基类指针删除派生类对象时，能够正确调用派生类的析构函数，避免资源泄漏和未定义行为

```cpp
#include <iostream>
using namespace std;

class Base {
public:
  virtual ~Base() { // 虚析构函数
    cout << "Base Destructor" << endl;
  }
};

class Derived : public Base {
public:
  ~Derived() { // 派生类析构函数
    cout << "Derived Destructor" << endl;
  }
};

int main() {
  Base* obj = new Derived(); // 基类指针指向派生类对象
  delete obj; // 先调用Derived的析构函数，再调用Base的析构函数
  return 0;
}
```

**析构函数的执行顺序**: 当通过基类指针删除派生类对象时，首先调用派生类的析构函数，然后调用基类的析构函数，确保派生类的资源先被释放，避免资源泄漏

如果这里obj的类型是Derived*，那么无论基类的析构函数是否是虚函数，都会正确调用Derived的析构函数，因为静态类型和动态类型都是Derived

如果基类的析构函数不是虚函数，就是静态绑定：obj的静态类型是Base，即使动态类型是Derived，也只会调用Base的析构函数

## 内联函数inline是什么

内联函数是一种通过在函数定义前加上`inline`关键字来**建议编译器**将函数调用替换为函数体的机制，目的是减少函数调用的开销，提高程序的执行效率

内联函数的主要特点:

1. 减少函数调用开销: 通过将函数调用替换为函数体，避免了函数调用的开销，如参数传递、栈帧创建等
2. 提高执行效率: 对于频繁调用的小函数，内联函数可以提高程序的执行效率
3. 编译器优化: 编译器可以根据具体情况决定是否将函数内联，通常对于小函数和频繁调用的函数更倾向于内联
4. 代码膨胀: 过多的内联函数可能导致生成的代码体积增大，影响缓存性能

适用于内联函数的场景:

- 小函数: 函数体较小，执行时间短的函数适合内联
- 频繁调用的函数: 在程序中被频繁调用的函数适合内联
- 简单的访问器函数: 如getter和setter函数适合内联
- 模板函数: 模板函数通常适合内联，以提高性能

宏是预处理阶段的文本替换，不具备类型检查和作用域，而内联函数是C++语言的一部分，是编译器优化的函数展开，具有类型检查和作用域，更安全和灵活

```cpp
#include <iostream>
using namespace std;

inline int add(int a, int b) { // 内联函数
  return a + b;
}

int main() {
  int result = add(5, 10); // 调用内联函数
  cout << "Result: " << result << endl;
  return 0;
}
```

## include的<>和""的区别

`#include <filename>`用于包含标准库头文件或系统头文件，编译器会在系统预定义的目录中搜索该文件，常用于包含标准库头文件
`#include "filename"`用于包含用户自定义的头文件，编译器首先在当前源文件所在的目录中搜索该文件，如果未找到，再在系统预定义的目录中搜索，常用于包含项目中的自定义头文件

## 编译中的静态库和动态库的区别

静态库（Static Library）: 在编译时将库文件的代码直接链接到可执行文件中，生成独立的可执行文件，运行时不依赖外部库文件
动态库（Dynamic Library）: 在运行时加载库文件，生成的可执行文件较小，运行时需要依赖外部库文件，可以实现代码共享和节省内存空间

主要区别:

1. 链接时机: 静态库在编译时链接，动态库在运行时加载
2. 可执行文件大小: 静态库生成的可执行文件较大，动态库生成的可执行文件较小
3. 依赖关系: 静态库不依赖外部库文件，动态库需要依赖外部库文件
4. 代码共享: 动态库可以实现多个程序共享同一份库代码，节省内存空间
5. 更新和维护: 动态库可以独立更新和维护，静态库需要重新编译可执行文件
6. 性能: 静态库在运行时性能较好，因为函数调用直接链接到可执行文件中，而动态库在运行时需要进行地址重定位，可能会有一定的性能开销
7. 平台依赖性: 动态库通常与操作系统和硬件平台相关，不同平台可能需要不同的动态库版本，而静态库在编译时已经链接到可执行文件中，具有更好的跨平台兼容性

静态库和动态库的生成方式：

```bash
# 生成静态库
g++ -c mylib.cpp -o mylib.o
ar rcs libmylib.a mylib.o # 将目标文件mylib.o打包成静态库libmylib.a

# 生成动态库
g++ -shared -fPIC mylib.cpp -o libmylib.so # 创建动态库libmylib.so

# 编译并链接动态库
g++ main.cpp -L. -lmylib -o myprogram # 参数-L指定库路径，-l指定库名(一般省略lib前缀和文件后缀)，生成可执行文件myprogram
```

## cpp的多态是如何实现的

多态是面向对象编程中的一个重要特性，允许不同类的对象通过相同的接口调用不同的实现，实现代码的灵活性和可扩展性

cpp的多态有两种形式:

- 编译时多态（静态多态）：通过函数重载和运算符重载实现，在编译时根据参数类型和数量决定调用哪个函数版本
- 运行时多态（动态多态）：通过虚函数和虚函数表（vtable）实现，在运行时根据对象的实际类型调用相应的函数版本，实现动态绑定

```cpp
#include <iostream>
using namespace std;

class Base {
public:
  virtual void show() { // 虚函数
    cout << "Base show" << endl;
  }
};

class Derived : public Base {
public:
  void show() override { // 重写虚函数
    cout << "Derived show" << endl;
  }
};

int main() {
  Base* obj = new Derived(); // 基类指针指向派生类对象
  obj->show(); // 调用Derived的show，输出"Derived show"，实现多态
  delete obj;
  return 0;
}
```

## cpp的函数对象是什么

函数对象（Function Object），也称为仿函数（Functor），是一个重载了`operator()`的类或结构体实例，可以像函数一样被调用

`operator()`是C++中的函数调用运算符，通过重载该运算符，可以使类的实例表现得像函数一样，可以直接使用括号`()`进行调用

```cpp
#include <iostream>
using namespace std;

class Adder {
public:
  Adder(int value) : value_(value) {}
  int operator()(int x) { // 重载operator()
    return value_ + x;
  }
private:
  int value_;
};

int main() {
  Adder add5(5); // 创建函数对象，初始化为5
  cout << add5(10) << endl; // 调用函数对象，输出15
  return 0;
}
```

## 空class的大小

空class在C++中至少占用1个字节的内存空间，以确保每个对象都有唯一的地址，尽管类中没有成员变量，但编译器仍然需要为每个对象分配内存地址

```cpp
#include <iostream>
using namespace std;

class EmptyClass {
};

int main() {
  cout << "Size of EmptyClass: " << sizeof(EmptyClass) << " byte(s)" << endl; // 输出1
  return 0;
}
```

## 模板是什么

模板是C++中的一种泛型编程机制，允许定义通用的类或函数，可以在实例化时指定具体的类型，实现代码的复用和灵活性

模板分为两种类型:

1. 函数模板: 用于定义通用的函数，可以接受不同类型的参数
2. 类模板: 用于定义通用的类，可以接受不同类型的成员变量

```cpp
#include <iostream>
using namespace std;

// 函数模板
template <typename T>
T add(T a, T b) {
  return a + b;
}

// 类模板
template <typename T>
class Box {
public:
  Box(T value) : value_(value) {}
  T getValue() { return value_; }
private:
  T value_;
};

int main() {
  // 使用函数模板
  cout << "Add int: " << add(5, 10) << endl; // 输出15
  cout << "Add double: " << add(3.5, 2.5) << endl; // 输出6.0

  // 使用类模板
  Box<int> intBox(10);
  cout << "Box int value: " << intBox.getValue() << endl; // 输出10

  Box<string> strBox("Hello");
  cout << "Box string value: " << strBox.getValue() << endl; // 输出Hello

  return 0;
}
```

## cpp的智能指针是什么

智能指针是C++标准库提供的一种用于自动管理动态分配内存的类模板，通过智能指针可以避免内存泄漏和悬空指针等问题，实现资源的自动释放和管理

主要的智能指针类型有:

1. `std::unique_ptr`: 独占所有权的智能指针，同一时间只能有一个`unique_ptr`指向某个对象，适用于单一所有权场景
2. `std::shared_ptr`: 共享所有权的智能指针，多个`shared_ptr`可以指向同一个对象，通过引用计数管理对象的生命周期，当最后一个`shared_ptr`被销毁时，自动释放对象
3. `std::weak_ptr`: 弱引用智能指针，不拥有对象的所有权，不能直接访问对象，用于解决`shared_ptr`的循环引用问题，可以通过`lock()`方法获取对应的`shared_ptr`

```cpp
#include <iostream>
#include <memory>
using namespace std;

int main() {
  // 使用unique_ptr
  unique_ptr<int> uptr(new int(10));
  cout << "Unique Pointer Value: " << *uptr << endl;

  // 使用shared_ptr
  shared_ptr<int> sptr1(new int(20));
  shared_ptr<int> sptr2 = sptr1; // 共享所有权
  cout << "Shared Pointer Value: " << *sptr1 << ", " << *sptr2 << endl;
  cout << "Shared Pointer Count: " << sptr1.use_count() << endl; // 输出2

  // 使用weak_ptr
  weak_ptr<int> wptr = sptr1; // 弱引用
  if (auto spt = wptr.lock()) { // 获取shared_ptr
    cout << "Weak Pointer Value: " << *spt << endl;
  } else {
    cout << "Weak Pointer is expired" << endl;
  }

  return 0;
}
```

## 虚拟内存是什么

## 内存分区有哪些
