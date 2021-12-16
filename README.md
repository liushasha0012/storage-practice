## 集群搭建+发布流程

实践文档地址：
https://app.yinxiang.com/fx/041de721-7d4a-40b2-a87e-308c7c4d2288


（1）申请一台阿里云服务器（centos7），可以选用阿里云轻量应用服务器

（2）在服务器上搭建好nginx/nodejs环境，可以直接在阿里云搜索安装教程

（3）通过nginx做流量分发，分发到四个nodejs服务，分别是：

    线上页面 http://test2.xiaohuangren.top/ 由9080端口提供服务

    预发页面 http://test2.xiaohuangren.top/ 由9081端口提供服务，跟线上页面的区别在于cookie的命中

    本地页面 http://test2-dev.xiaohuangren.top/ 由9082端口提供服务

    管理页面，管理分支创建/预发发布/正式发布 http://test2-manage.xiaohuangren.top/ 由9083端口提供服务
    
    备注：
    1）9080、9081、9082的服务运行的是一个h5页面（包含html/css/js），用不同的文件夹来存放 本地/预发/线上页面 的内容
    2）9083的服务是一个pc页面，有三个按钮（创建git分支/预发布/正式发布），创建或发布成功后把当前日志打印出来；

（4）预发服务需要配置cookie（可以自定义key和value）才能访问，在nginx里做配置；

（5）通过github创建一个仓库，然后clone到服务器上(仓库包含四个服务，同时ignore把node_modules忽略掉)；

（6）用webpack完成构建、编译、打包流程；

（7）用shell脚本完成自动化发布流程，分别为：

    创建git分支脚本：git pull（暂时不考虑解决冲突的问题） → git checkout -b [分支号]

    预发布脚本：git pull → npm版本设置 → npm包删除 → npm install → npm run build → 拷贝文件到预发文件夹下  重启node服务（9081端口）

    正式发布脚本：文件拷贝到正式文件夹下 →  重启node服务（9080端口） → 合并git分支到master（暂时不考虑解决冲突的问题）

## 静态资源缓存+websocket

实践文档地址：
https://app.yinxiang.com/fx/b94f23aa-97f1-4935-b9e4-77e7185f2307

（1）需要基于已搭建好的发布流程demo（工程实践1），才能开始接下去的流程； 
（2）通过socket来监听打包编译发布的过程，然后把每一步都返回给前端做日志展现；
（3）申请一个域名，同时接入到CDN（不贵，阿里云CDN 20元一年100个G）；
（4）实现H5页面的JS/CSS资源，浏览器强缓存2分钟，并且使用协商缓存；
（5）实现H5页面的HTML/JS/CSS资源，CDN缓存4分钟，在阿里云cdn上配置
（6）管理页面有三个按钮，分别可以刷新掉H5页面当前的强缓存、CDN缓存、协商缓存（备注：阿里云CDN刷新缓存有API可以调用）；
（7）管理页面，可以分别配置H5页面当前的强缓存、CDN缓存时间；