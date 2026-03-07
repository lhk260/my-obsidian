---
title: argparse 和 absl Python包开发工具
tags:
  - python
date: " 2025-02-22T18:52:20+08:00 "
modify: " 2025-02-22T18:52:20+08:00 "
share: false
cdate: " 2025-02-22 "
mdate: " 2025-02-22 "
---

`argparse` 和 `absl` 都是用于在Python中处理命令行参数的工具，但它们在很多方面存在区别，以下是详细介绍：

### 1. 来源和背景

- **argparse**：`argparse` 是Python标准库的一部分，自Python 2.7和Python 3.2版本起被引入。这意味着在使用Python时，无需额外安装就可以直接使用它，使用起来非常方便，适用于各种Python项目。
- **absl**：`absl-py`（`absl`）是由Google开发的一个Python库，主要用于Google内部的Python项目。它是Google开源的一部分，旨在提供一套统一的命令行参数处理和日志记录解决方案，适用于大规模的项目开发。

### 2. 语法和使用方式

- **argparse**：使用时需要创建一个 `ArgumentParser` 对象，然后通过该对象的方法来定义命令行参数，最后调用 `parse_args()` 方法来解析参数。以下是一个简单的示例：

```python
1import argparse
2
3parser = argparse.ArgumentParser(description='Process some integers.')
4parser.add_argument('integers', metavar='N', type=int, nargs='+',
5                    help='an integer for the accumulator')
6parser.add_argument('--sum', dest='accumulate', action='store_const',
7                    const=sum, default=max,
8                    help='sum the integers (default: find the max)')
9
10args = parser.parse_args()
11print(args.accumulate(args.integers))
```

- **absl**：使用时需要从 `absl` 库中导入 `flags` 模块来定义命令行参数，然后使用 `app.run()` 来运行主函数。示例如下：

```python
1from absl import app
2from absl import flags
3
4FLAGS = flags.FLAGS
5flags.DEFINE_integer('num', 10, 'An integer value.')
6
7def main(argv):
8    print(f'The value of num is: {FLAGS.num}')
9
10if __name__ == '__main__':
11    app.run(main)
```

### 3. 功能特性

- **argparse**：
    - 提供了丰富的参数类型支持，如整数、浮点数、字符串等。
    - 支持位置参数和可选参数，并且可以定义参数的默认值、帮助信息等。
    - 可以自定义参数的解析逻辑，例如通过自定义类型函数来处理特殊格式的参数。
- **absl**：
    - 除了基本的参数处理功能外，还提供了日志记录功能，方便在项目中进行调试和信息输出。
    - 支持参数的分组和命名空间管理，使得参数的组织更加清晰。
    - 具有自动生成帮助信息的功能，并且支持在不同的Python文件中共享参数定义。

### 4. 适用场景

- **argparse**：适用于小型到中型的Python项目，尤其是那些对依赖库有严格限制或者希望使用标准库来处理命令行参数的项目。由于其简单易懂的API，新手也能快速上手。
- **absl**：更适合大型的、复杂的Python项目，特别是那些由Google开发或者遵循Google开发规范的项目。它的日志记录和参数管理功能可以帮助开发者更好地组织和维护项目。  
虽然 `argparse` 和 `absl` 在处理命令行参数上功能有重合，但它们有同时存在的必要，原因主要体现在以下几个方面：

### 1. 兼容性和通用性

- **argparse**
    - 作为Python标准库的一部分，`argparse` 最大的优势是通用性和兼容性。无论使用何种Python环境，都可以直接使用，无需额外安装依赖。这对于一些小型项目、脚本工具或者需要在不同Python版本和环境中快速部署的场景非常方便。例如，在一些简单的自动化脚本、数据处理脚本中，使用 `argparse` 可以快速实现命令行参数的解析，而不用担心依赖问题。
- **absl**
    - `absl` 是Google开发的库，虽然它的安装和使用需要额外引入依赖，但它在Google内部的项目生态中有很好的兼容性。许多Google开源的大型项目（如TensorFlow）都使用了 `absl` 来处理命令行参数和日志记录，这使得开发者在参与这些项目时能够更方便地使用统一的参数处理和日志管理方式。

