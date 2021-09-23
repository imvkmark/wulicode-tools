<template>
    <div id="menu">
        <el-menu default-active="2">
            <el-sub-menu index="1">
                <template #title>
                    <i class="el-icon-document"></i>
                    <span>文档</span>
                </template>
                <el-menu-item index="1-4-1">文档工具</el-menu-item>
            </el-sub-menu>
        </el-menu>
    </div>
    <div id="main" class="px--tool">
        <component :is="zoneMap[zone]"/>
    </div>
</template>

<script lang="ts" setup>
import { computed, defineAsyncComponent, reactive, ref } from 'vue'
import { useRouter } from 'vue-router';
import { ElForm } from 'element-plus';

const form: any = ref<InstanceType<typeof ElForm>>();

const value = reactive({
    passport: '',
    password: '',
    captcha: ''
})

const router = useRouter();
const zone = computed(() => {
    return router.currentRoute.value.params.zone || 'index'
})
const zoneMap = {
    apidoc: defineAsyncComponent(() => import('@/views/Tool/Apidoc.vue'))
}

</script>

<style scoped lang="less">
@import '../../assets/style/vars';

.el-menu {
    border-right: none;
}

#menu {
    background: #FFF;
    min-width: 240px;
    box-sizing: border-box;
    border-right: 1px solid #E1EDFF;
}
</style>
