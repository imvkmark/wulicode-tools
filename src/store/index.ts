import { InjectionKey } from 'vue'
import { createStore, Store, useStore as baseUseStore } from 'vuex'
import { AllStateTypes, RootStateTypes } from './types'

import poppy from './modules/poppy'

export const store = createStore<RootStateTypes>({
    state: {
        text: 'This is Vuex Root.state.text'
    },
    getters: {},
    mutations: {},
    actions: {},
    modules: {
        poppy,
    }
})

export const key: InjectionKey<Store<RootStateTypes>> = Symbol('vue-store')

export function useStore<T = AllStateTypes>() {
    return baseUseStore<T>(key)
}
