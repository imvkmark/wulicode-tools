<template>
    <ElIcon @click="onSwitchDrawer" class="theme">
        <ElBadge :is-dot="trans.tip">
            <Operation/>
        </ElBadge>
    </ElIcon>
    <ElDrawer v-model="trans.visible" title="用户设定" :size="sizePercent(trans.media)">
        <ElForm class="py--form">
            <ElDivider content-position="left">用户信息</ElDivider>
            <ElFormItem label="退出登录">
                <ElButton @click="onLogout" type="danger" plain>退出</ElButton>
            </ElFormItem>
            <ElDivider content-position="left">更新记录</ElDivider>
            <ElScrollbar>
                <div class="changelog">
                    <p>
                        <span>2022-04-16</span>
                        支持本地开发 <br>
                        支持主页快速刷新文档 <br>
                        支持凭证复制 <br>
                        修复凭证更名隐藏, 修复 401 无法退出, 增加接口说明
                        <span>2022-04-15</span>
                        支持切换保存参数, 支持参数保存到服务端 <br>
                        支持版本更新提示 <br>
                        支持显示更多说明 <br>
                        支持登录/可自动获取验证码 <br>
                        拆离 '@popjs/core' 框架
                        <span>2022-04-04</span>
                        支持多用户 <br>
                        支持公共文档 <br>
                        支持凭证分离
                    </p>
                </div>
            </ElScrollbar>
        </ElForm>
    </ElDrawer>
</template>

<script lang="ts" setup>
import { computed, onMounted, reactive } from 'vue';
import { useRouter } from 'vue-router';
import { useStore } from '@/store';
import { Operation } from "@element-plus/icons-vue";
import { sizePercent } from "../../../pkg/core/utils/helper";
import { ElMessageBox } from "element-plus";
import { emitter, PY_USER_LOGOUT } from "../../../pkg/core/bus/mitt";
import { appVersion } from "@/utils/conf";
import { localStore } from "../../../pkg/core/utils/util";


// 监听路由前缀的变化
let router = useRouter();
let store = useStore();
const trans = reactive({
    style: computed(() => store.state.poppy.style),
    media: computed(() => store.state.poppy.media),
    tip: false,
    visible: false,
});

const onSwitchDrawer = () => {
    trans.visible = !trans.visible;
    localStore("version", appVersion);
    trans.tip = false
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

const checkVersion = () => {
    let version = localStore('version');
    if (version !== appVersion) {
        trans.tip = true;
    }
}

onMounted(() => {
    checkVersion();
})
</script>

<style lang="less" scoped>
.changelog {
    max-height: 400px;
    p {
        color: gray;
        line-height: 1.4;
        margin: 0.2rem 0;
        font-size: 13px;
        span {
            color: darken(gray, 10%);
            font-size: 14px;
            display: block;
        }
    }
}

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
