/*
 * @Author: Varian LIn
 * @Date: 2026-03-12 11:13:54
 * @LastEditors: Varian LIn
 * @LastEditTime: 2026-03-12 16:05:41
 * @Description: 26031204
 * v1.1.0 主题
 * v1.1.1 主题
 */

import type { Plugin, ViteDevServer } from 'vite';
import fs from 'fs';
import path from 'path';
import dark from './tempFolderDark.html?raw';
import light from './tempFolderLight.html?raw';

interface FilesServerOptions {
    enable?: boolean; // 是否启用
    root?: string; // 根目录，默认为项目根目录
    theme?: 'dark' | 'light'; // 主题模式
}

export default function fileServerPlugin(options: FilesServerOptions = {}): Plugin {
    const { enable = true, root = '', theme = 'dark' } = options;
    return {
        name: 'vite-plugin-files-server',
        configureServer(server: ViteDevServer) {
            if (!enable) return;

            // 导入模板
            let templateString: string;

            try {
                if (theme === 'light') {
                    // 导入亮色主题模板
                    templateString = light; // fs.readFileSync(path.join(__dirname, 'tempFolderLight.html'), 'utf-8');
                } else {
                    // 导入暗色主题模板
                    templateString = dark; // fs.readFileSync(path.join(__dirname, 'tempFolder.html'), 'utf-8');
                }
            } catch (e) {
                console.error('Failed to load template:', e);
                // 如果模板文件不存在，使用默认模板
                templateString = dark; // getDefaultTemplate(theme);
            }

            // 辅助函数：递归构建树形结构（只用于gallery文件夹）
            function buildGalleryTree(dirPath: string, baseUrl = '', depth = 0) {
                try {
                    const files = fs.readdirSync(dirPath);
                    let html = '';

                    // 按字母顺序排序，文件夹在前，文件在后
                    files.sort((a, b) => {
                        const aPath = path.join(dirPath, a);
                        const bPath = path.join(dirPath, b);
                        const aIsDir = fs.statSync(aPath).isDirectory();
                        const bIsDir = fs.statSync(bPath).isDirectory();

                        if (aIsDir && !bIsDir) return -1;
                        if (!aIsDir && bIsDir) return 1;
                        return a.localeCompare(b);
                    });

                    // 收集当前目录的文件夹和文件
                    const folderItems: Array<{ file: string; filePath: string; relativePath: string }> = [];
                    const htmlFiles: Array<{ file: string; relativePath: string }> = [];

                    files.forEach((file) => {
                        const filePath = path.join(dirPath, file);
                        const relativePath = path.join(baseUrl, file).replace(/\\/g, '/');

                        try {
                            const stats = fs.statSync(filePath);

                            if (stats.isDirectory()) {
                                // 文件夹
                                folderItems.push({ file, filePath, relativePath });
                            } else if (
                                path.extname(file).toLowerCase() === '.html' ||
                                path.extname(file).toLowerCase() === '.htm'
                            ) {
                                // HTML文件
                                htmlFiles.push({ file, relativePath });
                            }
                        } catch (e) {
                            console.error(`Error reading ${filePath}:`, e);
                        }
                    });

                    // 输出文件夹
                    folderItems.forEach(({ file, filePath, relativePath }) => {
                        html += `<div class="folder-item">
                            <a class="folder-name">${file}</a>
                        </div>`;
                        // 递归处理子目录
                        const subTree = buildGalleryTree(filePath, relativePath, depth + 1);
                        if (subTree) {
                            html += subTree;
                        }
                    });

                    // 输出HTML文件，按照三列排列
                    if (htmlFiles.length > 0) {
                        // 开始文件网格
                        html += `<div class="file-grid">`;

                        // 将HTML文件分组，每组3个
                        for (let i = 0; i < htmlFiles.length; i += 3) {
                            const rowFiles = htmlFiles.slice(i, i + 3);
                            html += `<div class="file-row">`;

                            rowFiles.forEach(({ file, relativePath }) => {
                                html += `<div class="file-column">
                                    <a href="${relativePath}" class="html-file-link">${file}</a>
                                </div>`;
                            });

                            // 如果一行不足3个，添加空列占位
                            for (let j = rowFiles.length; j < 3; j++) {
                                html += `<div class="file-column empty-column"></div>`;
                            }

                            html += `</div>`;
                        }

                        html += `</div>`;
                    }

                    return html;
                } catch (e) {
                    console.error(`Error reading directory ${dirPath}:`, e);
                    return '';
                }
            }

            // 辅助函数：生成文件列表（用于非gallery文件夹）
            function generateFileList(fullPath: string, url: string) {
                try {
                    const files = fs.readdirSync(fullPath);
                    let listItems = '';

                    // 先排序：文件夹在前，文件在后
                    const sortedFiles = files.sort((a, b) => {
                        const aPath = path.join(fullPath, a);
                        const bPath = path.join(fullPath, b);
                        const aIsDir = fs.statSync(aPath).isDirectory();
                        const bIsDir = fs.statSync(bPath).isDirectory();

                        if (aIsDir && !bIsDir) return -1;
                        if (!aIsDir && bIsDir) return 1;
                        return a.localeCompare(b);
                    });

                    // 添加返回上一级链接（如果不是根目录）
                    if (url !== '/') {
                        const backUrl = url.split('/').slice(0, -1).join('/') || '/';
                        listItems += `<li><a href="${backUrl}" class="folder-link back-link">..</a></li>\n`;
                    }

                    // 生成文件列表
                    sortedFiles.forEach((file) => {
                        const filePath = path.join(fullPath, file);
                        const stats = fs.statSync(filePath);
                        const isDir = stats.isDirectory();
                        const href = path.join(url, file).replace(/\\/g, '/');

                        if (isDir) {
                            // 文件夹
                            listItems += `<li><a href="${href}" class="folder-link">${file}</a></li>\n`;
                        } else {
                            // 文件
                            listItems += `<li><a href="${href}" class="file-link">${file}</a></li>\n`;
                        }
                    });

                    return listItems;
                } catch (e) {
                    console.error(`Error generating file list:`, e);
                    return '';
                }
            }

            // 统一生成HTML页面
            function generateHtmlPage(url: string, content: string, isGalleryTree: boolean = false) {
                // 生成面包屑导航
                let urlSplitArray = url.split('/').filter(Boolean);
                let breadcrumb = '';

                if (url === '/') {
                    breadcrumb = '<a href="/" class="breadcrumb-link">/</a>';
                } else {
                    breadcrumb = '<a href="/" class="breadcrumb-link">Home</a> ';
                    urlSplitArray.forEach((p, index) => {
                        const href = '/' + urlSplitArray.slice(0, index + 1).join('/');
                        breadcrumb += `<a href="${href}" class="breadcrumb-link"> / ${p}</a>`;
                        if (index < urlSplitArray.length - 1) {
                            breadcrumb += ' ';
                        }
                    });
                }

                const pageTitle = url === '/' ? '/' : url;
                const list = isGalleryTree
                    ? `<div class="gallery-tree">${content || '<div class="empty-message">No HTML files found</div>'}</div>`
                    : `
            <ul class="file-list">
                ${content || '<li class="empty-message">No files found</li>'}
            </ul>
            `;

                const html = templateString
                    .replace(/{{pageTitle}}/g, pageTitle)
                    .replace(/{{breadcrumb}}/g, breadcrumb)
                    .replace(/{{list}}/g, list);
                return html;
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
                        // 如果目录下有 index.html，交给 Vite 默认处理
                        if (fs.existsSync(path.join(fullPath, 'index.html'))) {
                            return next();
                        }

                        let content = '';
                        const isGalleryTree = url === '/apps/gallery' || url.startsWith('/gallery/');

                        if (isGalleryTree) {
                            // gallery 目录：显示树形结构的HTML文件
                            content = `<p class="back-all-link"><a href="/apps" class="back-link">..</a></p>`;

                            content += buildGalleryTree(fullPath, url === '/' ? '' : url);
                        } else {
                            // 其他目录：显示文件列表
                            content = generateFileList(fullPath, url);
                        }

                        const html = generateHtmlPage(url, content, isGalleryTree);
                        res.setHeader('Content-Type', 'text/html');
                        res.end(html);
                        return;
                    } else if (!fs.existsSync(fullPath)) {
                        setStatus404(res, url, theme);
                        return;
                    }
                } catch (e) {
                    setStatus500(res, e, theme);
                    return;
                }

                next();
            });
        }
    };
}

