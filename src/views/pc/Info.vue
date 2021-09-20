<template>
    <div class="login">
        <a-row>
            <a-col :span="12" :offset="6">
                <div class="logo">
                    <img src="@/assets/app/logo.png" alt="氪金兽">
                    <h4>氪金兽</h4>
                    <p>用户信息</p>
                </div>

            </a-col>
        </a-row>
    </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from 'vue'
import { apiPySystemAuthAccess, apiPySystemAuthLogout } from '@/services/poppy';
import { useStore } from '@/store';
import { get } from 'lodash-es';
import { useRouter } from 'vue-router';
import { localStore, toast } from '@/utils/utils';
import { storageKey } from '@/utils/conf';

export default defineComponent({
    name: 'PcInfo',
    setup() {
        const info = ref({
            id: '',
            created_at: '',
            username: ''
        });
        const store = useStore();
        const router = useRouter();
        const req = () => {
            apiPySystemAuthAccess({}, 'pc').then(({ success, data, message }) => {
                if (success) {
                    info.value = data
                }
                toast(message, success);
            })
        }
        onMounted(req)
        return {
            info,
            get,
            store,
            router
        }
    },
    methods: {
        // 这里进行多页加载
        onLogout: function () {
            apiPySystemAuthLogout('pc')
                .then(({ success, message }) => {
                    toast(message, success)
                    if (success) {
                        // set store
                        localStore(storageKey.PY_TOKEN, null);

                        this.store.commit('pc/SET_TOKEN', {
                            token: ''
                        })
                        this.router.push({ name: 'pc.login' })
                    }
                })
        }
    }
})
</script>

<style scoped lang="less">
@import '../../assets/style/vars';

.login {
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
    .btn {
        padding: 32px 16px 0;
        .van-button {
            height: 46px;
            opacity: 1;
            background: linear-gradient(90deg, #C5681C, #BB0A59);
            border-radius: 47px;
            color: #FFF;
        }
    }
}

</style>
