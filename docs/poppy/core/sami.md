# 生成 php api 文档

> 先睹为快, 使用 sami 生成的 php api 地址 [PhpApi For Poppy](https://poppy-demo.wulicode.com/docs/php/)

## 生成配置文件

```
$ php artisan vendor:publish --tag=poppy
...
Copied File [/modules/system/resources/config/sami.php] To [/storage/sami/config.php]
Publishing complete.
```

## 下载 sami

首先下载 sami , 放到 `storage/sami/sami.phar` 这个位置 或者使用命令来下载, 如果不知道命令可以运行 `php artisan py-core:doc php`
来查看下载文件的命令

```
$ php artisan py-core:doc php

Please Run Command To Install Sami.phar:
curl http://get.sensiolabs.org/sami.phar --output /data/workbench/www/wulicode/storage/sami/sami.phar

# 下载之后再运行

$ php artisan py-core:doc php
Please Run Command:
php /data/workbench/www/wulicode/storage/sami/sami.phar update /data/workbench/www/wulicode/storage/sami/config.php
```

我们运行命令来生成 php 文档

由于 sami 最新版是基于 php7.1 版本的, 所以我们必须以正确版本来运行. 如果版本不正确则无法运行

```
$ php71 /data/workbench/www/wulicode/storage/sami/sami.phar update /data/workbench/www/wulicode/storage/sami/config.php
 Updating project

Version master
  Parsing   done
  Rendering done

 Version    Updated C    Removed C
   master         1224            0

 Version    Updated C    Updated N    Removed C    Removed N
   master            2            0            0            0
```

运行完成后会在 `public/docs/php` 文件夹下生成标准的 html 文档, 这样我们就可以进行访问了.

如果默认的配置无法满足你的要求可以编辑 `resources/sami/sami.php`
文件来修改需要生成文档的文件夹和目标路径.

生成文档如下

![](https://file.wulicode.com/note/2021/10-23/11-33-00249.png)


Sami 配置文件查看 : [sami-config.php](https://github.com/imvkmark/poppy-core/blob/3.0/resources/config/sami-config.php)
