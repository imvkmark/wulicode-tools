import { useStore } from '@/store';
import { get } from 'lodash-es';
import { useRouter } from 'vue-router';
import { isUrl } from '@popjs/util';

/**
 * 登录和 Token 的保存以及跳转
 */
export default function usePcUserUtil() {
    const store = useStore();
    const router = useRouter();

    /**
     * 用户登录成功之后调用
     * @param data
     */
    const userLogin = function (data: any) {
        const { token } = data;
        // set store
        store.dispatch('pc/Login', {
            token
        }).then();
        const go = get(router.currentRoute.value, 'query.go', '');
        if (!go) {
            router.push({ name: 'pc.info' }).then()
        } else {
            let to = window.atob(go);
            if (isUrl(to)) {
                window.location.href = to;
            } else {
                router.push(to).then()
            }
        }
    }


    const userLogout = function () {
        store.dispatch('pc/Logout').then();
        router.push({ name: 'pc.login' }).then()
    }

    /**
     * 让用户去跳转登录
     */
    const userToLogin = function () {
        router.push({
            name: 'pc.login',
            query: {
                go: window.btoa(router.currentRoute.value.fullPath)
            }
        }).then();
    }
    return {
        userLogin,
        userLogout,
        userToLogin
    }
}