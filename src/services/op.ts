import { appPost } from "@/utils/request";


/**
 * Api Tool 转换
 */
export async function apiOpToolApidoc(params: object) {
    return appPost('/api_v1/op/tool/apidoc', params);
}
