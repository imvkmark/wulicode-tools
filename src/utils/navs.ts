/**
 * 项目中定义的导航项目
 */
import { get } from "lodash-es";
import { base64Encode } from "@/framework/utils/helper";
import { routerNameKey } from "@/utils/utils";

export const navs: object = {
    home: {
        title: '主页',
        icon: 'home-filled',
        name: 'home.index'
    },
    demo: {
        title: 'Demo',
        icon: 'lightning',
        children: [
            {
                title: '工具',
                children: [
                    { name: 'tool.apidoc', title: 'ApiDoc' },
                    { name: 'tool.base64', title: 'Base64' },
                    { name: 'tool.img', title: '图片占位符' },
                    { name: 'tool.url-decode', title: 'Url 解码' }
                ]
            },
            {
                title: 'Grid',
                children: [
                    { name: 'grid.index', title: 'Grid-Normal', params: { type: 'normal' } },
                    { name: 'grid.index', title: 'Grid-Button', params: { type: 'button' } },
                    { name: 'grid.index', title: 'Grid-Button-Group', params: { type: 'button-group' } },
                    {
                        name: 'grid.index',
                        title: 'Grid-Button-Dropdown',
                        params: { type: 'button-dropdown' }
                    },
                    { name: 'grid.index', title: 'Grid-filter', params: { type: 'filter' } },
                    { name: 'grid.index', title: 'Grid-filter-A', params: { type: 'filter-a' } },
                    { name: 'grid.index', title: 'Grid-filter-B', params: { type: 'filter-b' } },
                    { name: 'grid.index', title: 'Grid-filter-C', params: { type: 'filter-c' } },
                    { name: 'grid.index', title: 'Grid-filter-D', params: { type: 'filter-d' } },
                    { name: 'grid.index', title: 'Grid-filter-E', params: { type: 'filter-e' } },
                ]
            },
            {
                title: 'Js',
                children: [
                    { name: 'js.sentry', title: '异常' },
                    { name: 'js.scroll', title: '滚动' },
                    { name: 'js.info', title: '基本信息' }
                ]
            },
            {
                title: 'Css',
                children: [
                    { name: 'css.custom-box', title: '自定义Checkbox' },
                    { name: 'css.dash-middle', title: '居中线' },
                    { name: 'css.animation', title: '动画' }
                ]
            },
        ]
    },
    user: {
        title: '用户',
        icon: 'user',
        name: 'user.login'
    }
}

/**
 * 转换服务端 Item => Router Item
 * @param item
 */
export const navConvertItem = (item: any) => {
    const type = get(item, 'type', '');
    let params = {
        type: base64Encode(get(item, 'path', ''))
    }
    // 存在 name 的为框架自定义的路由, 否则是需要转换的
    if (get(item, 'name')) {
        let name = get(item, 'name');
        let params = get(item, 'params', {});
        return {
            name,
            icon: get(item, 'icon', ''),
            key: routerNameKey(name, params),
            title: get(item, 'title', ''),
            params: params,
            query: get(item, 'query', {})
        }
    }
    if (type === 'form') {
        let name = 'form.index';
        return {
            name: 'form.index',
            icon: get(item, 'icon', ''),
            key: routerNameKey(name, params),
            title: get(item, 'title', ''),
            params: params,
            query: get(item, 'query', {})
        }
    } else {
        let name = 'grid.index';
        return {
            name: name,
            icon: get(item, 'icon', ''),
            key: routerNameKey(name, params),
            title: get(item, 'title', ''),
            params: params,
            query: get(item, 'query', {})
        }
    }
}
