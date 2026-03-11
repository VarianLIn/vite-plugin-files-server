/*
 * @Author: Varian LIn
 * @Date: 2025-12-09 23:03:20
 * @LastEditors: Varian LIn
 * @LastEditTime: 2026-03-11 17:28:31
 * @Description:
 */

import type { Plugin, ViteDevServer } from 'vite';
import fs from 'fs';
import path from 'path';
import templateString from './temp.html?raw';

interface FilesServerOptions {
    enable?: boolean; // 是否启用
    root?: string; // 根目录，默认为项目根目录
}

export default function fileServerPlugin(options: FilesServerOptions = {}): Plugin {
    const { enable = true } = options;

    return {
        name: 'vite-plugin-files-server', // 必须唯一

        // 核心钩子：配置开发服务器
        configureServer(server: ViteDevServer) {
            if (!enable) return;

            // 添加一个中间件
            server.middlewares.use((req, res, next) => {
                const url = req.url ? decodeURIComponent(req.url.split('?')[0]) : '/';

                // 🌟 关键修复：如果是 Vite 内部请求或 HMR 请求，直接放行
                if (url.startsWith('/@') || url.includes('vite')) {
                    return next();
                }

                // 获取物理路径
                const projectRoot = server.config.root;
                const fullPath = path.join(projectRoot, url);

                try {
                    // 检查路径是否存在且为目录
                    if (fs.existsSync(fullPath) && fs.statSync(fullPath).isDirectory()) {
                        // 如果目录下有 index.html，交给 Vite 默认处理，不要拦截
                        if (fs.existsSync(path.join(fullPath, 'index.html'))) {
                            return next();
                        }

                        // 面包屑
                        let urlSplitArray = url.split('/');
                        if (urlSplitArray[urlSplitArray.length - 1] == '') urlSplitArray = urlSplitArray.slice(0, -1);
                        let headItem: string = '<a href="/">🏠︎</a> / ';
                        urlSplitArray.forEach((p) => {
                            p && (headItem += `<a href="/${p}">${p}</a> / `);
                        });

                        // 生成文件列表 HTML
                        const files = fs.readdirSync(fullPath);
                        const listItems = files
                            .map((file) => {
                                const filePath = path.join(fullPath, file);
                                const isDir = fs.statSync(filePath).isDirectory();
                                // const icon = isDir ? '📁' : '📄';
                                const href = path.join(url, file).replace(/\\/g, '/');
                                const item = `
                                    <li>
                                        <a href="${href}" class="icon ${isDir ? 'icon-directory' : 'icon-html icon-text-html'}"> 
                                            <span class="name">${file}</span> 
                                        </a>
                                    </li>`;
                                return item;
                            })
                            .join('');
                        // 退回功能
                        urlSplitArray = urlSplitArray.slice(0, -1);
                        let backUrl = urlSplitArray.join('/');
                        const backItem = `
                            <li>
                                <a href="${backUrl}" class="icon icon-directory"><span class="name">..</span></a>
                            </li>`;
                        let fullList = urlSplitArray.length > 1 ? backItem + listItems : listItems;

                        const html = templateString
                            .replace(/{{title}}/g, `Index of ${url}`)
                            .replace(/{{headItem}}/g, headItem)
                            .replace(/{{url}}/g, url)
                            .replace(/{{listItems}}/g, fullList);

                        res.setHeader('Content-Type', 'text/html');
                        res.end(html);
                        return; // 拦截结束
                    } else if (!fs.existsSync(fullPath)) {
                        // const html = 'path not found';
                        res.statusCode = 404; // 添加 404 状态码
                        const html = '404 Not Found';
                        res.setHeader('Content-Type', 'text/html');
                        res.end(html);

                        return;
                    }
                } catch (e) {
                    console.error('File Server Plugin Error:', e);
                }

                // 如果不是目录，交给 Vite 继续处理
                next();
            });
        }
    };
}
