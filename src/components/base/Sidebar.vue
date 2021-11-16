<template>
    <div :class="{sidebar:true, ...sizeClass(trans.size), active:trans.active}" v-if="trans.side.length">
        <ul>
            <li :class="{active: item.name === trans.name}" v-for="item in trans.side" v-bind:key="item">
                <router-link :to="{name:item.name}">{{ item.title }}</router-link>
            </li>
        </ul>
    </div>
</template>
<script lang="ts" setup>
import { computed, onMounted, reactive, watch } from 'vue'
import { useRouter } from 'vue-router';
import { get } from 'lodash-es';
import { useStore } from '@/store';
import { sizeClass } from '@/utils/defs';

const router = useRouter();
const store = useStore();
const routes = {
    tool: [
        { name: 'tool.apidoc', title: 'ApiDoc' },
        { name: 'tool.base64', title: 'Base64' },
        { name: 'tool.img', title: '图片占位符' },
        { name: 'tool.url-decode', title: 'Url 解码' }
    ],
    form: [
        { name: 'form.text', title: 'Text' }
    ],
    js: [
        { name: 'js.sentry', title: '异常' },
        { name: 'js.scroll', title: '滚动' }
    ],
    css: [
        { name: 'css.custom-box', title: '自定义Checkbox' },
        { name: 'css.dash-middle', title: '居中线' },
        { name: 'css.animation', title: '动画' }
    ]
}

const trans = reactive({
    name: computed(() => router.currentRoute.value.name),
    active: computed(() => store.state.sidebarActive),
    size: computed(() => store.state.size),
    side: [
        { name: 'tool.apidoc', title: 'ApiDoc' }
    ]
})

const initSideBar = () => {
    trans.side = get(routes, store.state.prefix, [])
}

watch(() => store.state.prefix, () => {
    initSideBar()
})

onMounted(() => {
    initSideBar()
})
</script>

<style scoped lang="less">
@import '../../assets/style/vars';

.md, .sm, .xs {
    position: absolute;
    right: -240px;
    transition: right 0.3s;
    &.active {
        right: 0;
    }
}

.sidebar {
    background: #FFF;
    height: calc(100vh - 4rem);
    z-index: 5;
    min-width: 240px;
    box-sizing: border-box;
    border-right: 1px solid #E1EDFF;
    ul {
        list-style: none;
        padding-left: 0.8rem;
        li {
            padding-left: 1rem;
            height: 18px;
            line-height: 18px;
            margin-bottom: 8px;
            font-size: 14px;
            border-left: 2px solid transparent;
            &.active {
                border-left: 2px solid @primaryColor;
            }
            a {
                color: var(--wc-color-dark-blue);
                text-decoration: none;
                display: block;
            }
        }
    }
}
</style>
