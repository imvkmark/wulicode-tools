<template>
    <header>
        <div :class="{nav:true, active:trans.navActive}" v-if="trans.prefix">
            <div v-if="sizeGt(trans.size, 'md')" class="logo">
                <img src="@/assets/app/logo.png" alt="Wulicode">
            </div>
            <div v-else class="icon">
                <ElIcon v-if="!trans.navActive" @click="showNav">
                    <component :is="navDefs[trans.prefix]"/>
                </ElIcon>
                <ElIcon v-else @click="showNav">
                    <ArrowLeft/>
                </ElIcon>
            </div>
        </div>
        <div class="sidebar">
            <ElIcon v-if="sizeLte(trans.size, 'md')">
                <Expand v-if="!trans.sidebarActive" @click="store.dispatch('SwitchSidebar', true)"/>
                <Close v-else @click="store.dispatch('SwitchSidebar', false)"/>
            </ElIcon>
        </div>
    </header>
</template>

<script lang="ts" setup>
import { useStore } from '@/store';
import { computed, defineComponent, reactive } from 'vue';
import { navDefs, sizeGt, sizeLte } from '@/utils/defs';
import { ArrowLeft, Close, Expand } from '@element-plus/icons';

const store = useStore();
const trans = reactive({
    prefix: computed(() => store.state.prefix),
    navActive: computed(() => store.state.navActive),
    sidebarActive: computed(() => store.state.sidebarActive),
    size: computed(() => store.state.size)
})
const showNav = () => {
    store.dispatch('SetNavActive', !trans.navActive)
}
defineComponent({
    ArrowLeft, Expand, Close
})
</script>

<style scoped lang="less">
@import "../../assets/style/vars";

header {
    height: 4rem;
    display: flex;
    align-items: center;
    background-color: #FFF;
    box-sizing: border-box;
    width: 100%;
    border-bottom: 1px solid var(--wc-header-border-color);
    .nav {
        width: 5rem;
        height: 4rem;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: background-color 0.3s;
        .logo {
            cursor: pointer;
            img {
                height: 2rem;
            }
        }
        .icon {
            width: 100%;
            cursor: pointer;
            height: 4rem;
            display: flex;
            align-items: center;
            justify-content: center;
            .el-icon {
                font-size: 2rem;
            }
        }
        &.active {
            .icon {
                background: var(--wc-nav-bg-color);
                color: #FFF;
                .el-icon {
                    font-size: 2rem;
                }
            }
        }
    }
    .sidebar {
        height: 3rem;
        width: 3rem;
        display: flex;
        align-items: center;
        justify-content: center;
        .el-icon {
            font-size: 1.5rem;
            cursor: pointer;
        }
    }
}
</style>