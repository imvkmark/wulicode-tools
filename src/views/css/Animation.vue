<template>
    <h2>动画</h2>
    <div class="main-area main-mono">
        <el-row :gutter="20">
            <el-col :span="12">
                <h3>持续转动</h3>
                <div class="rotate">
                    <img src="@/assets/app/logo.png" alt="LOGO">
                </div>
            </el-col>
            <el-col :span="12">

            </el-col>
        </el-row>
    </div>
</template>

<script lang="ts" setup>
import { onMounted, reactive, ref } from 'vue'

const refList: any = ref(null);
const trans = reactive({
    refList: null,
    top: 0,
    height: 0
})

const initValue = function () {
    trans.height = refList.value.scrollHeight;
}
onMounted(initValue);
</script>

<style scoped lang="less">
.rotate img {
    animation: rotate 5s linear infinite;
}

@keyframes rotate {
    0% {
        -webkit-transform: rotate(0deg);
    }
    100% {
        -webkit-transform: rotate(360deg);
    }
}

.rotate {
    background: #3E3E3E;
    min-height: 300px;
    min-width: 300px;
    img {
        width: 30%;
    }
    display: flex;
    align-items: center;
    justify-content: center;
}

</style>