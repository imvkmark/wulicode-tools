# 模型

## 命名及放置位置

### 创建

使用 `php artisan poppy:model {module} {DbModel}` 来生成模型

模型文件统一放置在 `~/modules/{module}/src/models/` 文件夹下,
这个文件夹中包含 4 中类型的数据

-   模型
-   筛选过滤器
-   策略
-   接口资源文件

配置项目

```
# 指定表名
protected $table = '';

# 指定主键, 如果 主键为 'id' 可以不用指定默认值
protected $primaryKey = '';

# 指定插入数据库字段
protected $fillable = [];

# 时间是否自动维护, (false 不自动维护,true 自动维护) 默认true
protected $timestamp = false;

# 时间类型 例:  logined_at, disabled_at  要放在
protected $dates = [
    'logined_at',
    'disabled_at',
];
```

**模型**:

模型文件放置在上述文件夹中的根目录( `~`  )下,命名与数据表名称相对应

**筛选过滤器**

放置位置 : `~/filters`
文件命名 : 模型名称+Filter 例如 :
(`PamAccountFilter`)

**策略**

放置位置 :
`~/policies`
文件命名 :
模型名称+Policy 例如 : (`PamAccountPolicy`)

**资源文件(接口资源)**:

放置位置 : `~/resources`
文件命名 : 模型名称+Resource 例如 :(`PamAccountResource`)

### 模型注释

模型需要有完备的文档注释, 日期格式和文字说明, 并且需要参数和注释对齐

使用 `ide-helper` 生成模型文档语法

```
$ php artisan ide-helper:model "System\Models\PamAccount"
```

模型注释需要导入提示, 在 PHPstorm 中需要 `alt+enter` 进行 `Import Class`
或者 `Simplify FQN`

```php
# bad
/**
 * @property \Carbon\Carbon    $created_at
 */

 /**
 * @property Carbon    $created_at
 */
```

### 完整注释

这里的注释必须放置在类文件中进行定义,
里边的字段值出现的仅仅是新模块使用的, 包含兼容,
但是不包含调用的字段命名.

```php
/**
 * System\BaseBanword
 * @property integer        $item_id      id
 * @property string         $replace_from 需要替换的词
 * @property string         $replace_to   替换为
 * @property boolean        $deny         是否进行拦截(0,1)
 * @property \Carbon\Carbon $created_at   创建时间
 * @property \Carbon\Carbon $deleted_at   删除时间
 * @property \Carbon\Carbon $updated_at   更新时间
 */
 class BaseBanword extends \Eloquent {
     ...
 }
```

存储为 datetime 类型的数字放到 \$dates 数组中

### 命名

**模型文件使用 首字母大写的驼峰方式**

例如 约定的数据表的名称是 `base_config`, 命名的数据库模型是 `BaseConfig`

**模型采用分组**

```
base    # 后台
pam     # 用户身份认证
order   # 订单
message # 消息
user    # 用户
```

### 命名空间

```
<?php namespace {Module}\Models;
```

### 表/主键

-   `$table` 定义的是原始表的名称
-   `$primaryKey` 定义的是主键

#### 设计原则

-   字串默认值必须是 \'\'
-   数值必须存在默认值, 默认值为 0 (根据业务需求来定义)
-   唯一 字段映射的唯一性 例如 group_id 仅仅是会员组 ID
-   模块分组 pam 作为权限验证组
-   使用最简略命名 username
-   数据库相关属性的字段放置在一起

```
disable_reason
disabled_from_at
disabled_to_at
```

#### 模型定义

#### kv 定义

开发中不允许出现状态是 1, 2, 3, 所有的对应项目必须在模型中给予定义,
采用常量的方式进行定义

```
const LOCK_LOCK    = 1;
const LOCK_UNLOCK  = 0;

/**
 * 锁定/解锁
 * @param null $key
 * @return array|mixed
 */
public static function kvLock($key = null) {
    $desc = [
        self::LOCK_LOCK   => '锁定',
        self::LOCK_UNLOCK => '解锁',
    ];
    return kv($key);
}
```

### Enum 的使用

开发中使用`常量`来替代 `enum`, 不得使用 `enum` 来对数据库进行枚举,
公共的定义放置在`BaseConfig` 中

```
class BaseConfig{
    const YES = 1;
    const NO  = 0;

    public static function kvYn($key = null) {
            $desc = [
              self::YES   => '是',
              self::NO    => '否',
         ];
         return kv($key);
    }
}
```

