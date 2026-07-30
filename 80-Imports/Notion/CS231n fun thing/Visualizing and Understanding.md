- 将ConvNet的第一个convolution层的卷积核可视化（可以可视化是因为input channel 为3）（想要可视化的动机是因为在范数的约束下（比如L2范数），input与卷积核越匹配，其点积越大，这是由柯西不等式轻松推出来的），发现第一层的卷积核大多都是在寻找oriented edge（有向边），明暗线条，相反颜色，这与人类视觉系统 相匹配。
- for deeper convolution layer：spread it out to 与channels数相匹配的灰度图像
- 考察最后一个FC层，联想：在原始pixel的空间作SVM排序，找到的是pixel意义下的neighbors，但是在最后的4096维的向量空间中作SVM，找到的是semantic意义下的neighbors！
- 降维方法：PCA（主成分分析）、t-SNE
- 遮挡图片的一部分（用数据集的平均像素值替代）如果图像在某一层的分数急剧下降，说明该层捕捉的就是这个特征。
- 考察分数对于每个像素的梯度，梯度越大，其对于分类的作用越关键。（可以用于无label的semantic segmentation）
- 风格迁移：先使用gradient descent调整模型的参数，再使用gradient ascent将噪点图变为风格类似的图

$\arg \max_IS_c(I)-\lambda||I||_2^2$

- Fooling Images/Adversarial Enamples
    - Start from an arbitary image
    - Pick an arbitrary class
    - Modify the image to maximize the class
    - Repeat until network is fooled
- DeepDream: A technique from a Google post
    
    - 先训练一个模型
    - 在将这个模型进行一些抖动，并前向传播
    - 选取一个特定层，将其gradient设置为其前向传播的activation
    - backprop
    
    [![](https://raw.githubusercontent.com/Tendourisu/images/master/image%2015.png)](https://raw.githubusercontent.com/Tendourisu/images/master/image%2015.png)
    
- **激活**（Activations）：通过不同的方法来观察神经网络中不同层次的激活情况。
    - **最近邻**（Nearest neighbors）：查看与某个输入特征最相似的样本，以理解网络的类别区分方式。
    - **降维**（Dimensionality reduction）：将高维特征向量降维到二维或三维空间，从而可视化特征分布。
    - **最大化补丁**（Maximal patcher）：找出对网络激活最强的区域，以识别重要特征。
    - **遮挡法**（Occlusion）：在输入中遮挡某些区域，观察其对输出的影响，以确定网络关注的重点。
- **梯度**（Gradients）：利用梯度信息理解网络的反向传播和决策过程。
    - **显著图**（Saliency map）：通过梯度显示出对特定输出贡献最大的输入区域。
    - **类别可视化**（Class visualization）：生成图像以最大化某个类别的响应，从而理解网络的类别表示。
    - **欺骗图像**（Fooling images）：创建可以欺骗网络的图像，从而揭示网络的潜在弱点。
    - **特征反转**（Feature inversion）：尝试将网络中某层的特征映射回输入空间，以可视化网络的内部特征表示。
- **趣味性方法**（Fun）：用于实验性的或艺术性探索。
    - **DeepDream**：通过放大特定特征图层中的激活，产生梦幻般的图像效果。
    - **风格迁移**（Style Transfer）：将一种图像的风格应用到另一图像上，探索网络在图像特征中的风格与内容分离能力。