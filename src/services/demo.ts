import request from '@/utils/request';

export async function apiDemo(type: string, params: object, method: string) {
    return request({
        url: '/api/demo/' + type,
        params,
        method
    });
}

export async function apiGrid(url: string, params: object, method: string) {
    return request({
        url: url,
        params,
        method
    });
}


