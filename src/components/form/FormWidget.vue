<template>
    <div class="py--form">
        <h3 class="form-title" v-if="title">
            {{ title }}
            <small v-if="description">{{ description }}</small>
        </h3>
        <!-- 表格数据 -->
        <el-form :model="transModel" :rules="schema" ref="formRef"
            :label-position="get(attr, 'label-position', 'right')"
            :label-suffix="get(attr, 'label-suffix', '')" :hide-required-asterisk="get(attr, 'hide-required-asterisk', false)"
            :show-message="get(attr, 'show-message', true)" :inline-message="get(attr, 'inline-message', false)"
            :status-icon="get(attr, 'status-icon', false)" :size="get(attr, 'size', '')"
            :validate-on-rule-change="get(attr, 'validate-on-rule-change', true)"
            :inline="get(attr, 'inline', false)" :disabled="get(attr, 'disabled', false)">

            <template v-for="item in props.items" :key="get(item , 'field.name')">
                <!--  hidden 不进行处理, 因为不修改模型数据  -->
                <el-form-item :label="get(item , 'item.label')" v-if="!includes(['hidden'], get(item , 'type'))"
                    :rules="get(item, 'item.rules')"
                    :prop="get(item , 'field.name')">
                    <!--  text -->
                    <field-text :attr="get(item, 'field')" v-if="get(item , 'type') === 'text'" @change="onChange"
                        :value="get(transModel, get(item, 'field.name'))"/>
                </el-form-item>
            </template>

            <el-form-item>
                <el-button type="primary" v-if="indexOf(buttons, 'submit')" @click="onSubmit">确认</el-button>
                <el-button v-if="indexOf(buttons, 'reset')" @click="onReset">重置</el-button>
                <el-button @click="onRules">规则</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>
<script lang="ts" setup>
import { defineProps, ref } from 'vue';
import { clone, get, includes, indexOf, set } from 'lodash-es';
import FieldText from '@/components/form/FieldText.vue';
import { ElForm } from 'element-plus';
import useValidation from '@/composables/useValidation';

const props = defineProps({
    title: String,
    loading: Boolean,
    description: String,
    attr: Object,
    items: Array,
    rules: Object,
    model: {
        type: Object,
        default: () => {
            return {}
        }
    },
    buttons: Array
})

const transModel = ref({});

//ts-ignore
const { schema } = useValidation(props, transModel)


const formRef: any = ref<InstanceType<typeof ElForm>>();
const emit = defineEmits([
    'submit'
])

const onChange = (field: any) => {
    let inter = clone(transModel.value)
    set(inter, get(field, 'name'), get(field, 'value'));
    transModel.value = inter;
}

const onSubmit = () => {
    formRef.value.validate().then((success: any) => {
        console.log(success, transModel.value);
        emit('submit', transModel.value);
    })
}
const onRules = () => {
    console.log(schema.value, 'parsed');
    console.log(props.rules, 'plain');
}

const onReset = () => {
    formRef.value.resetFields();
}


</script>

<style scoped lang="less">
@import '../../assets/style/vars';
</style>
