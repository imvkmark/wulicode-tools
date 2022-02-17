<template>
    <div v-if="trans.menus.length && !sizeLte(trans.size, 'sm')">
        <ElScrollbar class="sidebar-wrapper" :always="true">
            <PxMenus/>
        </ElScrollbar>
    </div>
    <ElDrawer v-if="trans.menus.length && sizeLte(trans.size, 'sm')" :model-value="trans.active" :with-header="false"
        custom-class="py--sidebar-drawer"
        :show-close="false" :size="240" direction="ltr" @close="onDrawerClose">
        <ElScrollbar class="sidebar-drawer" :always="true">
            <PxMenus/>
        </ElScrollbar>
    </ElDrawer>
</template>
<script lang="ts" setup>
import { computed, reactive } from 'vue'
import { useRouter } from 'vue-router';
import { useStore } from '@/store';
import { sizeLte } from "@/framework/utils/helper";
import PxMenus from "@/components/base/PxMenus.vue";

const router = useRouter();
const store = useStore();
const trans = reactive({
    active: computed(() => store.state.nav.sidebarActive),
    size: computed(() => store.state.poppy.size),
    menus: computed(() => store.state.nav.menus),
    key: computed(() => store.state.nav.key)
})

const onDrawerClose = () => {
    store.dispatch('nav/CloseSidebar')
}
</script>

<style scoped lang="less">
@import '../../assets/style/vars';

.sidebar-wrapper {
    margin-top: var(--wc-header-height);
    height: calc(100vh - var(--wc-header-height));
    position: fixed;
    top: 0;
    left: 0;
}

.sidebar-drawer {
    height: 100vh;
}
</style>
