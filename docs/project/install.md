# 安装

## 配置项目环境

默认项目中没有 `.env` 文件

### 项目配置文件

复制 `.env.example` 为 `.env`

```
$ cp .env.example .env
```

配置数据库信息

```
DB_HOST=127.0.0.1
DB_DATABASE=poppy_v1
DB_USERNAME=root
DB_PASSWORD=Poppy123456
```

配置域名

```
URL_SITE=https://poppy-demo.wulicode.com
```

生成 app key, jwt key

```
$ php artisan key:generate
$ php artisan jwt:secret
```

### 项目初始化以及安装

执行数据库 migrate

```
$ php artisan poppy:migrate
```

系统安装并创建用户

```
$ php artisan py-system:install
Start Install Lemon Framework!
Init UserRole Ing...
Init Role success
Install User Roles Success
Init Rbac Permission...
[poppy.core.PermissionCommand] Import permission Success!
Init Rbac Permission Success

$ php artisan py-system:user create_user

 Please input username!:
 > root_user

 Please input password!:
 > 123456

 Please input role name!:
 > root

User root_user created
```

安装完成访问 `https://poppy-demo.wulicode.com/backend/login`


![](https://file.wulicode.com/note/2021/11-09/09-47-19512.png)


登录之后的界面

![](https://file.wulicode.com/note/2021/11-09/09-47-58380.png)


