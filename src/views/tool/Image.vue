<template>
    <PxMain title="图片占位符">
        <div class="main-content">
            <ElForm :inline="true">
                <ElFormItem label="背景色">
                    <ElColorPicker v-model="trans.bg"/>
                </ElFormItem>
                <ElFormItem label="文字色">
                    <ElColorPicker v-model="trans.fc"/>
                </ElFormItem>
                <ElFormItem label="宽度">
                    <ElInput type="text" placeholder="宽度" style="width: 80px" v-model="trans.width"/>
                </ElFormItem>
                <ElFormItem label="高度">
                    <ElInput type="text" placeholder="高度" style="width: 80px" v-model="trans.height"/>
                </ElFormItem>
                <ElFormItem label="文字">
                    <ElInput type="text" placeholder="说明"  v-model="trans.text" clearable/>
                </ElFormItem>
            </ElForm>
            <ElRadioGroup v-model="trans.type">
                <ElRadioButton label="jd">京东</ElRadioButton>
                <ElRadioButton label="self">Wulicode</ElRadioButton>
            </ElRadioGroup>
        </div>
        <div v-if="value.url" class="img-wrapper">
            <img :src="value.url" :alt="trans.text"> <br>
            <ElTooltip content="点击复制">
                <p @click="onCopy">{{ value.url }}</p>
            </ElTooltip>
        </div>
    </PxMain>
</template>
<script lang="ts" setup>
import { trimEnd, trimStart } from 'lodash-es';
import { onMounted, reactive, watch } from 'vue';
import { copyText } from 'vue3-clipboard';
import PxMain from '@/components/base/PxMain.vue';
import { toast } from "@/utils/util";
import { appUrl } from "@/utils/conf";


const trans = reactive({
    bg: '#282828',
    type: 'jd',
    fc: '#EAE0D0',
    width: '428',
    height: '280',
    text: 'wulicode'
})

const value = reactive({
    url: ''
})
const onCopy = function () {
    copyText(value.url, undefined, (error: any) => {
        if (error) {
            toast('无法复制:' + error)
        } else {
            toast('已复制 URL', true)
        }
    })
}

const toNumber = function (val) {
    let v = parseInt(val);
    if (isNaN(val)) {
        return 0;
    } else if (typeof val === 'undefined') {
        return 0;
    } else {
        return v;
    }
}

const onChange = function () {
    let hwSpec = toNumber(trans.width) ? toNumber(trans.width) : '428';
    let width = toNumber(trans.width) ? toNumber(trans.width) : '428';
    let height = toNumber(trans.height) ? toNumber(trans.height) : '214';
    if (typeof height !== 'undefined') {
        hwSpec = `${width}x${height}`;
    }
    let textSpec = trans.text ? trans.text : '';

    if (trans.type === 'self') {
        let append = `?`;
        if (trans.bg !== '#282828') {
            append += `_bg=${trimStart(trans.bg, '#')}&`;
        }
        if (trans.fc !== '#EAE0D0') {
            append += `_fc=${trimStart(trans.fc, '#')}&`;
        }
        let resultUrl = `${appUrl}/img/${hwSpec}`;
        if (textSpec) {
            resultUrl += `/${textSpec}`
        }
        if (append !== '?') {
            resultUrl += append;
        }
        value.url = trimEnd(resultUrl, '&');
    } else {
        let append = `?`;
            append += `color=${trimStart(trans.bg, '#')}&`;
            append += `textColor=${trimStart(trans.fc, '#')}&`;
        let resultUrl = `https://jdc.jd.com/img/${hwSpec}`;
        if (textSpec) {
            append += `text=${textSpec}`
        }
        if (append !== '?') {
            resultUrl += append;
        }
        value.url = trimEnd(resultUrl, '&');
    }
}


watch(() => trans, onChange, { deep: true });

onMounted(onChange);
</script>
<style scoped lang="less">
.img-wrapper {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 100%;
    min-height: 500px;
    max-height: 620px;
    text-align: center;
    img {
        max-width: 800px;
        max-height: 600px;
    }
    p {
        cursor: pointer;
    }
}
</style>
