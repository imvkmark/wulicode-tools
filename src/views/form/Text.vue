<template>
    <PxMain title="文本输入">
        <div class="main-content">
            <el-row :gutter="20">
                <el-col :span="24">
                    <form-widget :attr="trans.attr" :description="trans.description" :items="trans.items" :title="trans.title"
                        :model="trans.model"
                        :rules="trans.rules"></form-widget>
                </el-col>
            </el-row>
        </div>
    </PxMain>
</template>
<script lang="ts" setup>
import { onMounted, reactive } from 'vue';
import { apiDemoFormText } from '@/services/demo';
import FormWidget from '@/components/form/FormWidget.vue';
import { get } from 'lodash-es';
import PxMain from '@/components/base/PxMain.vue';

const trans = reactive({
    title: '',
    description: '',
    items: [],
    rules: [],
    model: {},
    attr: {}
})
onMounted(() => {
    apiDemoFormText({}, 'get').then(({ data }) => {
        console.log(data);
        trans.title = get(data, 'title');
        trans.description = get(data, 'description');
        trans.items = get(data, 'items');
        trans.model = get(data, 'model');
        trans.rules = get(data, 'rules');
        trans.attr = get(data, 'attr');
    })
})
</script>

<style scoped lang="less">
@import '../../assets/style/vars';
</style>
