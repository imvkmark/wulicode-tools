<template>
    <header>
        <div :class="{nav:true, active:trans.active}" v-if="trans.prefix">
            <div v-if="sizeGt(trans.size, 'md')" class="logo">
                <img src="@/assets/app/logo.png" alt="Wulicode">
            </div>
            <div v-else class="icon">
                <ElIcon v-if="!trans.active" @click="showNav">
                    <component :is="navDefs[trans.prefix]"/>
                </ElIcon>
                <ElIcon v-else @click="showNav">
                    <ArrowLeft/>
                </ElIcon>
            </div>
        </div>
    </header>
</template>

<script lang="ts" setup>
import { useStore } from '@/store';
import { computed, defineComponent, reactive } from 'vue';
import { navDefs, sizeGt } from '@/utils/defs';
import { ArrowLeft } from '@element-plus/icons';

const store = useStore();
const trans = reactive({
    prefix: computed(() => store.state.prefix),
    active: computed(() => store.state.navActive),
    size: computed(() => store.state.size)
})
const showNav = () => {
    store.dispatch('SetNavActive', !trans.active)
}
defineComponent({
    ArrowLeft
})
</script>

<style scoped lang="less">
@import "../../assets/style/vars";

header {
    height: 4rem;
    display: flex;
    -webkit-box-align: center;
    align-items: center;
    -webkit-box-pack: end;
    background-color: #FFF;
    padding-right: 1.25rem;
    box-sizing: border-box;
    width: 100%;
    border-color: #CCC;
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
}
</style>