import { defineConfig } from 'vite';
// 直接引入上一级的源码（tsup 开发模式下推荐）
import fileServer from '../src/index';
import type { Plugin } from 'vite';

export default defineConfig({
    plugins: [
        fileServer({
            enable: true
        }) as Plugin // as any
    ]
});
