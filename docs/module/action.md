# 业务逻辑

## 位置

位置 `modules/{module}/src/action`

## 注释

这里的注释在使用 PhpStorm/WebStorm 的时候可以自动生成 `/**`
所有的函数都需要按照这种格式来写

```
/**
 * 创建|编辑订单
 * @param array  $input      订单数据    <br />
 *      {String} title     订单标题      <br />
 *      {Int}    server_id 服务器ID      <br />
 * @param string $pay_pwd    支付密码
 * @param string $order_type 操控类型  [create|创建,edit|编辑]
 * @param string $type       支付密码传递方式
 * @return bool
 */
public function establish($input, $pay_pwd, $order_type, $type = 'plain')
{
   ...
}
```

这里需要注意的是, 如果是数组, 则需要按照如下的方式进行注释

**数组注释** 这里的注释方式和 Api 接口注释方式一致

```
*      {String} title     订单标题      <br />
*      {Int}    server_id 服务器ID      <br />
```

## 定义 code

Code 定义, Code 定义在 Action 文件中, Action 为 6 位的代码 例如错误代码为
100101, 一般对于 app 有独特错误的才会进行返回, 例如这里支付密码不正确,
需要重新设置/找回支付密码, app 拿到这个代码可以进行相应的提示,
而不能够根据返回的错误提示进行相应操作. 错误提示可以更改,
错误代码一旦定义则不能更改, 为了错误码集中统一使用单一的 AppError 来进行定义

```
10        # 代表的是模块的名称
  01      # 代表的是本模块的Action 编号
    01    # 代表本类的错误编码
```

## 必须返回值

这里的返回值必须是 `true/false` , 如果是需要获取返回数值, 需要定义
`getXxx` 方法来获取

```
// 使用
$Image = new Upload();
$image = (\Input::file('image'));
if ($Image->saveInput($image)) {
    return Resp::success('上传图成功!', [
        'url' => $Image->getUrl(),
    ]);
}
```

class 的定义

```
/**
 * 图片上传
 */
class Upload
{

    use AppTrait;

    protected $destination = '';


    /**
     * doWhat
     * 保存内容或者流方式上传
     * @param $content
     * @return bool
     */
    public function saveInput($content)
    {
        // 磁盘对象
        $Disk = $this->storage();
      // ..

        $this->destination = $fileRelativePath;
        return true;
    }

    /**
     * 图片url的地址
     * @return string
     */
    public function getUrl()
    {
        ...
        return config('app.url') . '/uploads/' . $this->destination;
        ...
    }
}
```

## 逻辑处理验证方式

这里我们以订单发布为例做下简单的说明 详细说明见注释
其中根据业务情况来进行处理, 有的可能不需要这种处理

```php
// 这里的 input 是从控制器获取过来的, 不允许从请求中获取
public function establish($input, $pay_pwd, $order_type, $type = 'plain')
{
    /*
    |--------------------------------------------------------------------------
    | 验证用户权限
    |--------------------------------------------------------------------------
    */
    if (!$this->checkPam()) {
        // 需要明确的报错信息可以重写报错
        return $this->setError('无用户信息, 无法进行发单操作');
    }

   /*
    |--------------------------------------------------------------------------
    | 获取数据, 后边直接用到的在这里直接定义出来
    |--------------------------------------------------------------------------
    */
    $server_id       = (int) sys_get($input, 'server_id', 0);
    ...
    $order_current   = sys_get($input, 'order_title');

   /*
    |--------------------------------------------------------------------------
    | 和数据库字段相同的来组织数据
    |--------------------------------------------------------------------------
    */
    $dbInit = [
        'order_title'     => $order_title,
        ...
        'get_in_price' => sys_get($input, 'get_in_price'),
        'hour'         => (int) sys_get($input, 'order_number'),
    ];

    /*
    |--------------------------------------------------------------------------
    | 数据合法性校验
    |--------------------------------------------------------------------------
    */
    $validator = \Validator::make($dbInit, [
        'order_title'     => 'required|string',
        ...
        'source_id'       => 'numeric',
    ], [
        'order_title.required'    => '订单标题不能为空',
        'order_add_price.min'     => '溢价价格最低不能低于 1 元',
    ]);
    if ($validator->fails()) {
        return $this->setError($validator->errors());
    }

    /*
    |--------------------------------------------------------------------------
    | 数据服务端验证合法性
    |--------------------------------------------------------------------------
    */

    /* 游戏区服校验和完善
     -------------------------------------------- */
    $codeRef      = GameServer::codeRef();
    $collCodeRef  = new Collection($codeRef);
    $serverFilter = $collCodeRef->where('server_id', $server_id);
    if (!$serverFilter->count()) {
        return $this->setError('指定的游戏区服不存在');
    }

    /*
    |--------------------------------------------------------------------------
    | 操作权限验证 / 策略验证
    |--------------------------------------------------------------------------
    */
    if (!$this->policy('pubCreate', [$this->pam, $this->front])) {
        return false;
    }

    /*
    |--------------------------------------------------------------------------
    | 处理数据
    |--------------------------------------------------------------------------
    */
    try {
        \DB::transaction(function () use ($createData, $owner, $ownerPam, $totalNeedPrice) {

            ...
            /* 事务中抛出异常
           -------------------------------------------- */
            $this->order = DailianOrder::create($createData);
            if (!$this->order) {
                throw new TransactionException('创建订单失败, 请重试!');
            }
            ...
        });
        return true;
    } catch (\Throwable $e) {
        return $this->setError($e->getMessage());
    }
}
```

## 注意要点

**Action 中不得存在 log 日志**

Log 日志如果被 crontab
使用同时也被基本的信息错误调用便会出现权限不一致.

**必须修复所有的编辑器代码错误提示**

编辑器代码提示均可能存在 bug
或者优化项目

**Action 命名**

Action 命名不要和模型名称重复,
一般为一个单词, 例如账号管理使用 `Pam` 作为命名
