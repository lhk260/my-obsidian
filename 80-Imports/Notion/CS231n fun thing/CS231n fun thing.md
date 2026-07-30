## **Nearest Neighbor Classifier**

```Python
Xtr, Ytr, Xte, Yte = load_CIFAR10('data/cifar10/') # a magic function we provide
# flatten out all images to be one-dimensional
Xtr_rows = Xtr.reshape(Xtr.shape[0], 32 * 32 * 3) # Xtr_rows becomes 50000 x 3072
Xte_rows = Xte.reshape(Xte.shape[0], 32 * 32 * 3) # Xte_rows becomes 10000 x 3072
nn = NearestNeighbor() # create a Nearest Neighbor classifier class
nn.train(Xtr_rows, Ytr) # train the classifier on the training images and labels
Yte_predict = nn.predict(Xte_rows) # predict labels on the test images
# and now print the classification accuracy, which is the average number
# of examples that are correctly predicted (i.e. label matches)
print 'accuracy: %f' % ( np.mean(Yte_predict == Yte) )

import numpy as np

class NearestNeighbor(object):
  def __init__(self):
    pass

  def train(self, X, y):
    """ X is N x D where each row is an example. Y is 1-dimension of size N """
    # the nearest neighbor classifier simply remembers all the training data
    self.Xtr = X
    self.ytr = y

  def predict(self, X):
    """ X is N x D where each row is an example we wish to predict label for """
    num_test = X.shape[0]
    # lets make sure that the output type matches the input type
    Ypred = np.zeros(num_test, dtype = self.ytr.dtype)

    # loop over all test rows
    for i in range(num_test):
      # find the nearest training image to the i'th test image
      # using the L1 distance (sum of absolute value differences)
      distances = np.sum(np.abs(self.Xtr - X[i,:]), axis = 1)
      min_index = np.argmin(distances) # get the index with smallest distance
      Ypred[i] = self.ytr[min_index] # predict the label of the nearest example

    return Ypred

def L_i_vectorized(x, y, W):
  """
  A faster half-vectorized implementation. half-vectorized
  refers to the fact that for a single example the implementation contains
  no for loops, but there is still one loop over the examples (outside this function)
  """
  delta = 1.0
  scores = W.dot(x)
  # compute the margins for all classes in one vector operation
  margins = np.maximum(0, scores - scores[y] + delta)
  # on y-th position scores[y] - scores[y] canceled and gave delta. We want
  # to ignore the y-th position and only consider margin on max wrong class
  margins[y] = 0
  loss_i = np.sum(margins)
  return loss_i
```

## CouputingTheGradient

```Python
def eval_numerical_gradient(f, x):
  """
  a naive implementation of numerical gradient of f at x
  - f should be a function that takes a single argument
  - x is the point (numpy array) to evaluate the gradient at
  """

  fx = f(x) # evaluate function value at original point
  grad = np.zeros(x.shape)
  h = 0.00001

  # iterate over all indexes in x
  it = np.nditer(x, flags=['multi_index'], op_flags=['readwrite'])
  while not it.finished:

    # evaluate function at x+h
    ix = it.multi_index
    old_value = x[ix]
    x[ix] = old_value + h # increment by h
    fxh = f(x) # evalute f(x + h)
    x[ix] = old_value # restore to previous value (very important!)

    # compute the partial derivative
    grad[ix] = (fxh - fx) / h # the slope
    it.iternext() # step to next dimension

  return grad
```

## Matrix-MatrixMultiplyGradient

```Python
# forward pass
W= np.random.randn(5, 10)
X= np.random.randn(10, 3)
D= W.dot(X)

# now suppose we had the gradient on D from above in the circuit
dD= np.random.randn(*D.shape)# same shape as D
dW= dD.dot(X.T)#.T gives the transpose of the matrix
dX= W.T.dot(dD)
```

## ConvNet Summary

