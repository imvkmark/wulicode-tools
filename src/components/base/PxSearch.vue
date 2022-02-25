<template>
    <ElDialog v-model="trans.visible">
        <div class="search">
            <ElInput v-model="trans.kw" size="large"/>
            <ElScrollbar height="60vh">
                <ul>
                    <li v-for="(nav, title) in searched" :key="nav">
                        <h3>{{ title }}</h3>
                        <p v-for="menu in nav" :key="menu" @click="goNav(menu)">
                            {{ get(menu, 'titleAll') }}
                        </p>
                    </li>
                </ul>
            </ElScrollbar>
        </div>
    </ElDialog>
</template>
<script lang="ts" setup>
import { computed, onMounted, reactive, watch } from 'vue';
import { useRouter } from 'vue-router';
import { useStore } from '@/store';
import { each, filter, get, groupBy, keys, lowerCase } from "lodash-es";

const props = defineProps({
    modelValue: {
        type: Boolean,
        default: () => {
            return false
        }
    }
})

const emit = defineEmits([
    'update:modelValue'
])

let router = useRouter();
let store = useStore();
const trans = reactive({
    navs: computed(() => store.state.nav.navs),
    format: [],
    visible: true,
    kw: '',
});

const searched = computed(() => {
    let filtered = filter(trans.format, (item) => {
        return String(get(item, 'titleCi')).indexOf(lowerCase(trans.kw)) >= 0
    });
    return groupBy(filtered, function (item) {
        return get(item, 'navTitle')
    });
})

watch(() => trans.visible, (val) => {
    emit('update:modelValue', val)
})

const goNav = (nav: any) => {
    router.push(get(nav, 'route'));
    trans.visible = false;
}


const init = () => {
    const convertToSearch = (nav: any, menu: any, submenu: any, level: number) => {
        let from;
        if (level === 1) {
            from = nav;
        } else if (level === 2) {
            from = menu;
        } else {
            from = submenu
        }

        const navTitle = level >= 1 ? get(nav, 'title') : '';
        const menuTitle = level >= 2 ? get(menu, 'title') : '';
        const subMenuTitle = level >= 3 ? get(submenu, 'title') : '';
        const titleAll = `${navTitle ? navTitle : ''} ${menuTitle ? '-' + menuTitle : ''} ${subMenuTitle ? '-' + subMenuTitle : ''}`;
        const titleCi = lowerCase(titleAll);
        return {
            navTitle,
            menuTitle,
            subMenuTitle,
            titleAll,
            titleCi,
            route: {
                name: get(from, 'name'),
                params: get(from, 'params'),
                query: get(from, 'query'),
            }
        }
    }
    let allPlainNavs = <any>[];
    each(trans.navs, (nav) => {
        const menus = get(nav, 'children', []);
        if (menus.length) {
            each(menus, (menu) => {
                const submenus = get(menu, 'children', []);
                if (submenus.length) {
                    each(submenus, (submenu) => {
                        allPlainNavs.push(convertToSearch(nav, menu, submenu, 3))
                    })
                } else {
                    allPlainNavs.push(convertToSearch(nav, menu, menu, 2))
                }
            })
        } else {
            allPlainNavs.push(convertToSearch(nav, nav, nav, 1))
        }
    })
    trans.format = allPlainNavs;
}

watch(() => trans.navs, () => {
    init();
})
watch(() => props.modelValue, (newVal) => {
    trans.visible = newVal
})

onMounted(() => {
    if (keys(trans.navs).length) {
        init();
    }
    trans.visible = props.modelValue;
})
</script>

<style lang="less" scoped>
.search {
    .search-icon {
        cursor: pointer;
        height: 3.5rem;
        margin-right: 1rem;
        margin-left: 1rem;
        font-size: 1.2rem;
        &:hover {
            color: var(--wc-link-active-color);
        }
    }
}
</style>
