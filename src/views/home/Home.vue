<template>
    <div class="content">
        <div class="logo">
            <img src="@/assets/app/logo.png" alt="WuliCode"> Wulicode
        </div>
        <div class="input">
            <ElInput/>
        </div>
    </div>
    <div class="footer">
        Copyright 2021 - present zhaody901(At)126.com &nbsp;
        <a href="https://beian.miit.gov.cn/#/Integrated/recordQuery" rel="nofollow">鲁ICP备13016276号-7</a>
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
const onScroll = function (e) {
    trans.top = e.target.scrollTop;
    trans.height = e.target.scrollHeight;
}
const onScrollTo = function () {
    refList.value.scrollTop = 200 * 4;
}

const initValue = function () {
    trans.height = refList.value.scrollHeight;
}
onMounted(initValue);
</script>

<style scoped lang="less">
.content {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    min-height: calc(100vh - 8rem);
    .logo {
        display: flex;
        align-items: center;
        justify-content: center;
        color: #081736;
        font-size: 25px;
        padding-bottom: 1.25rem;
        img {
            width: 35px;
            margin-right: 10px;
        }
    }
    .input {
        min-width: 40vw;
    }
}

.footer {
    position: fixed;
    height: 4rem;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 12px;
}
</style>