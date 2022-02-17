import { computed, onMounted, reactive, watch } from 'vue'
import { useStore } from '@/store';
import { each, get, map } from "lodash-es";
import { routerNameKey } from "@/utils/utils";
import { useRouter } from "vue-router";

/**
 * 初始化
 */
export default function useNav() {
    const store = useStore();
    let router = useRouter();
    const trans = reactive({
        navs: computed(() => store.state.nav.navs),
    });

    const findPrefix = (key: string) => {
        let matched = '';
        each(trans.navs, (nav, menu_key) => {
            if (matched) {
                return;
            }
            let navChildren = get(nav, 'children', []);
            if (navChildren.length) {
                each(get(nav, 'children', []), (menu) => {
                    if (matched) {
                        return;
                    }
                    const submenus = get(menu, 'children', []);
                    if (submenus.length) {
                        map(submenus, (submenu) => {
                            let name = get(submenu, 'name', '')
                            let params = get(submenu, 'params', {});
                            let submenu_key = routerNameKey(name, params);
                            if (key === submenu_key) {
                                matched = menu_key;
                            }
                        })
                    } else {
                        if (key === routerNameKey(get(menu, 'name', ''), get(menu, 'params', {}))) {
                            matched = menu_key;
                        }
                    }
                })
            } else {
                if (key === routerNameKey(get(nav, 'name', ''), get(nav, 'params', {}))) {
                    matched = menu_key;
                }
            }
        })
        return matched;
    }
    const setPrefix = function () {
        let name = String(router.currentRoute.value.name);
        let params = get(router.currentRoute.value, 'params', {});
        let key = routerNameKey(name, params)
        let prefix = findPrefix(key);
        store.dispatch('nav/SetPrefix', {
            prefix, key
        }).then()
    }
    onMounted(() => {
        store.dispatch('nav/Init').then(() => {
            setPrefix();
        })
    })
    watch(() => router.currentRoute.value.fullPath, () => {
        setPrefix();
    })
    watch(() => store.state.poppy.token, (newVal) => {
        if (newVal) {
            store.dispatch('nav/AppendUserPerms').then()
        }
    })
}