### 关联关系的命名

对于关联关系的命名, 采用简写格式. 例如我们需要关联用户表,
模型中需要如下定义

```
class FinanceCash{
    // ...
    public function pam() {
        return $this->belongsTo(App\Models\PamAccount::class, 'account_id', 'account_id');
    }
    // ...
}
```

### 在代码中调用模型注释

#### 注释调用

例如以下这个模型

```
...
* @property int    $login_times  登录次数[成功请求接口便认定为1次]
...
class PamAccount extends \Eloquent
{
   ...
}
```

我们使用 `sys_db('pam_account.login_times')` 便可以获取

-   `pam_account` 是模型的蛇形写法
-   `login_times` 是字段名称

这里注意的是, 注释中 `[]` 内的内容认定为模型注释, 不必进行返回

#### 注释更新

如果注释更新之后模型中调用没有获取到最新的, 清空下缓存即可.

## 数据表字段

### 数据表常用字段

```
id               : 条目ID
name             : 标示符, 只能是 英文
title            : 标题
account_id       : 用户ID
username         : 用户名
created_at       : datetime 类型 , L5 默认创建时间
deleted_at       : l5 软删除(项目中不推荐使用, 效率低下)
updated_at       : l5 更新
```

## 数据库索引

### 索引命名

```
# 索引(index)
item            k_base_config_item

# 唯一验证(unique)
account_name    u_account_name
```

## 使用

## 表创建

```
$tb_pam   = (new PamAccount())->getTable();
$tb_ft    = (new AccountFront())->getTable();
$Db = \DB::table($tb_pam)->where('account_type', 'front');
$Db->where($tb_pam . '.account_id', '!=', \FrontAuth::id());
$Db->join($tb_ft, $tb_pam . '.account_id', '=', $tb_ft . '.account_id');
$accounts = $Db->paginate(16);
$accounts->appends($request->input());
```

### like 搜索

**多字段 like**

```
$kw = $request->input('kw');
if ($kw) {
    $Db->where(function($query) use ($kw, $tb_weixin){
        $query->orWhere($tb_weixin.'.wx_account', 'like', '%'.$kw.'%');
        $query->orWhere($tb_weixin.'.wx_account', 'like', '%'.$kw.'%');
    });
}
```

**单字段 like**

```
$account_name = $request->input('account_name');
if ($account_name) {
    $Db->where($tb_pam . '.account_name', 'like', '%' . $account_name . '%');
}
```

### 普通搜索

```
$wx_status = $request->input('wx_status');
if ($wx_status) {
    $Db->where('wx_status', $wx_status);
}
```

### 排序

```
$orderKey = in_array(SysSearch::key(), [
    'wx_fans',
]) ? SysSearch::key() : 'created_at';
$Db->orderBy($tb_weixin . '.' . $orderKey, SysSearch::order());
```

## 建表规范

-   数据类型尽量用数字类型，数字类型的比字符类型的要快很多，比如使用 INT
    UNSIGNED 存储 IP
-   大数据字段最好剥离出单独的表，以便影响性能
-   使用 varchar，代替 char，这是因为 varchar 会动态分配长度
-   数据类型尽量小，这里的尽量小是指在满足可以预见的未来需求的前提下的,但是有不能太小，所以在建表的时候一定要预估这个字段最大的长度到底是多少
-   不允许 NULL，用 NOT NULL+DEFAULT 的值来代替
-   少用 TEXT 和 IMAGE，二进制字段的读写是比较慢的，而且，读取的方法也不多，大部分情况下最好不用
-   表名 字段名字统一用小写
-   字段名字不要用驼峰命名法 比如 add_time 不要写成 AddTime
-   字段命名关键字统一用下划线\"\_\"分割，一般采用简写，关键字要准确，不能有歧义
-   所有的表必须包含 id（自增主键），add_time（新增时间），update_time（更新时间），mark（删除标记
    ）这 3 个字段
-   每个字段的 COMMENT 必须写清楚，枚举类型必须写清楚每个值到底是什么意思，枚举的写法统一成"删除标记（0：未删除，1：已经删除）"，符号为中文符号
-   update_time（更新时间）字段自动修改。`update_time` timestamp NOT
    NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT
    \'更新时间 \'
-   时间类型尽量用 timestamp 4 个字节,而不用 datetime
    8 个字节。只用表示日期的字段用 date 类型
-   建表语句不允许包含外键
-   库、表、字段字符集统一使用 UTF8。
