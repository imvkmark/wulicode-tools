<template>
    <div class="dev--apidoc">
        <div class="group">
            <ElScrollbar>
                <div class="group-search">
                    <h3>
                        接口查询
                        <ElTag>{{ get(source.active, 'title') }}</ElTag>
                        <span class="group-setting">
                            <XIcon type="setting" @click="manageSource"/>
                        </span>
                    </h3>
                    <ElInput v-model="source.kw" clearable placeholder="输入关键词来查询"/>
                </div>
                <template v-for="(items, key) in sourceGrouped" :key="key">
                    <h4>{{ key }}</h4>
                    <ul>
                        <template v-for="(item, k) in items" :key="k">
                            <li @click="selectUrl(get(item, 'url'))" :class="{active: api.url === get(item, 'url')}">
                                <span class="text-ellipsis">{{
                                        get(item, 'title')
                                    }} {{ get(item, 'description') ? '-' + stripTags(get(item, 'description')) : '' }} </span>
                                <span class="group-url">{{ get(item, 'url') }}</span>
                            </li>
                        </template>
                    </ul>
                </template>
            </ElScrollbar>
        </div>
        <div class="form">
            <ElScrollbar>
                <h3>
                    请求参数
                    <ElTag size="small" type="success">凭证:
                        <template v-if="get(api.cert, 'label')">{{ get(api.cert, 'label') }}</template>
                        <template v-else>无</template>
                    </ElTag>
                    <span class="form-setting">
                        <XIcon type="setting" @click="manageCert"/>
                    </span>
                    <span :class="{'form-save' : true, 'form-saving': apiUploading}">
                        <XIcon type="clock" v-if="apiUploading"/>
                        <XIcon type="cloudy" v-else @click="saveCert"/>
                    </span>
                    <span class="form-login">
                        <XIcon type="user" @click="certLogin"/>
                    </span>
                </h3>
                <h4>{{ api.title }}</h4>
                <p v-if="api.description">
                    {{ stripTags(api.description) }}
                </p>
                <p>
                    <ElTag type="info">{{ api.method }}</ElTag>
                    <ElTag type="warning" @click="onCopyUrl" style="cursor:pointer;"> {{ api.urlReplaced }}</ElTag>
                </p>
                <ElForm label-position="top" class="form-form" @keyup.enter="onRequest">
                    <ElDivider v-if="api.parameters.length">参数</ElDivider>
                    <ElFormItem v-for="param in api.parameters" :key="param">
                        <ElInput v-model="apiParamsRef[get(param, 'field')]">
                            <template #suffix>
                                <ElTooltip :content="stripTags(get(param, 'description'))" placement="top" width="200px">
                                    <span style="position: relative;top:2px;left:2px;cursor: pointer"><XIcon type="chat-line-round"/></span>
                                </ElTooltip>
                            </template>
                        </ElInput>
                        <template #label>
                            <span class="text-ellipsis">
                                <span class="required" v-if="!get(param, 'optional', false)">{{ !get(param, 'optional', false) ? '*' : '' }}</span>
                               {{ get(param, 'field') }}  ({{ get(param, 'type') }}) {{ get(param, 'title') }}
                                <em v-html="stripTags(get(param, 'description'))"/>
                            </span>
                        </template>
                    </ElFormItem>
                    <ElDivider v-if="api.queries.length">查询</ElDivider>
                    <ElFormItem v-for="query in api.queries" :key="query" class="apidoc-request_label">
                        <ElInput v-model="apiQueryRef[get(query, 'field')]">
                            <template #suffix>
                                <ElTooltip :content="stripTags(get(query, 'description'))" placement="top" width="200px">
                                    <span style="position: relative;top:2px;left:2px;cursor: pointer"><XIcon type="chat-line-round"/></span>
                                </ElTooltip>
                            </template>
                            <!-- 预留给刷新 & 生成工具
                            <template #prefix>
                                <span style="position: relative;top:2px;left:2px;cursor: pointer"><XIcon type="refresh"/></span>
                            </template>
                            -->
                        </ElInput>
                        <template #label>
                            <span class="text-ellipsis">
                                <span class="required" v-if="!get(query, 'optional', false)">{{ !get(query, 'optional', false) ? '*' : '' }}</span>
                                {{ get(query, 'field') }}({{ get(query, 'type') }}) {{ get(query, 'title') }}
                                <em v-html="stripTags(get(query, 'description'))"/>
                            </span>
                        </template>
                    </ElFormItem>
                    <div class="request">
                        <ElButton type="warning" @click="onRequest">请求</ElButton>
                    </div>
                </ElForm>
            </ElScrollbar>
        </div>
        <div class="result">
            <h3>请求结果和文档</h3>
            <ElTabs v-model="result.tab">
                <ElTabPane label="请求结果" name="result">
                    <ElAlert style="margin-bottom: 0.5rem;" v-if="result.message" :title="result.message" :type="result.status > 200 ? 'error' : 'success'"
                        :closable="false"/>
                    <JsonViewer :value="resultResp" boxed :expanded="true" copyable/>
                </ElTabPane>
                <ElTabPane label="文档" name="document" v-if="!isEmpty(api.document)">
                    <ElTable :data="api.document">
                        <ElTableColumn label="字段" width="160" align="center" prop="field">
                        </ElTableColumn>
                        <ElTableColumn label="类型" width="100" align="center">
                            <template #default="scope">
                                {{ scope.row.type }} <span v-if="scope.row.optional" style="color: red">*</span>
                            </template>
                        </ElTableColumn>
                        <ElTableColumn label="说明">
                            <template #default="scope">
                                {{ stripTags(scope.row.description) }}
                            </template>
                        </ElTableColumn>
                    </ElTable>
                </ElTabPane>
                <ElTabPane label="示例" name="sample" v-if="!isEmpty(api.sample)">
                    <template v-for="sample in api.sample" :key="sample">
                        <h4>{{ get(sample, 'title') }}</h4>
                        <pre class="form-sample" v-html="get(sample, 'content')"></pre>
                    </template>
                </ElTabPane>
            </ElTabs>
        </div>
    </div>
    <ElDrawer v-model="trans.visible" :title="trans.drawer === 'cert' ? '设置凭证' : '接口来源'">
        <DevApiDocCert v-if="trans.drawer === 'cert'" :key-name="get(source.active, 'key')"/>
        <DevApiDocSource v-if="trans.drawer === 'source'"
            @delete="deleteSource" @add="addSource" @active="activeSource" @refresh="refreshSource"
            :sources="sourcesRef" :domains="sourcesDomainRef"
        />
    </ElDrawer>
    <ElDialog v-model="trans.login" title="登录" width="400px">
        <ElForm label-position="top" @keyup.enter="onRequest">
            <ElTabs tab-position="top" v-model="apiLogin.type">
                <ElTabPane label="通行证登录" name="passport">
                    <ElFormItem>
                        <ElInput v-model="apiLogin.passport" placeholder="请输入通行证"/>
                    </ElFormItem>
                    <ElFormItem>
                        <ElInput v-model="apiLogin.password" placeholder="请输入密码"/>
                    </ElFormItem>
                </ElTabPane>
                <ElTabPane label="验证码登录" name="captcha">
                    <ElFormItem>
                        <ElInput v-model="apiLogin.passport" placeholder="请输入通行证"/>
                    </ElFormItem>
                    <ElFormItem>
                        <ElRow :gutter="8">
                            <ElCol :span="12">
                                <ElInput v-model="apiLogin.captcha" placeholder="请输入验证码"/>
                            </ElCol>
                            <ElCol :span="12">
                                <ElButton type="primary" plain @click="onCertLoginSendCaptcha">发送验证码</ElButton>
                            </ElCol>
                        </ElRow>
                    </ElFormItem>
                </ElTabPane>
            </ElTabs>

        </ElForm>
        <template #footer>
            <el-button type="primary" @click="onCertLogin">登录</el-button>
        </template>
    </ElDialog>
