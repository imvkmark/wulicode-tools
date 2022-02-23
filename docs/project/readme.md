# 说明

### 开发文件不需要自动加载

-   项目中使用 IDE Helper 生成浏览器提示文件, 此文件在正式项目下不需要进行加载
-   Clockwork 不需要加载

```
"extra" : {
    "laravel" : {
        "dont-discover" : [
            "itsgoingd/clockwork",
            "barryvdh/laravel-ide-helper",
        ]
    }
},
```

## 项目说明

### 项目目录树

```
├── config              # 配置文件
├── modules             # 模块名称, 这里以system 模块 作为说明, 详细见 模块目录树
│   ├── finance
│   ├── order
│   └── ...
├── public
│   ├── docs            # 文档
│   ├── modules         # 模块资源
│   └── resources       # 资源项目 / 公共
│       ├── css
│       ├── js
│       └── scss
├── resources           # 资源源文件
│   ├── assets
│   ├── docs
│   ├── lang
│       ├── en
│       └── zh
├── storage             # 存储目录
│   ├── app             # 应用资源
│   ├── bootstrap       # 启动项目
│   ├── bower           # bower 文档
│   ├── clockwork       # 调试文件
│   ├── console         # 控制器
│   ├── framework       # 框架缓存
│   │   ├── cache
│   │   ├── sessions
│   │   └── views
│   ├── logs            # 日志
│   ├── phplint
│   ├── purifier
│   ├── sami
├── tests               # 测试目录
│   ├── MerchantApi
│   │   └── User
│   └── WebApi
│       └── User
└── vendor              # 第三方文档(只是预览, 不做详细说明)

```

## 单元测试

```
首先安装PHPunit  PHPunit --version 可以查看是否安装和PHPunit版本
PHPstorm配置:
 - 在setting 搜索PHP 设置php版本
 - 在php下 Test Frameworks 中设置 phpunit路径
 - default bootstrap中设置框架自动加载文件目录
使用本框架的  php artisan poppy:test  模块名 测试文件名来创建测试文件
```

## 代码风格统一

-   下载代码风格文件[Code_Style-Mark](http://oss-test.iliexiang.com/develop/Code_Style-Mark.xml)
-   打开 `Preferences | Editor | Code Style` , 在右侧 `设置` 中选择 `Import Scheme`, 导入刚才下载的 xml 文件
-   在 `Scheme` 选择框中选择刚才导入的风格进行使用

phpstorm 常用快捷键

```
ctrl/cmd + alt + L          # 格式化代码(提交代码前操作)
ctrl/cmd + alt + O          # 项目优化导入, 保证代码无冗余
ctrl/cmd + shift + n        # 查找文件
ctrl/cmd + alt + shift + n  # 查找函数
```

## 代码协同

### 协同工具 GIT

代码使用 Git 进行代码协同

### 开发工作流程 Git Flow

git-flow 并不是要替代 Git，它仅仅是非常聪明有效地把标准的 Git 命令用脚本组合了起来。 Release 管理是版本控制处理中的另外一个非常重要的话题, 详细见下边的文档. Git Flow
的详细说明文档 [git-flow 的工作流程](https://www.git-tower.com/learn/git/ebook/cn/command-line/advanced-topics/git-flow)

**分支说明**
_master_ 只能用来包括产品代码。你不能直接工作在这个 master 分支上，而是在其他指定的，独立的特性分支中（这方面我们会马上谈到）。不直接提交改动到 _master_ 分支上也是很多工作流程的一个共同的规则。
_develop_ 是你进行任何新的开发的基础分支。当你开始一个新的功能分支时，它将是 _开发_ 的基础。另外，该分支也汇集所有已经完成的功能，并等待被整合到 _master_ 分支中。
这两个分支被称作为 [长期分支](https://www.git-tower.com/learn/git/ebook/cn/command-line/branching-merging/branching-workflows)。它们会存活在项目的整个生命周期中。而其他的分支，例如针对功能的分支，针对发行的分支，仅仅只是临时存在的。它们是根据需要来创建的，当它们完成了自己的任务之后就会被删除掉。

```
# 分支说明
master       : 线上分支
develop      : 开发分支
hotfix/2.0.3 : Bug 分支
feature/2.3  : 开发分支
```

**安装**

安装 Git flow (参考文档: https://github.com/nvie/gitflow/wiki/Installation)

```
# 初始化
git flow init -d

# 查看帮助
git flow feature help

# 分支说明
Feature branches? [feature/]
Bugfix branches? [bugfix/]
Release branches? [release/]
Hotfix branches? [hotfix/]
Support branches? [support/]

# hotfix
# 创建修复分支
git flow hotfix start {missing-link}
#创建修复分支：
git flow hotfix finish {missing-link}

# feature
# 用于新版本开发时使用
git flow feature start 2.0.99
# 这个 “feature finish” 命令会把我们的工作整合到主 “develop” 分支中去，后需要手动推送到线上分支
git flow feature finish 2.0.99

# release
git flow release start 2.0.99
git flow release finish 2.0.99
```

**注意事项**

-   开发新功能或者修复的时候，需要先保证本地没有未上传的代码才可以创建
-   提交分支时，需先提交到本地之后，运行 git flow... 后，推送到线上 master 和 develop（两次推送）
-   进行 hotfix 进行修复以及 release 发布版本时候必须完整填写 `~/modules/build.md` 发版文件

### 代码提交规范

代码提交根据前缀来区分不同的提交内容

```
# 任务前缀
task # 859 子 订单列表界面调整/订单列表
# bug 前缀
bug # 308 用户管理操作
# 版本发布前缀
release # 2.3.2
```

## 单元测试

必须对接口写单元测试, 否则测试不通过的代码一律打回

### 接口单元测试

-   保证接口请求不返回 null 值
-   保证接口必须返回成功, 必须要有返回

### 功能单元测试

-   编写配置文件, 保证配置正确
-   编写模型文件, 保证模型函数正确
-   编写功能文件, 保证 Notification, Im 等功能正常

### Action 单元测试

-   编写方便的 Action 测试, 便于功能点测试

## 代码审核

### 代码要求

-   参数命名符合规范
-   撰写负责模块的注释(注释包含类, 接口文档, 参数, 方法, 函数)
-   撰写单元测试, 保障功能/接口 正常使用

### 审核标准

-   运行优化导入, 保证代码无冗余 `ctrl + alt + o`
-   保证代码格式正确, 对文件夹进行代码格式化 `ctrl + alt + l`, 在 `src` 目录下运行
-   代码中不得存在编辑器提示的错误, 优化提示见[PHP Code Review](https://snippets.cacher.io/snippet/8e1fe81c08d6f6591295)
-   Api 单元测试正确
-   功能单元测试正确
-   对开发功能进行抽检, 进行考评, 不符合标准的进行 5 元红包进行改正

## IDE

**忽略掉不需要的加载目录**

生成的文件, 不需要进行索引

```
# 前端文件
public/assets

# 调试
storage/clockwork

# 生成的文档
storage/sami
public/docs
```

**将 public 目录设置为资源根目录**

因为 public 目录是对外输出目录, 所有的资源均以这个作为资源的识别

## 最佳实践

-   单元测试 : [**在 PhpStorm 中运行 Laravel 的 phpunit 单元测试** ](https://www.yuque.com/duoli/php/phpstorm-run-laravel-phpunit)
