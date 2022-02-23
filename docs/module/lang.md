# 国际化

## 位置

公共语言位置: `resource/lang/zh/`

```
validator.php    # 验证文件, 和框架匹配的
```

模块语言位置: `modules/{module}/resources/lang` 文件夹中

```
action.php     # 存放业务逻辑
seo.php        # Seo 标题优化文件
util.php       # 其他相关的文件
```

## action.php

```
/* 验证码
 * ---------------------------------------- */
'captcha' => [   // Action
    'send_passport_format_error' => '无法发送验证码, 格式不正确',
    'account_miss'               => '指定账号不存在, 无法发送',
    'account_exists'             => '指定手机号已经存在, 不能绑定, 请更换',
    'account_no_password'        => '账户未设置密码',
],
```

Action 的文件的使用

```
trans('py-system::action.captcha.account_no_password'),
```

## seo.php

这里根据路由的名称来返回 Seo 的标题还有描述

```
return [
    'web_layout_index'             => '页面布局',
    'web_res_mix'                  => '资源调用',
    'web_res_translate'            => [
        '资源翻译',
        '通过资源的翻译来返回响应的 json 信息',
    ],
]
```
