<template>
    <PxHeader/>
    <PxSidebar/>
    <div :class="{'py--content':true,'with-menu' : trans.hasMenu, smaller : sizeLte(trans.media, 'sm'),larger : sizeGt(trans.media, 'sm'),}">
        <router-view/>
    </div>
</template>

<script lang="ts" setup>
import useAuth from '@/composables/useAuth';
import useGlobalInit from '@/composables/useGlobalInit';
import PxSidebar from '@/components/base/PxSidebar.vue';
import { sizeGt, sizeLte } from "../../core/utils/helper";
import { computed, reactive } from "vue";
import { useStore } from "@/store";
import useNav from "@/composables/useNav";
import useGlobalTheme from "@/composables/useGlobalTheme";
import PxHeader from "@/components/base/PxHeader.vue";

useGlobalInit();
useGlobalTheme()
useNav();
useAuth();
const store = useStore();
const trans = reactive({
    media: computed(() => store.state.poppy.media),
    hasMenu: computed(() => {
        return Boolean(store.state.nav.menus.length)
    }),
})

</script>
<style scoped lang="less">
.container {
    position: relative;
    box-sizing: border-box;
}
</style>