### 2. 功能侧重点

- **argparse**
    - 侧重于提供一个灵活且基础的命令行参数解析框架。它允许开发者通过简单的API自定义参数的类型、默认值、帮助信息等，并且可以灵活地处理位置参数和可选参数。开发者可以根据自己的需求对参数解析逻辑进行定制，非常适合需要精细控制参数解析过程的场景。
- **absl**
    - 除了基本的参数解析功能外，还集成了日志记录等额外功能。它强调在大型项目中对参数和日志进行统一管理，提供了参数分组、命名空间管理等功能，使得项目的参数组织更加清晰。同时，它的日志记录功能可以方便地控制日志的输出级别和格式，有助于开发者在复杂项目中进行调试和监控。

### 3. 学习成本和使用习惯

- **argparse**
    - 由于其简单易懂的API和标准库的身份，对于Python初学者来说更容易上手。其使用方式符合Python的常规编程习惯，只需要创建 `ArgumentParser` 对象并添加参数，然后解析参数即可。这种简单直接的方式使得开发者可以快速实现基本的命令行参数解析功能。
- **absl**
    - 对于有一定Python开发经验，特别是熟悉Google开发规范和大型项目开发流程的开发者来说，`absl` 的使用方式和功能特性可能更符合他们的使用习惯。它的参数定义和管理方式与Google的其他工具和库有相似之处，能够提高开发效率和代码的一致性。

### 4. 社区和生态支持

- **argparse**
    - 作为Python标准库的一部分，拥有庞大的Python社区支持。开发者可以在各种Python相关的文档、教程和论坛中找到大量关于 `argparse` 的使用示例和解决方案。同时，由于其广泛使用，很多Python开发者都熟悉 `argparse`，这有利于代码的共享和协作。
- **absl**
    - 在Google开源项目的生态系统中得到了广泛的应用和支持。许多使用 `absl` 的项目都有详细的文档和社区支持，开发者可以参考这些项目的代码和文档来学习和使用 `absl`。此外，`absl` 的开发者社区也在不断发展壮大，为开发者提供了更多的交流和学习机会。

`argparse` 是 Python 标准库中用于解析命令行参数的模块，它提供了一种简单而灵活的方式来处理用户输入的命令行参数。下面将对 `argparse` 进行全面解析，涵盖其基本使用、参数类型、参数解析等方面。

### 基本使用步骤

#### 1. 导入模块

在 Python 脚本中，首先需要导入 `argparse` 模块：

```python
1import argparse
```

#### 2. 创建 `ArgumentParser` 对象

`ArgumentParser` 是 `argparse` 的核心类，用于定义命令行参数和解析用户输入。创建该对象时，可以提供一些描述信息，这些信息会在用户请求帮助时显示。

```python
1parser = argparse.ArgumentParser(description='A simple argparse example')
```

#### 3. 添加命令行参数

使用 `add_argument()` 方法向 `ArgumentParser` 对象添加参数。该方法可以接受多个参数，用于定义参数的名称、类型、默认值、帮助信息等。

```python
1# 添加一个位置参数
2parser.add_argument('input_file', help='Path to the input file')
3
4# 添加一个可选参数
5parser.add_argument('--output_file', help='Path to the output file')
```

#### 4. 解析命令行参数

调用 `parse_args()` 方法解析用户输入的命令行参数，返回一个包含所有参数值的命名空间对象。

```python
1args = parser.parse_args()
```

#### 5. 使用解析后的参数

通过访问命名空间对象的属性，可以获取用户输入的参数值。

```python
1print(f'Input file: {args.input_file}')
2if args.output_file:
3    print(f'Output file: {args.output_file}')
```

### 参数类型

#### 位置参数

位置参数是根据其在命令行中的位置来确定的，不需要使用参数名指定。例如：

```python
1import argparse
2
3parser = argparse.ArgumentParser()
4parser.add_argument('number', type=int, help='An integer number')
5args = parser.parse_args()
6print(f'You entered: {args.number}')
```

