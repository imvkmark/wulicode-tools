<template>
    <div class="form--widget">
        <h3>{{ title }}</h3>
        <el-form :model="transModel">
            <el-form-item v-for="item in props.items" :key="get(item , 'item.prop')" :label="get(item , 'item.label')"
                :prop="get(item , 'item.prop')">
                <field-text :attr="get(item, 'field')" v-if="get(item , 'type') === 'text'" @change="onChange"
                    :value="get(transModel, get(item, 'field.name'))"/>

            </el-form-item>
        </el-form>
    </div>
</template>
<script lang="ts" setup>
import { defineProps, ref, watch } from 'vue';
import { clone, get, set } from 'lodash-es';
import FieldText from '@/components/form/FieldText.vue';

const props = defineProps({
    title: String,
    items: Array,
    model: Object
})

const transModel = ref();

const onChange = (field: any) => {
    let inter = clone(transModel.value)
    set(inter, get(field, 'name'), get(field, 'value'));
    transModel.value = inter;
}
watch(() => props.model, (newVal) => {
    transModel.value = newVal;
})

</script>

<style scoped lang="less">
@import '../../assets/style/vars';
</style>
