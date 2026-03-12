/*
 * @Author: Varian LIn
 * @Date: 2025-12-09 23:03:20
 * @LastEditors: Varian LIn
 * @LastEditTime: 2026-03-12 10:09:07
 * @Description:
 * v1.0.3 修复 当请求一个不存在的文件时，浏览器会收到 404 状态码，而不是 200。
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
    const { enable = true, root = '' } = options;

    return {
        name: 'vite-plugin-files-server',

        configureServer(server: ViteDevServer) {
            if (!enable) return;

            // 中间件
            server.middlewares.use((req, res, next) => {
                const url = req.url ? decodeURIComponent(req.url.split('?')[0]) : '/';

                if (url.startsWith('/@') || url.includes('vite')) {
                    return next();
                }

                const projectRoot = server.config.root;
                const fullPath = path.join(projectRoot, url);

                try {
                    if (fs.existsSync(fullPath) && fs.statSync(fullPath).isDirectory()) {
                        // 其他目录保持原有逻辑
                        if (fs.existsSync(path.join(fullPath, 'index.html'))) {
                            return next();
                        }

                        let urlSplitArray = url.split('/');
                        if (urlSplitArray[urlSplitArray.length - 1] == '') urlSplitArray = urlSplitArray.slice(0, -1);
                        let headItem: string = '<a href="/">🏠︎</a> / ';
                        urlSplitArray.forEach((p) => {
                            p && (headItem += `<a href="/${p}">${p}</a> / `);
                        });

                        const files = fs.readdirSync(fullPath);
                        const listItems = files
                            .map((file) => {
                                const filePath = path.join(fullPath, file);
                                const isDir = fs.statSync(filePath).isDirectory();
                                const href = path.join(url, file).replace(/\\/g, '/');
                                const item = `
                                    <li>
                                        <a href="${href}" class="icon ${isDir ? 'icon-directory' : 'icon-html'}"> 
                                            <span class="name">${file}</span> 
                                        </a>
                                    </li>`;
                                return item;
                            })
                            .join('');

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
                        return;
                    } else if (!fs.existsSync(fullPath)) {
                        res.statusCode = 404;
                        res.setHeader('Content-Type', 'text/html');
                        res.end(`
                            <!DOCTYPE html>
                            <html>
                            <head><title>404 Not Found</title></head>
                            <body style="background:#1e1e1e;color:#d4d4d4;font-family:Consolas;padding:20px;">
                                <h1>404 Not Found</h1>
                                <p>The requested URL ${url} was not found on this server.</p>
                                <p><a href="/" style="color:#569cd6;">Return to home</a></p>
                            </body>
                            </html>
                        `);
                        return;
                    }
                } catch (e) {
                    console.error('File Server Plugin Error:', e);
                    res.statusCode = 500;
                    res.end('Internal Server Error');
                    return;
                }

                next();
            });
        }
    };
}
