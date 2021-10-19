<template>
    <div class="tool">
        <div id="menu">
            <ul>
                <li :class="{active: item.name === trans.name}" v-for="item in trans.side" v-bind:key="item">
                    <router-link :to="{name:item.name}">{{ item.title }}</router-link>
                </li>
            </ul>
        </div>
        <div class="px--tool">
            <router-view/>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { reactive, watch } from 'vue'
import { useRouter } from 'vue-router';

const router = useRouter();
const trans = reactive({
    name: router.currentRoute.value.name,
    side: [
        { name: 'demo.sentry', title: '异常' }
    ]
})

watch(() => router.currentRoute.value.name, (newVal) => {
    trans.name = newVal;
})

</script>

<style scoped lang="less">
@import '../assets/style/vars';

.tool {
    display: flex;
    height: calc(100vh - 4rem);
}


#menu {
    background: #FFF;
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
