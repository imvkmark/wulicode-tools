import { useStore } from '@/store';
import { get } from 'lodash-es';
import { useRouter } from 'vue-router';
import { isUrl } from '@/utils/helper';

/**
 * 登录和 Token 的保存以及跳转
 */
export default function useUserUtil() {
    const store = useStore();
    const router = useRouter();

    /**
     * 跳转到指定界面或者用户中心
     */
    const goWithCp = () => {
        const go = get(router.currentRoute.value, 'query.go', '');
        if (!go) {
            let name = 'user.cp';
            router.push({ name }).then()
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
     * 管理员登录成功之后调用
     * @param data
     */
    const userLogin = function (data: any) {
        store.dispatch('poppy/Login', data).then(() => {
            goWithCp();
        });
    }

    const userOnLogin = function () {
        if (router.currentRoute.value.name !== 'user.login') {
            return;
        }
        goWithCp();
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
        userToLogin
    }
}
