<template>
    <div :class="{'px--nav' : true, ...sizeClass(trans.size), active:trans.active}">
        <ul>
            <li :class="{active:trans.prefix === nav.name.split('.')[0]}" v-for="nav in navs" :key="nav.name"
                @click="jumpTo(nav.name)"
            >
                <em>
                    <ElIcon>
                        <component :is="navDefs[prefix(nav.name)]"/>
                    </ElIcon>
                    <span class=" side-text">{{ nav.text }}</span>
                </em>
            </li>
        </ul>
    </div>
</template>

<script lang="ts" setup>
import { computed, onMounted, reactive, watch } from 'vue';
import { useRouter } from 'vue-router';
import { useStore } from '@/store';
import { navDefs, sizeClass } from '@/utils/defs';

// 监听路由前缀的变化
let router = useRouter();
let store = useStore();
const trans = reactive({
    prefix: computed(() => store.state.prefix),
    size: computed(() => store.state.size),
    active: computed(() => store.state.navActive)
});
const prefix = (name: string) => {
    return name.split('.')[0];
}
const navs = [
    {
        name: 'home.index',
        text: '主页'
    },
    {
        name: 'tool.apidoc',
        text: '工具'
    },
    {
        name: 'js.sentry',
        text: 'Js'
    },
    {
        name: 'form.text',
        text: 'Form'
    },
    {
        name: 'css.custom-box',
        text: 'Css'
    },
    {
        name: 'user.login',
        text: '用户'
    }
];

const jumpTo = (name: string) => {
    router.push({
        name
    });
    if (trans.active) {
        store.dispatch('SetNavActive', false);
    }
}
const setPrefix = function () {
    let name = String(router.currentRoute.value.name);
    let prefix = name.split('.')[0];
    store.dispatch('SetPrefix', {
        prefix
    })
}
onMounted(() => {
    setPrefix()
})
watch(() => router.currentRoute.value.name, () => {
    setPrefix();
})
</script>

<style scoped lang="less">
.px--nav {
    transition: all 0.3s;
    margin-left: -5rem;
    &.active {
        margin-left: 0;
    }
}

.md, .sm, .xs {
    position: absolute;
    margin-left: -5rem;
}

.lg, .xl, .xxl {
    position: relative;
    margin-left: 0;
}
</style>