import { Module } from 'vuex'
import { PyNavTypes, PyRootStateTypes } from "@/store/types";
import { clone, get, merge } from "lodash-es";
import { navConvertNav, navs as defaultNavs } from "@/utils/navs";
import { pyStorageKey } from "@/utils/conf";
import { appLocalStore } from "@/utils/util";

// Create a new store Modules.
const nav: Module<PyNavTypes, PyRootStateTypes> = {
    namespaced: true,
    state: {
        navs: {},
        prefix: '',
        key: '',
        menus: [],
        sidebarActive: false,
    },
    mutations: {
        SET_NAVS(state: PyNavTypes, navs) {
            state.navs = navs
        },
        CLEAR_NAVS(state: PyNavTypes) {
            state.navs = {}
        },
    },
    actions: {
        // 初始化导航以及菜单
        Init({ commit }, menus: []) {
            if (menus) {
                let totalNavs = merge(clone(defaultNavs), menus);
                commit('SET_NAVS', navConvertNav(totalNavs));
                return;
            } else {
                commit('SET_NAVS', navConvertNav(defaultNavs));
            }
        },
        SetPrefix({ state }, { prefix, key }) {
            state.prefix = prefix;
            state.key = key;
            state.menus = get(state.navs, `${prefix}.children`, []);
        },
        Destruct({ commit, dispatch }) {
            appLocalStore(pyStorageKey.navs, null);
            commit('CLEAR_NAVS');
            dispatch('Init');
        },
        CloseSidebar({ state }) {
            state.sidebarActive = false
        },
        OpenSidebar({ state }) {
            state.sidebarActive = true
        },
    }
}

export default nav
