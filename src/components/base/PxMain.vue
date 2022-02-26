<template>
    <div :class="{
        'py--main': true,
        smaller : sizeLte(trans.size, 'sm'),
        'with-menu' : trans.hasMenu,
        larger : sizeGt(trans.size, 'sm')}">
        <h3 class="main-title" v-if="title">
            {{ title }}
            <small v-if="description">{{ description }}</small>
        </h3>
        <div class="main-area">
            <slot/>
        </div>
    </div>
</template>
<script lang="ts" setup>
import { useStore } from '@/store';
import { computed, defineComponent, reactive } from 'vue';
import { Expand } from '@element-plus/icons';
import { sizeGt, sizeLte } from "@/framework/utils/helper";

const store = useStore();
const trans = reactive({
    size: computed(() => store.state.poppy.size),
    hasMenu: computed(() => store.state.nav.menus.length),
})

const props = defineProps({
    title: String,
    description: String
})
defineComponent({
    Expand
})
</script>

<style lang="less" scoped>
</style>