function setStatus404(res: any, url: string, theme: 'dark' | 'light') {
    res.statusCode = 404;
    res.setHeader('Content-Type', 'text/html');

    if (theme === 'light') {
        res.end(`
            <!DOCTYPE html>
            <html>
            <head><title>404 Not Found</title></head>
            <body style="background:#f8f9fa;color:#212529;font-family:Consolas;padding:20px;">
                <h1>404 Not Found</h1>
                <p>The requested URL ${url} was not found on this server.</p>
                <p><a href="/" style="color:#0d6efd;">Return to home</a></p>
            </body>
            </html>
        `);
    } else {
        res.end(`
            <!DOCTYPE html>
            <html>
            <head><title>404 Not Found</title></head>
            <body style="background:#000;color:#fff;font-family:Consolas;padding:20px;">
                <h1>404 Not Found</h1>
                <p>The requested URL ${url} was not found on this server.</p>
                <p><a href="/" style="color:#569cd6;">Return to home</a></p>
            </body>
            </html>
        `);
    }
}

function setStatus500(res: any, error: any, theme: 'dark' | 'light') {
    console.error('File Server Plugin Error:', error);
    res.statusCode = 500;

    if (theme === 'light') {
        res.end(`
            <!DOCTYPE html>
            <html>
            <head><title>500 Internal Server Error</title></head>
            <body style="background:#f8f9fa;color:#212529;font-family:Consolas;padding:20px;">
                <h1>500 Internal Server Error</h1>
                <p>An error occurred on the server.</p>
                <p><a href="/" style="color:#0d6efd;">Return to home</a></p>
            </body>
            </html>
        `);
    } else {
        res.end('Internal Server Error');
    }
}

// 默认模板
function getDefaultTemplate(theme: 'dark' | 'light'): string {
    if (theme === 'light') {
        return `<!doctype html>
<html lang="en">
    <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Demo List {{pageTitle}}</title>
        <style>
            /* 亮色主题样式 - 稍后填充 */
        </style>
    </head>
    <body>
        <div class="breadcrumb">{{breadcrumb}}</div>
        <div class="content-area">{{list}}</div>
    </body>
</html>`;
    } else {
        return `<!doctype html>
<html lang="en">
    <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Demo List {{pageTitle}}</title>
        <style>
            /* 暗色主题样式 - 稍后填充 */
        </style>
    </head>
    <body>
        <div class="breadcrumb">{{breadcrumb}}</div>
        <div class="content-area">{{list}}</div>
    </body>
</html>`;
    }
}
