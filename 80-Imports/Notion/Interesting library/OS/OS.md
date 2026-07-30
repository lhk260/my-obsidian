```Python
 >>> import os
 >>> os.name
 'nt'
 
 >>> os.environ["HOMEPATH"]
 'd:\\justdopython'
 
 >>> for item in os.walk("."):
 ...     print(item)
 ...
 ('.', ['do'], ['go_go_go.txt'])
 ('.\\do', ['IAmDirectory', 'python'], [])
 ('.\\do\\IAmDirectory', [], [])
 ('.\\do\\python', [], ['hello_justdopython.txt'])

 def get_filelists(file_dir='.'):
     list_directory = os.listdir(file_dir)
     filelists = []
     for directory in list_directory:
         # os.path 模块稍后会讲到
         if(os.path.isfile(directory)):
             filelists.append(directory)
     return filelists
     
 >>> os.mkdir("test_os_mkdir")
 >>> os.mkdir("test_os_mkdir")
 Traceback (most recent call last):
   File "<stdin>", line 1, in <module>
 FileExistsError: [WinError 183] 当文件已存在时，无法创建该文件。: 'test_os_mkdir'
 >>> 
 >>> os.mkdir("test_os_mkdir/test_os_makedirs/just/do/python/hello")
 Traceback (most recent call last):
   File "<stdin>", line 1, in <module>
 FileNotFoundError: [WinError 3] 系统找不到指定的路径。: 'test_os_mkdir/test_os_makedirs/just/do/python/hello'
 >>> 
 >>> os.makedirs("test_os_mkdir/test_os_makedirs/just/do/python/hello")
 
 >>> os.remove()
 >>> os.rmdir()
 >>> os.removedirs()
 
 >>> os.rename(src, dst)
 >>> os.renames()
 
 >>> os.getcwd() #“get the current working directory”
 'd:\\justdopython\\just\\do\\python'
 
 >>> os.chdir("d:/justdopython/just/do") #“change the directory”
 >>> os.getcwd()
 'd:\\justdopython\\just\\do'
 
 >>> os.chdir("..")
 >>> os.getcwd()
 'D:\\justdopython\\just'
 >>> with open("hello_justdopython.txt", encoding="utf-8") as f:
 ...     f.read()
 ...
 '欢迎访问 justdopython.com，一起学习 Python 技术~'
 >>> os.listdir()
 ['hello_justdopython.txt']
 
 >>> os.path.join("just", "do", "python", "dot", "com")
 'just\\do\\python\\dot\\com'
 >>> 
 >>> os.path.join("just", "do", "d:/", "python", "dot", "com")
 'd:/python\\dot\\com'
 >>> 
 >>> os.path.join("just", "do", "d:/", "python", "dot", "g:/", "com")
 'g:/com'
 >>> os.path.abspath("a:/just/do/python")
 'a:\\just\\do\\python'
 >>> # 我的系统中并没有 a 盘
 >>> os.path.abspath("ityouknow")
 'D:\\justdopython\\ityouknow'
 >>> os.path.basename("/ityouknow/justdopython/IAmBasename")
 'IAmBasename'
 >>> # 我的系统中同样没有这么一个路径。可见 os.path.basename() 页是单纯进行字符串处理
 >>> os.path.dirname("/ityouknow/justdopython/IAmBasename")
 '/ityouknow/justdopython'
 >>> 
 >>> os.path.dirname("/ityouknow/justdopython/IAmBasename/")
 '/ityouknow/justdopython/IAmBasename' 

 # os.path.split()才是真正的大哥
 def basename(p):
     """Returns the final component of a pathname"""
     return split(p)[1]
     
 def dirname(p):
     """Returns the directory component of a pathname"""
     return split(p)[0]
     
 >>> os.path.exists(".")
 True
 >>> os.path.exists("./just")
 True
 >>> os.path.exists("./Inexistence") # 不存在的路径
 False 

 >>> os.path.isabs("a:/justdopython")
 True

 >>> # 无效路径
 >>> os.path.isfile("a:/justdopython")
 False
 >>> 
 >>> # 有效路径
 >>> os.path.isfile("./just/plain_txt")
 True
 >>> 
 >>> # 无效路径
 >>> os.path.isdir("a:/justdopython/")
 False
 >>> # 有效路径
 >>> os.path.isdir("./just/")
 
```

![[v2-8be123b0dcf72bc5c03f764328531b91_720w.webp]]

> [!info] Python os 模块详解  
> Python os 模块详解1.  
> [https://zhuanlan.zhihu.com/p/150835193](https://zhuanlan.zhihu.com/p/150835193)
