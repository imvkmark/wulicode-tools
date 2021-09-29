import { createRouter, createWebHashHistory, Router, RouteRecordRaw } from 'vue-router'
import PcLayout from '@/layouts/PcLayout.vue';
import Tool from '@/views/tool/Tool.vue';
import { get } from 'lodash-es';

const routes: Array<RouteRecordRaw> = [
    {
        path: '/',
        component: PcLayout,
        children: [
            {
                path: 'tool', component: Tool, children: [
                    { path: 'apidoc', component: () => import('@/views/tool/Apidoc.vue'), name: 'tool.apidoc' }
                ]
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
