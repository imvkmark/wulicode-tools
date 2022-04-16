/*
|--------------------------------------------------------------------------
| 框架定义文件
|--------------------------------------------------------------------------
|
*/
//region Vite 定义
// 访问接口URL
export const appUrl: string = String(import.meta.env.VITE_APP_URL);

// App 环境
export const appMode = String(import.meta.env.MODE);

// App 版本号
export const appVersion = String(import.meta.env.PY_APP_VERSION);

// 是否是生产环境
export const appIsProd = import.meta.env.PROD;
//endregion

//region 存储KEY
// 存储KEY
export const storageKey = {
    core: 'x-core',
    theme: 'x-theme',
    navs: 'x-navs',
}

export const pyFileExtensions = {
    images: ['jpg', 'jpeg', 'png', 'gif'],
    audio: ['mp3', 'm4a', 'wav', 'aac'],
    video: ['mp4', 'rm', 'rmvb', 'wmv']
}

export const storageTokenKey = () => {
    return `x-token`
}

export const storageDevApidocApiCurrentKey = () => {
    return `x-dev-apidoc-api-current`
}

export const storageDevApidocCertsKey = () => {
    return `x-dev-apidoc-certs`
}

export const storageDevApidocQueryParamKey = () => {
    return `x-dev-apidoc-query_params`
}

export const storageDevApidocApiLastSavedKey = (type: any) => {
    return `x-dev-apidoc-api-last-saved:${type}`;
}
//endregion


//region EMITTERS
export const USER_LOGIN = 'user:login'
export const USER_LOGOUT = 'user:logout'
//endregion
