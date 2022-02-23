# 配置

## page_size

default : 15
默认的分页大小, 默认 15 条

## page_max

default: 3000
最大分页数

## message_template

default : []
根据执行内容显示不同的视图模板(例成功/失败)
接收视图地址 如 `module::xx.folder.message`   可支持多个视图地址

## title

default : '网站名称'
默认的网站名称, 作为默认信息会注入到 view 视图的 `$_title`  中

## description

default : '网站描述'
默认的网站描述信息, 作为默认信息会注入到 view 视图的 `$_description`  中
