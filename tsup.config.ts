/*
 * @Author: Varian LIn
 * @Date: 2025-12-09 23:03:47
 * @LastEditors: Varian LIn
 * @LastEditTime: 2026-03-12 15:29:58
 * @Description:
 */
import { defineConfig } from 'tsup';

export default defineConfig({
    // entry: ['src/index.ts'],
    entry: {
        // index: 'src/index_26031201.ts'
        // index: 'src/index_26031202.ts'
        // index: 'src/index_26031203.ts'
        index: 'src/v1_1_0_theme/index.ts'
    },
    format: ['cjs', 'esm'], // 同时输出 CommonJS 和 ES Module
    dts: true, // 生成 .d.ts 类型文件
    clean: true, // 每次打包前清空 dist
    splitting: false,
    loader: {
        '.html': 'text' // 将 .html 文件视为字符串导入
    },
    outDir: 'release/plugin/'
});
