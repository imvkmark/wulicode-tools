import { appPost } from '@/utils/request';

/**
 * 发送验证码
 */
export async function apiPySystemCaptchaSend(params: object) {
    return appPost('/api_v1/system/captcha/send', params);
}


export async function apiPySystemAuthLogin(params: object) {
    return appPost('/api_v1/system/auth/login', params);
}

/**
 *上传图片
 */
export function apiPySystemUploadImage(image: any) {
    const data = new FormData()
    data.set('image', image, image.name)
    return appPost('api_v1/system/upload/image', data);
}

/**
 *上传图片
 */
export function apiPySystemUploadFile(image: any, type: string) {
    const data = new FormData()
    data.set('file', image, image.name);
    data.set('type', type);
    return appPost('api_v1/system/upload/file', data);
}


/**
 * 退出登录
 */
export async function apiPySystemAuthLogout() {
    return appPost('/api_v1/system/auth/logout');
}

/**
 * Core Info
 */
export async function apiPySystemCoreInfo() {
    return appPost('/api_v1/system/core/info');
}

export async function apiPyRequest(url: string, params: object) {
    return appPost(url, params);
}
