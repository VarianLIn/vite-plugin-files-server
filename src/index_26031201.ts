/*
 * @Author: Varian LIn
 * @Date: 2025-12-09 23:03:20
 * @LastEditors: Varian LIn
 * @LastEditTime: 2026-03-12 10:09:17
 * @Description: 
 * v1.0.4 gallery文件夹按照文件夹结构展示树形结构
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

            // 辅助函数：递归获取所有 HTML 文件
            function getHtmlFiles(dirPath: string, baseUrl = '', indent = 0) {
                try {
                    const files = fs.readdirSync(dirPath);
                    let htmlList = '';
                    const indentStr = '&nbsp;'.repeat(indent * 4); // 缩进

                    files.forEach((file) => {
                        const filePath = path.join(dirPath, file);
                        const relativePath = path.join(baseUrl, file).replace(/\\/g, '/');

                        try {
                            const stats = fs.statSync(filePath);

                            if (stats.isDirectory()) {
                                // 如果是文件夹，递归获取 HTML 文件
                                const subHtmlFiles = getHtmlFiles(filePath, relativePath, indent + 1);
                                if (subHtmlFiles) {
                                    htmlList += `<div class="folder-item">${indentStr}📁 ${file}</div>${subHtmlFiles}`;
                                }
                            } else if (
                                path.extname(file).toLowerCase() === '.html' ||
                                path.extname(file).toLowerCase() === '.htm'
                            ) {
                                // 如果是 HTML 文件，添加到列表
                                htmlList += `<div class="file-item">
                                    ${indentStr}<a href="${relativePath}" class="icon icon-html">📄 ${file}</a>
                                </div>`;
                            }
                        } catch (e) {
                            console.error(`Error reading ${filePath}:`, e);
                        }
                    });

                    return htmlList;
                } catch (e) {
                    console.error(`Error reading directory ${dirPath}:`, e);
                    return '';
                }
            }

            // 辅助函数：生成文件树 HTML
            function generateHtmlTree(fullPath: string, url: string) {
                // 面包屑导航
                let urlSplitArray = url.split('/').filter(Boolean);
                let headItem = '<a href="/">🏠︎</a> / ';
                urlSplitArray.forEach((p, index) => {
                    const href = '/' + urlSplitArray.slice(0, index + 1).join('/');
                    headItem += `<a href="${href}">${p}</a> / `;
                });

                // 获取所有 HTML 文件
                const htmlFiles = getHtmlFiles(fullPath, url === '/' ? '' : url);

                // 生成完整的 HTML
                return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Index of ${url}</title>
    <style>
        body {
            background-color: #1e1e1e;
            color: #d4d4d4;
            font-family: 'Consolas', 'Monaco', 'Courier New', monospace;
            margin: 20px;
            line-height: 1.6;
        }
        .header {
            background-color: #2d2d2d;
            padding: 15px;
            border-left: 4px solid #569cd6;
            margin-bottom: 20px;
            border-radius: 4px;
        }
        .tree-container {
            background-color: #252526;
            padding: 20px;
            border-radius: 6px;
            border: 1px solid #3e3e42;
        }
        .folder-item {
            color: #9cdcfe;
            margin: 8px 0;
            font-weight: bold;
            cursor: pointer;
            user-select: none;
        }
        .file-item {
            margin: 8px 0;
            color: #ce9178;
        }
        .file-item a {
            color: #ce9178;
            text-decoration: none;
            padding: 2px 6px;
            border-radius: 3px;
            transition: background-color 0.2s;
        }
        .file-item a:hover {
            background-color: #2a2d2e;
            color: #ffffff;
        }
        .breadcrumb {
            background-color: #2d2d2d;
            padding: 10px 15px;
            border-radius: 4px;
            margin-bottom: 20px;
            color: #d4d4d4;
        }
        .breadcrumb a {
            color: #569cd6;
            text-decoration: none;
            transition: color 0.2s;
        }
        .breadcrumb a:hover {
            color: #9cdcfe;
            text-decoration: underline;
        }
        h1 {
            color: #569cd6;
            margin-bottom: 10px;
            font-size: 20px;
        }
        .empty-message {
            color: #808080;
            font-style: italic;
            padding: 20px;
            text-align: center;
        }
        .icon-directory {
            color: #9cdcfe !important;
        }
        .icon-html {
            color: #ce9178 !important;
        }
        .tree-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 15px;
            border-bottom: 1px solid #3e3e42;
            padding-bottom: 10px;
        }
        .tree-title {
            font-size: 18px;
            color: #d4d4d4;
        }
        .tree-info {
            color: #808080;
            font-size: 14px;
        }
    </style>
</head>
<body>
    <div class="breadcrumb">${headItem}</div>
    
    <div class="header">
        <h1>📁 ${url === '/' ? 'Root' : path.basename(url)}</h1>
        <div>Path: ${url || '/'}</div>
    </div>
    
    <div class="tree-container">
        <div class="tree-header">
            <div class="tree-title">HTML Files Tree View</div>
            <div class="tree-info">All .html/.htm files in this directory and subdirectories</div>
        </div>
        
        ${htmlFiles || '<div class="empty-message">No HTML files found in this directory</div>'}
    </div>
    
    <script>
        // 添加文件夹点击展开/折叠功能
        document.querySelectorAll('.folder-item').forEach(folder => {
            folder.addEventListener('click', function() {
                const nextSibling = this.nextElementSibling;
                if (nextSibling && nextSibling.style) {
                    nextSibling.style.display = nextSibling.style.display === 'none' ? 'block' : 'none';
                    this.textContent = this.textContent.includes('▶') 
                        ? this.textContent.replace('▶', '▼') 
                        : this.textContent.replace('▼', '▶');
                }
            });
        });
    </script>
</body>
</html>`;
            }

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
                        // 如果是 gallery 目录，显示文件树
                        if (url === '/apps/gallery' || url.startsWith('/gallery/')) {
                            const html = generateHtmlTree(fullPath, url);
                            res.setHeader('Content-Type', 'text/html');
                            res.end(html);
                            return;
                        }

                        // 其他目录保持原有逻辑
                        if (fs.existsSync(path.join(fullPath, 'index.html'))) {
                            return next();
                        }

                        // 原有文件列表逻辑保持不变...
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
