<template>
    <div :class="{'py--nav' : true}">
        <ul>
            <li :class="{active:trans.prefix === key}" v-for="(menu, key) in trans.navs" :key="key"
                @click="jumpTo(menu)">
                <ElIcon>
                    <component :is="icon[upperCamelCase(menu.icon)]"/>
                </ElIcon>
                <span class="side-text">{{ menu.title }}</span>
            </li>
        </ul>
    </div>
</template>

<script lang="ts" setup>
import { computed, reactive } from 'vue';
import { useRouter } from 'vue-router';
import { useStore } from '@/store';
import { icon } from "@/framework/utils/icon";
import { upperCamelCase } from "@/framework/utils/helper";
import { first, get } from "lodash-es";

// 监听路由前缀的变化
let router = useRouter();
let store = useStore();
const trans = reactive({
    navs: computed(() => store.state.nav.navs),
    prefix: computed(() => store.state.nav.prefix),
});

const jumpTo = (nav: any) => {
    let findLast: any = (parent: object) => {
        let children = get(parent, 'children', []);
        if (children.length) {
            return findLast(first(children));
        } else {
            return parent;
        }
    }
    let last = findLast(nav);
    console.log(last);
    router.push({
        name: get(last, 'name'),
        params: get(last, 'params')
    });
}

</script>

<style lang="less" scoped>

</style>
