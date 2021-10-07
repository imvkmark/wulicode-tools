<template>
    <ul>
        <li class="active">
            <router-link :to="{name : 'tool.apidoc'}">
                <icon-font type="icon-tool"/>
                <span class="side-text">工具</span>
            </router-link>
        </li>
        <li>
            <router-link :to="{name : 'user.login'}">
                <icon-font type="icon-user"/>
                <span class="side-text">用户</span>
            </router-link>
        </li>
    </ul>

</template>

<script lang="ts" setup>
import { defineComponent } from 'vue';
import IconFont from '@/components/base/IconFont';

defineComponent({
    IconFont
})
</script>