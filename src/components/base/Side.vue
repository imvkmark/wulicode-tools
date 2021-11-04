<template>
    <ul>
        <li :class="{active:trans.prefix === 'tool'}">
            <router-link :to="{name : 'tool.apidoc'}">
                <el-icon>
                    <fork-spoon/>
                </el-icon>
                <span class="side-text">工具</span>
            </router-link>
        </li>
        <li :class="{active:trans.prefix === 'js'}">
            <router-link :to="{name : 'js.sentry'}">
                <el-icon>
                    <sugar/>
                </el-icon>
                <span class="side-text">Js</span>
            </router-link>
        </li>
        <li :class="{active:trans.prefix === 'form'}">
            <router-link :to="{name : 'form.text'}">
                <el-icon>
                    <connection/>
                </el-icon>
                <span class="side-text">Form</span>
            </router-link>
        </li>
        <li :class="{active:trans.prefix === 'css'}">
            <router-link :to="{name : 'css.custom-box'}">
                <el-icon>
                    <brush-filled/>
                </el-icon>
                <span class="side-text">Css</span>
            </router-link>
        </li>
        <li :class="{active:trans.prefix === 'user'}">
            <router-link :to="{name : 'user.login'}">
                <el-icon>
                    <user/>
                </el-icon>
                <span class="side-text">用户</span>
            </router-link>
        </li>
    </ul>
</template>

<script lang="ts" setup>
import { computed, defineComponent, onMounted, reactive, watch } from 'vue';
import { BrushFilled, Connection, ForkSpoon, Sugar, User } from '@element-plus/icons';
import { useRouter } from 'vue-router';
import { useStore } from '@/store';

defineComponent({
    User, Sugar, ForkSpoon, Connection, BrushFilled
})

// 监听路由前缀的变化
let router = useRouter();
let store = useStore();
const trans = reactive({
    prefix: computed(() => store.state.prefix)
});
const setPrefix = function () {
    let name = String(router.currentRoute.value.name);
    let prefix = name.split('.')[0]
    store.dispatch('SetPrefix', {
        prefix
    })
}
onMounted(() => {
    setPrefix()
})
watch(() => router.currentRoute.value.name, (newVal) => {
    setPrefix();
})
</script>