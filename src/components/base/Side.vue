<template>
    <ul>
        <li class="active">
            <router-link :to="{name : 'tool.apidoc'}">
                <el-icon>
                    <fork-spoon/>
                </el-icon>
                <span class="side-text">工具</span>
            </router-link>
        </li>
        <li>
            <router-link :to="{name : 'user.login'}">
                <el-icon>
                    <user/>
                </el-icon>
                <span class="side-text">用户</span>
            </router-link>
        </li>
        <li>
            <router-link :to="{name : 'demo.sentry'}">
                <el-icon>
                    <sugar/>
                </el-icon>
                <span class="side-text">Demo</span>
            </router-link>
        </li>
    </ul>

</template>

<script lang="ts" setup>
import { defineComponent } from 'vue';
import { ForkSpoon, Sugar, User } from '@element-plus/icons';

defineComponent({
    User, Sugar, ForkSpoon
})
</script>