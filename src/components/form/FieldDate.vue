<template>
    <ElDatePicker v-model="val"
        :type="get(attr, 'date-type', '')"
        :format="get(attr, 'format', '')"
        :disabled="get(attr, 'disabled', false)" :placeholder="get(attr, 'placeholder', '')">
    </ElDatePicker>
</template>
<script lang="ts" setup>
import { defineProps, onMounted, ref, watch } from 'vue';
import { get } from 'lodash-es';
import dayjs from 'dayjs';
import advancedFormat from 'dayjs/plugin/advancedFormat';
import weekOfYear from 'dayjs/plugin/weekOfYear';
import timezone from 'dayjs/plugin/timezone';
dayjs.extend(timezone)
dayjs.tz.setDefault("Asia/Shanghai")
dayjs.extend(advancedFormat)
dayjs.extend(weekOfYear)

const props = defineProps({
    name: String,
    attr: Object,
    value: {
        type: String,
        default: () => {
            return ''
        }
    }
})


const emit = defineEmits([
    'change'
])

const val: any = ref('');

watch(() => val.value, (newVal) => {
    let formatVal = '';
    if (newVal) {
        console.log(get(props.attr, 'format'), newVal);
        formatVal = dayjs(newVal).format(get(props.attr, 'format'));
    }
    emit('change', {
        name: props.name,
        value: formatVal
    })
})

onMounted(() => {
    val.value = props.value;
})
</script>