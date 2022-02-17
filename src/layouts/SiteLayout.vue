<template>
    <div class="container">
        <PxSidebar/>
        <div class="py--content">
            <ElScrollbar>
                <router-view/>
            </ElScrollbar>
        </div>
    </div>
</template>

<script lang="ts" setup>
import useAuth from '@/composables/useAuth';
import useClearCache from '@/composables/useClearCache';
import useInit from '@/composables/useInit';
import useTkd from '@/composables/useTkd';
import useFluid from '@/composables/useFluid';
import PxNav from '@/components/base/PxNav.vue';
import PxSidebar from '@/components/base/PxSidebar.vue';

useClearCache()
useInit();
useAuth();
useTkd();
useFluid();
</script>
<style scoped lang="less">
.container {
    position: relative;
    overflow: hidden;
    display: flex;
    box-sizing: border-box;
}
</style>
