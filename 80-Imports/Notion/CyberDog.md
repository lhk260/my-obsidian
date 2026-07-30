[[CyberDog]]

```Python
\#backward.py
import rclpy
from rclpy.node import Node
from protocol.msg import MotionServoCmd

class BackwardController(Node):
    def __init__(self, name):
        super().__init__(name)
        self.speed_x, self.speed_y, self.speed_z = 0.0, 0.0, 0.0
        self.dog_name = "cyberdog"
        self.pub = self.create_publisher(MotionServoCmd, f"/{self.dog_name}/motion_servo_cmd", 10)
        self.timer = self.create_timer(0.1, self.timer_callback)

    def timer_callback(self):
        msg = MotionServoCmd()
        msg.motion_id = 303
        msg.cmd_type = 1
        msg.value = 2
        msg.vel_des = [self.speed_x, self.speed_y, self.speed_z]
        msg.step_height = [0.05, 0.05]
        self.pub.publish(msg)

def main(args = None):
    rclpy.init(args = args)
    node = BackwardController("move_the_dog")
    rclpy.spin(node)
    node.destroy_node()
    rclpy.shutdown()

if __name__ == '__main__':
    main()
```

```Python
\#forward.py
import rclpy
from rclpy.node import Node
from protocol.msg import MotionServoCmd

class ForwardController(Node):
    def __init__(self, name):
        super().__init__(name)
        self.speed_x, self.speed_y, self.speed_z = 0.1, 0.0, 0.0
        self.dog_name = "cyberdog"
        self.pub = self.create_publisher(MotionServoCmd, f"/{self.dog_name}/motion_servo_cmd", 10)
        self.timer = self.create_timer(0.1, self.timer_callback)

    def timer_callback(self):
        msg = MotionServoCmd()
        msg.motion_id = 303
        msg.cmd_type = 1
        msg.value = 2
        msg.vel_des = [self.speed_x, self.speed_y, self.speed_z]
        msg.step_height = [0.05, 0.05]
        self.pub.publish(msg)

def main(args = None):
    rclpy.init(args = args)
    node = ForwardController("move_the_dog")
    rclpy.spin(node)
    node.destroy_node()
    rclpy.shutdown()
```

```Python
\#ObstacleAvoidance.py
import rclpy
from rclpy.node import Node
from sensor_msgs.msg import Range
from geometry_msgs.msg import Twist
import math

class ObstacleAvoidanceNode(Node):

    def __init__(self):
        super().__init__('obstacle_avoidance_node')
        self.cmd_vel_publisher = self.create_publisher(Twist, '/cmd_vel', 10)
        self.ultrasonic_subscriber = self.create_subscriber(Range, '/ultrasonic', self.callback)

    def callback(self, msg):
        self.ultrasonic = msg.range

    def forward(self):
        # 假设这个函数已经实现，使机器人向前移动
        cmd = Twist()
        cmd.linear.x = 0.1  # 向前移动
        self.cmd_vel_publisher.publish(cmd)

    def rotation(self):
        # 假设这个函数已经实现，使机器人逆时针旋转
        cmd = Twist()
        cmd.angular.z = -1.0  # 逆时针旋转
        self.cmd_vel_publisher.publish(cmd)

def main(args=None):
    rclpy.init(args=args)
    obstacle_avoidance_node = ObstacleAvoidanceNode()
    
    while rclpy.ok():
        rclpy.spin_once(obstacle_avoidance_node)
        distance = obstacle_avoidance_node.ultrasonic
        
        if distance < 0.5:
            obstacle_avoidance_node.rotation()
        elif distance > 1.0:
            obstacle_avoidance_node.forward()

    obstacle_avoidance_node.destroy_node()
    rclpy.shutdown()

if __name__ == '__main__':
    main()
```

