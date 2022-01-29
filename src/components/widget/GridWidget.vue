<template>
    <div :class="{'py--form':true, ...sizeClass(trans.size)}">
        <h3 class="form-title" v-if="title">
            {{ title }}
            <small v-if="description">{{ description }}</small>
        </h3>
        <!-- 表格数据 -->
        <ElTable :data="grid.rows" border stripe v-loading="grid.loading">
            <template v-for="col in cols" :key="col">
                <ElTableColumn :prop="get(col, 'field')" :width="get(col, 'width', '')" :label="get(col, 'label')">
                    <template #default="scope">
                        <ColumnText v-if="get(col, 'type') === 'text'" :ellipsis="get(col, 'ellipsis', false)"
                            :value="get(scope.row, String(get(col, 'field')))"/>
                        <ColumnLink v-else-if="get(col, 'type') === 'link'" :ellipsis="get(col, 'ellipsis', false)"
                            :value="JSON.parse(get(scope.row, String(get(col, 'field'))))"/>
                        <ColumnImage v-else-if="get(col, 'type') === 'image'"
                            :value="JSON.parse(get(scope.row, String(get(col, 'field'))))"/>
                        <ColumnDownload v-else-if="get(col, 'type') === 'download'"
                            :value="JSON.parse(get(scope.row, String(get(col, 'field'))))"/>
                        <span v-else>
                            {{ get(scope.row, String(get(col, 'field'))) }}
                        </span>
                    </template>
                </ElTableColumn>
            </template>
        </ElTable>
        <div class="pagination">
            <ElPagination :page-sizes="pageSizes" :total="grid.total" background
                layout="sizes,prev, pager, next, total"
                v-model:page-size="pagesizeRef"
                v-model:current-page="pageRef"/>
        </div>
    </div>
</template>
<script lang="ts" setup>
import { computed, onMounted, reactive, ref, watch } from 'vue';
import { get, merge } from 'lodash-es';
import { sizeClass } from '@/utils/helper';
import { useStore } from '@/store';
import { apiGrid } from "@/services/demo";
import ColumnText from "@/components/table/ColumnText.vue";
import ColumnLink from "@/components/table/ColumnLink.vue";
import ColumnImage from "@/components/table/ColumnImage.vue";
import ColumnDownload from "@/components/table/ColumnDownload.vue";

const log = console;
const props = defineProps({
    title: String,
    description: String,
    pageSizes: {
        type: Array,
        default: () => {
            return [15]
        }
    },
    url: {
        type: String,
        default: () => {
            return ''
        }
    },
    cols: {
        type: Array,
        default: () => {
            return []
        }
    },
})
const store = useStore();
const trans = reactive({
    size: computed(() => store.state.size)
})
const pagesizeRef = ref(15)
const pageRef = ref(1)
const grid = reactive({
    rows: [],
    total: 0,
    loading: false
})

const params = reactive({
    page: 1,
    pagesize: 15
})

const emit = defineEmits([
    'submit'
])

// 监听多个 Ref
watch([pagesizeRef, pageRef], ([pagesize, page]) => {
    params.pagesize = pagesize;
    params.page = page;
    onLoad()
})

const onLoad = () => {
    if (!props.url) {
        return;
    }
    grid.loading = true
    apiGrid(props.url, merge({
        _query: 1
    }, params), 'get').then(({ data }) => {
        console.log(data)
        grid.rows = get(data, 'list');
        grid.total = get(data, 'total');

        grid.loading = false;
    })
}

// Url 初始赋值,请求第一页
watch(() => props.url, (newVal, oldVal) => {
    if (oldVal === '' && newVal) {
        onLoad();
    }
})

onMounted(() => {
    onLoad();
})

</script>

<style scoped lang="less">
@import '../../assets/style/vars';

.pagination {
    padding-top: var(--wc-pagination-padding)
}
</style>
