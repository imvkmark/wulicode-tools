# 说明

## 功能开发流程

```
明白需求 --> 拆分功能点 (整理逻辑) --> 写代码 --> 完成功能
```

## 模块文件树

```
├── configurations       # 配置文件
│   ├── permissions.yaml
├── docs                 # 技术文档
├── resources            # 资源文件
│   ├── config           # 发布的配置文件
│   ├── lang             # 多语言支持包的位置
│   │   └── zh
│   ├── mixes            # mixs : 混杂的文件
│   │   └── poppy        # poppy 核心包 (普通页面布局)
│   │       └── backend
│   ├── scss             # sass 预处理文件 (普通页面布局需要)
│   │   ├── backend
│   │   ├── basic
│   │   └── develop
│   └── views            # 视图文件
│       ├── backend      # 视图 - 后台
│       ├── develop      # 视图 - 开发者平台
│       ├── email        # 视图 - email
│       └── tpl          # 视图 - 核心模板
├── src
│   ├── action           # action
│   ├── backend          # 后端模块管理
│   ├── classes          # 基础类
│   │   ├── auth         # 权限
│   │   │   ├── guard    # 权限 - guard
│   │   │   └── provider # 权限 - provider
│   │   ├── payment      # 支付
│   │   └── traits       # traits
│   ├── commands         # 命令
│   ├── database         # 数据库
│   │   ├── factories    # 数据库 - 工厂
│   │   ├── migrations   # 数据库 - migrations
│   │   └── seeds        # 数据库 - 种子
│   ├── events           # 事件, 事件使用 Event 后缀
│   ├── extension        # 扩展包管理(开发用, 以后可能会废弃掉)
│   ├── http             # 路由和中间件
│   │   ├── middleware
│   │   └── routes
│   ├── listeners        # 事件 - 监听器
│   ├── mail             # 邮件
│   ├── models           # 模型
│   │   ├── filters      # 模型 - 过滤器
│   │   ├── policies     # 模型 - 策略
│   │   └── resources    # 模型 - 资源
│   ├── module           # 模块
│   │   ├── listeners
│   │   └── repositories
│   ├── notifications    # 通知
│   ├── permission       # 权限
│   │   ├── commands
│   │   ├── exceptions
│   │   ├── middlewares
│   │   └── repositories
│   ├── rbac             # rbac 角色包
│   │   ├── contracts
│   │   ├── facades
│   │   ├── helper
│   │   ├── middleware
│   │   └── traits
│   ├── request          # 控制器
│   │   ├── api_v1       # 控制器 - Api
│   │   │   ├── backend
│   │   │   ├── pam
│   │   │   └── util
│   │   ├── backend      # 后端页面
│   │   ├── develop      # 开发平台
│   │   └── system       # 后台系统入口
│   └── setting          # 系统设置
└── tests                # 单元测试
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

## 注册服务

```
<?php namespace Poppy\System;

/**
 * 定义模块名称
 * 模块可以使用 module.{module} , 也可以直接是 {module}
 */
protected $name = 'poppy.system';

// 注册事件监听器
protected $listens = [
    \Illuminate\Auth\Events\Failed::class               => [
        Listeners\AuthFailed\LogListener::class,
    ],
];

// 注册策略
protected $policies = [
    PamRole::class    => PamRolePolicy::class,
    PamAccount::class => PamAccountPolicy::class,
];

/**
 * 启动
 */
public function boot()
{
    parent::boot($this->name);

    // 注册 api 文档配置
    $this->publishes([
        __DIR__ . '/../resources/config/sami.php'   => storage_path('sami/config.php'),
        __DIR__ . '/../resources/config/module.php' => base_path('config/module.php'),
    ], 'poppy-module');

    $path = poppy_path($this->name);

    // 配置文件
    $this->mergeConfigFrom($path . '/resources/config/module.php', 'module');

    $this->bootConfigMail();
}

// 注册服务
public function register()
{
    $this->app->register(Http\MiddlewareServiceProvider::class);
    // ...
    $this->app->register(Permission\PermissionServiceProvider::class);

    $this->registerConsole();

    $this->registerSchedule();
}

// 计划任务
private function registerSchedule()
{
    app('events')->listen('console.schedule', function (Schedule $schedule) {
        $schedule->command('py-system:user', ['auto_enable'])
            ->everyFiveMinutes()->appendOutputTo($this->consoleLog());
    });
}

// 注册命令
private function registerConsole()
{
    $this->commands([
        Commands\UserCommand::class,
        ...
        Permission\Commands\PermissionCommand::class,
    ]);
}

// config 覆盖
private function bootConfigMail()
{
    config([
        'mail.driver'       => sys_setting('system::mail.driver') ?: config('mail.driver'),
    ]);
}

```

## 验证

```
1.语言包
 - resource/lang/zh/validator.php
2.相应的验证规则
 - Rule 类
3.FrameworkServiceProvider.php 验证正则规则
```

## 设置

设置使用 Form Setting 来进行设置, 详细见 Form 部分

## 模块约定

## 缓存

**缓存 Key 命名**

缓存 Key 放置在模型/Action 的常量中, 命名规范是

`CK_{Key}`

Key : 命名的标识

**缓存命中命名**

缓存命中包含 Atomic / Funnel 这种, 缓存命中放置在 `Redis(0)` 仓库中,
命名规范为

`prefix:redis:{function tag}:{key}`

function tag : 功能标签, 用来进行文件夹区分 key : 唯一标识符
