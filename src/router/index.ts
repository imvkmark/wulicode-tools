import { createRouter, createWebHashHistory, Router, RouteRecordRaw } from 'vue-router'
import SideLayout from '@/layouts/SideLayout.vue';
import EmptyLayout from '@/layouts/EmptyLayout.vue';
import SideNavLayout from '@/layouts/SideNavLayout.vue';
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
                path: 'tool', component: SideNavLayout, children: [
                    { path: 'apidoc', component: () => import('@/views/tool/Apidoc.vue'), name: 'tool.apidoc' },
                    { path: 'img', component: () => import('@/views/tool/Image.vue'), name: 'tool.img' },
                    { path: 'base64', component: () => import('@/views/tool/Base64.vue'), name: 'tool.base64' },
                    { path: 'url-decode', component: () => import('@/views/tool/UrlDecode.vue'), name: 'tool.url-decode' }
                ]
            },
            {
                path: 'css', component: SideNavLayout, children: [
                    { path: 'custom-box', component: () => import('@/views/css/CustomBox.vue'), name: 'css.custom-box' },
                    { path: 'dash-middle', component: () => import('@/views/css/DashMiddle.vue'), name: 'css.dash-middle' },
                    { path: 'animation', component: () => import('@/views/css/Animation.vue'), name: 'css.animation' },
                ]
            },
            {
                path: 'js', component: SideNavLayout, children: [
                    { path: 'sentry', component: () => import('@/views/js/Sentry.vue'), name: 'js.sentry' },
                    { path: 'scroll', component: () => import('@/views/js/Scroll.vue'), name: 'js.scroll' }
                ]
            },
            {
                path: 'form', component: SideNavLayout, children: [
                    { path: 'text', component: () => import('@/views/form/Text.vue'), name: 'form.text' }
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
