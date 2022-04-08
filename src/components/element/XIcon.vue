<template>
    <ElIcon :class="get(props, 'className')" :style="style" v-if="props.type">
        <SvgIcon v-if="hasSvg()" :name="svgType()"/>
        <component v-else :is="get(icon, iconType)"/>
    </ElIcon>
</template>
<script lang="ts" setup>
import { icon } from "@/utils/icon";
import { get } from "lodash-es"
import { toRef } from "vue";
import { upperCamelCase } from "@/utils/helper";
import SvgIcon from "@/components/element/SvgIcon.vue";

const props = defineProps({
    type: {
        type: String,
        default: "",
    },
    style: {
        type: [String, Array],
        default: "",
    },
    className: {
        type: [String, Object]
    }
})
const hasSvg = () => {
    return props.type.indexOf('svg|') > -1;
}
const svgType = () => {
    return props.type?.substring(4);
}
const iconType = upperCamelCase(String(toRef(props, 'type').value));
</script>

<style lang="less" scoped>
</style>
