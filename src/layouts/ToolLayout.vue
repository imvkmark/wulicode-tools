<template>
    <div class="tool">
        <div id="menu">
            <el-menu default-active="1">
                <el-sub-menu index="1">
                    <template #title>
                        <i class="el-icon-document"></i>
                        <span>文档</span>
                    </template>
                    <el-menu-item index="tool.apidoc">
                        <router-link :to="{name:'tool.apidoc'}">ApiDoc</router-link>
                    </el-menu-item>
                    <el-menu-item index="tool.base64">
                        <router-link :to="{name:'tool.base64'}">Base64</router-link>
                    </el-menu-item>
                    <el-menu-item index="tool.img">
                        <router-link :to="{name:'tool.img'}">图片占位符</router-link>
                    </el-menu-item>
                </el-sub-menu>
            </el-menu>
        </div>
        <div class="px--tool">
            <router-view/>
            <!--        <component :is="zoneMap[zone]"/>-->
        </div>
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
    return router.currentRoute.value.params.zone || 'apidoc'
})
const zoneMap = {
    apidoc: defineAsyncComponent(() => import('@/views/Tool/Apidoc.vue'))
}

</script>

<style scoped lang="less">
@import '../assets/style/vars';

.tool {
    display: flex;
    height: calc(100vh - 4rem);
}

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
