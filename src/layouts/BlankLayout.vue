<template>
    <router-view/>
</template>

<script lang="ts" setup>

import useGlobalInit from "@/composables/useGlobalInit";
import useAuth from "@/composables/useAuth";

useGlobalInit();
useAuth();
</script>
<style scoped lang="less">
</style>
