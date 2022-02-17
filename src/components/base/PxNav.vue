<template>
    <div :class="{'py--nav' : true}">
        <ul>
            <li :class="{active:trans.prefix === key}" v-for="(menu, key) in trans.navs" :key="key"
                @click="jumpTo(menu.name)">
                <ElIcon>
                    <component :is="appNavDefs[menu.icon]"/>
                </ElIcon>
                <span class="side-text">{{ menu.title }}</span>
            </li>
        </ul>
    </div>
</template>

<script lang="ts" setup>
import { computed, onMounted, reactive, watch } from 'vue';
import { useRouter } from 'vue-router';
import { useStore } from '@/store';
import { appNavDefs } from "@/utils/conf";
import { each, get, map } from "lodash-es";
import { routerNameKey } from "@/utils/utils";

// 监听路由前缀的变化
let router = useRouter();
let store = useStore();
const trans = reactive({
    navs: computed(() => store.state.nav.navs),
    prefix: computed(() => store.state.nav.prefix),
    size: computed(() => store.state.size),
    active: computed(() => store.state.navActive)
});


const jumpTo = (name: string) => {
    router.push({
        name
    });
    if (trans.active) {
        store.dispatch('SetNavActive', false);
    }
}

const findPrefix = (key: string) => {
    let matched = '';
    each(trans.navs, (nav, menu_key) => {
        console.log(nav, menu_key);
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
    })
}
onMounted(() => {
    store.dispatch('nav/Init').then(() => {
        setPrefix();
    })
})
watch(() => router.currentRoute.value.fullPath, () => {
    setPrefix();
})
</script>

<style scoped lang="less">

</style>
