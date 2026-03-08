---
author: Alex Zook1, Fan-Yun Sun2, Josef Spjut1, Valts Blukis1, Stan Birchfield1, Jonathan Tremblay1
---

#robotic

>[!abstract]  
>Abstract— We introduce GRS (Generating Robotic Simulation tasks), a novel system to address the challenge of real-tosim in robotics, computer vision, and AR/VR. GRS enables the creation of digital twin simulations from single real-world RGBD observations, complete with diverse, solvable tasks for virtual agent training. We use state-of-the-art vision-language models (VLMs) to achieve a comprehensive real-to-sim pipeline. GRS operates in three stages: 1) scene comprehension using SAM2 for object segmentation and VLMs for object description, 2) matching identified objects with simulation-ready assets, and 3) generating contextually appropriate robotic tasks. Our approach ensures simulations align with task specifications by generating test suites designed to verify adherence to the task specification. We introduce a router that iteratively refines the simulation and test code to ensure the simulation is solvable by a robot policy while remaining aligned to the task specification. Our experiments demonstrate the system’s efficacy in accurately identifying object correspondence, which allows us to generate task environments that closely match input environments, and enhance automated simulation task generation through our novel router mechanism.

基本步骤：

1. scene comprehension using SAM2 for object segmentation and VLMs for object description
2. matching identified objects with simulation-ready assets, and
3. generating contextually appropriate robotic tasks