在命令行中运行该脚本时，需要直接提供参数值：

```sh
python script.py 42
```

#### 可选参数

可选参数需要使用参数名指定，通常以 `--` 开头。可以为可选参数指定默认值。例如：

```python
1import argparse
2
3parser = argparse.ArgumentParser()
4parser.add_argument('--verbose', action='store_true', help='Enable verbose mode')
5parser.add_argument('--output', default='output.txt', help='Output file name')
6args = parser.parse_args()
7
8if args.verbose:
9    print('Verbose mode is enabled')
10print(f'Output file: {args.output}')
```

在命令行中可以选择是否提供可选参数：

```sh
python script.py --verbose --output result.txt
```

### 参数解析相关方法和特性

#### `add_argument()` 方法的常用参数

- `name or flags`：参数的名称或标志，可以是位置参数名（如 `'input_file'`）或可选参数标志（如 `'--output_file'`）。
- `type`：参数的类型，如 `int`、`float`、`str` 等。
- `default`：参数的默认值。
- `help`：参数的帮助信息，会在用户请求帮助时显示。
- `action`：指定参数的处理方式，常见的有 `'store_true'`（当参数出现时将其值设为 `True`）、`'store_false'` 等。
- `nargs`：指定参数接受的参数值数量，可以是整数、`'?'`、`'*'`、`'+'` 等。例如：

```python
1import argparse
2
3parser = argparse.ArgumentParser()
4parser.add_argument('numbers', nargs='+', type=int, help='One or more numbers')
5args = parser.parse_args()
6print(f'Sum of numbers: {sum(args.numbers)}')
```

#### 子命令

`argparse` 支持子命令，用于实现不同的命令行功能。例如：

```python
1import argparse
2
3parser = argparse.ArgumentParser()
4subparsers = parser.add_subparsers(dest='command')
5
6# 创建一个子命令
7parser_foo = subparsers.add_parser('foo', help='Foo command')
8parser_foo.add_argument('bar', type=int, help='Bar argument for foo command')
9
10# 创建另一个子命令
11parser_baz = subparsers.add_parser('baz', help='Baz command')
12parser_baz.add_argument('--qux', type=str, help='Qux argument for baz command')
13
14args = parser.parse_args()
15
16if args.command == 'foo':
17    print(f'Foo command with bar: {args.bar}')
18elif args.command == 'baz':
19    if args.qux:
20        print(f'Baz command with qux: {args.qux}')
21    else:
22        print('Baz command without qux')
```

#### 帮助信息

当用户在命令行中使用 `-h` 或 `--help` 选项时，`argparse` 会自动显示帮助信息，包括脚本的描述、参数的说明等。例如：

```sh
python script.py --help
```

`argparse` 是一个功能强大且灵活的命令行参数解析模块，通过创建 `ArgumentParser` 对象、添加参数和解析参数，可以方便地处理各种命令行输入。它支持位置参数、可选参数、子命令等多种功能，并且能够自动生成详细的帮助信息，是 Python 开发者处理命令行参数的首选工具之一。

### 1. 直接在同一脚本中使用解析后的参数

当你在一个脚本中定义和解析命令行参数后，可以立即在该脚本后续代码中使用这些参数。以下是一个简单示例：

python

复制代码

```python
1import argparse
2
3# 创建 ArgumentParser 对象
4parser = argparse.ArgumentParser(description='A simple script to demonstrate argparse usage')
5
6# 添加位置参数
7parser.add_argument('input_file', help='Path to the input file')
8# 添加可选参数
9parser.add_argument('--output_file', default='output.txt', help='Path to the output file')
10
11# 解析命令行参数
12args = parser.parse_args()
13
14# 使用解析后的参数
15print(f'Input file path: {args.input_file}')
16print(f'Output file path: {args.output_file}')
17
18# 这里可以继续使用参数进行其他操作，例如读取输入文件并写入输出文件
19try:
20    with open(args.input_file, 'r') as infile, open(args.output_file, 'w') as outfile:
21        content = infile.read()
22        outfile.write(content.upper())
23    print('File processing completed.')
24except FileNotFoundError:
25    print(f'Error: The input file {args.input_file} was not found.')
26
```

