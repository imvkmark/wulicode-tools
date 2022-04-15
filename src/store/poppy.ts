import { Module } from 'vuex'
import { get, set } from 'lodash-es';
import { apiPySystemCoreInfo } from '@/services/poppy';
import { emitter, PY_USER_LOGIN } from '../../pkg/core/bus/mitt'
import { PyRequestOptions } from "@/utils/types";
import { appLocalStore, appSessionStore } from "@/utils/util";
import { PyPoppyTypes, PyRootStateTypes } from "@/store/types";
import { pyStorageKey, pyStorageTokenKey } from "@/utils/conf";
import { deviceId } from "../../pkg/core/utils/util";
import { base64Encode } from "../../pkg/core/utils/str";

const poppy: Module<PyPoppyTypes, PyRootStateTypes> = {
    namespaced: true,
    state: {
        appId: '',
        token: '',
        core: {},
        user: {},

        // theme
        media: '',         // 媒体响应尺寸
        size: 'default',
        style: 'light',

        // request
        loading: {},

        // 标题
        title: '',
    },
    getters: {
        isLoading: (state) => (url: string = '') => {
            if (url === '') {
                // 全局的加载, 只要是有请求, 便是触发全局Loading
                return get(state.loading, 'global', false)
            }
            // 获取当前 Url 的加载
            return get(state.loading, base64Encode(url), false)
        }
    },
    actions: {
        /**
         * 系统初始化
         * @constructor
         */
        Init({ state }) {
            // 设备ID
            state.appId = deviceId();
            // 系统信息
            let info: any = appSessionStore(pyStorageKey.core);
            if (info) {
                state.core = info;
            } else {
                apiPySystemCoreInfo().then(({ success, data }) => {
                    if (!success) {
                        return;
                    }
                    appSessionStore(pyStorageKey.core, data);
                    state.core = data;
                })
            }
        },

        /**
         * 登录, 有 token 则认定为登录
         * @constructor
         */
        Login({ commit, state, dispatch }, { token }) {
            // 保存用户的Token
            appLocalStore(pyStorageTokenKey(), token);

            state.token = token;
            // 另一种方式触发事件
            emitter.emit(PY_USER_LOGIN, { token });
        },

        /**
         * 退出登录
         */
        Logout({ state }) {
            appLocalStore(pyStorageTokenKey(), null);
            state.token = '';
            state.user = {};
        },

        /**
         * 加载中
         */
        Loading({ state }, options: PyRequestOptions) {
            set(state.loading, 'global', true);
            set(state.loading, base64Encode(options.url), true)
        },

        /**
         * 加载完毕
         */
        Loaded({ state }, options: PyRequestOptions) {
            set(state.loading, 'global', false);
            set(state.loading, base64Encode(options.url), false)
        },

        /**
         * 设定组件规格大小
         */
        SetSize({ state }, size) {
            let theme: any = appLocalStore(pyStorageKey.theme) ? appLocalStore(pyStorageKey.theme) : {};
            set(theme, 'size', size);
            appLocalStore(pyStorageKey.theme, theme)
            state.size = size;
        },

        /**
         * 设置页面主题风格
         */
        SetStyle({ state }, val) {
            let theme: any = appLocalStore(pyStorageKey.theme) ? appLocalStore(pyStorageKey.theme) : {};
            set(theme, 'style', val);
            appLocalStore(pyStorageKey.theme, theme);
            document.documentElement.setAttribute('theme', val);
            state.style = val;
        },

        /**
         * 设置 Media 尺寸
         */
        SetMedia({ commit, state }, media) {
            state.media = media;
        },

        /**
         * 设置页面的标题
         */
        SetTitle({ commit, state }, title) {
            document.title = `${title} - ${get(state.core, 'py-system.title')}`
            state.title = title;
        },

        /**
         * 设置页面的标题
         */
        ClearCache() {
            appSessionStore(pyStorageKey.core, null);
        },

        /**
         * 设置全局动作
         */
        SetMotion({ state }, motion) {
            const { type, action } = motion;
            const addition = get(motion, 'addition', {});
            state.motion = { type, action, addition }
        },
        /**
         * 清除全局的动作
         */
        ClearMotion({ state }) {
            state.motion = { type: '', action: '', addition: {} }
        },

        SetAction({ state }, action) {
            state.action = action;
        },
        ClearAction({ state }) {
            state.action = {};
        },
    }
}

export default poppy;
