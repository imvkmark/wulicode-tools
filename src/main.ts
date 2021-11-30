import { createApp } from 'vue'
// route
import router from '@/router/index'
import { key, store } from '@/store'
import App from './App.vue'
import * as Sentry from '@sentry/vue';
import { Integrations } from '@sentry/tracing';
import { appIsProd, appMode, appVersion, sentryDsnUrl } from '@/utils/conf';
import ElementPlus from 'element-plus'
import zhCn from 'element-plus/es/locale/lang/zh-cn'
import 'element-plus/dist/index.css'
import '@/assets/style/style.less';

const app = createApp(App)

Sentry.init({
    app,
    dsn: sentryDsnUrl,
    release: `${appMode}-${appVersion}`,
    environment: appMode,
    integrations: [
        new Integrations.BrowserTracing({
            routingInstrumentation: Sentry.vueRouterInstrumentation(router),
            tracingOrigins: ['wulicode.com', 'poppy.duoli.com', /^\//]
        })
    ],
    // 开发环境下不抛出错误
    sampleRate: appIsProd ? 1 : 1,
    /**
     * 线上环境捕捉 1%, 开发环境捕捉完整
     * https://docs.sentry.io/platforms/javascript/guides/vue/configuration/sampling/#setting-a-sampling-function
     */
    tracesSampler: () => {
        return 0
    }
});
app.use(ElementPlus, {
    locale: zhCn
})
    .use(router)
    .use(store, key)
    .mount('#app');
