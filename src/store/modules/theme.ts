import { Module } from 'vuex'
import { RootStateTypes, ThemeTypes } from '@/store/types'

const theme: Module<ThemeTypes, RootStateTypes> = {
    namespaced: true,
    state: {
        size: '',
    },
    mutations: {
        SET_SIZE(state: ThemeTypes, size) {
            state.size = size
        },
    },
    actions: {
        /**
         * 设定组件规格大小
         */
        SetSize({ commit }, size) {
            // 设备ID
            commit('SET_SIZE', size)
        },
    }
}

export default theme
