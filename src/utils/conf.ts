/*
|--------------------------------------------------------------------------
| 全局配置文件
|--------------------------------------------------------------------------
|
*/
import { BrushFilled, Connection, ForkSpoon, HomeFilled, Sugar, User } from '@element-plus/icons';

// App 版本号
export const appVersion = String(import.meta.env.DEF_APP_VERSION);

// sentryDsn
export const sentryDsnUrl: string = String(import.meta.env.VITE_SENTRY_DSN_URL);

/**
 * App Nav 定义
 */
export const appNavDefs = {
    home: HomeFilled,
    tool: ForkSpoon,
    js: Sugar,
    form: Connection,
    css: BrushFilled,
    user: User
}


