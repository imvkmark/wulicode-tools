<template>
    <ul>
        <li class="active">
            <icon-font type="icon-tool"/>
            <span class="side-text">工具</span>
        </li>
        <li>
            <icon-font type="icon-user"/>
            <span class="side-text">用户</span>
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