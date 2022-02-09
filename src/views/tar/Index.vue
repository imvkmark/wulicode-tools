<template>
    <PxMain :title="trans.title" v-loading="trans.loading">
        <FormWidget v-if="type === 'form'" :attr="form.attr" :description="form.description" :items="form.items"
            :title="form.title" :model="form.model" @submit="onSubmit"/>
        <GridWidget v-if="type === 'grid'" :cols="grid.cols" :url="grid.url" :page-sizes="grid.pageSizes"/>
    </PxMain>
</template>
<script lang="ts" setup>
import { onMounted, reactive, ref, watch } from 'vue';
import { apiDemo } from '@/services/demo';
import FormWidget from '@/framework/components/widget/FormWidget.vue';
import { get } from 'lodash-es';
import PxMain from '@/components/base/PxMain.vue';
import { useRouter } from 'vue-router';
import { ElNotification } from 'element-plus';
import { useStore } from "@/store";
import GridWidget from "@/framework/components/widget/GridWidget.vue";

let router = useRouter();

const store = useStore();
const trans = reactive({
    type: '',
    path: '',
    title: '',
    loading: false
})
const form = reactive({
    title: '',
    description: '',
    items: [],
    model: {},
    attr: {}
})

const grid = reactive({
    rows: [],
    cols: [],
    url: '',
    pageSizes: [15]
})

const type = ref('');
const path = ref('');
const setPath = () => {
    let type = String(router.currentRoute.value.params.type);
    let name = router.currentRoute.value.name;
    if (name === 'form.index') {
        path.value = `form/${type}`
    }
    if (name === 'grid.index') {
        path.value = `grid/${type}`
    }
}

const doRequest = () => {
    trans.loading = true;
    setPath()
    apiDemo(path.value, {}, 'get').then(({ data }) => {
        type.value = get(data, 'type');
        if (type.value === 'form') {
            trans.title = get(data, 'title');
            form.title = get(data, 'title');
            form.description = get(data, 'description');
            form.items = get(data, 'items');
            form.model = get(data, 'model');
            form.attr = get(data, 'attr');
        } else if (type.value === 'grid') {
            trans.title = get(data, 'title');
            grid.cols = get(data, 'cols');
            grid.url = get(data, 'url');
            grid.pageSizes = get(data, 'page_sizes');
        }

        trans.loading = false
    })
}

const onSubmit = (data: any) => {
    setPath()
    apiDemo(path.value, data, 'post').then(({ message, success }) => {
        ElNotification({
            title: success ? '成功' : '失败',
            message
        })
    })
}

watch(() => router.currentRoute.value.params.type, () => {
    doRequest();
}, { deep: true })
onMounted(() => {
    doRequest();
})
</script>

<style scoped lang="less">
@import '../../assets/style/vars';
</style>
