import { createRouter, createWebHashHistory, Router, RouteRecordRaw } from 'vue-router'
import SiteLayout from '@/layouts/SiteLayout.vue';
import { get } from 'lodash-es';

const routes: Array<RouteRecordRaw> = [
    {
        path: '/',
        component: SiteLayout,
        redirect: '/tool/base64'
    },
    {
        path: '/',
        component: SiteLayout,
        children: [
            { path: 'home', component: () => import('@/views/home/Home.vue'), name: 'home.index' },
            { path: 'tool/apidoc', component: () => import('@/views/tool/Apidoc.vue'), name: 'tool.apidoc' },
            { path: 'tool/img', component: () => import('@/views/tool/Image.vue'), name: 'tool.img' },
            { path: 'tool/base64', component: () => import('@/views/tool/Base64.vue'), name: 'tool.base64' },
            { path: 'tool/url-decode', component: () => import('@/views/tool/UrlDecode.vue'), name: 'tool.url-decode' },
            { path: 'css/custom-box', component: () => import('@/views/css/CustomBox.vue'), name: 'css.custom-box' },
            { path: 'css/dash-middle', component: () => import('@/views/css/DashMiddle.vue'), name: 'css.dash-middle' },
            { path: 'css/animation', component: () => import('@/views/css/Animation.vue'), name: 'css.animation' },
            { path: 'js/sentry', component: () => import('@/views/js/Sentry.vue'), name: 'js.sentry' },
            { path: 'js/scroll', component: () => import('@/views/js/Scroll.vue'), name: 'js.scroll' },
            { path: 'js/info', component: () => import('@/views/js/Info.vue'), name: 'js.info' },
            { path: 'form/:type', component: () => import('@/framework/views/Form.vue'), name: 'form.index' },
            { path: 'grid/:type', component: () => import('@/framework/views/Grid.vue'), name: 'grid.index' }
        ]
    },
    {
        path: '/user', component: SiteLayout, children: [
            {
                path: 'cp',
                component: () => import('@/views/user/Cp.vue'),
                name: 'user.cp',
                meta: { title: '用户控制中心', auth: true }
            },
            {
                path: 'login',
                component: () => import('@/views/user/Login.vue'),
                name: 'user.login',
                meta: { title: '登录' }
            }
        ]
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
