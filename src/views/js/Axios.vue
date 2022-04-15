<template>
    <PxMain title="Axios">
        <h3>发起请求</h3>
        <p>
            <ElButton @click="onTimeout" type="primary">发起请求</ElButton>
            <ElButton @click="onAbort" type="primary">取消请求</ElButton>
        </p>
    </PxMain>
</template>
<script lang="ts" setup>
import PxMain from '@/components/base/PxMain.vue';
import { pyAbort, pyPost } from "../../../pkg/core/utils/request";

const onAbort = () => {
    pyAbort();
}
const onTimeout = () => {
    pyPost('/api/misc/time/out', {
        seconds: 30
    }).then(res => {
        console.log(res);
    }).catch(err => {
        console.log(err);
    });
}

</script>

<style scoped lang="less">
</style>
