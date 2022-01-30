import { Module } from 'vuex'
import { GridTypes, RootStateTypes } from '@/store/types'

const grid: Module<GridTypes, RootStateTypes> = {
    namespaced: true,
    state: {
        request: {},
    },
    mutations: {
        SET_REQUEST(state: GridTypes, request) {
            state.request = request
        },
    },
    actions: {
        // 请求
        SetRequest({ commit }, request) {
            commit('SET_REQUEST', request)
        },
    }
}

export default grid
