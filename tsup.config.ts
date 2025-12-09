/*
 * @Author: Varian LIn
 * @Date: 2025-12-09 23:03:47
 * @LastEditors: Varian LIn
 * @LastEditTime: 2025-12-09 23:04:01
 * @Description: 
 */
import { defineConfig } from 'tsup';

export default defineConfig({
    entry: ['src/index.ts'],
    format: ['cjs', 'esm'], // 同时输出 CommonJS 和 ES Module
    dts: true, // 生成 .d.ts 类型文件
    clean: true, // 每次打包前清空 dist
    splitting: false
});
