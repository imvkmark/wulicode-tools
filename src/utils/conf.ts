/*
|--------------------------------------------------------------------------
| 全局配置文件
|--------------------------------------------------------------------------
|
*/

// 访问接口URL
export const appUrl: string = String(import.meta.env.VITE_APP_URL);

// App 版本号
export const appVersion = String(import.meta.env.DEF_APP_VERSION);

// App 环境
export const appMode = String(import.meta.env.MODE);

// 是否是生产环境
export const appIsProd = import.meta.env.PROD;

// 存储KEY
export const storageKey = {
    PY_DEVICE_ID: 'x-device-id',
    PY_CORE_INFO: 'x-core',
    PY_TOKEN: 'x-token',
    APP_USER: 'app-user',
    PC_TOKEN: 'pc-token',
    PC_IM_TOKEN: 'pc-im-token',
    PC_USER: 'pc-user'
}

// sentryDsn
export const sentryDsnUrl: string = String(import.meta.env.VITE_SENTRY_DSN_URL);
