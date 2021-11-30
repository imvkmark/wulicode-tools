<template>
    <template v-if="get(attr, 'check-all', false)">
        <ElCheckbox v-model="trans.checkAll" :indeterminate="trans.isIndeterminate" @change="onCheckAll">全选</ElCheckbox>
    </template>
    <ElCheckboxGroup v-model="val" :disabled="get(attr, 'disabled', false)"
        :min="get(attr, 'min')" :max="get(attr, 'max')">
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
import { defineProps, onMounted, reactive, ref, watch } from 'vue';
import { get, map } from 'lodash-es';

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

const trans = reactive({
    isIndeterminate: true,
    checkAll: false,
    allKeys: <any>[]
})

const onCheckAll = (checked: boolean) => {
    if (checked) {
        val.value = trans.allKeys;
        trans.checkAll = true;
    } else {
        val.value = [];
        trans.checkAll = false;
    }
    trans.isIndeterminate = false;
}

const emit = defineEmits([
    'change'
])

const val = ref(<any>[]);

watch(() => val.value, (newVal) => {
    trans.isIndeterminate = newVal.length > 0 && newVal.length < trans.allKeys.length;
    trans.checkAll = newVal.length === trans.allKeys.length;

    emit('change', {
        name: props.name,
        value: newVal
    })
})

onMounted(() => {
    val.value = Array.isArray(props.value) ? props.value : [];
    const isComplex = get(props.attr, 'complex');
    trans.allKeys = isComplex ? map(get(props.attr, 'options', []), (item) => {
        return get(item, 'value')
    }) : map(get(props.attr, 'options', []), (item, key) => {
        return key;
    })
})
</script>