在这个示例中，`parse_args()` 方法解析命令行输入后，返回的 `args` 对象包含了用户输入的参数值。后续代码直接通过访问 `args` 对象的属性来使用这些参数。

### 2. 在不同模块中使用命令行参数

如果你将命令行参数解析逻辑放在一个模块中，而在另一个模块中使用这些参数，可以通过函数封装和导入模块的方式实现。

#### 示例代码结构

```plaintext
project/
│
├── main.py
└── arg_parser.py
```

#### `arg_parser.py` 文件

```python
1import argparse
2
3def parse_arguments():
4    parser = argparse.ArgumentParser(description='A multi - module argparse example')
5    parser.add_argument('--message', default='Hello, World!', help='A custom message')
6    parser.add_argument('--repeat', type=int, default=1, help='Number of times to repeat the message')
7    return parser.parse_args()
8
```

#### `main.py` 文件

```python
1from arg_parser import parse_arguments
2
3# 调用解析函数获取参数
4args = parse_arguments()
5
6# 使用参数
7for _ in range(args.repeat):
8    print(args.message)
9
```

在这个例子中，`arg_parser.py` 模块定义了 `parse_arguments` 函数来解析命令行参数，`main.py` 模块导入该函数并调用它来获取解析后的参数，然后在 `main.py` 中使用这些参数。

### 3. 模拟命令行输入进行测试

在开发和测试过程中，你可能需要模拟命令行输入来测试 `argparse` 代码的功能。可以通过传递一个参数列表给 `parse_args` 方法来实现。

```python
1import argparse
2
3parser = argparse.ArgumentParser()
4parser.add_argument('--name', default='Guest', help='Your name')
5parser.add_argument('--age', type=int, default=18, help='Your age')
6
7# 模拟命令行输入
8test_args = ['--name', 'Alice', '--age', '25']
9args = parser.parse_args(test_args)
10
11print(f'Name: {args.name}, Age: {args.age}')
12
```

在这个示例中，我们通过手动传递一个参数列表 `test_args` 给 `parse_args` 方法，模拟了用户在命令行输入的参数，从而可以在代码内部进行测试。

在使用 `argparse` 模块时，`parser.parse_args([])` 和 `parser.parse_args()` 存在一定的区别，下面为你详细介绍：

### 1. `parser.parse_args()`

- **功能说明**：`parser.parse_args()` 方法用于解析实际从命令行获取的参数。当你在终端中运行 Python 脚本时，它会读取命令行中输入的所有参数，并根据你之前使用 `add_argument` 方法定义的参数规则进行解析。
- **示例代码**：

```python
1import argparse
2
3parser = argparse.ArgumentParser()
4parser.add_argument('--name', default='Guest', help='Your name')
5
6args = parser.parse_args()
7print(f"Hello, {args.name}!")
```

- **运行情况**：
    - 若在终端中运行 `python script.py --name John`，那么 `parse_args()` 会解析出 `--name` 参数的值为 `John`，并将其存储在 `args.name` 中，最终输出 `Hello, John!`。
    - 若直接运行 `python script.py`，没有提供 `--name` 参数，由于设置了默认值，`args.name` 会取默认值 `Guest`，输出 `Hello, Guest!`。

### 2. `parser.parse_args([])`

- **功能说明**：`parser.parse_args([])` 方法是将一个空列表作为参数传递给 `parse_args`。这意味着它不会从实际的命令行获取参数，而是按照参数定义中的默认值来填充参数。可以将其看作是模拟没有任何命令行输入的情况。
- **示例代码**：

```python
1import argparse
2
3parser = argparse.ArgumentParser()
4parser.add_argument('--name', default='Guest', help='Your name')
5
6args = parser.parse_args([])
7print(f"Hello, {args.name}!")
```

