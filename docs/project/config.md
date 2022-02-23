# 配置

设置运行环境

```
# local|本地;test|测试;develop|预发;production|生产环境
APP_ENV=local
APP_DEBUG=true
```

生成 APP_KEY

```
$ php artisan key:generate
APP_KEY=base64:J3scto3x2wZNnJlqeKcZSBLUuUcSylIj1t+cJCUEbWY=
```

设置运行网址
运行网址不要有下划线(因为正常的域名中不会有\_, 所以某些浏览器可能无法识别), 不要有斜线

```
URL_SITE=http://local-domain.com
```

设置数据库

```
DB_HOST=192.168.1.21
DB_DATABASE=poppy
DB_USERNAME=root
DB_PASSWORD=Markzhao123456
```

设置 JWT key

```
$ php artisan jwt:secret
JWT_SECRET=XgVv3f3yLEBHmkkoipLil22oxaD1ZWaB
```

设置缓存

```env
# 缓存驱动
CACHE_DRIVER=redis
# 缓存前缀
CACHE_PREFIX=poppy
```

设置 Session 驱动方式

```
SESSION_DRIVER=redis
```

设置队列驱动

```
# 本地使用 同步驱动, 线上使用redis , 默认为 sync
QUEUE_DRIVER=sync
```
