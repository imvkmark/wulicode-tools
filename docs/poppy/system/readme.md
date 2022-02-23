# Readme

## 系统模块

```
# 项目初始化
$ php artisan py-system:install

# 用户部分
$ php artisan py-system:user {slug}
```

## System: 用户类型/角色/加密方式

本系统基于角色的权限访问控制（Role-Based Access Control）

### 用户类型

根据使用分为三种用户类型(默认)

```
user            # 前台用户
develop         # 开发者用户
backend         # 后台用户
```

根据使用到的用户的类型我们应当分为这几项

```
用户 - api (jwt) 驱动
用户 - web 驱动
开发 - web 驱动
后端 - web 驱动
后端 - api (jwt) 驱动
```

每一种用户定义的角色分为三种

```
root     : 后台超级管理员
user     : 前台普通用户
develop  : 开发者
```

### 密码加密方式

```
$password     : 原始密码
$reg_datetime : 注册时间(datetime) 类型
$randomKey    : 六位随机值
md5(sha1($password . $reg_datetime) . $randomKey);
```

### 通行证约定

| id       | int(10)     |                                           |
| -------- | ----------- | ----------------------------------------- |
| username | varchar(45) | 字母数字下划线中文, 冒号(英文,子用户使用) |
| mobile   | varchar(45) | 手机号, 格式 86-15555555555, 国别手机号   |
| email    | varchar(50) | 邮箱                                      |

因为以上这些可以作为通行证, 所以必须是经过认证的才可以写入这个数据表, 否则无法进行写入
