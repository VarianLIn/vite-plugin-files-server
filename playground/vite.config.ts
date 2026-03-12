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
            theme: 'light',
        }) as Plugin // as any
    ]
});
