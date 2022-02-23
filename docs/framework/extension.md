# 扩展开发

## Composer 文件生成

composer.json 文件解释

```
{
    # 包名称, 可以自定义 package 名称, 蛇形写法
    "name": "poppy/ext-{package}",
    # 描述, 必须是英文
    "description": "Poppy frontEnd support",
    "type": "poppy-extension",
    # 作者
    "authors": [
        {
            "name": "Mark Zhao",
            "email": "zhaody901@126.com"
        }
    ],
    # 依赖包 不依赖则留空
    "require": {
        "php": ">=7.0.0",
        # 加载第三方包
        "sabberworm/php-css-parser": "^8.1"
    },
    # 自动加载命名空间
    # 命名空间 {Package} 应当和 name 相匹配
    "autoload": {
        "psr-4": {
            "Poppy\\Extension\\{Package}\\": "src/"
        }
    },
    "config": {
        "preferred-install": "dist"
    },
    "minimum-stability": "dev"
}
```

根目录文件生成方式 - 初始化 第一步: 创建 创建: 如果没有
ext-{package}/composer.json 中的时候

```
$ composer init
```

composer 文件加载

生成 autoload 文件

```
$ composer update -vvv
```

清空进行 poppy 优化,重置缓存, 加载当前包(From notadd)

```
$ php artisan poppy:optimize
```

至此命名空间可以自动加载成功

## 开发时单元测试支持

配置命名空间支持 单元测试

因为单元测试需要识别路径, 这里需要配置 psr-4 的映射 需要配置 1 个地址即可, 否则使用 phpunit 进行单元测试的时候无法进行有效的类加载.

```
"autoload-dev" : {
    "classmap" : [
    ],
    "psr-4" : {
        "Poppy\\System\\Tests\\" : "poppy/system/tests/"
    }
},
```

## 技巧

1. 如何验证 trans 文档是否正确

-   使用 phpstorm 搜索出所有所有 `trans('` 匹配的文档
-   使用 `open in window`打开
-   邮件根菜单选择 `Export to text file` 选择位置进行保存
-   运行命令 `php artisan py-core:inspect trans --export=/Users/duoli/Desktop/report.txt`
