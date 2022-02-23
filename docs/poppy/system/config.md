# 系统配置

> 本模块的配置是注入到 `poppy.php` 文件中, 以下的所有配置均可配置
> key 是 `poppy.system`

## cross_origin

-   Type : `string|array`
-   Default : `*`

接口请求的时候可以对来源进行设定, 防止 web 端跨域访问资源, 这里的来源可以为 `*` 或者数组, 数组为类似于 `http://poppy.wulicode.com` 这种形式, 如果是网址则只能填写一个完整字串, 或者多个网址, 使用
数组进行设定

```
'cross_origin'      => [
    'http://poppy.wulicode.com'
],
```

## cross_headers

-   Type : `string`
-   Default : `''`

允许的 Header, 可以允许设定前端访问的时候指定的 Header 可以通过浏览器跨域验证, 多个参数使用 `,` 分隔

```
cross_headers => 'X-APP-VERSION'
```

## demo

-   Type : `bool`
-   Default : `false`

演示模式, 开启则无法上传文件, 修改密码

## upload_image_district

-   Type : `array`
-   Default : `['default' => 1920,'avatar' => 300,]`

上传图片大小限制, 根据接口上传的 `image_type` 类型对图片进行压缩

```
'upload_image_district' => [
    'default' => 1920,
    'avatar'  => 300,
    ...
],
```

## csrf_except

-   Type : `array`
-   Default : `[]`

支持 Laravel 的路由过滤的方式来移除匹配的路由不进行 csrf 验证. 参考 : [CSRF 保护](https://learnku.com/docs/laravel/6.x/csrf/5137)

## uncrypt_cookies

-   Type : `array`
-   Default : `[]`

使用 laravel cookie 进行设定时, 设定的 cookie 不进行加密输出, 方便 js 进行读取, 共享数据

## password_provider

-   Type : `string`
-   Default : `''`

密码加载器, 这里这里设定密码算法, 为了保护用户数据安全, 特设定此方式来保护密码计算 默认是 `\Poppy\System\Classes\Auth\Password\DefaultPasswordProvider::class`
替换该实现方式需要实现 `\Poppy\System\Classes\Contracts\PasswordContract::class` 约定.

## user_location

-   Type : `string`
-   Default : `''`

登录跳转地址, 使用默认的 `web-auth` guard 做验证则需要设定此配置, 当验证失败, 自动跳转到此路径, 这里是路径, 不是路由地址

## route_hide

-   Type : `array`
-   Default : `[]`

隐藏路由, 后台可以隐藏的路由, 写在这里, 后台列表不予显示

## prefix

-   Type : `string`
-   Default : `mgr-page`

后台默认登陆入口

## api_enable_sign

-   Type : `bool`
-   Default : `true`

是否启用 api 签名验证

## api_sign_provider

接口签名算法, 需要实现 `\Poppy\System\Classes\Contracts\ApiSignContract:class` 约定

## (\*)payment_types

-   Type : `array`
-   Default : `[]`

[待定]支付类型
