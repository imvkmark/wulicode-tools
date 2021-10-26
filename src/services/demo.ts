import request from '@/utils/request';

/**
 * 文本
 */
export async function apiDemoFormText(params: object, method: string) {
    return request({
        url: '/api/demo/form/text',
        params,
        method
    });
}
