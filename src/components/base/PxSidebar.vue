<template>
    <el-collapse v-model="trans.accordion" accordion v-if="includes(keys(routes), trans.prefix)"
        :class="{'px--sidebar':true, sidebar:true, ...sizeClass(trans.size), active:trans.active}">
        <el-collapse-item :title="key" :name="key" v-for="(item, key) in routes" :key="item">
            <ul>
                <li v-for="rt in item" :key="rt.name">
                    <router-link :to="{name:rt.name}">{{ rt.title }}</router-link>
                </li>
            </ul>
        </el-collapse-item>
    </el-collapse>
</template>
<script lang="ts" setup>
import { computed, onMounted, reactive, watch } from 'vue'
import { useRouter } from 'vue-router';
import { useStore } from '@/store';
import { sizeClass } from '@/utils/defs';
import { includes, keys } from 'lodash-es';

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
    prefix: computed(() => store.state.prefix),
    accordion: ''
})

const initSideBar = () => {
    trans.accordion = store.state.prefix;
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


.sidebar {
    position: absolute;
    right: -240px;
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
            height: 18px;
            line-height: 18px;
            margin-bottom: 8px;
            font-size: 14px;
            border-left: 2px solid transparent;
            a {
                padding-left: 1rem;
                &.router-link-active {
                    border-left: 2px solid @primaryColor;
                }
                color: var(--wc-color-dark-blue);
                text-decoration: none;
                display: block;
            }
        }
    }
}

.md, .sm, .xs {
    position: absolute;
    right: -240px;
    transition: right 0.3s;
    &.active {
        right: 0;
    }
}

.xl, .lg, .xxl {
    position: relative;
    right: 0;
}
</style>
