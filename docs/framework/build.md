# 修改记录

## 3.x

**3.2**

-   poppy 框架升级到 `6.*`
-   composer 升级到 2.0 版本
-   php 最低版本为 7.4
-   相关依赖变更为 `3.2.*`

**3.1**

_framework_

-   PoppyTrait 更改为 pyXx 模式, Poppy Function Rename
    -   getCache => pyCache
-   Symfony error FatalErrorException => FatalError
-   Remove lang/zh/http.php
-   Add parse_seo function
-   Remove str-helper generator
-   Remove web-helper
-   Remove PoppyServiceProvider@registerConsoleCommand
-   更改为强类型(Strong Type)
-   remove `Http\Middlewares\CrossPreflight` : 使用 `EnableCrossRequest` 替代
-   Event `PoppyOptimized` move to `src\Events` folder
-   模块支持 composer poppy 文件夹加载, poppy.xxx 为 composer 模块, module.xx 为自定义业务逻辑模块
-   Resp 内置参数 `_json`, `_location`, `_time`, `_forget`, `_time` 更改为下划线前缀
-   `Rule::password()` 和 Laravel 框架的 `password` 规则冲突, 新增 `Rule::simplePwd()` 方法来进行基本的密码校验

_core_

-   Add Rds 缓存系列工具
-   Modules 管理
-   Rbac

_system_

-   拆离组件包到 Core 模块

## 2.x

**2.0.0**

-   for laravel 6.x
-   remove agmotto

## 1.x

**1.0.0**

-   for laravel 5.5
-   Remove `cache_name` function
-   Remove similar function with laravel
-   Move Pinyin Component to Package
-   Add update
-   Resp
-   Doc command remove to System module
-   Add Document for command
-   Delete Graphql
-   Add phplint
-   Add php-cs-fixer
