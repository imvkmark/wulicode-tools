<template>
    <PxMain title="全局样式">
        <ElRow :gutter="20">
            <ElCol :span="12">
                <h3>全局样式</h3>
                <div class="global">
                    <span>Purple</span>
                    <p>
                        默认, 颜色是蓝色
                        <span class="initial">初始属性 : Initial</span>
                        <span class="inherit">继承属性: Inherit</span>
                        <span class="unset">Unset</span>
                        <span class="revert">Revert</span>
                        <span class="all">All Unset</span>
                    </p>
                </div>
            </ElCol>
            <ElCol :span="12">

            </ElCol>
        </ElRow>
    </PxMain>
</template>

<script lang="ts" setup>
import PxMain from '@/components/base/PxMain.vue';</script>

<style scoped lang="less">
span {
    color: purple;
}

.global {
    color: blue;
    font-size: 20px;
    p {
        color: red;
    }
    span.initial {
        color: initial;
    }
    span.inherit {
        color: inherit;
    }
    span.unset {
        color: unset;
    }
    span.revert {
        color: revert;
    }
    span.all {
        all: unset;
    }
}

</style>
