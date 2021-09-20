<template>
    <el-row>
        <el-col :span="12" :offset="6">
            <div class="login-ctr">
                <div class="form">
                    <div class="logo">
                        <img src="@/assets/app/logo.png" alt="氪金兽">
                        <h4>氪金兽</h4>
                        <p>您的一对一专属游戏助手</p>
                    </div>
                    <el-form
                        :model="value"
                        :rules="rules"
                        :ref="(el)=> {form = el}"
                        label-width="100px"
                    >
                        <el-form-item label="通行证" prop="passport">
                            <el-input v-model="value.passport"></el-input>
                        </el-form-item>
                        <el-form-item label="密码" prop="password">
                            <el-input v-model="value.password"></el-input>
                        </el-form-item>
                        <el-row :gutter="10">
                            <el-col :span="18">
                                <el-form-item label="验证码" prop="captcha">
                                    <el-input v-model="value.captcha"></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="6">
                                <el-button type="primary" @click="onSendCaptcha" class="px--block" :disabled="trans.captchaDisabled">
                                    {{ trans.captchaText }}
                                </el-button>
                            </el-col>
                        </el-row>
                        <el-form-item>
                            <el-button type="primary" class="px--block" @click="onSubmit('form')">登录</el-button>
                        </el-form-item>
                    </el-form>
                </div>
            </div>
        </el-col>
    </el-row>
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
    name: 'PcLogin',
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

.login-ctr {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100vh;

}

.form {
    width: 100%;
}

.logo {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding-top: 55px;
    img {
        width: 55px;
    }
    h4 {
        height: 40px;
        line-height: 40px;
        font-size: 18px;
        color: @textColor;
        text-align: center;
        margin: 0;
    }
    p {
        font-size: 12px;
        color: @assistColor;
        text-align: center;
        margin-top: 0;
    }
}

.login {

    .btn {
        padding: 32px 16px 0;
        .van-button {
            height: 46px;
            opacity: 1;
            background: linear-gradient(90deg, #41B2F6, #6843F8);
            border-radius: 47px;
            color: #FFF;
        }
    }
}

</style>
