import { createRouter, createWebHashHistory, Router, RouteRecordRaw } from 'vue-router'
import PcLayout from '@/layouts/PcLayout.vue';
import ToolLayout from '@/layouts/ToolLayout.vue';
import PcFullFill from '@/layouts/PcFullFill.vue';
import { get } from 'lodash-es';

const routes: Array<RouteRecordRaw> = [
    {
        path: '/',
        component: PcLayout,
        children: [
            {
                path: 'tool', component: ToolLayout, children: [
                    { path: 'apidoc', component: () => import('@/views/tool/Apidoc.vue'), name: 'tool.apidoc' },
                    { path: 'img', component: () => import('@/views/tool/Image.vue'), name: 'tool.img' },
                    { path: 'base64', component: () => import('@/views/tool/Base64.vue'), name: 'tool.base64' }
                ]
            }
        ]
    },
    {
        path: '/user', component: PcFullFill, children: [
            { path: 'login', component: () => import('@/views/user/Login.vue'), name: 'user.login' }
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
