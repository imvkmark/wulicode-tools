import vue from '@vitejs/plugin-vue'
import { svgBuilder } from './src/utils/main/svgBuilder';
import pkgJson from './package.json';
// 如果编辑器提示 path 模块找不到，则可以安装一下 @types/node -> npm i @types/node -D
import { resolve } from 'path'
import { defineConfig } from 'vite';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
    // 读取环境变量放置到代码中
    const fs = require('fs')
    const dotenv = require('dotenv')
    const envFiles = [
        `./config/.env`, // default file
        `./config/.env.${mode}` // mode file
    ]

    for (const file of envFiles) {
        const envConfig = dotenv.parse(fs.readFileSync(file))
        for (const k in envConfig) {
            process.env[k] = envConfig[k]
        }
    }

    return {
        envDir: './config/',
        plugins: [
            vue(),
            svgBuilder('./src/assets/svg/')
        ],
        resolve: {
            alias: {
                '@': resolve(__dirname, 'src/') // 设置 `@` 指向 `src` 目录
            }
        },
        base: '/tools/',
        define: {
            'import.meta.env.PY_APP_VERSION': JSON.stringify(pkgJson.version)
        },
        build: {
            outDir: `build/wulicode-${mode}`,
            sourcemap: false,
            rollupOptions: {
                output: {
                    manualChunks: {
                        lodash: ['lodash-es'],
                        element: ['element-plus'],
                        crypto: ['crypto-js']
                    }
                }
            }
        },
        server: {
            port: 9241, // 设置服务启动端口号
            cors: true, // 允许跨域
            host: '0.0.0.0'
        }
    }
});
