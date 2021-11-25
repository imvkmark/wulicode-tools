## 需要对接的数据

- [] console.log 打包的时候依然存在
- [] 对接表单的显示以及验证
    - Text
    - Image
    - Checkbox
    - RadioBox
    - MultiImage
    - Select
    - SelectWithRemote
- [] 验证规则 : 参考 Laravel 文档

- after:date
- after_or_equal:date
- array
- before:date
- before_or_equal:date
- boolean
- confirmed
- date
- date_equals:date
- date_format:format
- different:field
- dimensions
- ends_with:foo,bar
- filled
- gt:field
- gte:field
- image
- file
- in:foo,bar
- not_in:foo,bar
- not_regex:pattern
- nullable
- regex:pattern
- required_if:anotherfield,value1,value2,value3
- same:field
- starts_with:foo,bar
- timezone
- 需要支持自定义的参数代入和替换
## Change Log

- ~~上传失败更改为 Reject~~