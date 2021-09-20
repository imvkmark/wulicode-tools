<template>
    <router-view/>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
    name: 'App'
})

var _hmt = _hmt || [];
(function () {
    var hm = document.createElement('script');
    hm.src = 'https://hm.baidu.com/hm.js?f5b9493b0690fe0ae102753dfd125d17';
    var s = document.getElementsByTagName('script')[0];
    s.parentNode.insertBefore(hm, s);
})();
</script>

<style lang="less">
@import "./assets/style/vars";

body {
    background: @mainBgColor;
}

#app {
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji";
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    box-sizing: border-box;
    position: relative;
    width: 100%;
    height: 100%;
}
</style>
