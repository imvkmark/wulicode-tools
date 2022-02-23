# 钩子服务

服务的位置: `modules/{module}/configurations/services.yaml`

hook 位置: `modules/{module}/configurations/hooks.yaml`

## 服务和钩子的概念

我们来解释一下 service：

1.  service 是 module 之间扩展的重要方式。
2.  我们将 service 和 hook
    看作是插槽与插头的关系。一个插槽可以插多个插头。
3.  每个 app 下都会有一个 service.yaml 的文件，来描述本 app 的 service,。

## 使用

### Array 类型

**定义 service**

首先再 services.yaml 中定义如下内容

```yaml
poppy.system.api_info:
    title: 系统接口
    type: array
    description: 系统信息接口调用, 系统信息返回的灵活数据
```

**定义 hooks** 然后再 hooks.yaml 文件中,注册调用 hook 方法

```yaml
- name: "poppy.system.api_info"
  hooks:
      - '\Poppy\System\Services\Hooks\ApiInfo'
```

编写实现对应的 key()/data()方法

```php
<?php
class ApiInfo
    public function key()
    {
        return 'api';
    }

    public function data()
    {
        return 'info';
    }
}
```

执行 ServiceFactory 的 parse 方法

```php
sys_hook('poppy.system.api_info')
[
    'api' => 'info'
]
```

### Form

定义 service, 这个 Service 是单选 首先再 services.yaml 中定义如下内容

```yaml
poppy.ad.place_selection:
    title: 广告位选择
    type: form
    description: 选择广告位
```

注册 hook 方法

```yaml
- name: "poppy.ad.place_selection"
  builder: '\Poppy\Ad\Services\Hooks\AdPlaceSelection'
```

实现 builder 方法

```php
public function builder($params = [])
{
   $name    = $params['name'];
   $value   = $params['value'] ?? null;
   $options = $params['options'] ?? [];

   $options  += [
      'class'       => 'layui-input',
      'placeholder' => '请选择广告位',
   ];
   $places = AdPlace::pluck('title', 'id');
   return \Form::select($name, $places, $value, $options);
}
```

调用执行

```php
sys_hook('poppy.ad.place_selection', $param)
```

## 代码实现

```php
<?php
    public function parse($id, $params = [])
    {
        $service = app('module')->services()->get($id);
        if (!$service) {
            return null;
        }
        $hooks = app('module')->hooks()->get($id);

        $method = 'parse' . studly_case($service['type']);

        if (\is_callable([$this, $method])) {
            return $this->$method($hooks, $params);
        }
        return null;
    }
```

### 获取 service

services 方法中调用
ModulesService 发 initialize 方法中,对每个模块下的 service 的配置进行了 key=\>value 的缓存初始化操作

```php
/**
 * @return ModulesService(
 */
public function services(): ModulesService
{
    if (!$this->serviceRepo instanceof ModulesService) {
        $collect = collect();
        $this->repository()->enabled()->each(function (Module $module) use ($collect) {
            $collect->put($module->slug(), $module->get('services', []));
        });
        $this->serviceRepo = new ModulesService();
        $this->serviceRepo->initialize($collect);
    }

    return $this->serviceRepo;
}
```

```php
/**
 * Initialize.
 * @param Collection $data 集合
 */
public function initialize(Collection $data)
{
    $this->items = $this->getCache('poppy')->remember(
        'modules.service', SysConfig::MIN_DEBUG,
        function () use ($data) {
            $collection = collect();
            $data->each(function ($items) use ($collection) {
                $items = collect($items);
                $items->each(function ($item, $key) use ($collection) {
                    $collection->put($key, $item);
                });
            });
            return $collection->all();
        }
    );
}
```

然后通过 get()方法获取指定 key 的相关 service 配置

```php
/**
 * Get a module by name.
 * @param mixed $name name
 * @return Module
 */
public function get($name): Module
{
    return $this->repository()->get($name);
}
```

```php
/**
 * @return Modules
 */
public function repository(): Modules
{
    if (!$this->repository instanceof Modules) {
        $this->repository = new Modules();
        $slugs            = app('poppy')->enabled()->pluck('slug');
        $this->repository->initialize($slugs);
    }

    return $this->repository;
}
```

### 获取注册的 hook 方法

```php
$hooks = app('module')->hooks()->get($id);
```

```php
/**
 * @return ModulesHook
 */
public function hooks(): ModulesHook
{
    if (!$this->hooksRepo instanceof ModulesHook) {
        $collect = collect();
        $this->repository()->enabled()->each(function (Module $module) use ($collect) {
            $collect->put($module->slug(), $module->get('hooks', []));
        });
        $this->hooksRepo = new ModulesHook();
        $this->hooksRepo->initialize($collect);
    }

    return $this->hooksRepo;
}
```

```php
/**
 * Initialize.
 * @param Collection $data 集合
 */
public function initialize(Collection $data)
{
    $this->items = $this->getCache('poppy')->remember(
        'modules.hooks', SysConfig::MIN_DEBUG,
        function () use ($data) {
            $collection = collect();
            $data->each(function ($items) use ($collection) {
                $items = collect($items);
                $items->each(function ($item) use ($collection) {
                    $data    = (array) $collection->get($item['name']);
                    $service = app('module')->services()->get($item['name']);
                    if ($service['type'] === 'array') {
                        $collection->put($item['name'], $data + $item['hooks']);
                    }
                    if ($service['type'] === 'form') {
                        $collection->put($item['name'], $item['builder']);
                    }
                });
            });
            return $collection->all();
        }
    );
}
```

### 执行相应的 parseArray /parseForm 方法

```php
$method = 'parse' . studly_case($service['type']);

if (\is_callable([$this, $method])) {
    return $this->$method($hooks, $params);
}
```

```php
private function parseArray($hooks, $params)
{
    $collect = [];
    collect($hooks)->each(function ($hook) use (&$collect) {
        if (class_exists($hook)) {
            $obj = new $hook();
            if ($obj instanceof ServiceArray) {
                $collect = array_merge($collect, [
                    $obj->key() => $obj->data(),
                ]);
            }
        }
    });
    return $collect;
}
```

```php
private function parseForm($builder, $params)
{
    if (class_exists($builder)) {
        $obj = new $builder();
        if ($obj instanceof ServiceForm) {
            return $obj->builder($params);
        }
    }
    return '';
}
```

调用 hook 定义的对应的方法

```php
public function key()
{
    return 'api';
}

public function data()
{
    return 'info';
}
```

```php
public function builder($params = [])
{
    $name    = $params['name'];
    $value   = $params['value'] ?? null;
    $options = $params['options'] ?? [];

    $options  += [
        'class'       => 'layui-input',
        'placeholder' => '请选择广告位',
    ];
    $places = AdPlace::pluck('title', 'id');
    return \Form::select($name, $places, $value, $options);
}
```

### 运行结果

```php
dump((new ServiceFactory)->parse('system.api_info'));

/**
 *  array:2 [
 *      "api" => "info"
 *      "api2" => "info2"
 *  ]
 *
 */


dump((new ServiceFactory)->parse('ad.place_selection', [
    'name' => 'abc'
]));
// Illuminate\Support\HtmlString {#619
  #html: "<select class="layui-input" name="abc"><option selected="selected" value="">请选择广告位</option><option value="4">东城区</option><option value="5">北京市</option><option value="7">轮播图</option></select>"
}
```
