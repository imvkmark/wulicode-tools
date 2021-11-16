<template>
    <div class="px--main">
        <h2>{{ props.title }}</h2>
        <div class="main-area main-mono">
            <slot/>
        </div>
    </div>
</template>
<script lang="ts" setup>
const props = defineProps({
    title: String
})
</script>

<style scoped lang="less">
@import '../../assets/style/vars';
</style>
