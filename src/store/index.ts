import { InjectionKey } from 'vue'
import { createStore, Store, useStore as baseUseStore } from 'vuex'
import { AllStateTypes, RootStateTypes } from './types'

import grid from '@/framework/store/grid'
import poppy from '@/framework/store/poppy'
import nav from '@/framework/store/nav'

export const store = createStore<RootStateTypes>({
    state: {
        text: 'This is Vuex Root.state.text',
        loading: false
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
        }
    },
    modules: {
        poppy, grid, nav
    }
})

export const key: InjectionKey<Store<RootStateTypes>> = Symbol('vue-store')

export function useStore<T = AllStateTypes>() {
    return baseUseStore<T>(key)
}
