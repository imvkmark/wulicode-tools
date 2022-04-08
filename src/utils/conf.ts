/*
|--------------------------------------------------------------------------
| 框架定义文件
|--------------------------------------------------------------------------
|
*/

// 访问接口URL
export const pyAppUrl: string = String(import.meta.env.VITE_APP_URL);

// App 环境
export const pyAppMode = String(import.meta.env.MODE);

// App 版本号
export const pyAppVersion = import.meta.env.PY_APP_VERSION;

// 是否是生产环境
export const pyAppIsProd = import.meta.env.PROD;

// 存储KEY
export const pyStorageKey = {
    deviceId: 'x-device-id',
    localCache: 'x-local-cache',
    core: 'x-core',
    theme: 'x-theme',
    navs: 'x-navs',
}

export const pyFileExtensions = {
    images: ['jpg', 'jpeg', 'png', 'gif'],
    audio: ['mp3', 'm4a', 'wav', 'aac'],
    video: ['mp4', 'rm', 'rmvb', 'wmv']
}

export const pyStorageTokenKey = () => {
    return `x-token`
}

export const pyStorageDevApidocApiCurrentKey = () => {
    return `x-dev-apidoc-api-current`
}

export const pyStorageDevApidocCertsKey = () => {
    return `x-dev-apidoc-certs`
}

export const pyStorageDevApidocQueryParamKey = () => {
    return `x-dev-apidoc-query_params`
}

export const pyStorageDevApidocApiLastSavedKey = (type: any) => {
    return `x-dev-apidoc-api-last-saved:${type}`;
}
