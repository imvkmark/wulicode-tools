<template>
    <h2>异常处理</h2>
    <div class="main-area main-mono">
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
    </div>
</template>
<script lang="ts" setup>
const onException = function () {
    doNotExistsMethod()
    throw 'Test Sentry Error';
};

</script>

<style scoped lang="less">
@import '../../assets/style/vars';
</style>
