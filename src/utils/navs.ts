/**
 * 项目中定义的导航项目
 */
import { clone, each, get, map, set } from "lodash-es";
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
 * 转换所有的导航到预期的格式
 * @param totalNavs
 */
export const navConvertNav = (totalNavs: {}) => {
    let newTotalNavs = {};
    each(totalNavs, (nav, nav_key) => {
        const menus = get(nav, 'children', []);
        let newNav = clone(nav);
        if (menus.length) {
            const newChildren = map(menus, (menu) => {
                const submenus = get(menu, 'children', []);
                let newMenu = clone(menu);
                if (submenus.length) {
                    const newChildren = map(submenus, (submenu) => {
                        return navConvertItem(submenu);
                    })
                    set(newMenu, 'children', newChildren)
                    return newMenu;
                } else {
                    return navConvertItem(newMenu);
                }
            })
            set(newNav, 'children', newChildren)
            // add menus to nav
            set(newTotalNavs, nav_key.replace('.', '-'), newNav)
        } else {
            set(newTotalNavs, nav_key.replace('.', '-'), navConvertItem(newNav))
        }
    })
    return newTotalNavs;
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
