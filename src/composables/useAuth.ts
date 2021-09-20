import { localStore } from '@/utils/utils';
import { storageKey } from '@/utils/conf';
import { useStore } from '@/store';
import { get } from 'lodash-es';
import { useRouter } from 'vue-router';
import { onMounted, watch } from 'vue';
import usePcUserUtil from '@/composables/usePcUserUtil';

/**
 * 登录和 Token 的保存以及跳转
 */
export default function useAuth() {
    const store = useStore();
    const router = useRouter();
    const { userToLogin } = usePcUserUtil();

    // 处理 token, 存在 qs Token , 则覆盖本地的 token, 否则用户登录之后的token 也是可以使用的
    let token = localStore(storageKey.PY_TOKEN) ? localStore(storageKey.PY_TOKEN) : '';
    const qsToken = get(router.currentRoute.value, 'query.token', '');
    if (qsToken) {
        localStore(storageKey.PY_TOKEN, qsToken);
        token = qsToken;
    }


    // 判定权限并进行跳转
    const auth = get(router.currentRoute.value.meta, 'auth');
    if (!token && auth) {
        userToLogin();
        return;
    }

    // 监听 token 的变化
    watch(
        () => store.state.poppy.token,
        (newVal, oldVal) => {
            // Token 清空, 则跳转掉用户登录界面
            if (!newVal && oldVal) {
                if (auth) {
                    userToLogin()
                }
            }
            if (!oldVal && newVal) {
                store.dispatch('pc/Fetch').then()
            }
        }, { deep: true }
    );


    // Login With Token
    onMounted(() => {
        if (token) {
            store.dispatch('pc/Login', {
                token
            }).then();
        }
    })
}