<template>
    <ElScrollbar :always="true" height="100vh">
        <router-view/>
    </ElScrollbar>
</template>

<script lang="ts" setup>
import PxHeader from '@/components/base/PxHeader.vue';

</script>

<style lang="less">
body {
    background: var(--wc-bg-color);
    margin: 0;
}

#app {
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji";
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    box-sizing: border-box;
    min-height: 100vh;
    width: 100%;
}
</style>
