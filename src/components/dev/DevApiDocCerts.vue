<template>
    <div class="doc-header">
        <ElRow :gutter="4">
            <ElCol :span="16">
                <ElInput v-model="trans.cert"/>
            </ElCol>
            <ElCol :span="8">
                <ElButton type="primary" class="py--block" @click="addCert">添加凭证</ElButton>
            </ElCol>
        </ElRow>
        <ElRow :gutter="4">
            <ElCol>
                <ElTabs v-model="trans.current" :closable="certsRef.length > 1" @edit="onTabEdit">
                    <ElTabPane v-for="cert in trans.certs" :label="get(cert, 'label')" :name="get(cert, 'label')" :key="cert">
                        <ElInput :model-value="cert.label" @update:model-value="updateCertLabel">
                            <template #prepend>凭证名称</template>
                        </ElInput>
                        <ElInput :model-value="cert.url" @update:model-value="updateCertUrl" style="margin-top:0.2rem">
                            <template #prepend>请求地址</template>
                        </ElInput>
                        <ElButton type="warning" style="margin-top:0.2rem" size="small" plain @click="addHeader(cert)">添加 Header</ElButton>
                        <ElTable :data="cert['headers']">
                            <ElTableColumn label="Header" width="100" align="center">
                                <template #default="scope">
                                    <ElInput v-model="scope.row.key" placeholder="name"/>
                                </template>
                            </ElTableColumn>
                            <ElTableColumn label="值" align="center">
                                <template #default="scope">
                                    <ElInput v-model="scope.row.value" placeholder="value"/>
                                </template>
                            </ElTableColumn>
                            <ElTableColumn width="60" align="center">
                                <template #default="scope">
                                    <ElButton circle type="danger" size="small" plain @click="removeHeader(scope.row)">
                                        <XIcon type="delete"/>
                                    </ElButton>
                                </template>
                            </ElTableColumn>
                        </ElTable>
                        <ElButton type="primary" style="margin-top:0.2rem" plain size="small" @click="addParam(cert)">添加 Param</ElButton>
                        <ElTable :data="cert['params']">
                            <ElTableColumn label="参数" width="100" align="center">
                                <template #default="scope">
                                    <ElInput v-model="scope.row.key" placeholder="name"/>
                                </template>
                            </ElTableColumn>
                            <ElTableColumn label="值" align="center">
                                <template #default="scope">
                                    <ElInput v-model="scope.row.value" placeholder="value"/>
                                </template>
                            </ElTableColumn>
                            <ElTableColumn width="60" align="center">
                                <template #default="scope">
                                    <ElButton circle type="danger" size="small" plain @click="removeParam(scope.row)">
                                        <XIcon type="delete"/>
                                    </ElButton>
                                </template>
                            </ElTableColumn>
                        </ElTable>
                        <ElButton style="margin-top: 0.2rem;" type="primary" :disabled="get(cert, 'active')" @click="setDefault(cert)">
                            {{ get(cert, 'active') ? '当前默认凭证' : '使用此凭证作为默认凭证' }}
                        </ElButton>
                    </ElTabPane>
                </ElTabs>
            </ElCol>
        </ElRow>
    </div>
</template>
<script lang="ts" setup>
import { computed, onMounted, reactive, ref, watch } from 'vue'
import { filter, find, get, indexOf, map, set } from "lodash-es";
import { localStore, toast } from "@/utils/util";
import XIcon from "@/components/element/XIcon.vue";
import { pyStorageDevApidocCertsKey } from "@/utils/conf";
import { emitter } from "@/bus/mitt";

const props = defineProps({
    keyName: {
        type: String,
        required: true,
        default: '',
    }
})

const certsRef: any = ref([]);
const trans = reactive({
    certs: computed(() => {
        return filter(certsRef.value, { key: props.keyName })
    }),
    active: computed(() => {
        return find(certsRef.value, { active: true, key: props.keyName })
    }),
    cert: '',
    current: ''
})

const fetchCurrent = () => {
    return find(certsRef.value, {
        label: trans.current,
        key: props.keyName,
    });
}

const removeHeader = (header: any) => {
    let current = fetchCurrent();
    let index = indexOf(get(current, 'headers'), header);
    if (index > -1) {
        current.headers.splice(index, 1);
    }
}

const updateCertLabel = (value: any) => {
    if (value === '') {
        return;
    }
    let current = fetchCurrent()
    current.label = value;
}
const updateCertUrl = (value: any) => {
    let current = fetchCurrent()
    current.url = value;
}

const removeParam = (param: any) => {
    let current = fetchCurrent();
    let index = indexOf(get(current, 'params'), param);
    if (index > -1) {
        current.params.splice(index, 1);
    }
}

const setDefault = (cert: any) => {
    let label = get(cert, 'label');
    certsRef.value = map(certsRef.value, function (item: any) {
        if (get(item, 'key') !== props.keyName) {
            return item;
        }
        if (get(item, 'label') === label) {
            set(item, 'active', true);
        } else {
            set(item, 'active', false);
        }
        return item;
    })
}

/**
 * 删除 Tab
 * @param label
 */
const onTabEdit = (label: string) => {
    certsRef.value = filter(certsRef.value, function (cert) {
        return cert.label !== label && cert.key === props.keyName;
    })
    let one = find(certsRef.value, { key: props.keyName });
    if (one) {
        set(one, 'active', true);
    }
}

const addHeader = (cert: any) => {
    cert['headers'].push({
        key: '',
        value: '',
    })
}
const addParam = (cert: any) => {
    cert['params'].push({
        key: '',
        value: '',
    })
}


const addCert = () => {
    if (!trans.cert) {
        toast('请输入凭证', true);
        return;
    }
    let allCerts = filter(certsRef.value, function (cert) {
        return cert.label === trans.cert && cert.key === props.keyName
    })
    if (allCerts.length > 0) {
        toast('已存在凭证, 无需添加', true);
        return;
    }
    certsRef.value.push({
        label: trans.cert,
        active: false,
        key: props.keyName,
        headers: [],
        params: [],
    })
}

// 同步Certs
watch(() => certsRef.value, () => {
    localStore(pyStorageDevApidocCertsKey(), certsRef.value);
    emitter.emit('dev:apidoc-certs-update', certsRef.value);
}, { deep: true })


onMounted(() => {
    let hds = [
        {
            label: '默认',
            key: props.keyName,
            headers: [{ key: '', value: '' }],
            params: [{ key: '', value: '' }]
        }
    ]
    let storeHeaders: any = localStore(pyStorageDevApidocCertsKey())
    if (storeHeaders) {
        hds = storeHeaders
    }
    certsRef.value = hds;
    trans.current = get(trans.active, 'label');
})
</script>

<style lang="less" scoped>
.doc-header {
    padding: 0.2rem 0.5rem;
    min-width: 300px;
}
</style>
