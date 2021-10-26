<template>
    <el-input :name="get(attr, 'name')" @input="onInput" :model-value="value"/>
</template>
<script lang="ts" setup>
import { defineProps } from 'vue';
import { get } from 'lodash-es';

const props = defineProps({
    attr: Object,
    value: String
})

const emit = defineEmits([
    'change'
])

const onInput = (val: any) => {
    emit('change', {
        name: get(props.attr, 'name'),
        value: val
    })
}
</script>