<p align="center">
  <a href="https://github.com/uabjs/uabpress" target="_blank">
    <img width="150" src="https://avatars1.githubusercontent.com/u/73016681?s=200&v=4" alt="logo">
  </a>
</p>

<div align="center">
<h1>UabPress</h1>
</div>

简体中文| [English](https://github.com/uabjs/uabpress/blob/main/README_en-US.md)

## uabpress
基于 Vue3.0 SSR 的一个快速高效的 Markdown 网站制作工具
![uabpress 动态效果图展示](https://img-blog.csdnimg.cn/20201206225626894.gif)
运行后默认热更新自动编译打开运行在浏览器3000端口

### 全局安装 uabpress 包
```
yarn add -g uabpress
```

### 使用方法：
```
只需在任意一个文件夹中简单的编写您的 md 文件，即可为您编译成一个说明文档网页
下面以效果图内的 docs 文件夹为例
```

### 运行 docs 文件夹内md文件自动编译成文档网页形式指定端口输出
```
// 在您的 docs 项目路径内执行 默认编译当前文件夹
uabpress dev  //or   "uabpress dev  ./docs"
```

### 将 docs 文件夹打包成html页面
```
// 也可指定文件夹制作 Markdown 网页
uabpress bulid ./docs
```

### 效果图如下：
![UabPress基于 vue3 ssr 运行](https://img-blog.csdnimg.cn/20201206234140347.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3FxXzQxNjE0OTI4,size_16,color_FFFFFF,t_70)