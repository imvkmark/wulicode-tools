<template>
    <PxMain title="Axios">
        <h3>发起请求</h3>
        <ElRow :gutter="8">
            <ElCol :span="8">
                <ElDivider content-position="left">正确响应</ElDivider>
                <p>向服务器发起一个请求, 但服务器未返回任何数据(204)</p>
                <p>
                    <ElButton @click="onNoResponse" type="primary">发起请求</ElButton>
                </p>
            </ElCol>
            <ElCol :span="8">
                <ElDivider content-position="left">客户端请求</ElDivider>
                <p>向服务器发起一个超时请求(408), 可以点击取消请求中断, 请求失败可以触发 cancel(400)</p>
                <p>
                    <ElButton @click="onTimeout" type="primary">发起请求</ElButton>
                    <ElButton @click="onAbort" type="primary">取消请求</ElButton>
                </p>
                <p>请求不存在的接口(404)</p>
                <p>
                    <ElButton @click="onNotFound" type="primary">发起请求</ElButton>
                </p>
                <p>向服务器发起请求, 但请求方法不正确(405)</p>
                <p>
                    <ElButton @click="onMethodGet" type="primary">发起请求</ElButton>
                </p>
                <p>向服务器发起一个请求, 但服务器返回未授权(401)</p>
                <p>
                    <ElButton @click="onResponse(401)" type="primary">发起请求</ElButton>
                </p>
                <p>向服务器发起一个请求, 但服务器返回包体过大(413)</p>
                <p>
                    <ElButton @click="onResponse(413)" type="primary">发起请求</ElButton>
                </p>
            </ElCol>
            <ElCol :span="8">
                <ElDivider content-position="left">服务器错误 500</ElDivider>
                <p>向服务器发起一个请求, 但服务器异常(500)</p>
                <p>
                    <ElButton @click="onResponse(500)" type="primary">发起请求</ElButton>
                </p>
            </ElCol>
        </ElRow>
    </PxMain>
</template>
<script lang="ts" setup>
import PxMain from '@/components/base/PxMain.vue';
import { pyAbort } from "../../../core/utils/request";
import { appRequest } from "@/utils/request";
import { toast } from "@/utils/util";

const onAbort = () => {
    pyAbort();
}
const onTimeout = () => {
    appRequest({
        url: "/api/misc/http/timeout",
        data: {
            seconds: 6
        },
        method: "post",
        timeout: 5000
    }).then(res => {
        toast(res);
    }).catch(err => {
        toast(err);
    });
}
const onNotFound = () => {
    appRequest({
        url: "-/api/misc/http/timeout-",
        method: "post",
    }).then(res => {
        toast(res);
    }).catch(err => {
        toast(err);
    });
}
const onMethodGet = () => {
    appRequest({
        url: "/api/misc/http/timeout",
        method: "get",
    }).then(res => {
        toast(res);
    }).catch(err => {
        toast(err);
    });
}
const onResponse = (status: number) => {
    appRequest({
        url: "/api/misc/http/status",
        method: "post",
        data: {
            status: status
        }
    }).then(res => {
        toast(res);
    }).catch(err => {
        toast(err);
    });
}
const onNoResponse = () => {
    appRequest({
        url: "/api/misc/http/empty",
        method: "post",
        timeout: 5000
    }).then(res => {
        toast(res);
    }).catch(err => {
        toast(err);
    });
}

</script>

<style scoped lang="less">
</style>
