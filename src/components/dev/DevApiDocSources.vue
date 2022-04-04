<template>
    <div class="source">
        <ElRow :gutter="4">
            <ElCol :span="24">
                <ElForm label-position="left" label-width="80px">
                    <ElFormItem label="标题">
                        <ElInput v-model="trans.title" placeholder="标题"/>
                    </ElFormItem>
                    <ElFormItem label="文档地址">
                        <ElInput v-model="trans.url" placeholder="文档地址所在的目录"/>
                    </ElFormItem>
                    <ElFormItem>
                        <ElButton type="primary" class="py--block" @click="addSource">添加文档</ElButton>
                    </ElFormItem>
                </ElForm>
            </ElCol>
        </ElRow>
        <ElRow :gutter="4">
            <ElCol>
                <ElTable :data="sources">
                    <ElTableColumn label="标题" width="100" align="center" prop="title">
                    </ElTableColumn>
                    <ElTableColumn label="KEY" align="center" prop="key">
                    </ElTableColumn>
                    <ElTableColumn width="100" align="center">
                        <template #default="scope">
                            <ElButton :type="scope.row.active? 'success' : 'info'" size="small" circle @click="activeSource(scope.row)">
                                <XIcon type="check"/>
                            </ElButton>
                            <ElPopconfirm :title="`确定要移除${get(scope.row, 'title')}?`" @confirm="deleteSource(scope.row)">
                                <template #reference>
                                    <ElButton circle type="danger" size="small" plain>
                                        <XIcon type="delete"/>
                                    </ElButton>
                                </template>
                            </ElPopconfirm>
                        </template>
                    </ElTableColumn>
                </ElTable>
            </ElCol>
        </ElRow>
        <ElRow :gutter="4">
            <ElCol>
                <h5 style="margin-bottom: 0.2rem;">可用文档</h5>
                <ElTable :data="domains">
                    <ElTableColumn label="域名" prop="domain"/>
                    <ElTableColumn width="100" align="center">
                        <template #default="scope">
                            <ElButton circle type="primary" size="small" plain @click="refreshDomain(scope.row)">
                                <XIcon type="refresh"/>
                            </ElButton>
                            <ElButton circle type="primary" size="small" plain @click="addDomain(scope.row)">
                                <XIcon type="document-add"/>
                            </ElButton>
                        </template>
                    </ElTableColumn>
                </ElTable>
            </ElCol>
        </ElRow>
    </div>
</template>
<script lang="ts" setup>
import { reactive } from 'vue'
import { find, get } from "lodash-es";
import { toast } from "@/utils/util";
import XIcon from "@/components/element/XIcon.vue";
import { isUrl } from "@/utils/helper";
import { apiMiscApidocAdd, apiMiscApidocDelete, apiMiscApidocRefresh } from "@/services/misc";


const props = defineProps({
    sources: {
        type: Array,
        default: () => []
    },
    domains: {
        type: Array,
        default: () => []
    }
});

const trans = reactive({
    title: '',
    url: '',
});

const emit = defineEmits([
    'active',
    'delete',
    'refresh',
    'add'
])


const activeSource = (row: any) => {
    emit('active', get(row, 'key'));
}

const addDomain = (row: any) => {
    trans.url = get(row, 'domain')
}

const refreshDomain = (row: any) => {
    apiMiscApidocRefresh({
        url: get(row, 'domain')
    }).then(({ success, message }) => {
        toast(message, success);
        if (success) {
            emit('refresh');
        }
    })
}

const addSource = () => {
    if (!trans.title || !trans.url) {
        toast('请完善输入数据', false);
        return;
    }
    if (!isUrl(trans.url)) {
        toast('请输入正确的地址', false);
        return;
    }
    if (find(props.sources, { title: trans.title })) {
        toast('已存在标识, 无法添加', false);
        return;
    }
    apiMiscApidocAdd({
        title: trans.title,
        url: trans.url
    }).then(({ success, message }) => {
        toast(message, success);
        if (success) {
            emit('add');
            trans.title = '';
            trans.url = '';
        }
    })
}


const deleteSource = (row: any) => {
    apiMiscApidocDelete({
        key: get(row, 'key'),
    }).then(({ success, message }) => {
        toast(message, success);
        if (success) {
            emit('delete');
        }
    })
}
</script>

<style lang="less" scoped>
.source {
    min-width: 300px;
}
</style>
