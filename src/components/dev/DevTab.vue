<template>
    <div class="sidebar">
        <router-link :class="{active : router.currentRoute.value.name === 'dev.api_runner'}" :to="{name: 'dev.api_runner'}">
            <XIcon type="promotion"/>
        </router-link>
        <router-link :to="{name: 'tool.img'}">
            <XIcon type="lightning"/>
        </router-link>
        <a href="https://github.com/imvkmark/wulicode-tools/issues" target="_blank">
            <XIcon type="svg|github"/>
        </a>
        <PxSetting/>
    </div>
</template>
<script lang="ts" setup>
import PxSetting from "@/components/base/PxSetting.vue";
import XIcon from "@/components/element/XIcon.vue";
import { useRouter } from "vue-router";

const router = useRouter();
</script>

<style lang="less" scoped>
.sidebar {
    width: 50px;
    background: #0C0603;
    height: 100vh;
    a {
        height: 50px;
        font-weight: bold;
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        text-decoration: none;
        color: #fff;
        box-sizing: border-box;
        &.active {
            background: var(--wc-color-dark-blue);
            border-left: 3px solid var(--wc-color-primary);
        }
    }
}
</style>
