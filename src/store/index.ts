import { InjectionKey } from 'vue'
import { createStore, Store, useStore as baseUseStore } from 'vuex'
import { AllStateTypes, RootStateTypes } from './types'

import poppy from './modules/poppy'

export const store = createStore<RootStateTypes>({
    state: {
        text: 'This is Vuex Root.state.text',
        loading: false,
        prefix: '',
        size: '',
        navs: [],
        nav: {},
        navActive: false,
        sidebarActive: false,
        sidebars: []
    },
    getters: {
        loading(state: any) {
            return state.loading;
        },
        core(state: any) {
            return state.poppy.core;
        }
    },
    mutations: {},
    actions: {
        Loading({ state }) {
            state.loading = true
        },
        Loaded({ state }) {
            state.loading = false
        },
        SetPrefix({ state }, { prefix }) {
            state.prefix = prefix
        },
        SetSize({ state }, { size }) {
            state.size = size
        },
        SetNavActive({ state }, status) {
            state.navActive = status
        },
        SetSidebarActive({ state }, status) {
            state.sidebarActive = status
        }
    },
    modules: {
        poppy
    }
})

export const key: InjectionKey<Store<RootStateTypes>> = Symbol('vue-store')

export function useStore<T = AllStateTypes>() {
    return baseUseStore<T>(key)
}
