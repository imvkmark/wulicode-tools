import { Module } from 'vuex'
import { PoppyTypes, RootStateTypes } from '@/store/types'
import { get } from 'lodash-es';
import { deviceId, localStore, sessionStore, toast } from '@/utils/utils';
import { storageKey } from '@/utils/conf';
import { apiPySystemCoreInfo } from '@/services/poppy';
import { ElMessage } from 'element-plus';

// Create a new store Modules.
const poppy: Module<PoppyTypes, RootStateTypes> = {
    namespaced: true,
    state: {
        appId: '',
        token: '',
        core: {},
        is401: false
    },
    mutations: {
        SET_X_APP_ID(state: PoppyTypes, obj) {
            state.appId = get(obj, 'appId')
        },
        SET_401(state: PoppyTypes) {
            state.is401 = true
        },
        SET_TOKEN(state: PoppyTypes, obj) {
            state.token = get(obj, 'token')
        },
        SET_CORE_INFO(state: PoppyTypes, obj) {
            state.core = obj
        }
    },
    actions: {
        Init({ state }) {
            // 设备ID
            state.appId = deviceId()

            // 系统信息
            let info: any = sessionStore(storageKey.PY_CORE_INFO);
            if (info) {
                state.core = info

            } else {
                apiPySystemCoreInfo().then(({ success, data }) => {
                    if (success) {
                        sessionStore(storageKey.PY_CORE_INFO, data);
                        state.core = info
                    }
                })
            }
        },
        // 有 token 则认定为登录
        Login({ commit, state, dispatch }, { token }) {
            // 保存用户的Token
            localStore(storageKey.PY_TOKEN, token);
            state.token = token;

            dispatch('Fetch');
        },

        Logout({ state }, options) {
            let from = get(options, 'from');
            if (from === 'api') {
                toast('用户访问受限, 请重新登录', false);
            }
            localStore(storageKey.PY_TOKEN, null);
            state.token = '';
        }

    }
}

export default poppy
