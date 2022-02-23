# Readme

> Poppy 核心模块, system 基于本模块

### 权限操作

```
php artisan py-core:permission {slug}
{slug}:
    - list   : 获取权限列表
    - init   : 权限初始化
    - menus  : 检查菜单[todo Undefined index: children]
    - assign : 将权限赋值给指定的用户组
    - check  : 权限检测
```

### 文档以及检查工具

```
php artisan py-core:doc {slug}
{slug}:
    - api   : 生成api文档[apidoc 生成目录]
    - cs    : code style - fix , 代码格式修复(todo 以后IDE 来做)
    - cs-pf :
    - lint  : 安装检测PHP语法错误的工具
    - php   : 生成 php api 文档
    - log   : 查看当天的 storage 日志
```

**关于 phplint**

[phplint](https://github.com/overtrue/phplint)是一个快速检测 php 语法错误的工具, 此工具无需安装在项目中, 全局安装即可.

```
$ composer global require overtrue/phplint -vvv
$ php artisan py-core:doc lint
$ phplint /path/of/code -c /framework/path/.phplint.yml
```

### 检查代码

```
php artisan py-core:inspect {slug}
{slug} :
    - apidoc     : 检查api文档(需要指定目录)
    - class      : 方法检测
    - pages      : 检测页面Key[todo 以后会删掉]
    - file       : 检测文件命名[文件类和文件位置不匹配]
    - database   : 检测数据库配置
    - controller : 列出所有功能点
    - action     : 列出所有业务逻辑
    - seo        : 生成 seo 项目
    - db_seo     : 生成数据库SEO 数据
```

### 运维工具

```
php artisan py-core:op {slug}
{slug} :
    - mail   : 发送运维邮件
```

## 配置说明

文件位置 : `config/poppy.php`

```
return [
    ...
    'core' => [

        // 设置维护的邮箱
        'op_mail'    => env('CORE_OP_MAIL', ''),

        // 设置 RBAC 模型以及外键 KEY
        'rbac' => [
            // 角色模型
            'role'            => \Poppy\System\Models\PamRole::class,
            // 账号模型
            'account'         => \Poppy\System\Models\PamAccount::class,
            // 角色账号模型
            'role_account'    => \Poppy\System\Models\PamRoleAccount::class,
            // 权限模型
            'permission'      => \Poppy\System\Models\PamPermission::class,
            // 角色权限模型
            'role_permission' => \Poppy\System\Models\PamPermissionRole::class,
            // 角色外键
            'role_fk'         => 'role_id',
            // 账号外键
            'account_fk'      => 'account_id',
            // 权限外键
            'permission_fk'   => 'permission_id',
        ],
    ],
    ...
]
```
