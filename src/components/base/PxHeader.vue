<template>
    <header>
        <div class="nav">
            <div class="logo">
                <img src="@/assets/app/logo.png" alt="Wulicode">
            </div>
        </div>
        <PxNav/>
    </header>
    <div class="sidebar" v-if="sizeLte(trans.size, 'md')">
        <ElIcon>
            <Expand v-if="!trans.sidebarActive" @click="store.dispatch('SwitchSidebar', true)"/>
            <Close v-else @click="store.dispatch('SwitchSidebar', false)"/>
        </ElIcon>
    </div>
</template>

<script lang="ts" setup>
import { useStore } from '@/store';
import { computed, defineComponent, reactive } from 'vue';
import { ArrowLeft, Close, Expand } from '@element-plus/icons';
import { sizeLte } from "@/framework/utils/helper";
import PxNav from "@/components/base/PxNav.vue";

const store = useStore();
const trans = reactive({
    prefix: computed(() => store.state.prefix),
    navActive: computed(() => store.state.navActive),
    sidebarActive: computed(() => store.state.sidebarActive),
    size: computed(() => store.state.size)
})
defineComponent({
    ArrowLeft, Expand, Close
})
</script>

<style scoped lang="less">
@import "../../assets/style/vars";

header {
    height: 3.5rem;
    background-color: #FFF;
    box-sizing: border-box;
    width: 100%;
    display: flex;
    flex: auto;
    justify-content: space-between;
    border-bottom: 1px solid var(--wc-header-border-color);
    .nav {
        width: 5rem;
        height: 3.5rem;
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
    }

}

.sidebar {
    height: 2rem;
    align-items: center;
    justify-content: center;
    border-bottom: var(--wc-header-border-color) 1px solid;
    .el-icon {
        font-size: 1.5rem;
        cursor: pointer;
    }
}
</style>
