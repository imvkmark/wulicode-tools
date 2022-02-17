<template>
    <div v-if="trans.menus.length"
        :class="{sidebar:true, ...sizeClass(trans.size), float:trans.active}">
        <div v-for="(item, key) in trans.menus" :key="key">
            <h3>{{ item.title }}</h3>
            <ul>
                <li v-for="rt in get(item, 'children', [])" :key="rt"
                    :class="{active : routerNameKey(rt.name , get(rt, 'params', {})) === trans.key}">
                    <span @click="onLinkClick(rt.name, get(rt, 'params', {}))">{{ rt.title }}</span>
                </li>
            </ul>
        </div>
    </div>
</template>
<script lang="ts" setup>
import { computed, onMounted, reactive, watch } from 'vue'
import { useRouter } from 'vue-router';
import { useStore } from '@/store';
import { get } from 'lodash-es';
import { sizeClass } from "@/framework/utils/helper";
import { routerNameKey } from "@/utils/utils";

const router = useRouter();
const store = useStore();
const trans = reactive({
    name: computed(() => router.currentRoute.value.name),
    active: computed(() => store.state.sidebarActive),
    size: computed(() => store.state.size),
    menus: computed(() => store.state.nav.menus),
    key: computed(() => store.state.nav.key)
})
const onLinkClick = (name: string, params: any) => {
    router.push({
        name,
        params
    })
    store.dispatch('SwitchSidebar', false);
}
const initSideBar = () => {

}

watch(() => store.state.prefix, () => {
    initSideBar()
})

onMounted(() => {
    initSideBar()
})
</script>

<style scoped lang="less">
@import '../../assets/style/vars';


.sidebar {
    left: -240px;
    background: #FFF;
    height: calc(100vh - 4rem);
    z-index: 5;
    min-width: 240px;
    box-sizing: border-box;
    border-right: 1px solid var(--wc-side-border-color);
    transition: left 0.3s;
    .close {
        padding: 0.8rem 1.2rem;
        height: 2rem;
        box-sizing: content-box;
        display: none;
    }
    // 浮动显示
    &.float {
        left: 0;
        .el-icon {
            font-size: 2rem;
            cursor: pointer;
        }
        .close {
            display: flex;
            justify-content: flex-start;
        }
    }
    h3 {
        font-size: 12px;
        font-weight: normal;
        padding-left: 1rem;
        color: var(--wc-color-dark-blue);
    }
    ul {
        list-style: none;
        padding-left: 0.8rem;
        li {
            height: 18px;
            line-height: 18px;
            margin-bottom: 8px;
            font-size: 14px;
            border-left: 2px solid transparent;
            cursor: pointer;
            &.active {
                span {
                    border-left: 2px solid @primaryColor;
                }
            }
            span {
                padding-left: 1rem;
                border-left: 2px solid transparent;
                color: var(--wc-color-dark-blue);
                text-decoration: none;
                display: block;
            }
        }
    }
}

.md, .sm, .xs {
    position: absolute;
}

.xl, .lg, .xxl {
    .close {
        display: none;
    }
}
</style>
