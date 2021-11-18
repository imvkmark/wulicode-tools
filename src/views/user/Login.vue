<template>
    <div class="login">
        <el-row justify="center">
            <el-col :span="12" :xs="{span:22}" :sm="{span:18}">
                <div class="login-ctr">
                    <div class="form">
                        <div class="form-desc">
                            <h4>登录</h4>
                            <p>开发中的前后端分离框架</p>
                        </div>
                        <el-form :model="value" :rules="rules" ref="form" label-width="100px" label-position="top">
                            <el-form-item label="通行证" prop="passport">
                                <el-input v-model="value.passport"></el-input>
                            </el-form-item>
                            <el-form-item label="密码" prop="password">
                                <el-input v-model="value.password"></el-input>
                            </el-form-item>
                            <el-form-item>
                                <el-button type="primary" class="py--block" @click="onSubmit()">登录</el-button>
                            </el-form-item>
                        </el-form>
                    </div>
                </div>
            </el-col>
        </el-row>
    </div>
</template>

<script lang="ts" setup>
import { reactive, ref } from 'vue'
import { apiPySystemAuthLogin } from '@/services/poppy';
import { useStore } from '@/store';
import { get } from 'lodash-es';
import { useRouter } from 'vue-router';
import { toast } from '@/utils/utils';
import { ElForm } from 'element-plus';
import useUserUtil from '@/composables/useUserUtil';

const form: any = ref<InstanceType<typeof ElForm>>();
const value = reactive({
    passport: '',
    password: '',
    captcha: ''
})
const rules = reactive({
    passport: [
        { required: true, message: '请输入通行证', trigger: 'change' }
    ],
    password: [
        { required: true, message: '请输入密码', trigger: 'change' }
    ]
})
const router = useRouter();
const store = useStore();

const { userLogin } = useUserUtil();

const onSubmit = () => {
    form.value.validate((valid: boolean) => {
        if (valid) {
            apiPySystemAuthLogin({
                passport: value.passport,
                password: value.password,
                guard: 'backend'
            }).then(({ success, data, resp }) => {
                toast(resp)
                if (success) {
                    userLogin({
                        token: get(data, 'token')
                    })
                }
            })
        }
    })

}
</script>

<style scoped lang="less">
@import '../../assets/style/vars';

.login {
    background: #081836;
    min-height: calc(100vh - 4rem);
    display: flex;
    align-items: center;
    .el-row {
        flex: 1;
    }
}

.login-ctr {
    display: flex;
    width: 100%;
    flex-direction: column;
    align-items: center;
    justify-content: center;
}

.form-desc {
    display: flex;
    flex-direction: column;
    align-items: center;
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

.form {
    width: 100%;
    background: #FFF;
    padding: 30px;
    box-sizing: border-box;
    box-shadow: 0 0 18px 0 rgba(0, 0, 0, 0.20);
    border-radius: 5px;
    max-width: 40rem;
}
</style>
