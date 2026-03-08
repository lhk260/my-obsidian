#ConvNet

>[!abstract]+  
>We trained a large, deep convolutional neural network to classify the 1.2 million high-resolution images in the ImageNet LSVRC-2010 contest into the 1000 different classes. On the test data, we achieved top-1 and top-5 error rates of 37.5% and 17.0% which is considerably better than the previous state-of-the-art. The neural network, which has 60 million parameters and 650,000 neurons, consists of five convolutional layers, some of which are followed by max-pooling layers, and three fully-connected layers with a final 1000-way softmax. To make training faster, we used non-saturating neurons and a very efficient GPU implementation of the convolution operation. To reduce overfitting in the fully-connected layers we employed a recently-developed regularization method called “dropout” that proved to be very effective. We also entered a variant of this model in the ILSVRC-2012 competition and achieved a winning top-5 test error rate of 15.3%, compared to 26.2% achieved by the second-best entry.

读论文3遍法：

1. **标题、摘要、结论：读首尾** 是否感兴趣、是否适合
2. **通读论文、不推细节：扫读法** 了解文章的每部分在做什么
3. **推细节**：清楚每一句话、每段话的目的，为何这么写？思考作者的流程、实验步骤和遗留问题，是否能复现 or 继续解决？  
AlexNet：DL 浪潮的奠基作之一  
视角1：回到 2012 年， 理解文章  
视角2：2021 年时，AlexNet 过时 or 仍然适用的 idea  
**1.标题**  
ImageNet （当时最大的图片分类数据集 100w 图片 1000类别） Classification  
Deep Convolutional：2012 convolution 没有 tree SVM 火  
Neural Network  
**作者**  
Alex：第一作者命名的网络  
轶事：Goolge 研究院 引用次数 > 10w 有 20 + 人，都去参加了讲座；Ilya 讲了 3 个 dirty tricks：图片增强、ReLU、dropout，赢了比赛。  
大佬们的期待：这个工作揭示了深刻的见解，对世界的新理解；模型的新理解 or 任意关于模型的解释部分，不单纯只是 提出模型效果好 就可以。  
Why 效果好？How to apply? 在哪些地方的应用好？  
Hinton：DL 先驱  
**2.摘要**  
训练了卷积神经网络、图片分类效果好 SOTA （top1 + top5）、网络的参数和架构、加速训练的技巧、避免过拟合的 dropout、模型变体比赛赢  
1 What：干了什么？  
训练了 large, deep 的 CNN 以分类 120 w 图片的 1000 个类别。  
2 Outcome：效果如何？  
比前人工作好  
top-1 error: 37.5%  
top-5 error: 17%  
3 网络长什么样？  
600w 参数，65 w 神经元  
5 个卷积层 （< 5 max-pooling 层） + 3 个全连接层（1000-way softmax）  
4 这么多参数、怎么训练快点？  
non-saturating neurons + GPU 实现卷积运算  
5 这么多参数、学过头了怎么办？  
避免 FCN 的过拟合，dropout 正则 effective  
6 为什么我这么厉害？  
想知道？不告诉你，但我的兄弟姐妹也厉害！比赛冠军！远超第二！  
**3.结论**  
本文无 conclusion（和摘要一一对应），只有 discussion (吐槽（😂）、为来做什么)  
**P1：文章总结**  
**一句话，怎么总结我的好？**  
a large, deep CNN is capable of achieving record-breaking results (SOTA) on a highly challenging dataset（指的是ImageNet）using purely supervised learning.  
**什么情况，我会表现得不好呢？**
- remove a single convolutional layer
- i.e., 去掉中间层，降 2%  
depth is important.  
**深度重要，但深度是最重要的吗？**  
去掉一层 convolutional layer, 降低 2%；不能证明深度是最重要的。  
**可能的情况**：没设置好参数。  
AlexNet 可以去掉一些层、调节中间参数，效果不变。直接砍掉一层，掉 2% 可能是搜索参数做的不够，没调好参数。  
**反过来讲，结论没问题？**  
**深宽都重要**，i.e., 照片的高宽比  
深度重要 --> CNN 需要 **很深**。  
宽度也重要 --> 特别深 + 特别窄 or 特别浅 + 特别宽 ❌  
**P2：未来研究**  
**我们没有做什么？**  
did not use any unsupervised pre-training  
**不用 unsupervised pre-training 也没关系？**  
2012年 DL 的目的是：像“人”（不一定知道真实答案） 书读百遍、其意自现。  
通过训练一个非常大的神经网络，在没有标签的数据上，把数据的内在结构抽取出来。  
**关注的潮流怎么改变？**  
AlexNet之前大佬们爱：无监督学习  
（**Why 大佬们不爱 有监督学习？**）  
（有监督学习 打不赢 树 SVM ）  
AlexNet 证明 大力出奇迹。模型够大、有标签数据够多、我 No. 1 !  
最近大家一起爱：BERT、GAN  
**我们认为 pre-training 为什么好？**  
有充足计算资源 可以 增加网络 size 时，无需增加标注数据。  
**我们有多牛？**  
我们可以通过 让网络变大、训练更久，变得更强。  
但 2012年的结果 和人类比还是有差距。  
Note：现在图片里找简单的物品，DL 比人类好很多；图片识别在 无人车驾驶 的应用。  
**我们怎么继续牛🐂呢？**  
在 video 上训练 very large and deep CNN，因为 video 里的时序信息可以 辅助理解 图片的空间信息。  
**这么牛的事情，大家做到了吗？**  
目前，video 还是很难。why？图片和语言进展不错，video 相对于图片的计算量大幅增加，video 的版权问题。  
**4重要的图、公式**  
结果测试展示：  
效果在比较难的 case 表现不错  
![](https://i0.hdslb.com/bfs/note/16b65332f4f8b750715ce531f48f27de42b5eb9d.png@620w_!web-note.webp)  
motor scooter、leopard 雪豹、grille 敞篷车✔  
cherry ❌  
![8d8c4baed12d6432a1071819a34a88212c227cd9.png@620w_!web-note.webp](https://i0.hdslb.com/bfs/note/8d8c4baed12d6432a1071819a34a88212c227cd9.png@620w_!web-note.webp)  
![](https://i0.hdslb.com/bfs/note/8d8c4baed12d6432a1071819a34a88212c227cd9.png@620w_!web-note.webp)

向量集合：输入图片在 CNN 的倒数第二层的数，作为每个图片的语义向量  
给定一张图片，返回 和我向量相似的 图片；结果靠谱，❀、象、南瓜、狗🐕都差不多。  
**本文最重要的 是什么？real wow moment**  
Deep CNN 训练的结果，图片最后向量（学到了一种嵌入表示）的语义表示 特别好~！  
相似的图片的向量会比较近，学到了一个非常好的特征；非常适合后面的 ML，一个简单的 softmax 就能分类的很好！  
学习嵌入表示，DL 的一大强项。  
和当前最好结果的对比：远远超过别人（卖点、wow moment、sexy point）  
![](https://i0.hdslb.com/bfs/note/67a9c3778f7f919377f4305d38afe863326f3731.png@620w_!web-note.webp)  
96 个卷积核，学习不同模式  
![](https://i0.hdslb.com/bfs/note/f63715e4177b3a84b38b37853cb43e05ce3bec59.png@620w_!web-note.webp)  
模型架构图

![](https://i0.hdslb.com/bfs/note/3e5c25d0f744faefc7a7dfd632bfa7dabb915411.png@620w_!web-note.webp)

第一遍可能看不懂。  
**第一遍能看懂什么图？**  
实验结果图，比较了解的方向的模型结构图。以后第一遍读论文，遇到比较新、开创性、看不懂的模型结构图，第一遍放下，后面再看。  
**第一遍的印象：**结果特别好、NN 实现的，为什么好？怎么做的？  
**第一遍读完做什么？**  
要不要继续读？  
不读：很好用的 视觉网络；研究无关，放弃  
读：CV研究者，工作很好，赢了今年的比赛，明年大家都用这个模型打比赛，我不试试吗？哈哈哈
