<template>
    <div>
        <pre v-html="val"></pre>
        <el-tooltip v-model:visible="disabled" content="已复制" placement="left" effect="light">
            <XIcon :class-name="{copy : true,'copy-success': !disabled}" type="copy-document" @click="copy"/>
        </el-tooltip>
    </div>
</template>
<script lang="ts" setup>
import {  onMounted, ref } from 'vue';
import XIcon from "@/components/element/XIcon.vue";
import { copyText } from 'vue3-clipboard'
import { toast } from "@/utils/utils";

const props = defineProps({
    value: {
        type: String,
        default: () => {
            return ''
        }
    }
})

const val = ref('');
const disabled = ref(false);
const copy = () => {
    copyText(val.value, undefined, (error: any) => {
        if (error) {
            toast('无法复制:' + error, false)
        } else {
            disabled.value = true;
            setTimeout(() => {
                disabled.value = false
            }, 2000)
        }
    })
}


onMounted(() => {
    val.value = props.value;
})
</script>
<style lang="less" scoped>
div {
    position: relative;

    pre {
        background: #F6F8FA;
        padding: 0.5rem;
        color: #24292f;
    }
}

.copy {
    cursor: pointer;
    position: absolute;
    top: 7px;
    right: 7px;
    font-size: 18px;
}

.copy-success {
    .el-icon {
        color: #34B7FF;
    }
}
</style>
