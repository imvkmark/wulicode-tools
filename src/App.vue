<template>
    <router-view/>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
    name: 'App'
})
</script>

<style lang="less">
@import "./assets/style/vars";

body {
    background: @mainBgColor;
    margin: 0;
}

#app {
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji";
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    box-sizing: border-box;
    height: 100vh;
    width: 100vw;
    display: grid;
    overflow: hidden;
    grid-template-columns: 5rem auto;
    grid-template-areas:
        "sidebar topbar"
        "sidebar content";
}
</style>
