import { appPost } from "@/utils/request";

/**
 * ApiDoc 添加
 */
export async function apiMiscApidocAdd(params: object) {
    return appPost('/api/misc/apidoc/add', params);
}

/**
 * 移除 Apidoc
 * @param params
 */
export async function apiMiscApidocDelete(params: object) {
    return appPost('/api/misc/apidoc/delete', params);
}

/**
 * Local
 * @param params
 */
export async function apiMiscApidocLocal(params: object) {
    return appPost('/api/misc/apidoc/local', params);
}

/**
 * 刷新文档
 * @param params
 */
export async function apiMiscApidocRefresh(params: object) {
    return appPost('/api/misc/apidoc/refresh', params);
}

/**
 * 请求 Data Json 数据
 * @param params
 */
export async function apiMiscApidocJson(params: object) {
    return appPost('/api/misc/apidoc/json', params);
}

/**
 * 保存
 * @param params
 */
export async function apiMiscApidocSave(params: object) {
    return appPost('/api/misc/apidoc/save', params);
}
