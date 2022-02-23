# 管理后台

## 资源发布

MgrPage 管理后台使用的是 js 加载方式, 如果使用 MgrPage, 则需要在更新 composer 组件之后运行以下命令进行强制更新

```
$ php artisan vendor:publish --force --tag=poppy-mix
```

或者将此命令加入 composer.json 文件中, 每次更新完成 composer 的时候都会自动进行一次发布

```json
{
    "....": "...",
    "scripts": {
        "post-update-cmd": [
            "...",
            "php artisan vendor:publish --force --tag=poppy-mix"
            "..."
        ]
    },
    ".....": "...."
}
```
