import { Module } from 'vuex'
import { PoppyTypes, RootStateTypes } from '@/store/types'
import { get } from 'lodash-es';
import { deviceId, localStore, sessionStore, toast } from '@/utils/utils';
import { storageKey } from '@/utils/conf';
import { apiPySystemAuthAccess, apiPySystemCoreInfo } from '@/services/poppy';
import { EM_USER_LOGIN, emitter } from '@/bus/mitt'

// Create a new store Modules.
const poppy: Module<PoppyTypes, RootStateTypes> = {
    namespaced: true,
    state: {
        appId: '',
        token: '',
        core: {},
        user: {}
    },
    mutations: {
        SET_APP_ID(state: PoppyTypes, deviceId) {
            state.appId = deviceId
        },
        SET_TOKEN(state: PoppyTypes, obj) {
            state.token = get(obj, 'token')
        },
        SET_CORE(state: PoppyTypes, obj) {
            state.core = obj
        },
        SET_USER(state: PoppyTypes, obj) {
            state.user = obj
        }
    },
    actions: {
        /**
         * 系统初始化
         * @constructor
         */
        Init({ commit }) {
            // 设备ID
            commit('SET_APP_ID', deviceId())

            // 系统信息
            let info: any = sessionStore(storageKey.PY_CORE_INFO);
            if (info) {
                commit('SET_CORE', info)
            } else {
                apiPySystemCoreInfo().then(({ success, data }) => {
                    if (success) {
                        sessionStore(storageKey.PY_CORE_INFO, data);
                        commit('SET_CORE', info)
                    }
                })
            }
        },

        /**
         * 获取用户信息
         * @param commit
         * @constructor
         */
        Fetch({ commit }) {
            apiPySystemAuthAccess({}).then(({ success, data }) => {
                if (success) {
                    commit('SET_USER', data);
                }
            })
        },

        /**
         * 登录, 有 token 则认定为登录
         * @constructor
         */
        Login({ commit, state, dispatch }, { token }) {
            // 保存用户的Token
            localStore(storageKey.PY_TOKEN, token);
            // token 变化在监听中触发获取信息
            commit('SET_TOKEN', { token });
            // 另一种方式触发事件
            emitter.emit(EM_USER_LOGIN, { token })
        },

        /**
         * 退出登录
         * @constructor
         */
        Logout({ state, commit }, options) {
            let from = get(options, 'from');
            if (from === 'api') {
                toast('用户访问受限, 请重新登录', false);
            }
            localStore(storageKey.PY_TOKEN, null);
            commit('SET_TOKEN', { token: '' })
            commit('SET_USER', {})
        }

    }
}

export default poppy
