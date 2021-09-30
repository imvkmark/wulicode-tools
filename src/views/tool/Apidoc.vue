<template>
    <h2>ApiDoc注释生成</h2>
    <div class="tool-area tool-mono">
        <div class="tool-content">
            <el-row :gutter="20">
                <el-col :span="12">
                    <el-form :model="value" :rules="rules" ref="form">
                        <el-form-item prop="text">
                            <el-input @input="onInput" v-model="value.text"
                                :rows="8" type="textarea" placeholder="输入Json 内容"/>
                        </el-form-item>
                    </el-form>
                </el-col>
                <el-col :span="12">
                    <el-tooltip content="点击复制">
                        <el-input readonly v-model="trans.comment" v-loading="trans.loading" class="tool-pointer"
                            :autosize="{ minRows: 8, maxRows: 16 }" @click="onCopy"
                            :rows="8" type="textarea" placeholder="输出注释"/>
                    </el-tooltip>
                </el-col>
            </el-row>
        </div>
    </div>
</template>
<script lang="ts" setup>
import { computed, onMounted, reactive, ref } from 'vue'
import { useStore } from '@/store';
import { debounce, get } from 'lodash-es';
import { useRouter } from 'vue-router';
import { apiOpToolApidoc } from '@/services/op';
import { toast } from '@/utils/utils';
import { ElForm } from 'element-plus';
import { copyText } from 'vue3-clipboard'

const store = useStore();
const router = useRouter();
const trans = reactive({
    loading: computed(() => store.getters.loading),
    comment: ''
})
const value = reactive({
    text: '{}'
})
const form: any = ref<InstanceType<typeof ElForm>>();


const rules = reactive({
    text: [
        { required: true, message: '输入需要转换的Json', trigger: 'change' },
        {
            validator: (rule: any, val: string, callback: any) => {
                try {
                    if (typeof JSON.parse(val) !== 'object') {
                        callback('请输入正确的Json 数据');
                    }
                } catch (e) {
                    callback('请输入正确的Json 数据');
                }
                return true;
            },
            trigger: 'blur'
        }
    ]
})

const onInput = debounce(function () {
    if (!value.text) {
        trans.comment = '';
    }
    form.value.validate((valid: boolean) => {
        if (valid) {
            store.dispatch('Loading')
            apiOpToolApidoc({
                content: value.text
            }).then(({ data, success, message, resp }) => {
                if (success) {
                    trans.comment = get(data, 'comment');
                } else {
                    toast(message, false)
                }
            })
        }
    })
}, 300, {
    leading: false,
    trailing: true
})


const onCopy = function () {
    copyText(trans.comment, undefined, (error: any) => {
        if (error) {
            toast('无法复制:' + error, false)
        } else {
            toast('已复制')
        }
    })
}

onMounted(onInput);
</script>

<style scoped lang="less">
@import '../../assets/style/vars';
</style>
