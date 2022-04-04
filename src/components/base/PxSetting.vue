<template>
    <ElIcon @click="onSwitchDrawer" class="theme">
        <Operation/>
    </ElIcon>
    <ElDrawer v-model="trans.visible" title="用户设定" :size="sizePercent(trans.media)">
        <ElForm class="py--form">
            <ElDivider content-position="left">主题</ElDivider>
            <ElFormItem label="主题">
                <ElRadioGroup :model-value="trans.style" @update:model-value="onUpdateStyle">
                    <ElRadioButton label="light">浅色</ElRadioButton>
                    <ElRadioButton label="dark">深色</ElRadioButton>
                </ElRadioGroup>
            </ElFormItem>
            <ElDivider content-position="left">用户信息</ElDivider>
            <ElFormItem label="退出登录">
                <ElButton @click="onLogout" type="danger" plain>退出</ElButton>
            </ElFormItem>
        </ElForm>
    </ElDrawer>
</template>

<script lang="ts" setup>
import { computed, reactive } from 'vue';
import { useRouter } from 'vue-router';
import { useStore } from '@/store';
import { Operation } from "@element-plus/icons-vue";
import { sizePercent } from "@/utils/helper";
import { ElMessageBox } from "element-plus";
import { emitter, PY_USER_LOGOUT } from "@/bus/mitt";


// 监听路由前缀的变化
let router = useRouter();
let store = useStore();
const trans = reactive({
    style: computed(() => store.state.poppy.style),
    media: computed(() => store.state.poppy.media),
    visible: false,
});

const onUpdateStyle = (value: string) => {
    store.dispatch('poppy/SetStyle', value)
}

const onSwitchDrawer = () => {
    trans.visible = !trans.visible;
}

const onLogout = () => {
    ElMessageBox.confirm(
        '确认退出登录?',
        '确认', {
            confirmButtonText: '确认',
            cancelButtonText: '取消',
            type: 'warning',
        }
    ).then(() => {
        emitter.emit(PY_USER_LOGOUT)
    })
}

</script>

<style lang="less" scoped>
.theme {
    cursor: pointer;
    color: #fff;
    height: 3.5rem;
    margin-right: 1rem;
    margin-left: 1rem;
    font-size: 1.2rem;
    &:hover {
        color: var(--wc-link-active-color);
    }
}
</style>
