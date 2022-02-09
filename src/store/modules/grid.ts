import { Module } from 'vuex'
import { GridTypes, RootStateTypes } from '@/store/types'
import { get } from "lodash-es";
import { apiGrid } from "@/services/demo";
import { toast } from "@/utils/utils";

const grid: Module<GridTypes, RootStateTypes> = {
    namespaced: true,
    state: {
        action: {},
        loading: false,
        page: '',
        button: '',
        reload: false,
        reset: false,
    },
    mutations: {
        LOADING(state: GridTypes) {
            state.loading = true
        },
        LOADED(state: GridTypes) {
            state.loading = false
        },
        RESET_START(state: GridTypes) {
            state.reset = true
        },
        RESET_OVER(state: GridTypes) {
            state.reset = false
        },
        RELOAD_START(state: GridTypes) {
            state.reload = true
        },
        RELOAD_OVER(state: GridTypes) {
            state.reload = false
        },
        BTN_KEY(state: GridTypes, key) {
            state.button = key;
        },
        BTN_EMPTY(state: GridTypes) {
            state.button = '';
        },
        PAGE_SET(state: GridTypes, page) {
            state.page = page;
        },
        PAGE_EMPTY(state: GridTypes) {
            state.page = '';
        },
    },
    actions: {
        // 进行操作
        DoAction({ commit }, { action }) {
            const url = get(action, 'url');
            let method = get(action, 'method');

            switch (method) {
                // 页面请求
                case 'request':
                    commit('BTN_KEY', window.btoa(url))
                    apiGrid(url, {}, 'POST').then((resp) => {
                        commit('BTN_EMPTY')
                        toast(resp);
                        const { success } = resp
                        if (success) {
                            commit("RELOAD_START");
                        }
                    })
                    break;
                // 页面
                case 'page':
                    commit('PAGE_SET', url)
                    break;
                default:
                    toast('不正确的操作类型');
                    break;
            }
        },
    }
}

export default grid
