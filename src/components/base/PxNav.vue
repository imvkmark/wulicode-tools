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
import { computed, reactive } from 'vue';
import { useRouter } from 'vue-router';
import { useStore } from '@/store';
import { appNavDefs } from "@/utils/conf";
// 监听路由前缀的变化
let router = useRouter();
let store = useStore();
const trans = reactive({
    navs: computed(() => store.state.nav.navs),
    prefix: computed(() => store.state.nav.prefix),
});

const jumpTo = (name: string) => {
    router.push({
        name
    });
}

</script>

<style scoped lang="less">

</style>
