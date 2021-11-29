<template>
    <div :class="{'py--form':true, ...sizeClass(trans.size)}">
        <h3 class="form-title" v-if="title">
            {{ title }}
            <small v-if="description">{{ description }}</small>
        </h3>
        <!-- 表格数据 -->
        <el-form :model="transModel" :rules="schema" ref="formRef"
            :label-position="sizeLt('lg', trans.size)? 'right': 'top'"
            :label-width="get(attr, 'label-width', 'auto')"
            :size="get(attr, 'size', '')"
            :inline="get(attr, 'inline', false)" :disabled="get(attr, 'disabled', false)">

            <template v-for="item in props.items" :key="get(item , 'name')">
                <!--  hidden 不进行处理, 因为不修改模型数据  -->
                <el-form-item :label="get(item , 'label')" v-if="!includes(['hidden'], get(item , 'type'))"
                    :prop="get(item , 'name')">
                    <!--  text -->
                    <field-text :attr="get(item, 'field')" v-if="get(item , 'type') === 'text'" @change="onChange"
                        :value="get(transModel, get(item, 'name'))"/>
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
import { computed, defineProps, reactive, ref } from 'vue';
import { clone, get, includes, indexOf, set } from 'lodash-es';
import FieldText from '@/components/form/FieldText.vue';
import { ElForm } from 'element-plus';
import useValidation from '@/composables/useValidation';
import { sizeClass, sizeLt } from '@/utils/helper';
import { useStore } from '@/store';

const props = defineProps({
    title: String,
    loading: Boolean,
    description: String,
    attr: Object,
    items: Array,
    model: {
        type: Object,
        default: () => {
            return {}
        }
    },
    buttons: Array
})
const store = useStore();
const trans = reactive({
    size: computed(() => store.state.size)
})
const transModel = ref({});
const obj = ref({
    str: {
        required: '{0}这里是自定义的提示'
    }
});

//ts-ignore
const { schema } = useValidation(props, transModel, obj)


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
}

const onReset = () => {
    formRef.value.resetFields();
}


</script>

<style scoped lang="less">
@import '../../assets/style/vars';
</style>
