# 如何更新tbui？

## mixin

> 仅修改mixin，不需要上线，但是需要的步骤

 1. 在随便一个模块下的`_build`路径下执行`git submodule foreach git pull origin master`
 
 2. 进入tbui目录切换到`master`分支，修改代码提交tbui到gitlab上

 3. 回到`_build`目录执行`git add -u`，然后提交`_build`到gitlab上

## style
> 修改style，需要上线，需要的步骤

1. 拉common分支
2. 重复mixin的操作
3. 在common下执行bower update
4. 可以上线了