- **运行情况**：无论在终端中实际输入了什么命令行参数，由于传递了空列表，`parse_args` 不会去解析它们。因此，`args.name` 会直接使用定义参数时设置的默认值 `Guest`，最终输出 `Hello, Guest!`。

### 3. 区别总结

- `parser.parse_args()` 会从命令行读取用户输入的参数并进行解析，根据用户输入来确定参数的值，若用户未提供某些参数，则使用默认值。
- `parser.parse_args([])` 忽略实际的命令行输入，强制按照参数定义中的默认值来确定参数的值，通常用于测试或者在代码中模拟没有命令行输入的场景。

在使用 `argparse` 时，`parser.parse_args()` 通常不建议重复出现，下面从不同情况来分析具体原因：

### 正常情况下不建议重复调用

一般来说，一个 `ArgumentParser` 对象的 `parse_args()` 方法不应该被重复调用。原因在于，`parse_args()` 方法会解析命令行参数，并且在第一次调用时就已经将命令行参数解析完毕并返回结果。如果再次调用 `parse_args()`，它还是会尝试解析同样的命令行参数，这样不仅没有必要，还可能引发问题。

以下是示例代码：

python

复制代码

```python
1import argparse
2
3parser = argparse.ArgumentParser()
4parser.add_argument('--input', type=str, help='Input file path')
5
6# 第一次调用 parse_args()
7args1 = parser.parse_args()
8print(f"First parse: Input = {args1.input}")
9
10# 第二次调用 parse_args()
11args2 = parser.parse_args()
12print(f"Second parse: Input = {args2.input}")
```

在这个例子中，第二次调用 `parse_args()` 并没有实际意义，因为命令行参数不会在两次调用之间发生变化，两次解析得到的结果是一样的。

### 可能引发的问题

如果在代码中错误地重复调用 `parse_args()` 并且在两次调用之间修改了 `ArgumentParser` 对象的参数配置，可能会导致意外的结果或者抛出异常。例如：

python

复制代码

```python
1import argparse
2
3parser = argparse.ArgumentParser()
4parser.add_argument('--input', type=str, help='Input file path')
5
6# 第一次调用 parse_args()
7args1 = parser.parse_args()
8print(f"First parse: Input = {args1.input}")
9
10# 修改 ArgumentParser 对象
11parser.add_argument('--output', type=str, help='Output file path')
12
13# 第二次调用 parse_args()
14try:
15    args2 = parser.parse_args()
16    print(f"Second parse: Input = {args2.input}, Output = {args2.output}")
17except SystemExit:
18    print("An error occurred during the second parse.")
```

在上述代码中，第一次解析之后修改了 `ArgumentParser` 对象，第二次调用 `parse_args()` 时，由于命令行参数已经被消费过，它可能无法正确处理新添加的参数，从而导致 `SystemExit` 异常（因为 `argparse` 在遇到无法解析的情况时通常会调用 `sys.exit()` 退出程序）。

### 特殊情况

在某些特殊情况下，你可能需要多次解析不同来源的参数。例如，你想先解析一些预定义的参数列表，然后再解析实际的命令行参数。这时可以使用 `parse_args(args)` 方法，传入不同的参数列表进行解析。示例如下：

```python
1import argparse
2
3parser = argparse.ArgumentParser()
4parser.add_argument('--input', type=str, help='Input file path')
5parser.add_argument('--output', type=str, help='Output file path')
6
7# 解析预定义的参数列表
8predefined_args = ['--input', 'test.txt']
9pre_args = parser.parse_args(predefined_args)
10print(f"Pre - parsed: Input = {pre_args.input}, Output = {pre_args.output}")
11
12# 解析实际的命令行参数
13actual_args = parser.parse_args()
14print(f"Actual parsed: Input = {actual_args.input}, Output = {actual_args.output}")
```

在这个例子中，我们分别解析了预定义的参数列表和实际的命令行参数，但这与重复解析相同的命令行参数是不同的情况。

综上所述，一般不建议简单地重复调用 `parser.parse_args()`，除非有特殊需求并采用合适的方式来处理不同来源的参数解析。