```Python
\#rotate.py
import rclpy
from rclpy.node import Node
from protocol.msg import MotionServoCmd
import math

class RotateController(Node):
    def __init__(self, name):
        super().__init__(name)
        self.speed_x, self.speed_y, self.speed_z = 0.0, 0.0, 0.0  # 初始速度设为0
        self.dog_name = "cyberdog"
        self.pub = self.create_publisher(MotionServoCmd, f"/{self.dog_name}/motion_servo_cmd", 10)
        self.timer = self.create_timer(0.1, self.timer_callback)
        self.time_counter = 0.0  # 时间计数器

    def timer_callback(self):
        angle = 90  # 旋转角度，这里假设是90度
        angular_speed = 0.5  # 设置旋转的角速度，单位是弧度/秒
        time_to_rotate = abs(angle) / angular_speed  # 计算旋转需要的时间
        self.speed_z = math.copysign(angular_speed, angle)  # 根据角度确定旋转方向和速度

        msg = MotionServoCmd()
        msg.motion_id = 303
        msg.cmd_type = 1
        msg.value = time_to_rotate  # 将旋转时间设置为value字段
        msg.vel_des = [self.speed_x, self.speed_y, self.speed_z]
        msg.step_height = [0.05, 0.05]
        self.pub.publish(msg)

        self.time_counter += 0.1  # 计时器每次加0.1秒
        if self.time_counter >= time_to_rotate:  # 判断是否达到旋转时间
            self.speed_z = 0.0  # 停止旋转
            self.pub.publish(msg)  # 发布停止旋转的消息
            self.get_logger().info("Rotation completed.")
            self.timer.cancel()  # 停止定时器

def main(args = None):
    rclpy.init(args = args)
    node = RotateController("move_the_dog")
    rclpy.spin(node)
    node.destroy_node()
    rclpy.shutdown()
```

```Python
\#sit.py
import rclpy
from rclpy.node import Node
from protocol.srv import MotionResultCmd

class SitController(Node):
    def __init__(self, name):
         super().__init__(name)
         self.client = self.create_client(MotionResultCmd, '/cyberdog/motion_result_cmd')
         while not self.client.wait_for_service(timeout_sec = 1.0):
            self.get_logger().info('service not available, waiting again...')
         self.request = MotionResultCmd.Request()

    def send_request(self):
        self.request.motion_id = 101
        self.future = self.client.call_async(self.request)

def main(args = None):
    rclpy.init(args = args)
    node = SitController("basic_cmd")
    node.send_request()
    while rclpy.ok():
        rclpy.spin_once(node)

        if node.future.done():
            try:
                response = node.future.result()
            except Exception as e:
                node.get_logger().info(
                )

            else:
                node.get_logger().info("cmd has done!")
            break

    node.destroy_node()
    rclpy.shutdown()

if __name__ == '__main__':
    main()
```

```Python
\#stand.py
import rclpy
from rclpy.node import Node
from protocol.srv import MotionResultCmd

class basic_cmd(Node):
    def __init__(self, name):
         super().__init__(name)
         self.client = self.create_client(MotionResultCmd, '/cyberdog/motion_result_cmd')
         while not self.client.wait_for_service(timeout_sec = 1.0):
            self.get_logger().info('service not available, waiting again...')
         self.request = MotionResultCmd.Request()

    def send_request(self):
        self.request.motion_id = 111
        self.future = self.client.call_async(self.request)

def main(args = None):
    rclpy.init(args = args)
    node = basic_cmd("basic_cmd")
    node.send_request()
    while rclpy.ok():
        rclpy.spin_once(node)

        if node.future.done():
            try:
                response = node.future.result()
            except Exception as e:
                node.get_logger().info(
                )

            else:
                node.get_logger().info("cmd has done!")
            break

    node.destroy_node()
    rclpy.shutdown()

if __name__ == '__main__':
    main()
```

