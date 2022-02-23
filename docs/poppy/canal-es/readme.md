# CanalEs - 同步导入监听组件

> 一个把`Mysql`表数据导入到`Es`的工具.

## 配置

### Env 配置

-   `.env`文件中配置对应的`Mysql`连接信息及`Es`配置信息

```
#  db
#-------------------------------------------------------
DB_HOST=localhost
DB_PORT=3306
DB_DATABASE=
DB_USERNAME=root
DB_PASSWORD=
DB_CHARSET=utf8mb4
DB_COLLATION=utf8mb4_unicode_ci

#  es
#-------------------------------------------------------
ELASTICSEARCH_CONCURRENCY=100
ELASTICSEARCH_USER=
ELASTICSEARCH_PASS=
#------------- scheme://host:port;scheme2://host2:port2 -------------#
ELASTICSEARCH_HOSTS=http://127.0.0.1:9200
```

### 索引配置

此项目读取 `poppy.canal-es`  配置详细配置以及说明如下

```
// canal 配置, 监听的主机
'canal'  => [
    'client_type'     => CanalClient::TYPE_SWOOLE,
    'host'            => env('CANAL_HOST', '127.0.0.1'),
    'port'            => env('CANAL_PORT', 11111),
    'client_id'       => env('CANAL_CLIENT_ID', 1001),
    'connect_timeout' => env('CANAL_CONNECT_TIMEOUT', 10),
    'message_size'    => 100,
],

// filter .*\\..*,shop.user

'mapper' => [
    // key 定义的是索引的名称
    'example_key'  => [
        // 文件格式工具, 当数据从库中取出来之后传递给es之前进行的数据处理
        'formatter'   => '',
        // 文件索引属性定义, 创建索引所需的数据
        'property'    => CsdnUser::class,
        // 数据表, 用于导入的表名称获取
        'table'       => 'canal_example.csdn_users',
        // canal 的 instance 名称
        'destination' => 'csdn_user',
        // 监听 canal 数据变动
        'filter'      => 'canal_example.csdn_users',
    ],
],

'elasticsearch' => [
    'concurrency' => env('ELASTICSEARCH_CONCURRENCY', 100),

    'hosts' => value(function () {
        $settings = env('ELASTICSEARCH_HOSTS');
        $hosts    = array_filter(explode(';', $settings));

        return $hosts ? array_map(function ($url) {
            return array_merge(parse_url($url), [
                'user' => env('ELASTICSEARCH_USER', null),
                'pass' => env('ELASTICSEARCH_PASS', null),
            ]);
        }, $hosts) : [
            [
                'host'   => '127.0.0.1',
                'port'   => '9200',
                'scheme' => 'http',
                'user'   => env('ELASTICSEARCH_USER', null),
                'pass'   => env('ELASTICSEARCH_PASS', null),
            ],
        ];
    }),
],
```

## 创建索引

执行`index:create`命令,即可创建指定名称的索引

```shell
php artisan ce:create-index index-name [-p property class]
```

**设置`Mappings`并创建索引**

-   创建`Property`类并且继承 `\Poppy\CanalEs\Classes\Properties\Property` 类,编写需要指定的字段及类型

```php
<?php
declare(strict_types = 1);

namespace App\Properties;

use \Poppy\CanalEs\Classes\Properties\Property;

class Example extends Property
{
    public function properties(): array
    {
        return [
            'id'       => [
                'type' => 'keyword',
            ],
            'name'     => [
                'type' => 'text',
            ],
            'login_at' => [
                'type'   => 'date',
                'format' => 'yyyy-MM-dd HH:mm:ss',
            ],
        ];
    }
}
```

-   执行命令

```shell
php artisan ce:create-index example -p "\App\Properties\Example"
```

## 导入`Mysql`数据到 Es

执行`import`命令即可把指定数据表的数据导入到 Es 中

```shell
php artisan ce:import tb_name [--index tb_name] [--size 10000] [--start 1] [--end 100000] [-f format class] [-p
property class] [-v]
```

**参数说明**

-   `index`   目标索引名称,不传递默认与数据表同名
-   `size`     每批查询的数据表数量,默认`10000`
-   `start`   导入数据起始 id
-   `end`     导入数据截止 id
-   `p`       查询数据表的字段, 默认查询全部
-   `v`       Debug Mode, 支持输出执行时候的 Sql 输出
-   `f`       导入数据格式化文件
