<template>
    <div class="container">
        <Nav/>
        <Sidebar/>
        <div class="px--content">
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
import Nav from '@/components/base/Nav.vue';
import Sidebar from '@/components/base/Sidebar.vue';
import useFluid from '@/composables/useFluid';

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