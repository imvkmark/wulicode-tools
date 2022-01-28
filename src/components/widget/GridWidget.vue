<template>
    <div :class="{'py--form':true, ...sizeClass(trans.size)}">
        <h3 class="form-title" v-if="title">
            {{ title }}
            <small v-if="description">{{ description }}</small>
        </h3>
        <!-- 表格数据 -->
        <ElTable :data="grid.rows" size="small">
            <template v-for="col in cols" :key="col">
                <ElTableColumn :prop="get(col, 'field')" :label="get(col, 'label')"/>
            </template>
        </ElTable>
        <ElPagination :page-sizes="pageSizes" :total="grid.total" v-model:current-page="gridQuery.page"/>
    </div>
</template>
<script lang="ts" setup>
import { computed, onMounted, reactive, Ref, ref, toRef, watch } from 'vue';
import { clone, get, includes, indexOf, merge, set } from 'lodash-es';
import FieldText from '@/components/form/FieldText.vue';
import { ElForm } from 'element-plus';
import useValidation from '@/composables/useValidation';
import { sizeClass, sizeLt } from '@/utils/helper';
import { useStore } from '@/store';
import FieldTextarea from '@/components/form/FieldTextarea.vue';
import FieldNumber from '@/components/form/FieldNumber.vue';
import FieldRadio from '@/components/form/FieldRadio.vue';
import FieldCheckbox from '@/components/form/FieldCheckbox.vue';
import FieldColor from '@/components/form/FieldColor.vue';
import FieldDate from '@/components/form/FieldDate.vue';
import FieldDateRange from '@/components/form/FieldDateRange.vue';
import FieldTime from '@/components/form/FieldTime.vue';
import FieldTimeRange from '@/components/form/FieldTimeRange.vue';
import FieldSelect from '@/components/form/FieldSelect.vue';
import FieldMultiSelect from '@/components/form/FieldMultiSelect.vue';
import FieldSwitch from '@/components/form/FieldSwitch.vue';
import FieldDivider from '@/components/form/FieldDivider.vue';
import FieldEditor from '@/components/form/FieldEditor.vue';
import FieldFile from '@/components/form/FieldFile.vue';
import FieldMultiFile from '@/components/form/FieldMultiFile.vue';
import FieldCode from "@/components/form/FieldCode.vue";
import { apiGrid } from "@/services/demo";

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

const grid = reactive({
    rows: [],
    total: 0,
})

const gridQuery = reactive({
    page: 1
})
const transModel = ref({});


const emit = defineEmits([
    'submit'
])


const init = () => {
    if (!props.url) {
        return;
    }

    /**
     *{
     *    "list": [],
     *    "pagination": {
     *        "total": 3,
     *        "page": 1,
     *        "size": 15,
     *        "pages": 1
     *    }
     *}
     */
    apiGrid(props.url, merge({
        _query: 1
    }, gridQuery), 'get').then(({ data }) => {
        console.log(data)
        grid.rows = get(data, 'list');
        grid.total = get(data, 'pagination.total');
    })
}
watch(() => props.url, (newVal, oldVal) => {
    if (oldVal === '' && newVal) {

    }
    init();
})

onMounted(() => {
    init();
})

</script>

<style scoped lang="less">
@import '../../assets/style/vars';
</style>