</template>

<script lang="ts" setup>
import { computed, onMounted, onUnmounted, reactive, ref } from 'vue'
import { useStore } from '@/store';
import { useRouter } from 'vue-router';
import { each, filter, find, first, get, groupBy, isEmpty, isEqual, map, merge, set } from "lodash-es";
import { strAfter, stripTags } from "../../../pkg/core/utils/helper";
import { ElForm } from "element-plus/es";
import DevApiDocCert from "@/components/dev/DevApiDocCerts.vue";
import { pyStorageDevApidocApiCurrentKey, pyStorageDevApidocApiLastSavedKey, pyStorageDevApidocCertsKey, pyStorageDevApidocQueryParamKey } from "@/utils/conf";
import { appLocalStore, toast } from "@/utils/util";
import XIcon from "@/components/element/XIcon.vue";
import { emitter } from "../../../pkg/core/bus/mitt";
import DevApiDocSource from "@/components/dev/DevApiDocSources.vue";
import { apiMiscApidocJson, apiMiscApidocSave } from "@/services/misc";
import { base64Decode, base64Encode } from "../../../pkg/core/utils/str";
import { appRequest } from "@/utils/request";
import { copyText } from 'vue3-clipboard'

const store = useStore();
const router = useRouter();

emitter.on('dev:apidoc-certs-update', (certs) => {
    apiCerts.value = certs;
})


