<template>
    <a-row>
        <a-col :span="6">

        </a-col>
        <a-col :span="12">
            <div class="chat-content" ref="main">

            </div>
        </a-col>
        <a-col :span="6">

        </a-col>
    </a-row>
</template>

<script lang="ts">
import { computed, defineComponent, reactive, ref } from 'vue'
import { get } from 'lodash-es';
import { useStore } from '@/store';
import { useRouter } from 'vue-router';
import { toast } from '@/utils/utils';

export default defineComponent({
    name: 'PcChat',
    components: {},

    setup() {
        const main = ref(null);
        const tid = ref('');
        // 接收传入的参数
        const { params } = useRouter().currentRoute.value;
        tid.value = String(get(params, 'tid', ''));
        const { emitTo } = useSocket('pc');
        const store = useStore();
        const trans = reactive({
            uid: computed(() => get(store.state.pc, 'im.uid')),
            tid: computed(() => get(store.state.pc, 'tid'))
        })

        const onEmitMessageResp = function (resp) {
            if (get(resp, 'status') !== 0) {
                toast(get(resp, 'message'), false);
                return;
            }
            store.commit('pc/NEW_MESSAGE', get(resp, 'data'))
        }

        return {
            main,
            tid,
            trans,
            store,
            emitTo, onEmitMessageResp,
            get
        }
    }
})
</script>

<style scoped lang="less">
@import '../../assets/style/vars';

.chat-content {
    display: flex;
    flex-direction: column;
    height: 100vh;
    border-right: 1px solid #EEE;
    flex: 1;
    overflow: hidden;
    background: @mainBgColor;
}
</style>