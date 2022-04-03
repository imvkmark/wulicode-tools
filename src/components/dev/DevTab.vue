<template>
    <div class="sidebar">
        <router-link :class="{active : router.currentRoute.value.name === 'dev.api_runner'}" :to="{name: 'dev.api_runner'}">
            <XIcon type="promotion"/>
        </router-link>
        <router-link :to="{name: 'tool.img'}">
            <XIcon type="lightning"/>
        </router-link>
        <PxSetting v-if="trans.isLogin"/>
    </div>
</template>
<script lang="ts" setup>
import { useRouter } from 'vue-router';
import { useStore } from '@/store';
import PxSetting from "@/components/base/PxSetting.vue";
import { computed, reactive } from "vue";
import XIcon from "@/components/element/XIcon.vue";

const router = useRouter();
const store = useStore();
const trans = reactive({
    isLogin: computed(() => store.state.poppy.token),
})
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
