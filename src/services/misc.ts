import request from "@/utils/request";

/**
 * ApiDoc 添加
 */
export async function apiMiscApidocAdd(params: object) {
    return request({
        url: '/api/misc/apidoc/add',
        params
    });
}

/**
 * 移除 Apidoc
 * @param params
 */
export async function apiMiscApidocDelete(params: object) {
    return request({
        url: '/api/misc/apidoc/delete',
        params
    });
}

/**
 * 刷新文档
 * @param params
 */
export async function apiMiscApidocRefresh(params: object) {
    return request({
        url: '/api/misc/apidoc/refresh',
        params
    });
}

/**
 * 请求 Data Json 数据
 * @param params
 */
export async function apiMiscApidocJson(params: object) {
    return request({
        url: '/api/misc/apidoc/json',
        params
    });
}

/**
 * 保存
 * @param params
 */
export async function apiMiscApidocSave(params: object) {
    return request({
        url: '/api/misc/apidoc/save',
        params
    });
}
