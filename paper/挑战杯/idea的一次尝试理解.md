#项目流程  
[Site Unreachable](https://wvflem1l6hs.feishu.cn/docx/AkpJdMGx3omLhvxVWOjclUN8n6d?from=from_copylink)  
![](https://raw.githubusercontent.com/Tendourisu/images/master/202501092241857.png)

- Inputs：
	- RGB-D 的 image
	- 人类自然语言 Instruction
- Task Preprocessing module
	- 第一个 GPT-4V 处理：从 instruction 中提取待操作物体集合
	- SAM 根据集合对 image 进行分割，得到待操作物体掩码以及对应自然语言的字典（对吗？） [GitHub - IDEA-Research/Grounded-Segment-Anything: Grounded SAM: Marrying Grounding DINO with Segment Anything & Stable Diffusion & Recognize Anything - Automatically Detect , Segment and Generate Anything](https://github.com/IDEA-Research/Grounded-Segment-Anything)
- 3D-aware Position Module
	- 根据 RGB-D Image 重建的 3D 点云以及各个物体的掩码得到给个物体的中心与包围盒信息
	- 交由 GPT-4V，结合先前的自然语言 Instruction，得到 Goal Position
- Simulation-assisted Rotation Module
	- 在仿真环境中对目标点云进行：仿真操作，拍照交由 GPT 打分搜索式操作，搜索到最优的Goal Rotation
- Sim.-assited Planning Module ：把Goal Position， Goal Rotation，点云数据交给传统求解器求解，然后运行
- 待完成
    
    - 目前物体类别和bbox是通过Grounded-SAM模型获得的，可以在真实环境中部署，但是如果用于仿真环境的训练会很慢，所以需要修改为直接在仿真中读取物体以及他们的位姿，用于点云后处理
        
    - 目前处理是一步step保存的单帧三个视角的RGBD图片，需要把点云过程放在交互过程中
        
        - 交互过程中可能出现物体遮挡或者堆叠的情况，点云分割可能存在问题，可能需要考虑用颜色等分割

    ![](https://wvflem1l6hs.feishu.cn/space/api/box/stream/download/asynccode/?code=NTQ5N2NmNGRlYjRlMmRmYmIyMjZlZDcwMTk1MGViY2ZfY1BmalFqODlNa2xvOFQ2eFN5NldveHJXUFVNbHZvcGVfVG9rZW46WGxybWJQRHNMb3lrUDN4aTNwbGNsMU9Ebm9lXzE3MzY1OTA0MDM6MTczNjU5NDAwM19WNA)

    - 特征提取的convex_hull部分有bug，希望能提取出点云中可以描述物体形状（进行碰撞检测）的关键点（比如六边形的顶点和边）
