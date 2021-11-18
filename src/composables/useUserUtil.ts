import { useStore } from '@/store';
import { get } from 'lodash-es';
import { useRouter } from 'vue-router';
import { isUrl } from '@popjs/util';
import { apiPySystemAuthLogout } from '@/services/poppy';
import { toast } from '@/utils/utils';

/**
 * 登录和 Token 的保存以及跳转
 */
export default function useUserUtil() {
    const store = useStore();
    const router = useRouter();

    const goWithCb = () => {
        const go = get(router.currentRoute.value, 'query.go', '');
        if (!go) {
            router.push({ name: 'user.cp' }).then()
        } else {
            let to = window.atob(go);
            if (isUrl(to)) {
                window.location.href = to;
            } else {
                router.push(to).then()
            }
        }
    }

    /**
     * 用户登录成功之后调用
     * @param data
     */
    const userLogin = function (data: any) {
        const { token } = data;
        // set store
        store.dispatch('poppy/Login', {
            token
        }).then(() => {
            goWithCb();
        });
    }

    const userOnLogin = function () {
        if (router.currentRoute.value.name !== 'user.login') {
            return;
        }
        goWithCb();
    }

    const userLogout = function () {
        apiPySystemAuthLogout().then(({ success, message }) => {
            toast(message, success)
            if (success) {
                store.dispatch('poppy/Logout').then();
                router.push({ name: 'user.login' }).then()
            }
        })
    }

    /**
     * 让用户去跳转登录
     */
    const userToLogin = function () {
        router.push({
            name: 'user.login',
            query: {
                go: window.btoa(router.currentRoute.value.fullPath)
            }
        }).then();
    }
    return {
        userOnLogin,
        userLogin,
        userLogout,
        userToLogin
    }
}