// sources
const source = reactive({
    kw: '',          // 查询关键字
    content: [],     // '所有定义
    active: computed(() => {  // 当前激活的接口
        return find(sourcesRef.value, { active: true });
    }),
})
// 当前接口定义
const sourcesRef: any = ref([]);
// 当前可用域名列表
const sourcesDomainRef: any = ref([]);
// 分组过的接口定义
const sourceGrouped = computed(() => {
    let filtered = filter(source.content, (item) => {
        let title: string = get(item, 'title', '');
        let description: string = get(item, 'description', '');
        let name: string = get(item, 'name', '');
        let url: string = get(item, 'url', '');
        if (!source.kw) {
            return true;
        }
        return title.indexOf(source.kw) > -1
            ||
            description.indexOf(source.kw) > -1
            ||
            url.indexOf(source.kw) > -1
            ||
            name.indexOf(source.kw) > -1;
    })
    return groupBy(filtered, (item) => {
        return get(item, 'group');
    })
})
const activeSource = (key: any) => {
    sourcesRef.value = map(sourcesRef.value, (item) => {
        if (get(item, 'key') === key) {
            set(item, 'active', true);
        } else {
            set(item, 'active', false);
        }
        return item;
    });
    appLocalStore(pyStorageDevApidocApiCurrentKey(), key);
    let activated = find(sourcesRef.value, { active: true });
    source.content = eval(get(activated, 'content'));
}

/* Api
 * ---------------------------------------- */
const apiRef: any = ref({});
const apiParamsRef = ref({});
const apiQueryRef = ref({});
const apiCerts: any = ref([]);
const apiUploading = ref(false);
const onCopyUrl = function () {
    copyText(api.urlReplaced, undefined, (error: any) => {
        if (error) {
            toast('无法复制:' + error)
        } else {
            toast('已复制', true)
        }
    })
}
let apiSaveHandler: any = null;
const api = reactive({
    url: computed(() => {
        return get(apiRef.value, 'url');
    }),
    urlReplaced: computed(() => {
        let url: string = get(apiRef.value, 'url');
        map(apiParamsRef.value, (value, key) => {
            if (value) {
                url = url.replace(`:${key}`, value);
            }
        })
        return url;
    }),
    title: computed(() => {
        return get(apiRef.value, 'title');
    }),
    method: computed(() => {
        return get(apiRef.value, 'type');
    }),
    description: computed(() => {
        return get(apiRef.value, 'description');
    }),
    sample: computed(() => {
        return get(apiRef.value, 'success.examples') || [];
    }),
    document: computed(() => {
        return get(apiRef.value, 'success.fields') ? get(apiRef.value, 'success.fields')['Success 200'] : [];
    }),
    parameters: computed(() => {
        return get(apiRef.value, 'parameter.fields.Parameter', []);
    }),
    queries: computed(() => {
        return get(apiRef.value, 'query', []);
    }),
    cert: computed(() => {
        return find(apiCerts.value, { active: true, key: get(source.active, 'key') });
    }),
})

