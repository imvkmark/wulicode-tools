<template>
    <ElIcon @click="onSwitchDrawer" class="theme">
        <MagicStick/>
    </ElIcon>
    <ElDrawer v-model="trans.visible" title="主题设定">
        <ElForm :size="trans.elementSize">
            <ElFormItem label="元素大小">
                <ElRadioGroup :model-value="trans.elementSize" @update:model-value="onUpdateElementSize">
                    <ElRadioButton label="small">小号</ElRadioButton>
                    <ElRadioButton label="default">默认</ElRadioButton>
                    <ElRadioButton label="large">大号</ElRadioButton>
                </ElRadioGroup>
            </ElFormItem>
            <ElFormItem label="清理缓存" :size="trans.elementSize">
                <ElButton :loading="trans.clearing" @click="onClearCache">清理</ElButton>
            </ElFormItem>
        </ElForm>
    </ElDrawer>
</template>

<script lang="ts" setup>
import { computed, reactive } from 'vue';
import { useRouter } from 'vue-router';
import { useStore } from '@/store';
import { MagicStick } from "@element-plus/icons-vue";
import { pyStorageKey } from "@/framework/utils/conf";
import { localStore, toast } from "@/framework/utils/helper";
import { apiMgrAppHomeClearCache } from "@/framework/services/mgr-app";

// 监听路由前缀的变化
let router = useRouter();
let store = useStore();
const trans = reactive({
    elementSize: computed(() => store.state.poppy.elementSize),
    visible: false,
    clearing: false,
});

const onUpdateElementSize = (value: string) => {
    store.commit('poppy/SET_ELEMENT_SIZE', value)
}
const onSwitchDrawer = () => {
    trans.visible = !trans.visible;
}

const onClearCache = () => {
    trans.clearing = true;
    localStore(pyStorageKey.navs, null);
    apiMgrAppHomeClearCache().then(() => {
        toast('已清空缓存, 稍后会进行页面刷新');
        trans.clearing = false;
        setTimeout(() => {
            store.commit('poppy/SET_ACTION', 'reload');
        }, 1000);
    })
}

</script>

<style lang="less" scoped>
.theme {
    cursor: pointer;
    height: 3.5rem;
    margin-right: 1rem;
    margin-left: 1rem;
    font-size: 1.2rem;
    &:hover {
        color: var(--wc-link-active-color);
    }
}
</style>
