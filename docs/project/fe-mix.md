# [WIP] Laravel-Mix

系统后台集成 layui 作为后台 UI 界面, 元素的使用详见 www.layui.com

## 前台页面开发

前台页面依赖于 laravel-mix 来进行页面的开发.
下面会对以下的几个部分进行深入解析,
首先,我们先看下如何进行页面的布局和显示 常用文档 : [资源任务编译器 Laravel Mix](https://laravel-china.org/docs/laravel/5.5/mix/1307)

### 文件的位置

```
# sass 源文件的位置, 使用的样式文件是 web.scss
~/resources/assets/scss/

# 页面资源放置位置
~/module/resources/images

# 监听文件位置, 这里使用的组件是 laravel-mix , 详细文档查看 : https://github.com/JeffreyWay/laravel-mix
~/webpack.mix.js

# 生成 css 的位置
~/public/assets/css/

# 图片的位置
~/public/modules/{user|system|web}/images/

# 访问地址, 这里 {page} 代表需要布局的页面的名称
# 例如 : http://dev.play.com/develop/l/layout.m.homepage
http://{domain}/develop/l/{page}

# 页面命名, 页面命名为 `{page}.blade.php`, 这里支持多层文件夹
~/resources/views
```

### 如何运行

```
# 安装
$ npm install

# 开始监听 scss, 写的 css
$ npm run watch
```

## apidoc 接口文档

apidoc 是一个简单的 RESTful API
文档生成工具，它从代码注释中提取特定格式的内容，生成文档。

```
php artisan system:doc api
```

配置信息

```
'apidoc' => [
    // key : 标识
    'web' => [
        // 标题
        'title'       => '后台接口',
        // 源文件夹
        'origin'      => 'modules',
        // 接口测试构建器
        'factory'     => \Site\Testing\WebApiFactory::class,
        // 生成目录
        'doc'         => 'public/docs/backend',
        // 默认访问的url
        'default_url' => 'api_v1/backend/system/role/permissions',
    ],
],


webpack.mix.js 的配置
~~~~~~~~~~~~~~~~~~~~~~~

.. code-block:: javascript

mix
   .browserSync({
       // 这里替换地址
       proxy : 'http://dev.{domain}.com/',
       files : [
           "public/resources/js/**/*.js",
           "public/resources/css/*.css",
           "modules/**/resources/views/**/*.blade.php",
           "modules/**/resources/mixes/**/*.js",
           "modules/**/resources/js/**/*.js"
       ]
   })
   .disableNotifications()
   .version()
   /*
   |--------------------------------------------------------------------------
   | develop & backend
   |--------------------------------------------------------------------------
   */
   /* system js
    * ---------------------------------------- */
   .combine([
           'modules/system/resources/libs/jquery/2.2.4/jquery.min.js',
           'modules/system/resources/libs/jquery/form/jquery.form.js',
           'modules/system/resources/libs/jquery/toastr/jquery.toastr.js',
           'modules/system/resources/libs/jquery/pjax/jquery.pjax.js',
           'modules/system/resources/libs/jquery/poshytip/jquery.poshytip.js',
           'modules/system/resources/libs/jquery/validation/jquery.validation.js',
           'modules/system/resources/libs/jquery/data-tables/jquery.data-tables.js',
           'modules/system/resources/libs/jquery/tokenize2/jquery.tokenize2.js',
           'modules/system/resources/libs/jquery/spinner/jquery.spinner.js',
           'modules/system/resources/libs/waves/waves.min.js',
           'modules/system/resources/libs/vue/vue.min.js',
           'modules/system/resources/libs/underscore/underscore.js',
           // hash, 加密使用 @ develop
           'modules/system/resources/libs/jshash/md5.min.js',
           'modules/system/resources/libs/jshash/sha1.min.js',
           // 粘贴板
           'modules/system/resources/libs/clipboard/clipboard.min.js',
           // 编辑器
           'modules/system/resources/libs/simditor/module.js',
           'modules/system/resources/libs/simditor/hotkeys.js',
           'modules/system/resources/libs/simditor/uploader.js',
           'modules/system/resources/libs/simditor/simditor.js',
           // 鼠标滑过提示
         'modules/system/resources/libs/popper.js/popper.min.js',
         'modules/system/resources/libs/bootstrap/js/util.js',
         'modules/system/resources/libs/bootstrap/js/tooltip.js',
           // 图片轮询显示
           'modules/system/resources/libs/jquery/fancybox/jquery.fancybox.min.js',
     ],
     'public/assets/js/system_vendor.js'
   )
   .combine([
           // editor
           'modules/system/resources/libs/ace/ace.js',
           'modules/system/resources/libs/jquery/backstretch/jquery.backstretch.min.js',
           'modules/system/resources/libs/poppy/util.js',
           'modules/system/resources/libs/poppy/cp.js',
           'modules/system/resources/libs/poppy/system/cp.js'
     ],
     'public/assets/js/system_cp.js'
   )
   /* system css
    * ---------------------------------------- */
   .sass(
     'modules/system/resources/scss/system.scss',
     'public/assets/css/system.css'
   )
   .copyDirectory('modules/system/resources/libs/layui', 'public/assets/layui')
   .copyDirectory('modules/system/resources/libs/easy-web', 'public/assets/easy-web')
   .copyDirectory('modules/system/resources/images/libs', 'public/assets/images/libs')
   .copyDirectory('modules/system/resources/images/system', 'public/assets/images/default')
   .copyDirectory('modules/system/resources/fonts/fontawesome', 'public/assets/font/fontawesome')
```