const resultResp: any = ref({});
const result = reactive({
    tab: 'result',
    status: 0,
    message: ''
})

const refreshSource = () => {
    fetchApiDoc()
}

const addSource = () => {
    fetchApiDoc()
}
const deleteSource = () => {
    fetchApiDoc()
}


const trans = reactive({
    visible: false,
    drawer: '',
    login: false,
});
const apiLogin = reactive({
    passport: '',
    password: '',
    captcha: '',
    type: 'captcha'
});

const manageCert = () => {
    trans.visible = true;
    trans.drawer = 'cert';
}
const certLogin = () => {
    if (isEmpty(api.cert)) {
        toast('请选择凭证');
        return;
    }
    let url = get(api.cert, 'url');
    if (!url) {
        toast('需要完善请求地址');
        return;
    }

    trans.login = true;
}
const onCertLogin = () => {
    let url = get(api.cert, 'url');
    let query = {};
    if (!isEmpty(get(api.cert, 'params', []))) {
        each(get(api.cert, 'params', []), (value) => {
            set(query, get(value, 'key'), get(value, 'value'));
        })
    }
    set(query, 'passport', apiLogin.passport);
    if (apiLogin.type === 'captcha') {
        set(query, 'captcha', apiLogin.captcha);
    } else{
        set(query, 'password', apiLogin.password);
    }
    appRequest({
        url: `${url}/api_v1/system/auth/login`,
        data: query,
        method: 'post',
    }).then(({ data, message, success }) => {
        if (success) {
            let { token } = data;
            console.log(api.cert);
            api.cert.headers = filter(api.cert.headers, (value) => {
                return get(value, 'key') !== 'Authorization';
            })
            api.cert.headers.push({
                key: 'Authorization',
                value: `Bearer ${token}`
            });
            appLocalStore(pyStorageDevApidocCertsKey(), apiCerts.value);
            trans.login = false;
        }
        toast(message, success);
    }).catch(({ message }) => {
        toast(message);
    })
}

const onCertLoginSendCaptcha = () => {
    let url = get(api.cert, 'url');
    let query = {};
    if (!isEmpty(get(api.cert, 'params', []))) {
        each(get(api.cert, 'params', []), (value) => {
            set(query, get(value, 'key'), get(value, 'value'));
        })
    }
    set(query, 'passport', apiLogin.passport);
    appRequest({
        url: `${url}/api_v1/system/captcha/send`,
        data: query,
        method: 'post',
    }).then(({ message, success }) => {
        if (success) {
            let captcha = strAfter(message, '验证码:');
            if (captcha) {
                apiLogin.captcha = captcha;
            }
        }
        toast(message, success);
    }).catch(({ message }) => {
        toast(message);
    })
}

const saveCert = () => {
    let lastSaved = appLocalStore(pyStorageDevApidocApiLastSavedKey('certs'));
    if (isEqual(lastSaved, apiCerts.value)) {
        return;
    }
    apiUploading.value = true;
    apiMiscApidocSave({
        content: JSON.stringify(apiCerts.value),
        type: 'cert'
    }).then(({ success }) => {
        if (success) {
            setTimeout(() => {
                apiUploading.value = false;
            }, 1000);
            appLocalStore(pyStorageDevApidocApiLastSavedKey('certs'), apiCerts.value);
        }
    });
}
const saveParamQuery = () => {
    let lastSaved = appLocalStore(pyStorageDevApidocApiLastSavedKey('param_query'));
    let paramQuery = appLocalStore(pyStorageDevApidocQueryParamKey())
    if (isEqual(lastSaved, paramQuery)) {
        return;
    }
    apiUploading.value = true;
    apiMiscApidocSave({
        content: JSON.stringify(paramQuery),
        type: 'param_query'
    }).then(({ success }) => {
        if (success) {
            setTimeout(() => {
                apiUploading.value = false;
            }, 1000);
            appLocalStore(pyStorageDevApidocApiLastSavedKey('param_query'), paramQuery);
        }
    });
}


const manageSource = () => {
    trans.visible = true;
    trans.drawer = 'source';
}

