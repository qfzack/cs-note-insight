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

| 类型     | 描述         | 大小        | 示例                     |
|----------|--------------|-------------|-------------------------|
| char     | 字符类型     | 1字节       | char ch = 'A';           |
| wchar_t  | 宽字符类型   | 2或4字节    | wchar_t wch = L'A';      |
| char16_t | 16位字符类型 | 2字节       | char16_t c16 = u'A';     |
| char32_t | 32位字符类型 | 4字节       | char32_t c32 = U'A';     |

- 整数类型

| 类型        | 描述              | 大小          | 示例                     |
|-------------|------------------|---------------| -------------------------|
| short       | 短整型            | 2字节         | short int s = 100;       |
| int         | 整型              | 4字节         | int i = 1000;            |
| long        | 长整型            | 4或8字节      | long int l = 100000;      |
| long long   | 长长整型          | 8字节         | long long ll = 1000000;   |

- 浮点类型

| 类型        | 描述           | 大小           | 示例                      |
|-------------|----------------|----------------|---------------------------|
| float       | 单精度浮点型   | 4字节          | float f = 3.14f;          |
| double      | 双精度浮点型   | 8字节          | double d = 3.1415926535;  |
| long double | 扩展精度浮点型 | 10、12或16字节 | long double ld = 3.14L;   |

- 其他类型

| 类型        | 描述         | 大小           | 示例                       |
|-------------|--------------|----------------|----------------------------|
| bool        | 布尔类型     | 1字节          | bool flag = true;          |
| void        | 空类型       | 0字节          | void func();               |
| nullptr_t   | 空指针类型   | 与指针大小相同 | nullptr_t np = nullptr;    |

> auto和decltype用于类型推导，auto根据初始化表达式推导类型，decltype根据变量或表达式的类型推导

## 类型修饰符

| 修饰符        | 描述                                  | 示例                      |
|---------------|-------------------------------------|---------------------------|
| signed        | 指定有符号类型                        | signed int si = -10;      |
| unsigned      | 指定无符号类型                        | unsigned int ui = 10;     |
| short         | 指定短整型                            | short int s = 100;        |
| long          | 指定长整型                            | long int l = 100000;      |
| const         | 表示常量，值不可修改                   | const int b = 5;          |
| static        | 表示静态存储期，变量在程序生命周期内存在 | static int a = 0;         |
| volatile      | 表示变量可能被意外修改，禁止编译器优化   | volatile int c = 10;      |
| mutable       | 表示类成员可以在 const 对象中被修改     | mutable int counter;      |
| extern        | 表示变量或函数在其他文件中定义           | extern int d;             |
| thread_local  | 表示变量为线程局部存储                | thread_local int t_var;   |

## 派生数据类型

| 数据类型 | 描述                                         | 示例                                 |
|----------|--------------------------------------------|--------------------------------------|
| 数组     | 相同类型元素的顺序集合                         | int arr[5] = {1,2,3,4,5};            |
| 指针     | 保存变量(或对象)的内存地址                     | int* p = &x;                         |
| 引用     | 变量的别名(必须初始化,不可更换指向)             | int& r = x;                          |
| 枚举     | 用户定义的命名整数常量集合                     | enum Color { RED, GREEN, BLUE };     |
| 函数     | 函数类型(仅有返回类型与参数类型的签名)           | int func(int a, int b);              |
| 结构体   | 聚合类型,成员默认 public                      | struct Point { int x; int y; };      |
| 类       | 自定义类型,支持封装/继承/多态                  | class MyClass { /*...*/ };           |
| 联合体   | 多成员共享同一内存,一次仅有效一个成员            | union Data { int i; float f; };      |

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

## 函数

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

### 指针

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