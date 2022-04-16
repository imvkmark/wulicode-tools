<template>
    <div class="source">
        <ElRow :gutter="4">
            <ElCol :span="24">
                <ElForm label-position="left" label-width="80px">
                    <ElFormItem label="类型">
                        <ElRadioGroup v-model="trans.type" placeholder="标题">
                            <ElRadio label="doc">文档</ElRadio>
                            <ElRadio label="local">本地</ElRadio>
                        </ElRadioGroup>
                    </ElFormItem>
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
                    <ElTableColumn label="标题" width="100" align="center">
                        <template #default="scope">
                            <ElTag :type="scope.row.type === 'local'? 'info' : 'success'" size="small">
                                {{ scope.row.title }}
                            </ElTag>
                        </template>
                    </ElTableColumn>
                    <ElTableColumn label="KEY" align="center" prop="key">
                    </ElTableColumn>
                    <ElTableColumn width="133" align="center">
                        <template #default="scope">
                            <ElButton v-if="scope.row.type === 'local'" type="primary" size="small" plain circle @click="refreshLocal(scope.row)">
                                <XIcon type="refresh"/>
                            </ElButton>
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
                <h5 style="margin-bottom: 0.2rem;">公共文档</h5>
                <ElTable :data="domains">
                    <ElTableColumn label="域名" prop="domain"/>
                    <ElTableColumn width="130" align="center">
                        <template #default="scope">
                            <ElButton circle type="primary" size="small" plain @click="openDomain(scope.row)">
                                <XIcon type="reading"/>
                            </ElButton>
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
        <ElAlert :closable="false" type="info">
            类型:(文档) <br>
            示例 http://start.wulicode.com/docs/web, 无后缀 '/' <br>
            文档的访问地址, 无后缀 '/' <br>
            类型:(本地) <br>
            示例 : http://start.duoli.com/api_v1/system/core/doc?type=web <br>
            文档通过接口解析之后的地址
        </ElAlert>
    </div>
</template>
<script lang="ts" setup>
import { reactive } from 'vue'
import { find, get } from "lodash-es";
import { toast } from "@/utils/util";
import XIcon from "@/components/element/XIcon.vue";
import { apiMiscApidocAdd, apiMiscApidocDelete, apiMiscApidocLocal, apiMiscApidocRefresh } from "@/services/misc";
import { isUrl } from "../../../pkg/core/utils/validate";
import { appRequest } from "@/utils/request";


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
    type: 'doc',
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
const refreshLocal = (row: any) => {
    appRequest({
        method: 'post',
        url: get(row, 'url')
    }).then(({ success, message, data }) => {
        if (!success) {
            toast(message, success)
        } else {
            apiMiscApidocLocal({
                title: get(row, 'title'),
                url: get(row, 'url'),
                content: get(data, 'content')
            }).then(({ success, message }) => {
                toast(message, success);
                emit('add');
                trans.title = '';
                trans.url = '';
            })
        }
    }).catch(({ success, message }) => {
        toast(success, message)
    })
}

const addDomain = (row: any) => {
    trans.url = get(row, 'domain')
}
const openDomain = (row: any) => {
    let url = get(row, 'domain');
    window.open(url);
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
        toast('请完善输入数据');
        return;
    }
    if (!isUrl(trans.url)) {
        toast('请输入正确的地址');
        return;
    }
    if (find(props.sources, { title: trans.title })) {
        toast('已存在标识, 无法添加');
        return;
    }
    if (trans.type === 'doc') {
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
    } else {
        appRequest({
            method: 'post',
            url: trans.url
        }).then(({ success, message, data }) => {
            if (!success) {
                toast(message, success)
            } else {
                apiMiscApidocLocal({
                    title: trans.title,
                    url: trans.url,
                    content: get(data, 'content')
                }).then(({ success, message }) => {
                    toast(message, success);
                    emit('add');
                    trans.title = '';
                    trans.url = '';
                })
            }
        }).catch(({ success, message }) => {
            toast(success, message)
        })
    }
}


const deleteSource = (row: any) => {
    apiMiscApidocDelete({
        key: get(row, 'url'),
        type: get(row, 'type'),
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