const selectUrl = (clk: string = '') => {
    // 保留当前 Url 参数 & 查询
    let currentUrl = get(apiRef.value, 'url');
    let sourceKey = get(source.active, 'key');
    let pqs = appLocalStore(pyStorageDevApidocQueryParamKey()) || [];
    if (currentUrl) {
        let item: any = find(pqs, { source: sourceKey, url: currentUrl }) || {};
        if (isEmpty(item)) {
            pqs.push({
                source: sourceKey,
                url: currentUrl,
                query: apiQueryRef.value,
                params: apiQueryRef.value
            });
        } else {
            set(item, 'query', apiQueryRef.value);
            set(item, 'params', apiParamsRef.value);
        }
        appLocalStore(pyStorageDevApidocQueryParamKey(), pqs);
        saveParamQuery();
    }

    // 切换 || 恢复 Url
    let url = clk ? clk : (get(router.currentRoute.value.query, 'url', '') ? base64Decode(String(get(router.currentRoute.value.query, 'url', ''))) : '');
    apiRef.value = find(source.content, (item: any) => {
        return get(item, 'url') === url;
    });
    if (isEmpty(apiRef.value)) {
        apiRef.value = first(source.content);
        url = get(apiRef.value, 'url');
    }

    // 恢复 Url 参数 & 查询
    let pqCurrent = find(pqs, { source: sourceKey, url: url });
    if (!isEmpty(pqCurrent)) {
        apiQueryRef.value = get(pqCurrent, 'query');
        apiParamsRef.value = get(pqCurrent, 'params');
    }
    result.tab = 'result';
    resultResp.value = {};
    result.message = '';
    router.push({
        query: {
            url: base64Encode(url),
        }
    })
}

const fetchApiDoc = () => {
    let current = appLocalStore(pyStorageDevApidocApiCurrentKey());
    apiMiscApidocJson({
        current: current
    }).then(({ data }) => {
        sourcesRef.value = get(data, 'sources');
        let activatedKey = appLocalStore(pyStorageDevApidocApiCurrentKey());
        let activated = find(sourcesRef.value, { key: activatedKey });
        if (isEmpty(activated)) {
            activated = first(sourcesRef.value);
        }
        set(activated, 'active', true);
        source.content = eval(get(activated, 'content'));

        // save to local activated
        appLocalStore(pyStorageDevApidocApiCurrentKey(), get(activated, 'key'));

        // load activated certs
        apiCerts.value = get(data, 'certs');
        appLocalStore(pyStorageDevApidocCertsKey(), get(data, 'certs'))

        // load params
        appLocalStore(pyStorageDevApidocQueryParamKey(), get(data, 'param_query'))

        // list domain
        sourcesDomainRef.value = get(data, 'domains');
        selectUrl();
    });
}

const onRequest = () => {
    let headers = {};
    let query = {};
    let url = '';
    if (isEmpty(api.cert)) {
        toast('请选择凭证');
        return;
    }

    url = get(api.cert, 'url');
    if (!url) {
        toast('需要完善请求地址');
        return;
    }
    // 复写 params
    if (!isEmpty(get(api.cert, 'params', []))) {
        each(get(api.cert, 'params', []), (value) => {
            set(query, get(value, 'key'), get(value, 'value'));
        })
    }

    // 复写 headers
    if (!isEmpty(get(api.cert, 'headers', []))) {
        each(get(api.cert, 'headers', []), (value) => {
            if (get(value, 'key') !== '') {
                set(headers, get(value, 'key'), get(value, 'value'));
            }
        })
    }

    let start = (new Date()).getTime();

    let path = api.urlReplaced;
    if (api.urlReplaced.indexOf('/') !== 0) {
        path = `/${api.urlReplaced}`;
    }
    appRequest({
        url: `${url}${path}`,
        data: merge(apiQueryRef.value, query),
        method: api.method,
        headers: headers
    }).then(({ status, data, message }) => {
        let end = (new Date()).getTime();
        let resp = {
            status,
            message
        }
        if (!isEmpty(data)) {
            set(resp, 'data', data);
        }

        resultResp.value = resp;

        let timing = end - start;
        result.tab = 'result';
        result.status = 200;
        result.message = `status : ${status}, time: ${timing}ms , message: ${message}`;
    }).catch(({ status, message }) => {
        let end = (new Date()).getTime();
        let timing = end - start;
        resultResp.value = {}
        result.status = status;
        result.message = `status : ${status}, time: ${timing}ms, message: ${message}`;
    })
}
onMounted(() => {
    fetchApiDoc();
    apiSaveHandler = setInterval(() => {
        saveCert();
    }, 1000 * 15);
})

