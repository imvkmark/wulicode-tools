import { Module } from 'vuex'
import { GridTypes, RootStateTypes } from '@/store/types'
import { get, set } from "lodash-es";
import { apiGrid } from "@/services/demo";
import { toast } from "@/utils/utils";

const grid: Module<GridTypes, RootStateTypes> = {
    namespaced: true,
    state: {
        request: {},
        action: {},
        loading: false,
        button: '',
        reload: false,
        reset: false,
    },
    mutations: {
        SET_REQUEST(state: GridTypes, request) {
            state.request = request
        },
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

    },
    actions: {
        // 请求
        SetRequest({ commit }, request) {
            commit('SET_REQUEST', request)
        },
        // 进行操作
        DoAction({ commit }, { action }) {
            if (get(action, 'method') === 'request') {
                const url = get(action, 'url');
                commit('BTN_KEY', window.btoa(url))
                apiGrid(url, {}, 'POST').then((resp) => {
                    commit('BTN_EMPTY')
                    toast(resp);
                    const { status } = resp
                    if (!status) {
                        commit("RELOAD_START");
                    }
                })
            }
            if (get(action, 'method') === 'page') {
                toast('Paging...')
                // store.dispatch('grid/SetPage', item);
            }
        },
    }
}

export default grid
