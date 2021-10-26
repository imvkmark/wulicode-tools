<template>
    <ul>
        <li :class="{active:routePrefix === 'tool'}">
            <router-link :to="{name : 'tool.apidoc'}">
                <el-icon>
                    <fork-spoon/>
                </el-icon>
                <span class="side-text">工具</span>
            </router-link>
        </li>
        <li :class="{active:routePrefix === 'user'}">
            <router-link :to="{name : 'user.login'}">
                <el-icon>
                    <user/>
                </el-icon>
                <span class="side-text">用户</span>
            </router-link>
        </li>
        <li :class="{active:routePrefix === 'demo'}">
            <router-link :to="{name : 'demo.sentry'}">
                <el-icon>
                    <sugar/>
                </el-icon>
                <span class="side-text">Demo</span>
            </router-link>
        </li>
        <li :class="{active:routePrefix === 'form'}">
            <router-link :to="{name : 'form.text'}">
                <el-icon>
                    <connection/>
                </el-icon>
                <span class="side-text">Form</span>
            </router-link>
        </li>
    </ul>

</template>

<script lang="ts" setup>
import { defineComponent, onMounted, ref, watch } from 'vue';
import { Connection, ForkSpoon, Sugar, User } from '@element-plus/icons';
import { useRouter } from 'vue-router';

defineComponent({
    User, Sugar, ForkSpoon, Connection
})

// 监听路由前缀的变化
let router = useRouter();
let routePrefix = ref('');
const setPrefix = function (path: string) {
    let allPath = String(path).toString().split('/')
    routePrefix.value = allPath[1];
}
onMounted(() => {
    setPrefix(router.currentRoute.value.path)
})
watch(() => router.currentRoute.value.path, (newVal) => {
    setPrefix(newVal);
})
</script>