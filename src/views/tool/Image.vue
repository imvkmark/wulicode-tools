<template>
    <h2>图片占位符</h2>
    <div class="main-area main-mono">
        <div class="main-content">
            <el-form :inline="true">
                <el-form-item label="背景色">
                    <el-color-picker v-model="trans.bg" size="small"/>
                </el-form-item>
                <el-form-item label="文字色">
                    <el-color-picker v-model="trans.fc" size="small"/>
                </el-form-item>
                <el-form-item label="宽度">
                    <el-input type="text" placeholder="宽度" style="width: 80px" v-model="trans.width" size="small"/>
                </el-form-item>
                <el-form-item label="高度">
                    <el-input type="text" placeholder="高度" style="width: 80px" v-model="trans.height" size="small"/>
                </el-form-item>
                <el-form-item label="文字">
                    <el-input type="text" placeholder="说明" style="width: 160px" v-model="trans.text" size="small" clearable/>
                </el-form-item>
            </el-form>
        </div>
        <div v-if="value.url" class="img-wrapper">
            <img :src="value.url" :alt="trans.text"> <br>
            <el-tooltip content="点击复制">
                <p @click="onCopy">{{ value.url }}</p>
            </el-tooltip>
        </div>
    </div>
</template>
<script lang="ts" setup>
import { trimEnd, trimStart } from 'lodash-es';
import { onMounted, reactive, watch } from 'vue';
import { appUrl } from '@/utils/conf';
import { copyText } from 'vue3-clipboard';
import { toast } from '@/utils/utils';

const trans = reactive({
    bg: '#282828',
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
            toast('无法复制:' + error, false)
        } else {
            toast('已复制 URL')
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
    let url = appUrl;
    let hwSpec = toNumber(trans.width) ? toNumber(trans.width) : '428';
    let width = toNumber(trans.width) ? toNumber(trans.width) : '428';
    let height = toNumber(trans.height) ? toNumber(trans.height) : '214';
    if (typeof height !== 'undefined') {
        hwSpec = `${width}x${height}`;
    }
    let textSpec = trans.text ? trans.text : '';

    // /
    let append = `?`;
    if (trans.bg !== '#282828') {
        append += `_bg=${trimStart(trans.bg, '#')}&`;
    }
    if (trans.fc !== '#EAE0D0') {
        append += `_fc=${trimStart(trans.fc, '#')}&`;
    }
    let resultUrl = `${url}/img/${hwSpec}`;
    if (textSpec) {
        resultUrl += `/${textSpec}`
    }
    if (append !== '?') {
        resultUrl += append;
    }
    value.url = trimEnd(resultUrl, '&');
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
        display: block;
    }
    p {
        cursor: pointer;
    }
}
</style>
