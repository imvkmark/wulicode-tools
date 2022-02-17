<template>
    <div class="container">
        <PxSidebar/>
        <div :class="{'py--content':true,
            'with-menu' : trans.hasMenu,
            smaller : sizeLte(trans.size, 'sm'),
            larger : sizeGt(trans.size, 'sm'),}">
            <router-view/>
        </div>
    </div>
</template>

<script lang="ts" setup>
import useAuth from '@/composables/useAuth';
import useClearCache from '@/composables/useClearCache';
import useInit from '@/composables/useInit';
import useTkd from '@/composables/useTkd';
import useFluid from '@/composables/useFluid';
import PxSidebar from '@/components/base/PxSidebar.vue';
import { sizeGt, sizeLte } from "@/framework/utils/helper";
import { computed, reactive } from "vue";
import { useStore } from "@/store";
import useNav from "@/composables/useNav";

useClearCache()
useNav();
useInit();
useAuth();
useTkd();
useFluid();
const store = useStore();
const trans = reactive({
    size: computed(() => store.state.poppy.size),
    hasMenu: computed(() => {
        return Boolean(store.state.nav.menus.length)
    }),
})

</script>
<style scoped lang="less">
.container {
    position: relative;
    display: flex;
    box-sizing: border-box;
}
</style>
