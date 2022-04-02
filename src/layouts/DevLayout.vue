<template>
    <ElScrollbar :always="true" height="100vh">
        <div class="py--dev">
            <DevTab/>
            <router-view/>
        </div>
    </ElScrollbar>
</template>

<script lang="ts" setup>
import DevTab from "@/components/dev/DevTab.vue";
import useGlobalInit from "@/composables/useGlobalInit";
import useDevelopAuth from "@/composables/useDevelopAuth";

useGlobalInit();
useDevelopAuth();

</script>
<style scoped lang="less">
.container {
    position: relative;
    box-sizing: border-box;
}
</style>
