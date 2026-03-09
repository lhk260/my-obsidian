WSL 代理的解决办法大概是：  
clash 开局域网共享  
windows 进 ipconfig 找到 以太网适配器 vEthernet，记录 IPv4 地址  
进 WSL，http_proxy="http://$host_ip:[端口]"
