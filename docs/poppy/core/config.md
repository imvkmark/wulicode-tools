# 配置

## apidoc

-   Type : `array`

api 接口文档配置, 改文档可以使用 `php artisan py-core:doc api` 来生成文档, 定义如下

```
'apidoc' => [
    ...
	'web' => [
        // 标题
        'title'            => '前台接口',
        // 方法
        'method'           => 'post',
        // 默认访问地址
        'default_url'      => 'api_v1/system/auth/login',
        // 其他参数  签名验证
		'sign_certificate' => [
			'name'         => 'timestamp',
			'title'        => 'TimeStamp',
			'type'         => 'String',
			'is_required'  => 'Y',
		],
        // 签名生成
		'sign_generate'    => DefaultApiSignProvider::js(),
        // 源文件夹
        'origin'           => 'modules',
        // 接口测试构建器[未实现]
        'factory'          => WebApiFactory::class,
        // 生成目录
        'doc'              => 'public/docs/web',
	],
	...
]
```

## op_mail

-   Type : `string`
-   Default : `env('CORE_OP_MAIL', '')`

后台可支持发送测试邮件, 这里配置发送人的邮箱

## rbac

-   Type : `array`

设置 RBAC 模型以及外键 KEY, 这里默认设定的是 `poppy/system` 模块的模型, 不使用此模块可以自行实现模型定义以及关联关系

```
'rbac'       => [
    // 角色模型
    'role'            => \Poppy\System\Models\PamRole::class,
    // 账号模型
    'account'         => \Poppy\System\Models\PamAccount::class,
    // 角色账号模型
    'role_account'    => \Poppy\System\Models\PamRoleAccount::class,
    // 权限模型
    'permission'      => \Poppy\System\Models\PamPermission::class,
    // 角色权限模型
    'role_permission' => \Poppy\System\Models\PamPermissionRole::class,
    // 角色外键
    'role_fk'         => 'role_id',
    // 账号外键
    'account_fk'      => 'account_id',
    // 权限外键
    'permission_fk'   => 'permission_id',
],
```
