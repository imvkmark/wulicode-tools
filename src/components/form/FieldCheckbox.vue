<template>
    <ElCheckboxGroup v-model="val" :disabled="get(attr, 'disabled', false)"
        :min="get(attr, 'min')" :max="get(attr, 'max')"
        :indeterminate="get(attr, 'indeterminate', false)">
        <template v-if="!get(attr, 'button', false) && !get(attr, 'complex', false)">
            <ElCheckbox :label="key" v-for="(label, key) in get(attr, 'options')" :key="key">{{ label }}</ElCheckbox>
        </template>
        <template v-if="get(attr, 'button', false) && !get(attr, 'complex', false)">
            <ElCheckboxButton :label="key" v-for="(label, key) in get(attr, 'options')" :key="key">{{ label }}</ElCheckboxButton>
        </template>
        <template v-if="!get(attr, 'button', false) && get(attr, 'complex', false)">
            <ElCheckbox :label="get(item, 'value')" :disabled="get(item, 'disabled')" v-for="item in get(attr, 'options')"
                :key="get(item, 'value')">{{ get(item, 'label') }}
            </ElCheckbox>
        </template>
        <template v-if="get(attr, 'button', false) && get(attr, 'complex', false)">
            <ElCheckboxButton :label="get(item, 'value')" :disabled="get(item, 'disabled')" v-for="item in get(attr, 'options')"
                :key="get(item, 'value')">{{ get(item, 'label') }}
            </ElCheckboxButton>
        </template>
    </ElCheckboxGroup>
</template>
<script lang="ts" setup>
import { defineProps, onMounted, ref, watch } from 'vue';
import { get } from 'lodash-es';

const props = defineProps({
    name: String,
    attr: Object,
    value: {
        type: Array,
        default: () => {
            return []
        }
    }
})

const emit = defineEmits([
    'change'
])

const val = ref(<any>[]);

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