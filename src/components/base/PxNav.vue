<template>
    <div class="search">
        <ElIcon class="search-icon" @click="onSearchClick">
            <Search/>
        </ElIcon>
        <PxSearch v-model="trans.showSearch"/>
    </div>
    <div class="py--nav">
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
import { Search } from "@element-plus/icons-vue";
import PxSearch from "@/components/base/PxSearch.vue";

// 监听路由前缀的变化
let router = useRouter();
let store = useStore();
const trans = reactive({
    navs: computed(() => store.state.nav.navs),
    prefix: computed(() => store.state.nav.prefix),
    showSearch: false
});

const onSearchClick = () => {
    trans.showSearch = !trans.showSearch
}

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
    router.push({
        name: get(last, 'name'),
        params: get(last, 'params')
    });
}

</script>

<style lang="less" scoped>
.search {
    .search-icon {
        cursor: pointer;
        height: 3.5rem;
        margin-right: 1rem;
        margin-left: 1rem;
        font-size: 1.2rem;
        &:hover {
            color: var(--wc-link-active-color);
        }
    }
}
</style>
