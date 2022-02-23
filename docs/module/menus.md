# 菜单

## 支持的类型

key 包含 backend(后端), develop(开发), web(前台)这几个部分.

```yaml
backend:
    title: 广告管理
    icon: "fa fa-audio-description"
    groups:
        - title: 广告管理
          icon: "fa fa-audio-description"
          injection: "poppy.mgr-page/backend||setting"
          children:
              - title: 广告位管理
                route: py-ad:backend.place.index
                permission: backend:poppy-ad.place.manage
develop: ...
```

## key 说明

```
title     : 标题
icon      : 支持的图标
groups    : 分组(数组)
injection : 分组的插入目标地 'poppy.mgr-page/backend||setting' 代表放置到 mgr-page/backend setting 那个 key 下模块的后台分组
match     : 用于路由的第三级别, 页面中内容区域和右侧菜单项目的匹配,不设置可能会导致页面菜单为空
```
