/*
 * @Author: Varian LIn
 * @Date: 2026-03-12 16:21:45
 * @LastEditors: Varian LIn
 * @LastEditTime: 2026-03-20 16:54:54
 * @Description: 
 */
import { defineConfig } from 'vite';
// 直接引入上一级的源码（tsup 开发模式下推荐）
// import fileServer from '../src/index';
import fileServer from '../release/plugin/index.cjs';
import type { Plugin } from 'vite';

export default defineConfig({
    plugins: [
        fileServer({
            enable: true,
            // theme: 'dark',
            theme: 'light'
        }) as Plugin // as any
    ],
    server: {
        host: true, // 设置0.0.0.0和true 就是监听所有
        port: 5973,
        // open: true,
        // proxy: {
        //     '/style/': {
        //         target: 'http://localhost:5173/apps/style',
        //         changeOrigin: true,
        //         rewrite: (path) => path.replace(/^\/style/, '')
        //     },
        //     '/sampledata/': {
        //         target: 'http://localhost:5173/apps/sampledata',
        //         changeOrigin: true,
        //         rewrite: (path) => path.replace(/^\/sampledata/, '')
        //     }
        //     // '/apps/': {
        //     //     target: 'http://localhost:5173/apps',
        //     //     changeOrigin: true,
        //     //     rewrite: (path) => path.replace(/^\/apps/, '')
        //     // }
        // }
    }
});
