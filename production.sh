#!/bin/sh

set -e

# #获取当前执行脚本路径
dir=`pwd`

# #上一级目录
path=$(dirname "$dir")

# 拷贝需要的文件到线上服务
path1=$(dirname "$path")
# echo $path1

path2=$(dirname "$path1")
echo $path2

cp -R $path2/staging/project-test $path2/production/

# #重启正式服务（9080）
pm2 reload production

echo $(date +"%Y-%m-%d %H:%M:%S") "正式发布完成" >> $path/test.log

# 提交日志文件
git add $path/test.log
git commit --no-verify -m "auto commit logs";
git push

# #合并分支
branch=$(git symbolic-ref --short -q HEAD)
echo $branch

git checkout master

# git pull

git merge $branch

git push

echo "合并主干完成"

# 健康检查
sleep 10
# 测试网页返回值 在脚本中，这是很常见的测试网站是否正常的用法
STATUS=`curl -o /dev/null -s -w %{http_code} http://127.0.0.1` 
if [ $STATUS -eq 200 ]; then
    echo 'deployed successed'
    exit 0
else
    echo 'health check failed'
    exit 1
fi