<template>
    <h2>文档工具</h2>
    <div class="tool-area">
        <div class="tool-content">
            <el-button plain type="primary" size="small">转换</el-button>
        </div>
        <el-row :gutter="20">
            <el-col :span="12">
                <el-input
                    :rows="2"
                    type="textarea"
                    placeholder="Please input"
                />
            </el-col>
            <el-col :span="12">
                <el-input
                    :rows="2"
                    type="textarea"
                    placeholder="Please input"
                />
            </el-col>
        </el-row>
    </div>
</template>

<script lang="ts">
import { defineComponent, reactive, ref } from 'vue'
import { CurrentTime, useCountDown } from '@vant/use';
import { apiPySystemAuthLogin, apiPySystemCaptchaSend } from '@/services/poppy';
import { isMobile } from '@popjs/util';
import { useStore } from '@/store';
import { get } from 'lodash-es';
import { useRouter } from 'vue-router';
import { localStore, toast } from '@/utils/utils';
import { storageKey } from '@/utils/conf';
import { ElForm } from 'element-plus';

export default defineComponent({
    name: 'ApiDoc',
    setup() {
        const form: any = ref<InstanceType<typeof ElForm>>();
        const trans = reactive({
            captchaDisabled: false,
            captchaText: '发送验证码'
        });
        const value = reactive({
            passport: '',
            password: '',
            captcha: ''
        })
        const rules = reactive({
            passport: [
                { required: true, message: '请输入通行证', trigger: 'change' }
            ]
        })
        const router = useRouter();
        const countDown = useCountDown({
            time: 5 * 1000,
            onChange: function (current: CurrentTime) {
                if (current.seconds === 0) {
                    trans.captchaText = '发送验证码';
                    trans.captchaDisabled = false;
                } else {
                    trans.captchaText = `${current.seconds}秒后重发`
                }
            },
            onFinish: () => {
                trans.captchaText = '发送验证码';
                trans.captchaDisabled = false;
            }
        });
        const store = useStore();

        const onSubmit = () => {
            form.value.validate((valid: boolean) => {
                if (valid) {
                    apiPySystemAuthLogin({
                        passport: value.passport,
                        password: value.password,
                        captcha: value.captcha,
                        guard: 'backend'
                    }).then(({ success, message, data }) => {
                        toast(message, success);
                        if (success) {
                            localStore(storageKey.PY_TOKEN, get(data, 'token'));
                            // set store
                            store.commit('pc/SET_TOKEN', {
                                token: get(data, 'token')
                            });
                            const go = get(router.currentRoute.value, 'query.go', '');
                            if (!go) {
                                router.push({ name: 'pc.info' })
                            } else {
                                router.push({ path: go })
                            }
                        }
                    })
                }
            })

        }
        return {
            value, rules, form,
            trans,
            store,
            router,
            countDown,
            onSubmit
        }
    },
    methods: {
        onSendCaptcha: function () {
            if (!isMobile(this.value.passport)) {
                toast('请输入正确的手机号', false);
                return;
            }
            apiPySystemCaptchaSend({
                passport: this.value.passport
            }).then(({ message, success }) => {
                toast(message, success);
                if (success) {
                    this.trans.captchaDisabled = true;
                    this.countDown.reset();
                    this.countDown.start();
                }
            })
        }
    }
})
</script>

<style scoped lang="less">
@import '../../assets/style/vars';
</style>
