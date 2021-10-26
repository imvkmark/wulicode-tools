<template>
    <h2>文本输入</h2>
    <div class="main-area main-mono">
        <div class="main-content">
            <el-row :gutter="20">
                <el-col :span="24">
                    <form-widget :items="trans.items" :title="trans.title" :model="trans.model"></form-widget>
                </el-col>
            </el-row>
        </div>
    </div>
</template>
<script lang="ts" setup>
import { onMounted, reactive } from 'vue';
import { apiDemoFormText } from '@/services/demo';
import FormWidget from '@/components/form/FormWidget.vue';
import { get } from 'lodash-es';

const trans = reactive({
    title: '',
    items: [],
    model: {}
})
onMounted(() => {
    apiDemoFormText({}, 'get').then(({ data }) => {
        console.log(data);
        trans.title = get(data, 'title');
        trans.items = get(data, 'items');
        trans.model = get(data, 'model');
    })
})
</script>

<style scoped lang="less">
@import '../../assets/style/vars';
</style>
