# 语义分割（**semantic segmentation）**

  

- 想法：对图片的每个像素做分类任务，相同类别的像素化为一大块
- 尝试：使用**sliding window**，将每个像素及其周围部分喂给ConvNet，但时空复杂度高。想到全连接卷积网络。

## **Fully Convolutional Net**

- 尝试：3x3的**filter**与1 **padding**，最后得到CxWxH，在C轴上使用softmax。缺点：参数过大，不易训练。
- 优化方向：使用**down sampling（pooling， strided conv）**与**up sampling（to increase spatial resolution）**

[![](https://raw.githubusercontent.com/Tendourisu/images/master/image%2014.png)](https://raw.githubusercontent.com/Tendourisu/images/master/image%2014.png)

- 问题：how to ==**up sampling**==？
    
    1. nearest neighbor pooling（just duplicate）
    2. **bed of nails(钉床）pooling** 注意：可以利用network 的 symmetry，前半部分的maxpooling层可以记住max的位置，在之后的bed of nails pooling 时可以对应操作
    
    [![](https://raw.githubusercontent.com/Tendourisu/images/master/image%201%208.png)](https://raw.githubusercontent.com/Tendourisu/images/master/image%201%208.png)
    
- 优点：缓解maxpooling的降清晰度带来的信息损失

### Transpose Convolution（deconvolution）

- 想法：可学习的 up sampling layer（对应于strided conv）

[![](https://raw.githubusercontent.com/Tendourisu/images/master/image%202%209.png)](https://raw.githubusercontent.com/Tendourisu/images/master/image%202%209.png)

- 具体理解transpose的含义（一维情况）（卷积核是（x y z））：
    
    一般的convolution $\overrightarrow{x} *\overrightarrow{a}=X\overrightarrow{a}$﻿
    
    $\begin{bmatrix}$﻿
    
    transpose convolution $\overrightarrow{x} *^T\overrightarrow{a}=X^T\overrightarrow{a}$﻿
    
    $\begin{bmatrix}$﻿这里的transpose不是数学意义上的逆，而是形式上将第一个矩阵取转置
    

# classification+localization

- 想法：在最后的类别向量中加上四位定位向量（x， y，w， h）用于定位bounding box
- 实际训练中发现：联合训练要比两个任务分开训练要易操作些
- 扩展：这种方法可用于骨骼定位（提醒：分类用softmax，回归用L2 Euclidean）

# object detection

- 任务：定位加分类
- 难点：不知道对象有多少个
- 尝试：**sliding window**，但是仍旧复杂度过高
- 想法：**region proposals**, 使用selective search（非学习的固定算法）来确定候选区域（R-CNN），再将候选区域喂给ConvNet做分类
    - little trick：大量的候选区域可分类为 background class，即无关区域
    - 缺陷：速度慢，selective search使用的特征需要大量储存空间
- 改进：**Fast R-CNN ，**selective search前加一层Conv
- 再改进：**Faster R-CNN，** 用region proposal network去替代selective search，同时执行四个任务
    - RPN clasify object / not object
    - RPN regress box coordinates
    - Final classification score
    - Final box coordinates
- dark magic: **YOLO(You Only Look Once)/SSD (Single Shoot Detection)**

[![](https://raw.githubusercontent.com/Tendourisu/images/master/image%203%207.png)](https://raw.githubusercontent.com/Tendourisu/images/master/image%203%207.png)

- 再再改进：**Mask R-CNN,** 在Faster R-CNN 的基础上，在进行最后的classification任务的同时，进行语义分割，从而分割出边界框

[![](https://raw.githubusercontent.com/Tendourisu/images/master/image%204%207.png)](https://raw.githubusercontent.com/Tendourisu/images/master/image%204%207.png)

[![](https://raw.githubusercontent.com/Tendourisu/images/master/image%205%207.png)](https://raw.githubusercontent.com/Tendourisu/images/master/image%205%207.png)