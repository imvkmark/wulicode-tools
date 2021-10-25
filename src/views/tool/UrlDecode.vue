<template>
    <h2>Url解码</h2>
    <div class="main-area main-mono">
        <div class="main-content">
            <el-row :gutter="20">
                <el-col :span="12">
                    <el-form :model="value" :rules="rules" ref="form">
                        <el-form-item prop="text">
                            <el-input @input="onInput" @change="onInput" v-model="value.text"
                                :rows="8" type="textarea" placeholder="输入内容"/>
                        </el-form-item>
                    </el-form>
                </el-col>
                <el-col :span="12">
                    <el-tooltip content="点击复制">
                        <el-input readonly v-model="trans.result" v-loading="trans.loading" class="main-pointer"
                            :autosize="{ minRows: 8, maxRows: 16 }" @click="onCopy"
                            :rows="8" type="textarea" placeholder="转换后内容"/>
                    </el-tooltip>
                    <el-alert class="error" v-if="trans.error" type="error" :closable="false">{{ trans.error }}</el-alert>
                </el-col>
            </el-row>
        </div>
    </div>
</template>
<script lang="ts" setup>
import { computed, onMounted, reactive, ref } from 'vue'
import { useStore } from '@/store';
import { useRouter } from 'vue-router';
import { localStore, toast } from '@/utils/utils';
import { ElForm } from 'element-plus';
import { copyText } from 'vue3-clipboard'
import { debounce, each, get } from 'lodash-es';
import qs from 'qs';


const store = useStore();
const router = useRouter();
const trans = reactive({
    loading: computed(() => store.getters.loading),
    ori: 'wulicode.com?role=duoli&wechat=imvkmark',
    result: '',
    error: '',
    key: 'tool-url'
})
const value = reactive({
    text: ''
})
const form: any = ref<InstanceType<typeof ElForm>>();

const rules = reactive({
    text: [
        { required: true, message: '输入需要转换的内容', trigger: 'change' }
    ]
})

const onInput = debounce(function () {
    if (!value.text) {
        trans.result = '';
    }
    const hasQuestion = value.text.indexOf('?') > -1;
    let content;
    if (hasQuestion) {
        content = value.text.substr(value.text.indexOf('?') + 1)
    } else {
        const hasEqual = value.text.indexOf('=') > -1;
        if (hasEqual) {
            content = value.text;
        } else {
            trans.error = '没有匹配到需要转换的数据'
        }
    }
    if (content) {
        let parsedObj = qs.parse(content);
        let parsed = '';
        each(parsedObj, function (item, key) {
            parsed += `${key} : ${item} \n`;
        })
        trans.result = parsed;
        // 这里保存原始输入
        localStore(trans.key, {
            text: value.text
        })
    }


}, 100, {
    leading: false,
    trailing: true
})


const onCopy = function () {
    copyText(trans.result, undefined, (error: any) => {
        if (error) {
            toast('无法复制:' + error, false)
        } else {
            toast('已复制')
        }
    })
}

onMounted(onInput);
onMounted(() => {
    // recovery
    let content = localStore(trans.key);
    if (content) {
        value.text = get(content, 'text');
    }
})

</script>

<style scoped lang="less">
@import '../../assets/style/vars';

.error {
    margin-top: 10px;
}
</style>
