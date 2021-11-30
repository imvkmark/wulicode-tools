<template>
    <ElInput v-model="val" :disabled="get(attr, 'disabled', false)" :clearable="get(attr, 'clearable', false)"
        :show-word-limit="get(attr, 'show-word-limit', false)"
        :placeholder="get(attr, 'placeholder', '')"
        :maxlength="get(attr, 'maxlength', '')"
    >
        <template #suffix v-if="get(attr, 'suffix-icon', '')">
            <el-icon class="el-input__icon">
                <component :is="get(icon, get(attr, 'suffix-icon', ''))"/>
            </el-icon>
        </template>
        <template #prefix v-if="get(attr, 'prefix-icon', '')">
            <el-icon class="el-input__icon">
                <component :is="get(icon, get(attr, 'prefix-icon', ''))"/>
            </el-icon>
        </template>
    </ElInput>
</template>
<script lang="ts" setup>
import { defineProps, onMounted, ref, watch } from 'vue';
import { get } from 'lodash-es';
import { icon } from '@/utils/icon';

console.log(icon);

const props = defineProps({
    name: String,
    attr: Object,
    value: {
        type: String,
        default: ''
    }
})

const emit = defineEmits([
    'change'
])

const val = ref('');

watch(() => val.value, (newVal) => {
    emit('change', {
        name: props.name,
        value: newVal
    })
})

onMounted(() => {
    val.value = props.value;
})
</script>