onUnmounted(() => {
    emitter.off('dev:apidoc-certs-update');
    clearInterval(apiSaveHandler)
})

</script>

<style scoped lang="less">

.group {
    width: 260px;
    height: 100vh;
    background: #fff;
    padding: 0.3rem 0 0.3rem 0.5rem;
    box-sizing: border-box;
    div.group-search {
        box-sizing: content-box;
        padding: 0.3rem 0;
        position: sticky;
        top: 0;
        background: #fff;
        .el-input {
            width: 96%;
        }
        .group-setting {
            position: absolute;
            right: 1rem;
            top: 0.2rem;
            cursor: pointer;
            &:hover {
                color: var(--wc-color-primary);
            }
        }
    }
    h3 {
        font-size: 16px;
        font-weight: normal;
        line-height: 32px;
        height: 32px;
        margin: 0;
    }
    h4 {
        font-size: 14px;
        line-height: 26px;
        height: 26px;
        margin: 0;
        font-weight: normal;
    }
    ul {
        font-size: 13px;
        padding: 0.3rem 0.5rem 0.3rem 0.1rem;
        margin: 0;
        li {
            cursor: pointer;
            border-left: 3px transparent solid;
            &.active {
                background: #f5f5f5;
                border-left: 3px solid var(--wc-color-primary);
            }
            line-height: 1.3;
            padding: 0.2rem 0.2rem 0.2rem 0.4rem;
            .group-url {
                line-height: 1.4;
                font-size: 12px;
            }

        }
    }
}

.form {
    width: 300px;
    border-right: 1px solid #eee;
    height: 100vh;
    padding: 0.3rem 0 0.3rem 0.5rem;
    box-sizing: border-box;
    position: relative;
    h3 {
        padding: 0.3rem 0;
        font-size: 16px;
        font-weight: normal;
        line-height: 32px;
        height: 32px;
        margin: 0;
        position: relative;
        .form-setting {
            position: absolute;
            right: 0.3rem;
            top: 0.5rem;
            cursor: pointer;
            &:hover {
                color: var(--wc-color-primary);
            }
        }
        .form-login {
            position: absolute;
            right: 3.3rem;
            top: 0.5rem;
            cursor: pointer;
            &:hover {
                color: var(--wc-color-primary);
            }
        }
        .form-save {
            position: absolute;
            right: 1.8rem;
            top: 0.5rem;
            cursor: pointer;
            &:hover {
                color: var(--wc-color-primary);
            }
        }
        .form-saving {
            color: green;
        }
    }
    h4 {
        font-size: 14px;
        line-height: 26px;
        height: 26px;
        margin: 0;
        font-weight: normal;
    }
    h4 + p {
        font-size: 12px;
        margin: 0;
    }
    em {
        font-style: normal;
    }

    .required {
        color: red;
    }
    .request {
        position: absolute;
        bottom: 5px;
        left: 5px;
        width: 300px;
    }
    .form-form {
        padding-right: 0.3rem;
    }

}

.result {
    background: #fff;
    height: 100vh;
    padding: 0.3rem 0 0.3rem 0.5rem;
    box-sizing: border-box;
    position: relative;
    width: calc(100vw - 610px);
    h3 {
        padding: 0.3rem 0;
        font-size: 16px;
        font-weight: normal;
        line-height: 32px;
        height: 32px;
        margin: 0;
    }
    h4 {
        font-size: 14px;
        line-height: 26px;
        height: 26px;
        margin: 0;
        font-weight: normal;
        padding-left: 1rem;
    }
    .form-sample {
        border: 1px solid #ccc;
        padding: 0.5rem;
        margin: 0.5rem;
        border-radius: 5px;
    }
}
</style>
