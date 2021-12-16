#!/bin/sh

# export NODE_OPTIONS="--max-old-space-size=4096"
set -e

git pull

# #获取当前执行脚本路径
dir=`pwd`

# #上一级目录
path=$(dirname "$dir")

# rm -rf $path/node_modules

export NODE_VERSION=10.15.0
# export NVM_NODEJS_ORG_MIRROR=https://npm.taobao.org/mirrors/node

. ~/.nvm/nvm.sh

nvm install ${NODE_VERSION}
NPM="nvm exec 10.15.0 npm"

${NPM} install --registry https://registry.npm.taobao.org
# # ${NPM} run eslint
${NPM} run build

GIT_STATUS=`git status`
echo ${GIT_STATUS};

# 判断时候有需要提交的文件的文件
if [[ "${GIT_STATUS}" == *"nothing to commit"* ]]; then
    echo "没有可提交的内容";
else
    git add $path/dist
    git add $path/test.log
    git commit --no-verify -m "auto commit build_files";
    git push
fi

# 拷贝需要的文件到预发服务
path1=$(dirname "$path")
# echo $path1

path2=$(dirname "$path1")
# echo $path2

cp -R $path/dist $path2/staging/project-test/

cp -R $path/src $path2/staging/project-test/

#重启预发服务（9081）
pm2 reload staging

echo "预发布完成"

echo $(date +"%Y-%m-%d %H:%M:%S") "预发布完成" >> $path/test.log

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
