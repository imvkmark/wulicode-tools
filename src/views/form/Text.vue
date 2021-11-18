<template>
    <PxMain title="文本输入">
        <form-widget v-loading="trans.loading" :attr="trans.attr" :description="trans.description" :items="trans.items" :title="trans.title"
            :model="trans.model"
            :rules="trans.rules"></form-widget>
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
    loading: false,
    items: [],
    rules: [],
    model: {},
    attr: {}
})
onMounted(() => {
    trans.loading = true;
    apiDemoFormText({}, 'get').then(({ data }) => {
        trans.loading = false;
        trans.title = get(data, 'title');
        trans.description = get(data, 'description');
        trans.items = get(data, 'items');
        trans.model = get(data, 'model');
        trans.rules = get(data, 'rules');
        trans.attr = get(data, 'attr');
        console.log('🐢', trans.rules)
    })
})
</script>

<style scoped lang="less">
@import '../../assets/style/vars';
</style>
