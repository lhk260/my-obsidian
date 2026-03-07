cdcd# OrangePi AIpro 开发板上手

## 1. 硬件准备

1. OrangePi AIpro 开发板
2. DP 充电头+USB Type-C 充电线
3. MicroUSB 数据线
4. TF 卡
5. 电脑

## 2. 系统烧录

1. 下载系统镜像  
    [镜像下载地址](https://cloud.tsinghua.edu.cn/d/b5d368ead32f4ab9b147/)  
    建议选择 Desktop 版本
2. 解压系统镜像
3. 使用 Etcher 工具烧录系统镜像到 TF 卡  
    [Etcher下载地址](https://www.balena.io/etcher/)
4. 烧录完成后，将 TF 卡插入 OrangePi AIpro 开发板
5. 将背部的拨码开关拨到 TF 卡启动位置
6. 使用 DP 充电头+USB Type-C 充电线连接电源

## 3. 串口调试

1. 使用 MicroUSB 数据线连接电脑和 OrangePi AIpro 开发板
2. 使用串口调试工具连接串口  
    [串口调试工具下载地址](https://mobaxterm.mobatek.net/)
3. 打开串口调试工具，选择串口号，波特率设置为 115200
4. 重启 OrangePi AIpro 开发板，查看串口输出信息
5. 默认用户 HwHiAiUser，密码 Mind@123
6. Vscode 配置 ssh HwHiAiUser@"ip"

## 4. 连接网络

1. 使用 network manager 连接网络

    ```shell
    sudo nmtui
    ```

2. 连接后输入

    ```shell
    ifconfig
    ```

    在 wlan0 下找到 ip 地址

3. 在电脑端使用 ssh 连接  
ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAABgQDPZI4ojNyef5Mok89VCIRp8eJuVMkcmlKN4J9ScG33o8ev7ywcOh/fbrGxx4vucOssSXiRpCMhS9yWNVSqJ+I7lWtytk815YtpDSB27mSqHKn5UEGZ2DSf+venDx9SS+a643rxFqWZfjDU5Yv9zDW9lxTh9sGE8p8Sk4NH3STBrJSma5sHCsAtAf2zCFgcbdnvpiBquaJFIH2UValPA9IdvQJq6GnFJtisfjAgsZXPVwMzJ02Hpf4sz0OyKBpoflFsI5/5/Cor9AbIMqi5iETKyQ8DCBf6py9LrHCG2EQ3guP9WC3/41GsdsTzMQoz3a+HvoKnre3IqXznH1c381gylqeVCmZUpd9IiG1oN0TffgYYRWXY+jFOqIA98BAlc6dlt9x787KaNGXKHNegUjRdtG1d0xv1p/chMP8Ih6hRRgxOgeVNsyJ+wngA2moLjzctnElWgo3eQywZIR4Q61RzoPwqzd6zRdESsTJYYRg5s5H8OkYp4DlKcYmB74Pzg2M= <Your email address>

## 5. 设置 VNC Server

4. 自己电脑上下载 tightvnc viewer [下载地址](https://www.tightvnc.com/download.php)
5. 在 OrangePi AIpro 上安装 tightvncserver（这个自带了）
6. 修改~/. vnc/xstartup 为以下内容

    ```shell
    # Uncomment the following two lines for normal desktop:
    # unset SESSION_MANAGER
    # exec /etc/X11/xinit/xinitrc
    #export XKL_XMODMAP_DISABLE=1
    unset SESSION_MANAGER
    unset DBUS_SESSION_BUS_ADDRESS
    [ -x /etc/vnc/xstartup ] && exec /etc/vnc/xstartup
    [ -r $HOME/. Xresources ] && xrdb $HOME/. Xresources
    xsetroot -solid grey
    vncconfig -iconic &
    x-terminal-emulator -geometry 1920x1080 -ls -title "$VNCDESKTOP Desktop" &
    xfce4-session &
    mate-session &
    startkde &
    gnome-panel &
    gnmoe-settings-daemon &
    metacity &
    nautilus &
    gnome-terminal &
    gnome-session &
    ```

>[!important]+  
>chmod 755 ./xstartup 记得给权限

7. 终端输入：

    ```shell
    vncserver
    ```

8. 打开 log 查看端口号
9. 电脑端连接

## 6. 手机网络摄像头

10. 下载 DroidCam App （iOS 和 Android 都有）

## 7. 运行 jupyter server

11. 运行~/samples/start_notebook. sh
12. 在输出中能够找到 jupyter server 的地址（127.0.0.1:8888/token 一串）
13. 在自己电脑浏览器上打开这个地址
14. 运行里面的模型

## 8. 环境问题

15. 降级 setuptools: pip install setuptools==62.3.4
16. 缺少一个包:av

    ```shell
    pip install av==8.0.0
    ```

17. 在~/. bashrc 中添加以下内容

    ```shell
    . /usr/local/Ascend/ascend-toolkit/set_env. sh
    export PYTHONPATH=/usr/local/Ascend/thirdpart/aarch64/acllite:$PYTHONPATH
    export DDK_PATH=/usr/local/Ascend/ascend-toolkit/latest
    export NPU_HOST_LIB=$DDK_PATH/runtime/lib64/stub
    ```

18. 运行

    ```shell
    source ~/. bashrc
    ```

## 9. 运行 YOLOv5

19. 按照 [YOLOv5官方教程](https://gitee.com/ascend/EdgeAndRobotics/tree/master/Samples/YOLOV5Video#%E7%9B%AE%E6%A0%87%E6%A3%80%E6%B5%8Byolov5s)下载模型、转换模型、下载数据。
20. 运行 scripts 文件夹下的 sample_run. sh
