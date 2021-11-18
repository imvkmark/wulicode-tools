<template>
    <div class="py--main">
        <h2>{{ props.title }}</h2>
        <div class="main-area main-mono">
            <slot/>
        </div>
    </div>
</template>
<script lang="ts" setup>

import { useStore } from '@/store';
import { computed, defineComponent, reactive } from 'vue';
import { Expand } from '@element-plus/icons';

const store = useStore();
const trans = reactive({
    size: computed(() => store.state.size)
})

const props = defineProps({
    title: String
})
defineComponent({
    Expand
})
</script>

<style scoped lang="less">
@import '../../assets/style/vars';

.py--main {
    padding: 0.8rem 1.2rem;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    width: 100%;
    height: calc(100vh - 4rem);
    overflow-y: auto;
    h2 {
        font-size: 1.45rem;
        line-height: 2rem;
        margin: 0;
        height: 2rem;
        padding-bottom: 1rem;
        display: flex;
        align-items: center;
        .el-icon {
            font-size: 1.5rem;
            font-style: normal;
            color: var(--wc-link-color);
            transition: color 0.3s;
            cursor: pointer;
            &:hover {
                color: var(--wc-link-active-color);
            }
        }
    }
}
</style>
