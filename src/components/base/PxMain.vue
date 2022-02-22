<template>
    <div :class="{
        'py--main': true,
        smaller : sizeLte(trans.size, 'sm'),
        'with-menu' : trans.hasMenu,
        larger : sizeGt(trans.size, 'sm')}">
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
.py--main {
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    width: 100%;
    overflow-y: auto;
    padding: 0.8rem 1.2rem 0.8rem;
}
</style>
