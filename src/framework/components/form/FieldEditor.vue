<template>

</template>
<script lang="ts" setup>
import { Ref, ref } from 'vue';

const props = defineProps({
    attr: Object,
    modelValue: {
        type: String,
        default: () => {
            return ''
        }
    }
})

const md = <Ref>ref()

const emit = defineEmits([
    'update:modelValue'
])
</script>
