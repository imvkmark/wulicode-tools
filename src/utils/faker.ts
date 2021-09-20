import { get } from 'lodash-es';

export const fakerImageUrl: (width: number, height: number) => string = function (width: number = 20, height: number = 20): string {
    return `https://jdc.jd.com/img/${width}x${height}`;
};


/**
 * 根据传参生成假的分页数据
 * @param params
 */
export const fakerSize = function (params: object): FakerSizeResult {
    let pagesize = get(params, 'pagesize', 15);
    let total = get(params, 'total', 35);
    let pages = Math.ceil(total / pagesize);
    let page = get(params, 'page', 1);
    let pageNums = [];
    for (let i = 1; i <= pages; i++) {
        if (i !== pages) {
            pageNums.push(pagesize);
        } else {
            pageNums.push(total - (i - 1) * pagesize);
        }
    }
    let size = pageNums[page - 1];
    return {
        size,
        total,
        pages,
        page,
        pagesize
    }
}