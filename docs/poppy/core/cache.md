# 缓存约定

## 缓存定义

缓存使用扁平化管理, 缓存函数是在 laravel 的基础上加了一层标签, 用法遵循 laravel 缓存使用

缓存一般采用如下命名

```
sys_cache('{slug}')->get('{name}')
slug    : 根据模块目录来进行判定
    例如 poppy system 模块命名为 py-system
    例如 poppy core 模块命名为 py-core
    例如 poppy core rbac 模块命名为 py-core-rbac(因为需要用到 flush 方法, 这里采用标签来区分, 而不是使用 type)
name    : 代表的是缓存的名称
```

为了保证缓存名称的唯一性我们约定
slug : poppy 模块 : `py-{module}`

name : name 使用静态方法定义, 支持传参

## 示例

例如 Area 模块的我们定义缓存函数

```php
<?php namespace Poppy\Area\Classes;


class PyAreaDef
{
    /**
     * ID -> PID 映射
     * @return string
     */
    public static function ckMatchIdPid(): string
    {
        return 'match_id_pid';
    }
}
```

使用

```php
/**
 * @param bool $clear 是否清除
 * @return mixed
 */
function matchKv($clear = false)
{
    if ($clear) {
        sys_cache('py-area')->forget(PyAreaDef::ckMatchIdPid());
    }

    return sys_cache('py-area')->remember(PyAreaDef::ckMatchIdPid(), 10, function () {
        return AreaContent::pluck('parent_id', 'id')->toArray();
    });
}
```