[![](https://raw.githubusercontent.com/Tendourisu/images/master/image%202.png)](https://raw.githubusercontent.com/Tendourisu/images/master/image%202.png)

[![](https://raw.githubusercontent.com/Tendourisu/images/master/image%201.png)](https://raw.githubusercontent.com/Tendourisu/images/master/image%201.png)

  

```Python
X_train_folds = np.array_split(X_train, num_folds)

accuracy = np.mean(y_val_pred == y_val_cv)
  
self.W = 0.001 * np.random.randn(dim, num_classes)

np.linalg.norm(). 

y_pred = np.argmax(X.dot(self.W), axis=1)

closest_idxs = np.argsort(dists[i])[:k]

indices = np.random.choice(num_train, batch_size, replace=True)

closest_idxs = np.argsort(dists[i])[:k]
closest_y = self.y_train[closest_idxs]
y_pred[i] = np.bincount(closest_y).argmax()

idxs = np.where((y_test != cls) & (y_test_pred == cls))[0]
idxs = np.random.choice(idxs, examples_per_class, replace=False)
```

  

## 绘图技巧

[![](https://raw.githubusercontent.com/Tendourisu/images/master/image%202%202.png)](https://raw.githubusercontent.com/Tendourisu/images/master/image%202%202.png)

[![](https://raw.githubusercontent.com/Tendourisu/images/master/image%203.png)](https://raw.githubusercontent.com/Tendourisu/images/master/image%203.png)

## SVMtmax

```Python
def svm_loss(x, y):
    """
    Computes the loss and gradient using for multiclass SVM classification.

    Inputs:
    - x: Input data, of shape (N, C) where x[i, j] is the score for the jth
      class for the ith input.
    - y: Vector of labels, of shape (N,) where y[i] is the label for x[i] and
      0 <= y[i] < C

    Returns a tuple of:
    - loss: Scalar giving the loss
    - dx: Gradient of the loss with respect to x
    """
    loss, dx = None, None

    ###########################################################################
    # TODO: Copy over your solution from A1.
    ###########################################################################
    # *****START OF YOUR CODE (DO NOT DELETE/MODIFY THIS LINE)*****

    N = x.shape[0]  # Number of samples
    C = x.shape[1]  # Number of classes

    # Compute the correct class scores
    correct_class_scores = x[np.arange(N), y].reshape(N, 1)

    # Compute the margins
    margins = np.maximum(0, x - correct_class_scores + 1)  # +1 for the margin
    margins[np.arange(N), y] = 0  # Do not count the correct class in loss

    # Compute the loss
    loss = np.sum(margins) / N

    # Compute the gradient
    dx = np.zeros_like(x)
    # Count how many times each class was incorrectly predicted
    dx[margins > 0] = 1
    # For the correct class, subtract the count of incorrect predictions
    incorrect_counts = np.sum(dx, axis=1)
    dx[np.arange(N), y] -= incorrect_counts

    # Average the gradient
    dx /= N


    # *****END OF YOUR CODE (DO NOT DELETE/MODIFY THIS LINE)*****
    ###########################################################################
    #                             END OF YOUR CODE                            #
    ###########################################################################
    return loss, dx
```

## Softmax

```Python
def softmax_loss(x, y):
    """
    Computes the loss and gradient for softmax classification.

    Inputs:
    - x: Input data, of shape (N, C) where x[i, j] is the score for the jth
      class for the ith input.
    - y: Vector of labels, of shape (N,) where y[i] is the label for x[i] and
      0 <= y[i] < C

    Returns a tuple of:
    - loss: Scalar giving the loss
    - dx: Gradient of the loss with respect to x
    """
    loss, dx = None, None

    ###########################################################################
    # TODO: Copy over your solution from A1.
    ###########################################################################
    # *****START OF YOUR CODE (DO NOT DELETE/MODIFY THIS LINE)*****

    N = x.shape[0]
    C = x.shape[1]

    # Shift the scores for numerical stability
    shift_x = x - np.max(x, axis=1, keepdims=True)

    # Compute softmax probabilities
    exp_scores = np.exp(shift_x)
    softmax_probs = exp_scores / np.sum(exp_scores, axis=1, keepdims=True)

    # Compute the loss: cross-entropy
    loss = -np.sum(np.log(softmax_probs[np.arange(N), y])) / N

    # Compute the gradient
    dx = softmax_probs.copy()
    dx[np.arange(N), y] -= 1  # Subtract 1 from the correct class scores
    dx /= N  # Average over the number of samples
    # *****END OF YOUR CODE (DO NOT DELETE/MODIFY THIS LINE)*****
    ###########################################################################
    #                             END OF YOUR CODE                            #
    ###########################################################################
    return loss, dx
```

## 炼丹

```Python
learning_rates = [1e-7, 5e-5]
regularization_strengths = [1e4, 2.5e4, 5e4]

# *****START OF YOUR CODE (DO NOT DELETE/MODIFY THIS LINE)*****

for lr in learning_rates:
    for reg in regularization_strengths:
        # 创建一个新的线性 SVM 模型
        svm = LinearSVM()
        
        # 训练模型
        svm.train(X_train, y_train, learning_rate=lr, reg=reg, num_iters=1500, batch_size=200, verbose=False)
        
        # 计算训练集上的准确性
        y_train_pred = svm.predict(X_train)
        train_accuracy = np.mean(y_train == y_train_pred)
        
        # 计算验证集上的准确性
        y_val_pred = svm.predict(X_val)
        val_accuracy = np.mean(y_val == y_val_pred)
        
        # 将结果存储在字典中
        results[(lr, reg)] = (train_accuracy, val_accuracy)
        
        # 更新最佳验证准确性和对应的 SVM 模型
        if val_accuracy > best_val:
            best_val = val_accuracy
            best_svm = svm

# *****END OF YOUR CODE (DO NOT DELETE/MODIFY THIS LINE)*****
    
# Print out results.
for lr, reg in sorted(results):
    train_accuracy, val_accuracy = results[(lr, reg)]
    print('lr %e reg %e train accuracy: %f val accuracy: %f' % (
                lr, reg, train_accuracy, val_accuracy))
    
print('best validation accuracy achieved during cross-validation: %f' % best_val)
```

`**ReLU**` `**Rectified Linear Unit**`

## PCA主成分分析

假设输入数据矩阵 X 的大小为 [N x D]

```Python
X -= np.mean(N x D)X -= np.mean(X, axis = 0) # 将数据置零居中（很重要）
cov = np.dot(X.T, X) / X.shape[0] # 得到数据协方差矩阵
```

数据协方差矩阵的 (i,j) 元素包含数据的 i 维和 j 维之间的协方差。特别是，该矩阵的对角线包含方差。此外，协方差矩阵是对称和正半有限的。我们可以计算数据协方差矩阵的 SVD 因式分解：

```Python
U,S,V = np.linalg.svd(cov)
```

其中 U 的列是特征向量，S 是奇异值的一维数组。为了对数据进行去相关处理，我们将原始数据（但以零为中心）投影到特征基础中：

```Python
Xrot = np.dot(X, U) # 对数据进行去相关处理
```

  
请注意，U 的列是一组正交向量（规范为 1，且相互正交），因此可以将它们视为基向量。因此，投影相当于在 X 轴上旋转数据，这样新的轴就是特征向量。如果我们计算 Xrot 的协方差矩阵，就会发现它现在是对角的。np.linalg.svd 的一个很好的特性是，在其返回值 U 中，特征向量列按其特征值排序。我们可以利用这一点来降低数据的维度，只使用最前面的几个特征向量，而舍弃数据没有方差的维度。这有时也被称为主成分分析（PCA）降维：  

```Python
Xrot_reduced = np.dot(X, U[:,:100]) # Xrot_reduced becomes [N x 100].
```

经过这个操作后，我们将把大小为 [N x D] 的原始数据集缩减为大小为 [N x 100] 的数据集，保留了数据中方差最大的 100 个维度。通常情况下，在 PCA 缩减后的数据集上训练线性分类器或神经网络可以获得很好的性能，从而节省空间和时间。

  

## **Calibrating the variances with 1/sqrt(n)**.

One problem with the above suggestion is that the distribution of the outputs from a randomly initialized neuron has a variance that grows with the number of inputs. It turns out that we can normalize the variance of each neuron’s output to 1 by scaling its weight vector by the square root of its _fan-in_ (i.e. its number of inputs). That is, the recommended heuristic is to initialize each neuron’s weight vector as: `w = np.random.randn(n) / sqrt(n)`, where `n` is the number of its inputs. This ensures that all neurons in the network initially have approximately the same output distribution and empirically improves the rate of convergence.

## 关于初始化系数的讨论

[![](https://raw.githubusercontent.com/Tendourisu/images/master/image%204.png)](https://raw.githubusercontent.com/Tendourisu/images/master/image%204.png)

## MomentumUpdate

[![](https://raw.githubusercontent.com/Tendourisu/images/master/image%205.png)](https://raw.githubusercontent.com/Tendourisu/images/master/image%205.png)

```Python
# Momentum update
v = mu * v - learning_rate * dx # integrate velocity
x += v # integrate position
```

```Python
\#Nesterov momentum update(Nesterov Accelerated Gradient NAG)
x_ahead = x + mu * v
# evaluate dx_ahead (the gradient at x_ahead instead of at x)
v = mu * v - learning_rate * dx_ahead
x += v
```

```Python
\#Adagrad

# Assume the gradient dx and parameter vector x
cache += dx**2
x += - learning_rate * dx / (np.sqrt(cache) + eps)
```

```Python
\#RMSprop

cache = decay_rate * cache + (1 - decay_rate) * dx**2
x += - learning_rate * dx / (np.sqrt(cache) + eps)
```

```Python
\#Adam

m = beta1*m + (1-beta1)*dx
v = beta2*v + (1-beta2)*(dx**2)
x += - learning_rate * m / (np.sqrt(v) + eps)

\#Full Adam

# t is your iteration counter going from 1 to infinity
m = beta1*m + (1-beta1)*dx
mt = m / (1-beta1**t)
v = beta2*v + (1-beta2)*(dx**2)
vt = v / (1-beta2**t)
x += - learning_rate * mt / (np.sqrt(vt) + eps)

\#experienced default settings:
\#beta1 = 0.9 
\#beta2 = 0.999 
\#learning_rate = 1e-3 or 5e-4
```

## BatchNormalization

```Python
def batchnorm_forward(x, gamma, beta, bn_param):
    """Forward pass for batch normalization.

    During training the sample mean and (uncorrected) sample variance are
    computed from minibatch statistics and used to normalize the incoming data.
    During training we also keep an exponentially decaying running mean of the
    mean and variance of each feature, and these averages are used to normalize
    data at test-time.

    At each timestep we update the running averages for mean and variance using
    an exponential decay based on the momentum parameter:

    running_mean = momentum * running_mean + (1 - momentum) * sample_mean
    running_var = momentum * running_var + (1 - momentum) * sample_var

    Note that the batch normalization paper suggests a different test-time
    behavior: they compute sample mean and variance for each feature using a
    large number of training images rather than using a running average. For
    this implementation we have chosen to use running averages instead since
    they do not require an additional estimation step; the torch7
    implementation of batch normalization also uses running averages.

    Input:
    - x: Data of shape (N, D)
    - gamma: Scale parameter of shape (D,)
    - beta: Shift paremeter of shape (D,)
    - bn_param: Dictionary with the following keys:
      - mode: 'train' or 'test'; required
      - eps: Constant for numeric stability
      - momentum: Constant for running mean / variance.
      - running_mean: Array of shape (D,) giving running mean of features
      - running_var Array of shape (D,) giving running variance of features

    Returns a tuple of:
    - out: of shape (N, D)
    - cache: A tuple of values needed in the backward pass
    """
    mode = bn_param["mode"]
    eps = bn_param.get("eps", 1e-5)
    momentum = bn_param.get("momentum", 0.9)

    N, D = x.shape
    running_mean = bn_param.get("running_mean", np.zeros(D, dtype=x.dtype))
    running_var = bn_param.get("running_var", np.zeros(D, dtype=x.dtype))

    out, cache = None, None
    if mode == "train":
        #######################################################################
        # TODO: Implement the training-time forward pass for batch norm.      #
        # Use minibatch statistics to compute the mean and variance, use      #
        # these statistics to normalize the incoming data, and scale and      #
        # shift the normalized data using gamma and beta.                     #
        #                                                                     #
        # You should store the output in the variable out. Any intermediates  #
        # that you need for the backward pass should be stored in the cache   #
        # variable.                                                           #
        #                                                                     #
        # You should also use your computed sample mean and variance together #
        # with the momentum variable to update the running mean and running   #
        # variance, storing your result in the running_mean and running_var   #
        # variables.                                                          #
        #                                                                     #
        # Note that though you should be keeping track of the running         #
        # variance, you should normalize the data based on the standard       #
        # deviation (square root of variance) instead!                        #
        # Referencing the original paper (https://arxiv.org/abs/1502.03167)   #
        # might prove to be helpful.                                          #
        #######################################################################
        # *****START OF YOUR CODE (DO NOT DELETE/MODIFY THIS LINE)*****

        # 计算当前批次的均值和方差
        sample_mean = np.mean(x, axis=0)
        sample_var = np.var(x, axis=0)

        # 归一化输入数据
        x_normalized = (x - sample_mean) / np.sqrt(sample_var + eps)

        # 缩放和平移
        out = gamma * x_normalized + beta

        # 更新运行中的均值和方差
        running_mean = momentum * running_mean + (1 - momentum) * sample_mean
        running_var = momentum * running_var + (1 - momentum) * sample_var

        # 存储中间结果以便反向传播时使用
        cache = (x, x_normalized, sample_mean, sample_var, gamma, beta, eps)

        # *****END OF YOUR CODE (DO NOT DELETE/MODIFY THIS LINE)*****
        #######################################################################
        #                           END OF YOUR CODE                          #
        #######################################################################
    elif mode == "test":
        #######################################################################
        # TODO: Implement the test-time forward pass for batch normalization. #
        # Use the running mean and variance to normalize the incoming data,   #
        # then scale and shift the normalized data using gamma and beta.      #
        # Store the result in the out variable.                               #
        #######################################################################
        # *****START OF YOUR CODE (DO NOT DELETE/MODIFY THIS LINE)*****

        # 使用运行中的均值和方差进行归一化
        x_normalized = (x - running_mean) / np.sqrt(running_var + eps)

        # 缩放和平移
        out = gamma * x_normalized + beta

        # *****END OF YOUR CODE (DO NOT DELETE/MODIFY THIS LINE)*****
        #######################################################################
        #                          END OF YOUR CODE                           #
        #######################################################################
    else:
        raise ValueError('Invalid forward batchnorm mode "%s"' % mode)

    # Store the updated running means back into bn_param
    bn_param["running_mean"] = running_mean
    bn_param["running_var"] = running_var

    return out, cache
```

[![](https://raw.githubusercontent.com/Tendourisu/images/master/image%206.png)](https://raw.githubusercontent.com/Tendourisu/images/master/image%206.png)

```Python
def batchnorm_backward(dout, cache):
    """Backward pass for batch normalization.

    For this implementation, you should write out a computation graph for
    batch normalization on paper and propagate gradients backward through
    intermediate nodes.

    Inputs:
    - dout: Upstream derivatives, of shape (N, D)
    - cache: Variable of intermediates from batchnorm_forward.

    Returns a tuple of:
    - dx: Gradient with respect to inputs x, of shape (N, D)
    - dgamma: Gradient with respect to scale parameter gamma, of shape (D,)
    - dbeta: Gradient with respect to shift parameter beta, of shape (D,)
    """
    dx, dgamma, dbeta = None, None, None
    ###########################################################################
    # TODO: Implement the backward pass for batch normalization. Store the    #
    # results in the dx, dgamma, and dbeta variables.                         #
    # Referencing the original paper (https://arxiv.org/abs/1502.03167)       #
    # might prove to be helpful.                                              #
    ###########################################################################
    # *****START OF YOUR CODE (DO NOT DELETE/MODIFY THIS LINE)*****

    x, x_normalized, sample_mean, sample_var, gamma, beta, eps = cache
    N, D = dout.shape

    # Step 1: Calculate dbeta and dgamma
    dbeta = np.sum(dout, axis=0)
    dgamma = np.sum(dout * x_normalized, axis=0)

    # Step 2: Calculate dx_normalized
    dx_normalized = dout * gamma

    # Step 3: Calculate dsample_var
    dsample_var = np.sum(dx_normalized * (x - sample_mean) * -0.5 * (sample_var + eps)**(-1.5), axis=0)

    # Step 4: Calculate dsample_mean
    dsample_mean = np.sum(dx_normalized * -1 / np.sqrt(sample_var + eps), axis=0) + dsample_var * np.sum(-2 * (x - sample_mean), axis=0) / N

    # Step 5: Calculate dx
    dx = dx_normalized / np.sqrt(sample_var + eps) + dsample_var * 2 * (x - sample_mean) / N + dsample_mean / N  

    # *****END OF YOUR CODE (DO NOT DELETE/MODIFY THIS LINE)*****
    ###########################################################################
    #                             END OF YOUR CODE                            #
    ###########################################################################

    return dx, dgamma, dbeta
```

## pytorch使用

```C++
class TwoLayerFC(nn.Module):
    def __init__(self, input_size, hidden_size, num_classes):
        super().__init__()
        # assign layer objects to class attributes
        self.fc1 = nn.Linear(input_size, hidden_size)
        # nn.init package contains convenient initialization methods
        # http://pytorch.org/docs/master/nn.html\#torch-nn-init 
        nn.init.kaiming_normal_(self.fc1.weight)
        self.fc2 = nn.Linear(hidden_size, num_classes)
        nn.init.kaiming_normal_(self.fc2.weight)
    
    def forward(self, x):
        # forward always defines connectivity
        x = flatten(x)
        scores = self.fc2(F.relu(self.fc1(x)))
        return scores

def test_TwoLayerFC():
    input_size = 50
    x = torch.zeros((64, input_size), dtype=dtype)  # minibatch size 64, feature dimension 50
    model = TwoLayerFC(input_size, 42, 10)
    scores = model(x)
    print(scores.size())  # you should see [64, 10]
    
def check_accuracy_part34(loader, model):
    if loader.dataset.train:
        print('Checking accuracy on validation set')
    else:
        print('Checking accuracy on test set')   
    num_correct = 0
    num_samples = 0
    model.eval()  # set model to evaluation mode
    with torch.no_grad():
        for x, y in loader:
            x = x.to(device=device, dtype=dtype)  # move to device, e.g. GPU
            y = y.to(device=device, dtype=torch.long)
            scores = model(x)
            _, preds = scores.max(1)
            num_correct += (preds == y).sum()
            num_samples += preds.size(0)
        acc = float(num_correct) / num_samples
        print('Got %d / %d correct (%.2f)' % (num_correct, num_samples, 100 * acc))
        
def train_part34(model, optimizer, epochs=1):
    """
    Train a model on CIFAR-10 using the PyTorch Module API.
    
    Inputs:
    - model: A PyTorch Module giving the model to train.
    - optimizer: An Optimizer object we will use to train the model
    - epochs: (Optional) A Python integer giving the number of epochs to train for
    
    Returns: Nothing, but prints model accuracies during training.
    """
    model = model.to(device=device)  # move the model parameters to CPU/GPU
    for e in range(epochs):
        for t, (x, y) in enumerate(loader_train):
            model.train()  # put model to training mode
            x = x.to(device=device, dtype=dtype)  # move to device, e.g. GPU
            y = y.to(device=device, dtype=torch.long)

            scores = model(x)
            loss = F.cross_entropy(scores, y)

            # Zero out all of the gradients for the variables which the optimizer
            # will update.
            optimizer.zero_grad()

            # This is the backwards pass: compute the gradient of the loss with
            # respect to each  parameter of the model.
            loss.backward()

            # Actually update the parameters of the model using the gradients
            # computed by the backwards pass.
            optimizer.step()

            if t % print_every == 0:
                print('Iteration %d, loss = %.4f' % (t, loss.item()))
                check_accuracy_part34(loader_val, model)
                print()
```

[[分割（segmentation）定位（localization）与识别（detection）]]

[[Visualizing and Understanding]]

[[Unsupervised Learning and Generative Models]]

[[ReinforcementLearning]]