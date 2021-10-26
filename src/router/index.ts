import { createRouter, createWebHashHistory, Router, RouteRecordRaw } from 'vue-router'
import SideLayout from '@/layouts/SideLayout.vue';
import ToolCompLayout from '@/layouts/ToolCompLayout.vue';
import EmptyLayout from '@/layouts/EmptyLayout.vue';
import DemoCompLayout from '@/layouts/DemoCompLayout.vue';
import { get } from 'lodash-es';

const routes: Array<RouteRecordRaw> = [
    {
        path: '/',
        component: SideLayout,
        redirect: '/tool/base64'
    },
    {
        path: '/',
        component: SideLayout,
        children: [
            {
                path: 'tool', component: ToolCompLayout, children: [
                    { path: 'apidoc', component: () => import('@/views/tool/Apidoc.vue'), name: 'tool.apidoc' },
                    { path: 'img', component: () => import('@/views/tool/Image.vue'), name: 'tool.img' },
                    { path: 'base64', component: () => import('@/views/tool/Base64.vue'), name: 'tool.base64' },
                    { path: 'url-decode', component: () => import('@/views/tool/UrlDecode.vue'), name: 'tool.url-decode' }
                ]
            },
            {
                path: 'demo', component: DemoCompLayout, children: [
                    { path: 'sentry', component: () => import('@/views/demo/Sentry.vue'), name: 'demo.sentry' },
                    { path: 'custom-box', component: () => import('@/views/demo/CustomBox.vue'), name: 'demo.custom-box' },
                    { path: 'dash-middle', component: () => import('@/views/demo/DashMiddle.vue'), name: 'demo.dash-middle' },
                    { path: 'scroll', component: () => import('@/views/demo/Scroll.vue'), name: 'demo.scroll' }
                ]
            }
        ]
    },
    {
        path: '/user', component: EmptyLayout, children: [
            {
                path: 'cp', component: () => import('@/views/user/Cp.vue'), name: 'user.cp', meta: {
                    title: '用户控制中心'
                }
            }
        ]
    },
    {
        path: '/user/login', component: () => import('@/views/user/Login.vue'), name: 'user.login'
    }
]

const router: Router = createRouter({
    history: createWebHashHistory(),
    routes
})

router.beforeEach((to, from, next) => {
    let title = get(to, 'meta.title');
    if (title) {
        document.title = title;
    }
    next();
});
export default router
