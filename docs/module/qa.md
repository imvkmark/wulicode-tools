# 常见问题

## 1. 在模块中对接 sentry

**安装 `sentry/sentry-laravel` 包**

```
composer require sentry/sentry-laravel
```

**新建异常监听**

这里文件位置放置在 `modules/misc/src/http/foundation` 下

_Handler.php_

```php
<?php

namespace Misc\Http\Foundation;

use Exception;

/**
 * poppy handler
 */
class Handler extends \Poppy\System\Http\Exception\Handler
{
    public function report(Exception $exception)
    {
        if (app()->bound('sentry') && $this->shouldReport($exception)) {
            if (!in_array(config('app.env'), ['local', 'test'])){
                app('sentry')->captureException($exception);
            }
        }
        parent::report($exception);
    }
}

```

**在 composer 中注册 psr-4 的类的位置**

_composer.json_

```json
{
     "autoload": {
        "psr-4": {
            ...
            "Misc\\Http\\Foundation\\": "modules/misc/src/http/foundation",
            ...
        }
     }
}
```

运行命令完成类的注册

```sh
$ composer dumpautoload
```

**使用 Handler**

将错误监听修改为自定义的错误监控类

_storage/bootstrap/app.php_

```php
$app->singleton(
	Illuminate\Contracts\Debug\ExceptionHandler::class,
	Misc\Http\Foundation\Handler::class
);
```

这样便可以注册并收到异常

因为框架在注册异常之前需要知晓异常类的位置, 否则出现异常的时候无法进行异常报错

> 2021/09/27 15:38:44 [error] 46887#0: \*12 FastCGI sent in stderr: "PHP message: PHP Fatal error: Uncaught ReflectionException: Class Misc\Foundation\Handler does not exist in /Users/duoli/Documents/workbench/dl.wulicode/poppy/vendor/laravel/framework/src/Illuminate/Container/Container.php:803
