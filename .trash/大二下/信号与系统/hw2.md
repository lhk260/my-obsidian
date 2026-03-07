---
title: 
tags: 
date: " 2025-03-04T21:32:27+08:00 "
modify: " 2025-03-04T21:32:27+08:00 "
share: false
cdate: " 2025-03-04 "
mdate: " 2025-03-04 "
math: "true"
---

## 实验作业

### 求取信号的能量

```python
import numpy as np

import matplotlib.pyplot as plt

  

N, E = [] , []

for i in range(1, 10001):

    N.append(i)

    x = np.linspace(0, 100, i)

    y = np.power(np.exp(-np.abs(x))*np.cos(2*x),2)*100/i ##函数定义

    E.append(np.sum(y)*2)


plt.figure(figsize=(8, 6))

plt.plot(N, E, label=r'$e^{|n|}*\cos(2n)\ energy\ approximation$', color='b')

# Mark key points

plt.scatter(0, 0,  zorder=5)  # 标记原点

plt.scatter(9999, E[9999], color='r', zorder=5)  

plt.text(9999, E[9999], f'(9999,{E[9999]})', horizontalalignment='center', fontsize=12)

plt.text(0.2, -0.1, 'O', horizontalalignment='center', fontsize=12)  # 添加原点标签

# Title and labels

plt.xlabel('N', fontsize=12)

plt.ylabel('E', fontsize=12)

plt.tight_layout()

# Grid, legend, and x-y axis limits

plt.legend(loc='upper right')

plt.xlim([-5, 10000])

plt.ylim([-1, 8])

ax = plt.gca()

ax.spines['left'].set_position('zero')  # y轴在原点处

ax.spines['bottom'].set_position('zero')  # x轴在原点处

ax.spines['right'].set_color('none')  # 不显示右侧边框

ax.spines['top'].set_color('none')  # 不显示顶部边框

# Show the plot

plt.show()
```

![image.png](https://raw.githubusercontent.com/Tendourisu/images/master/20250304213348053.png)  
这与理论结果 0.6 非常接近

### 图片信号基本运算

```python
import cv2
import numpy as np
import matplotlib.pyplot as plt
Read the image
img = cv2.imread('./aris.png')
Create a figure to plot transformations
plt.figure(figsize=(20,15))
  
# 1. 幅值变化 (Amplitude Variation)
def amplitude_variation(image):
    kernels = [0.5, 1.5, -1]
    variations = [cv2.filter2D(image, -1, np.array([[k]])) for k in kernels]
    return variations
amp_vars = amplitude_variation(img)
# 2. 尺度变化 (Scale Variation)
def scale_variation(image):
    scales = [2, 0.75]
    variations = [
        cv2.resize(image, None, fx=s, fy=s, interpolation=cv2.INTER_LINEAR) 
        for s in scales
    ]
    return variations
scale_vars = scale_variation(img)
# 3. 反褶 (Inversion)
def inversion(image):
    return 255 - image
inv_img = inversion(img)
# 4. 平移 (Translation)
def translation(image):
    rows, cols = image.shape[:2]
    M = np.float32([[1,0,50],[0,1,50]])
    return cv2.warpAffine(image, M, (cols, rows))
translated_img = translation(img)
# 5. 信号的微分 (Signal Differentiation)
def signal_diff(image):
    gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
    diff = cv2.Sobel(gray, cv2.CV_64F, 1, 0, ksize=3)
    return cv2.convertScaleAbs(diff)
diff_img = signal_diff(img)
# 6. 信号的积分 (Signal Integration)
def signal_integral(image):
    gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
    integral = cv2.integral(gray)
    return cv2.normalize(integral, None, 0, 255, cv2.NORM_MINMAX)
integral_img = signal_integral(img)
# 7. 信号的相加 (Signal Addition)
def signal_addition(image1, image2):
    gray1 = cv2.cvtColor(image1, cv2.COLOR_BGR2GRAY)
    gray2 = cv2.cvtColor(image2, cv2.COLOR_BGR2GRAY)
    return cv2.add(gray1, gray2)
add_img = signal_addition(img, cv2.flip(img, 1))
# 8. 信号的相减 (Signal Subtraction)
def signal_subtraction(image1, image2):
    gray1 = cv2.cvtColor(image1, cv2.COLOR_BGR2GRAY)
    gray2 = cv2.cvtColor(image2, cv2.COLOR_BGR2GRAY)
    return cv2.subtract(gray1, gray2)
sub_img = signal_subtraction(img, cv2.flip(img, 1))
Plotting
plt.subplot(4,2,1)
plt.title('1. Amplitude Variation')
plt.imshow(cv2.cvtColor(amp_vars[0], cv2.COLOR_BGR2RGB))
plt.subplot(4,2,2)
plt.title('2. Scale Variation')
plt.imshow(cv2.cvtColor(scale_vars[0], cv2.COLOR_BGR2RGB))
plt.subplot(4,2,3)
plt.title('3. Inversion')
plt.imshow(cv2.cvtColor(inv_img, cv2.COLOR_BGR2RGB))
plt.subplot(4,2,4)
plt.title('4. Translation')
plt.imshow(cv2.cvtColor(translated_img, cv2.COLOR_BGR2RGB))
plt.subplot(4,2,5)
plt.title('5. Signal Differentiation')
plt.imshow(diff_img, cmap='gray')
plt.subplot(4,2,6)
plt.title('6. Signal Integration')
plt.imshow(integral_img, cmap='gray')
plt.subplot(4,2,7)
plt.title('7. Signal Addition')
plt.imshow(add_img, cmap='gray')
plt.subplot(4,2,8)
plt.title('8. Signal Subtraction')
plt.imshow(sub_img, cmap='gray')
plt.tight_layout()
plt.show()
```

![image.png](https://raw.githubusercontent.com/Tendourisu/images/master/20250304213746423.png)

### 信号参数估计

#### 获取信号

```python
def get_from_npz(file_path):
    data = np.load(file_path)
    return data['xxx'], data['yyy']

x,y = get_from_npz('./wave11.npz')
plt.plot(x, y)
plt.xlabel("Time(s)")
plt.ylabel("Voltage(V)")
plt.grid(True)
plt.tight_layout()
plt.show()
```

![image.png](https://raw.githubusercontent.com/Tendourisu/images/master/20250304215009800.png)

#### 拟合信号

```python

import numpy as np
from scipy.optimize import curve_fit
import matplotlib.pyplot as plt

# 定义拟合函数
def fun(x, a, b, c, d, e):
    return a * np.exp(-b * x) * np.sin(c * x + d) + e

# 初始参数猜测
param = (1, 50, 2*np.pi*150, 0, 0)
param, conv = curve_fit(fun, x, y, p0=param)
print(param)
ysim = fun(x, *param)
plt.plot(x, y, linewidth=3, label='Origin')
plt.plot(x, ysim, label='Fit')
plt.xlabel("Time(s)")
plt.ylabel("Voltage(V)")
plt.grid(True)
plt.legend(loc="upper right")
plt.tight_layout()
plt.show()
![Uploading file...jgv84]()
```

![](https://raw.githubusercontent.com/Tendourisu/images/master/20250304215110746.png)
