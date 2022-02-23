# 最佳实践

## phplint

[phplint](https://github.com/overtrue/phplint)是一个快速检测 php 语法错误的工具,
此工具无需安装在项目中, 全局安装即可.

```
$ composer global require overtrue/phplint -vvv
$ php artisan system:doc lint
$ phplint /path/of/code -c /framework/path/.phplint.yml
```

## 项目优化 optimize

运行 `php artisan poppy:optimize` 保障依赖组件均已经安装

## composer 配置

### 开发文件不需要自动加载

-   项目中使用 IDE Helper 生成浏览器提示文件,
    此文件在正式项目下不需要进行加载
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

### 映射 Form , 需要在 composer 中加入数据

由于这里是继承的 "laravelcollective/html" 组件,
所以必须先禁用掉原生的自动发现

在 composer.json 文件中禁用自动发现

```
"extra" : {
    "laravel" : {
        "dont-discover" : [
            "laravelcollective/html"
        ]
    }
},
```

在 `providers` 部分加入

```
'providers' => [
    // ...
    Collective\Html\HtmlServiceProvider::class,
    // ...
];
```

生成自动加载类

```
composer dumpautoload
```

清空缓存的数据

```
php artisan poppy:optimize
```

然后在 `app.php` 的 `aliases` 部分加入

```
'aliases' => [
    // ...
    'Html' => Collective\Html\HtmlFacade::class,
    'Form' => System\Classes\Facade\FormFacade::class,
    // ...
];
```

## 模块配置 (config/module.php)

### 隐藏功能

### 配置命名空间支持 单元测试

因为单元测试需要识别路径, 这里需要配置 psr-4 的映射 需要配置 1 个地址即可,
否则使用 phpunit 进行单元测试的时候无法进行有效的类加载.

```
"autoload-dev" : {
    "classmap" : [
    ],
    "psr-4" : {
        "System\\Tests\\" : "modules/system/tests/"
    }
},
```

## IDE 项目配置

### 可以隐藏的目录

右键忽略掉即可, 这个是生成的文件, 不需要进行 php 索引

```
前端文件
========
public/assets/css
public/assets/font/fontawesome
public/assets/js/system_cp.js
public/assets/js/system_vendor.js
public/assets/easy-web
```

### IDE 插件配置

#### 插件 [.ignore](https://plugins.jetbrains.com/plugin/7495--ignore)

可以在编辑器忽略文件显示的组件

[.ignore 示例文件](https://gist.github.com/imvkmark/15198641b214b35916cf54414516caf0)

#### 插件 [Laravel Plugin](https://plugins.jetbrains.com/plugin/7532-laravel-plugin)

**启用 插件**

找到 `Preferences | Languages & Frameworks | PHP | Laravel`, 然后开启 `Enable Plugin for this project`

**配置 view 的映射**
例如 `system` 模块的映射地址应该是 `modules/system/resources/views`

这样在点击的时候才能够跳转到这个页面

**启用控制器的命名空间检测**

在 `Router Namespace` 中添加相关的命名空间, 多个使用 `,` 分隔.

#### 插件 [php inspection](https://plugins.jetbrains.com/plugin/7622-php-inspections-ea-extended-)

开启之后需要需要在写 PHP 的时候注意项目, [相关的文档点击](https://github.com/kalessil/phpinspectionsea/tree/master/docs)

#### 插件 [String Manipulation](https://plugins.jetbrains.com/plugin/2162-string-manipulation)

> 提供字符的便捷操作

#### 插件 [CamelCase](https://plugins.jetbrains.com/plugin/7160-camelcase)

> 提供大小写转换

## 前端组件文档

### 多图片/视频上传

```
{!! Form::multiThumb('images', [], $options) !!}

options    类型      默认值    备注
---------- -------- -------- --------------------------------
pam        object   null     当前用户对象, 用于上传文件的授权
type       string   image    允许传入的文件类型支持 (image:图片;video:视频;picture:音视频)
sequence   bool     false    是否支持排序
number     int      3        本表单允许上传的最大数量
```

### PHP-CS-Fixer

[PHP-CS-Fixer](https://github.com/FriendsOfPHP/PHP-CS-Fixer) is a tool to automatically fix PHP Coding Standards issues, We use it for Code Specification.

### 测试用例完善并且通过

### 注释完善并且通过

注释使用 `modules/system` 模块来检测

```
$ php artisan system:inspect class > fp.txt
```

### 代码清理过

```
ide:clean code
```

### 不要出现 package 标签

```
@package
```
