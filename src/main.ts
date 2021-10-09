import { createApp } from 'vue'
// route
import router from '@/router/index'
import { key, store } from '@/store'
import App from './App.vue'
import * as Sentry from '@sentry/vue';
import { Integrations } from '@sentry/tracing';
import { appIsProd, appMode, appVersion, sentryDsnUrl } from '@/utils/conf';
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import '@/assets/style/style.less';

const app = createApp(App)

app.use(ElementPlus);


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
    sampleRate: appIsProd ? 1 : 0,
    /**
     * 线上环境捕捉 1%, 开发环境捕捉完整
     * https://docs.sentry.io/platforms/javascript/guides/vue/configuration/sampling/#setting-a-sampling-function
     */
    tracesSampler: () => {
        if (appIsProd && appMode === 'dev') {
            return 1;
        }
        if (appIsProd) {
            return 0.3;
        }
        return 0;
    }
});
app.use(router)
    .use(store, key)
    .mount('#app');
