<template>
    <ElIcon :class="get(props, 'className')" v-if="props.type">
        <component :is="get(icon, iconType)"/>
    </ElIcon>
</template>
<script lang="ts" setup>
import { icon } from "@/utils/icon";
import { camelCase, get, upperFirst } from "lodash-es"
import { toRef } from "vue";

const props = defineProps({
    type: {
        type: String
    },
    className: {
        type: [String, Object]
    }
})
const iconType = upperFirst(camelCase(toRef(props, 'type').value));
</script>

<style scoped lang="less">
@import '../../assets/style/vars';
</style>
