/*
|--------------------------------------------------------------------------
| 全局配置文件
|--------------------------------------------------------------------------
|
*/

import { BrushFilled, Connection, ForkSpoon, HomeFilled, Sugar, User } from '@element-plus/icons';
import { indexOf } from 'lodash-es';

export const navDefs = {
    home: HomeFilled,
    tool: ForkSpoon,
    js: Sugar,
    form: Connection,
    css: BrushFilled,
    user: User
}

export const sizeClass = (size: string) => {
    return {
        xs: size === 'xs',
        sm: size === 'sm',
        md: size === 'md',
        lg: size === 'lg',
        xl: size === 'xl',
        xxl: size === 'xxl'
    }
}

const sizes = ['xs', 'sm', 'md', 'lg', 'xl', 'xxl'];

export const sizeGt = (a: string, b: string) => {
    let ia = indexOf(sizes, a);
    let ib = indexOf(sizes, b);
    return ia > ib;
}
export const sizeLt = (a: string, b: string) => {
    let ia = indexOf(sizes, a);
    let ib = indexOf(sizes, b);
    return ia < ib;
}

export const sizeGte = (a: string, b: string) => {
    let ia = indexOf(sizes, a);
    let ib = indexOf(sizes, b);
    return ia >= ib;
}

export const sizeLte = (a: string, b: string) => {
    let ia = indexOf(sizes, a);
    let ib = indexOf(sizes, b);
    return ia <= ib;
}
