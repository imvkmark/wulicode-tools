import { createRouter, createWebHashHistory, Router, RouteRecordRaw } from 'vue-router'
import PcLayout from '@/layouts/PcLayout.vue';
import { get } from 'lodash-es';

const routes: Array<RouteRecordRaw> = [
    {
        path: '/',
        component: PcLayout,
        children: [
            { path: 'login', component: () => import('@/views/pc/Login.vue'), name: 'pc.login' },
            { path: 'chat/:tid?', component: () => import('@/views/pc/Chat.vue'), name: 'pc.chat', meta: { auth: true } },
            { path: 'info', component: () => import('@/views/pc/Info.vue'), name: 'pc.info', meta: { auth: true } },
            { path: 'tool/:zone', component: () => import('@/views/tool/Tool.vue'), name: 'tool.home' }
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