```Python
\#step.py
import rclpy
from rclpy.node import Node
from protocol.msg import MotionServoCmd

class StepController(Node):
    def __init__(self, name):
        super().__init__(name)
        self.speed_x, self.speed_y, self.speed_z = 0.0, 0.0, 0.0
        self.dog_name = "cyberdog"
        self.pub = self.create_publisher(MotionServoCmd, f"/{self.dog_name}/motion_servo_cmd", 10)
        self.timer = self.create_timer(0.1, self.timer_callback)

    def timer_callback(self):
        msg = MotionServoCmd()
        msg.motion_id = 303
        msg.cmd_type = 1
        msg.value = 2
        msg.vel_des = [self.speed_x, self.speed_y, self.speed_z]
        msg.step_height = [0.05, 0.05]
        self.pub.publish(msg)


        

def main(args = None):
    rclpy.init(args = args)
    node = StepController("move_the_dog")
    rclpy.spin(node)
    node.destroy_node()
    rclpy.shutdown()

if __name__ == '__main__':
    main()
```

```Python
\#ultrasonic.py
import rclpy
from rclpy.node import Node 
from sensor_msgs.msg import Range

class UltrasonicSensor(Node):
    '''subscribe the message of sensor'''
    def __init__(self, name) -> None:
        super().__init__(name)
        self.declare_parameter('dog_name', 'cyberdog')
        dog_name = self.get_parameter('dog_name').get_parameter_value().string_value
        self.sub = self.create_subscription(Range, f'/{dog_name}/ultrasonic_payload', self.sub_callback, 10)
        pass

    def sub_callback(self, msg:Range):
        '''the callback function of subscriber'''
        dist = msg.range
        self.get_logger().info(f"the distance is {dist}")

def main(args = None):
    rclpy.init(args = args)
    node = UltrasonicSensor("my_sensor")
    rclpy.spin(node)
    node.destroy_node()
    rclpy.shutdown()

if __name__ == '__main__':
    main()
```

```Python
\#walk.py
import rclpy
from rclpy.node import Node
from sensor_msgs.msg import Range
from ultrasonic import UltrasonicSensor
from backward import BackwardController
from forward import ForwardController
from rotate import RotateController
from step import StepController

class ObstacleAvoidanceNode(Node):
    def __init__(self):
        super().__init__('obstacle_avoidance_node')
        self.declare_parameter('dog_name', 'cyberdog')
        dog_name = self.get_parameter('dog_name').get_parameter_value().string_value
        
        # 初始化各个控制器
        self.backward_ctrl = BackwardController()
        self.forward_ctrl = ForwardController()
        self.rotate_ctrl = RotateController()
        self.step_ctrl = StepController()

        # 初始化超声波传感器
        self.ultrasonic_sensor = UltrasonicSensor(self)

        # 订阅超声波数据
        self.subscription = self.create_subscription(
            Range,
            f'/{dog_name}/ultrasonic_payload',
            self.ultrasonic_callback,
            10)
        self.subscription  # prevent unused variable warning

        # 设置初始状态
        self.stand_ctrl.execute()

    def ultrasonic_callback(self, msg):
        distance = msg.data  # 获取超声波测得的距离

        if distance < 0.5:  # 若距离过近，执行紧急停止并坐下
            self.stop_all()
            self.sit_ctrl.execute(12)
        elif distance < 1.0:  # 若距离适中，尝试后退并旋转避开障碍物
            self.backward_ctrl.execute()
            self.rotate_ctrl.execute(90)  # 旋转90度以避开障碍物
        else:  # 距离足够远时，继续前进或行走
            self.forward_ctrl.execute()
            self.step_ctrl.execute()

    def stop_all(self):
        self.backward_ctrl.stop()
        self.forward_ctrl.stop()
        self.rotate_ctrl.stop()
        self.sit_ctrl.stop()
        self.stand_ctrl.stop()
        self.step_ctrl.stop()

def main(args=None):
    rclpy.init(args=args)
    obstacle_avoidance_node = ObstacleAvoidanceNode()
    rclpy.spin(obstacle_avoidance_node)
    rclpy.shutdown()

if __name__ == '__main__':
    main()
```