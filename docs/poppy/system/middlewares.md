# 中间件

## JwtAuthenticate

作用

-   校验 token 是否合法(不涉及到数据库查询, 校验 Token 合法性)
-   校验 用户密码是否符合, 在拿到授权之后, 对比 salt, 验证是否合法

流程参考

![](https://file.wulicode.com/note/2021/11-09/11-46-46495.png)
