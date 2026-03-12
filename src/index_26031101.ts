/*
 * @Author: Varian LIn
 * @Date: 2025-12-09 23:03:20
 * @LastEditors: Varian LIn
 * @LastEditTime: 2025-12-29 21:52:28
 * @Description:
 * v1.0.2
 */

import type { Plugin, ViteDevServer } from 'vite';
import fs from 'fs';
import path from 'path';
import templateString from './temp.html?raw';

// // 定义插件的配置项接口
// interface FileServerOptions {
//     enable?: boolean; // 是否启用
//     root?: string; // 根目录，默认为项目根目录
// }
// export default function fileServerPlugin(options: FileServerOptions = {}): Plugin {
//     const { enable = true } = options;

//     return {
//         name: 'vite-plugin-file-server', // 必须唯一

//         // 核心钩子：配置开发服务器
//         configureServer(server: ViteDevServer) {
//             if (!enable) return;

//             // 添加一个中间件
//             server.middlewares.use((req, res, next) => {
//                 const url = req.url ? decodeURIComponent(req.url.split('?')[0]) : '/';

//                 // 获取物理路径
//                 const projectRoot = server.config.root;
//                 const fullPath = path.join(projectRoot, url);

//                 try {
//                     // 检查路径是否存在且为目录
//                     if (fs.existsSync(fullPath) && fs.statSync(fullPath).isDirectory()) {
//                         // 如果目录下有 index.html，交给 Vite 默认处理，不要拦截
//                         if (fs.existsSync(path.join(fullPath, 'index.html'))) {
//                             return next();
//                         }

//                         // 生成文件列表 HTML
//                         const files = fs.readdirSync(fullPath);
//                         const listItems = files
//                             .map((file) => {
//                                 const filePath = path.join(fullPath, file);
//                                 const isDir = fs.statSync(filePath).isDirectory();
//                                 const icon = isDir ? '📁' : '📄';
//                                 const href = path.join(url, file).replace(/\\/g, '/');

//                                 return `
//                 <li style="padding: 5px 0;">
//                   <span style="margin-right: 10px;">${icon}</span>
//                   <a href="${href}" style="text-decoration: none; color: #646cff;">${file}</a>
//                 </li>`;
//                             })
//                             .join('');

//                         const html = `
//               <!DOCTYPE html>
//               <html>
//               <head>
//                 <title>Index of ${url}</title>
//                 <style>
//                   body { font-family: sans-serif; padding: 2rem; max-width: 800px; margin: 0 auto; }
//                   ul { list-style: none; padding: 0; }
//                   h2 { border-bottom: 1px solid #eee; padding-bottom: 10px; }
//                 </style>
//               </head>
//               <body>
//                 <h2>📂 Index of ${url}</h2>
//                 ${url !== '/' ? `<p><a href="..">⬅️ Back to parent</a></p>` : ''}
//                 <ul>${listItems}</ul>
//               </body>
//               </html>
//             `;

//                         res.setHeader('Content-Type', 'text/html');
//                         res.end(html);
//                         return; // 拦截结束
//                     }
//                 } catch (e) {
//                     console.error('File Server Plugin Error:', e);
//                 }

//                 // 如果不是目录，交给 Vite 继续处理
//                 next();
//             });
//         }
//     };
// }

// 定义插件的配置项接口
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

                        // const html = `
                        //   <!DOCTYPE html>
                        //   <html>
                        //   <head>
                        //   <meta charset="UTF-8">
                        // 		<title>Index of ${url}</title>
                        // 		<style>
                        // 				body { font-family: system-ui; padding: 2rem; max-width: 800px; margin: 0 auto; }
                        // 				h2 { border-bottom: 1px solid #eee; padding-bottom: 10px; }
                        // 				table { width: 100%; border-collapse: collapse; }
                        // 				td { padding: 8px; border-bottom: 1px solid #f5f5f5; }
                        // 				a { text-decoration: none; color: #646cff; }
                        // 				a:hover { text-decoration: underline; }
                        // 				ul,li { list-style: none; margin: 0; padding: 0; }
                        //     </style>
                        //   </head>
                        //   <body>
                        //     <h2>📂 Index of ${url}</h2>
                        //     ${url !== '/' ? `<p><a href="..">⬅️ Back to parent</a></p>` : ''}
                        //     <ul>${listItems}</ul>
                        //   </body>
                        //   </html>
                        // `;

                        const html = templateString
                            .replace(/{{title}}/g, `Index of ${url}`)
                            .replace(/{{headItem}}/g, headItem)
                            .replace(/{{url}}/g, url)
                            .replace(/{{listItems}}/g, fullList);

                        res.setHeader('Content-Type', 'text/html');
                        res.end(html);
                        return; // 拦截结束
                    } else if (!fs.existsSync(fullPath)) {
                        const html = 'path not found';
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
