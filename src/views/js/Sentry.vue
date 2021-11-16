<template>
    <PxMain title="异常处理">
        <div class="main-content">
            <el-row :gutter="20">
                <el-col :span="12">
                    <el-button @click="onException">触发异常</el-button>
                    <p></p>
                    <el-alert>点击会触发一个自定义异常</el-alert>
                </el-col>
                <el-col :span="12">

                </el-col>
            </el-row>
        </div>
    </PxMain>
</template>
<script lang="ts" setup>
import PxMain from '@/components/base/PxMain.vue';

const onException = function () {
    doNotExistsMethod()
    throw 'Test Sentry Error';
};

</script>

<style scoped lang="less">
@import '../../assets/style/vars';
</style>
