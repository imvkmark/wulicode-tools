/*
|--------------------------------------------------------------------------
| 全局配置文件
|--------------------------------------------------------------------------
|
*/

import { BrushFilled, Connection, ForkSpoon, HomeFilled, Sugar, User } from '@element-plus/icons';

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

