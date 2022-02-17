import { Module } from 'vuex'
import { PyRootStateTypes } from "@/framework/store/types";
import { NavTypes } from "@/store/types";
import { get } from "lodash-es";

// Create a new store Modules.
const nav: Module<NavTypes, PyRootStateTypes> = {
    namespaced: true,
    state: {
        navs: {},
        prefix: '',
        key: '',
        menus: [],
    },
    mutations: {
        SET_NAVS(state: NavTypes, navs) {
            state.navs = navs
        },
    },
    actions: {
        /**
         * 初始化
         * @constructor
         */
        Init({ commit }) {
            // 设备ID
            commit('SET_NAVS', {
                home: {
                    title: '主页',
                    icon: 'home',
                    name: 'home.index'
                },
                demo: {
                    title: 'Demo',
                    icon: 'tool',
                    name: 'tool.apidoc',
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
                            title: 'Form',
                            children: [
                                { name: 'form.index', title: 'Field-Textarea', params: { type: 'field-textarea' } },
                                { name: 'form.index', title: 'Field-Radio', params: { type: 'field-radio' } },
                                { name: 'form.index', title: 'Field-Checkbox', params: { type: 'field-checkbox' } },
                                { name: 'form.index', title: 'Field-Text', params: { type: 'field-text' } },
                                { name: 'form.index', title: 'Field-Number', params: { type: 'field-number' } },
                                { name: 'form.index', title: 'Field-Color', params: { type: 'field-color' } },
                                { name: 'form.index', title: 'Field-Date', params: { type: 'field-date' } },
                                { name: 'form.index', title: 'Field-Select', params: { type: 'field-select' } },
                                { name: 'form.index', title: 'Field-Switch', params: { type: 'field-switch' } },
                                { name: 'form.index', title: 'Field-File', params: { type: 'field-file' } },
                                { name: 'form.index', title: 'Field-Image', params: { type: 'field-image' } },
                                { name: 'form.index', title: 'Field-Editor', params: { type: 'field-editor' } },
                                { name: 'form.index', title: 'Rule-Text', params: { type: 'rule-text' } },
                                { name: 'form.index', title: 'Rule-Required', params: { type: 'rule-required' } },
                                { name: 'form.index', title: 'Rule-Date', params: { type: 'rule-date' } }
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
            })
        },
        SetPrefix({ state }, { prefix, key }) {
            state.prefix = prefix;
            state.key = key;
            state.menus = get(state.navs, `${prefix}.children`, []);
        },
    }
}

export default nav
