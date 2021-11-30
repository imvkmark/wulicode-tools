<template>
    <div v-if="includes(keys(routes), trans.prefix)"
        :class="{sidebar:true, ...sizeClass(trans.size), float:trans.active}">
        <div v-for="(item, key) in routes" :key="item">
            <h3>{{ key }}</h3>
            <ul>
                <li v-for="rt in item" :key="rt.name" :class="{active : rt.name === trans.name && trans.params === get(rt, 'params', {})}">
                    <span @click="onLinkClick(rt.name, get(rt, 'params', {}))">{{ rt.title }}</span>
                </li>
            </ul>
        </div>
    </div>
</template>
<script lang="ts" setup>
import { computed, onMounted, reactive, watch } from 'vue'
import { useRouter } from 'vue-router';
import { useStore } from '@/store';
import { sizeClass } from '@/utils/defs';
import { get, includes, keys } from 'lodash-es';

const router = useRouter();
const store = useStore();
const trans = reactive({
    name: computed(() => router.currentRoute.value.name),
    params: {},
    active: computed(() => store.state.sidebarActive),
    size: computed(() => store.state.size),
    prefix: computed(() => store.state.prefix)
})
const routes = {
    tool: [
        { name: 'tool.apidoc', title: 'ApiDoc' },
        { name: 'tool.base64', title: 'Base64' },
        { name: 'tool.img', title: '图片占位符' },
        { name: 'tool.url-decode', title: 'Url 解码' }
    ],
    form: [
        { name: 'form.index', title: 'Field-Textarea', params: { type: 'field-textarea' } },
        { name: 'form.index', title: 'Field-Radio', params: { type: 'field-radio' } },
        { name: 'form.index', title: 'Field-Checkbox', params: { type: 'field-checkbox' } },
        { name: 'form.index', title: 'Field-Text', params: { type: 'field-text' } },
        { name: 'form.index', title: 'Field-Number', params: { type: 'field-number' } },
        { name: 'form.index', title: 'Field-Color', params: { type: 'field-color' } },
        { name: 'form.index', title: 'Field-Date', params: { type: 'field-date' } },
        { name: 'form.index', title: 'Rule-Text', params: { type: 'rule-text' } },
        { name: 'form.index', title: 'Rule-Required', params: { type: 'rule-required' } },
        { name: 'form.index', title: 'Rule-Date', params: { type: 'rule-date' } }
    ],
    js: [
        { name: 'js.sentry', title: '异常' },
        { name: 'js.scroll', title: '滚动' },
        { name: 'js.info', title: '基本信息' }
    ],
    css: [
        { name: 'css.custom-box', title: '自定义Checkbox' },
        { name: 'css.dash-middle', title: '居中线' },
        { name: 'css.animation', title: '动画' }
    ]
}
const onLinkClick = (name: string, params: any) => {
    trans.params = params;
    router.push({
        name,
        params
    })
    store.dispatch('SwitchSidebar', false);
}
const initSideBar = () => {

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
    left: -240px;
    background: #FFF;
    height: calc(100vh - 4rem);
    z-index: 5;
    min-width: 240px;
    box-sizing: border-box;
    border-right: 1px solid var(--wc-side-border-color);
    transition: left 0.3s;
    .close {
        padding: 0.8rem 1.2rem;
        height: 2rem;
        box-sizing: content-box;
        display: none;
    }
    // 浮动显示
    &.float {
        left: 0;
        .el-icon {
            font-size: 2rem;
            cursor: pointer;
        }
        .close {
            display: flex;
            justify-content: flex-start;
        }
    }
    h3 {
        font-size: 12px;
        font-weight: normal;
        padding-left: 1rem;
        color: var(--wc-color-dark-blue);
    }
    ul {
        list-style: none;
        padding-left: 0.8rem;
        li {
            height: 18px;
            line-height: 18px;
            margin-bottom: 8px;
            font-size: 14px;
            border-left: 2px solid transparent;
            cursor: pointer;
            &.active {
                span {
                    border-left: 2px solid @primaryColor;
                }
            }
            span {
                padding-left: 1rem;
                border-left: 2px solid transparent;
                color: var(--wc-color-dark-blue);
                text-decoration: none;
                display: block;
            }
        }
    }
}

.md, .sm, .xs {
    position: absolute;
}

.xl, .lg, .xxl {
    .close {
        display: none;
    }
}
</style>
