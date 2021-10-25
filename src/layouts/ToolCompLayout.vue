<template>
    <div class="px--menu">
        <ul>
            <li :class="{active: item.name === trans.name}" v-for="item in trans.side" v-bind:key="item">
                <router-link :to="{name:item.name}">{{ item.title }}</router-link>
            </li>
        </ul>
    </div>
    <div class="px--main">
        <router-view/>
    </div>
</template>

<script lang="ts" setup>
import { reactive, watch } from 'vue'
import { useRouter } from 'vue-router';

const router = useRouter();
const trans = reactive({
    name: router.currentRoute.value.name,
    side: [
        { name: 'tool.apidoc', title: 'ApiDoc' },
        { name: 'tool.base64', title: 'Base64' },
        { name: 'tool.img', title: '图片占位符' },
        { name: 'tool.url-decode', title: 'Url 解码' }
    ]
})

watch(() => router.currentRoute.value.name, (newVal) => {
    trans.name = newVal;
})

</script>

<style scoped lang="less">
@import '../assets/style/vars';
</style>
