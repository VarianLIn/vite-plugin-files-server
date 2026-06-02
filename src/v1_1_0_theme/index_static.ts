/*
 * @Author: Varian LIn
 * @Date: 2026-03-12 11:13:54
 * @LastEditors: Varian LIn
 * @LastEditTime: 2026-03-18 15:15:38
 * @Description: 26031204
 * v1.1.0 主题
 * v1.1.1 主题
 * 2026年6月2日 增加统计所有文件数量
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
                    templateString = light;
                } else {
                    templateString = dark;
                }
            } catch (e) {
                console.error('Failed to load template:', e);
                templateString = dark;
            }

            // 辅助函数：递归构建树形结构（增加 fileCounter 用于统计数量）
            function buildGalleryTree(dirPath: string, baseUrl = '', depth = 0, fileCounter = { count: 0 }) {
                try {
                    const files = fs.readdirSync(dirPath);
                    let html = '';

                    files.sort((a, b) => {
                        const aPath = path.join(dirPath, a);
                        const bPath = path.join(dirPath, b);
                        const aIsDir = fs.statSync(aPath).isDirectory();
                        const bIsDir = fs.statSync(bPath).isDirectory();

                        if (aIsDir && !bIsDir) return -1;
                        if (!aIsDir && bIsDir) return 1;
                        return a.localeCompare(b);
                    });

                    const folderItems: Array<{ file: string; filePath: string; relativePath: string }> = [];
                    const htmlFiles: Array<{ file: string; relativePath: string }> = [];

                    files.forEach((file) => {
                        const filePath = path.join(dirPath, file);
                        const relativePath = path.join(baseUrl, file).replace(/\\/g, '/');

                        try {
                            const stats = fs.statSync(filePath);

                            if (stats.isDirectory()) {
                                folderItems.push({ file, filePath, relativePath });
                            } else if (
                                path.extname(file).toLowerCase() === '.html' ||
                                path.extname(file).toLowerCase() === '.htm'
                            ) {
                                htmlFiles.push({ file, relativePath });
                                // 🌟 新增：统计文件数量
                                fileCounter.count++;
                            }
                        } catch (e) {
                            console.error(`Error reading ${filePath}:`, e);
                        }
                    });

                    folderItems.forEach(({ file, filePath, relativePath }) => {
                        let level = relativePath.split('/');
                        if (level.length == 4) {
                            html += `<div class="folder-item">
                            <a class="folder-name">${file}</a>
                        </div>`;
                        } else if (level.length == 5) {
                            html += `<div class="folder-item">
                            <a class="folder-name level-sub">${file}</a>
                        </div>`;
                        }
                        // 将 fileCounter 向下传递以继续累加
                        const subTree = buildGalleryTree(filePath, relativePath, depth + 1, fileCounter);
                        if (subTree) {
                            html += subTree;
                        }
                    });

                    if (htmlFiles.length > 0) {
                        html += `<div class="file-grid">`;
                        for (let i = 0; i < htmlFiles.length; i += 3) {
                            const rowFiles = htmlFiles.slice(i, i + 3);
                            html += `<div class="file-row">`;

                            rowFiles.forEach(({ file, relativePath }) => {
                                html += `<a class="file-column" href="${relativePath}">
                                    <div class="html-file-link">${file}</div>
                                </a>`;
                            });

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

            // 辅助函数：生成文件列表（修改返回值以包含文件数量）
            function generateFileList(fullPath: string, url: string) {
                try {
                    const files = fs.readdirSync(fullPath);
                    let listItems = '';
                    let fileCount = 0; // 🌟 新增：当前目录文件计数器

                    const sortedFiles = files.sort((a, b) => {
                        const aPath = path.join(fullPath, a);
                        const bPath = path.join(fullPath, b);
                        const aIsDir = fs.statSync(aPath).isDirectory();
                        const bIsDir = fs.statSync(bPath).isDirectory();

                        if (aIsDir && !bIsDir) return -1;
                        if (!aIsDir && bIsDir) return 1;
                        return a.localeCompare(b);
                    });

                    if (url !== '/') {
                        const backUrl = url.split('/').slice(0, -1).join('/') || '/';
                        listItems += `<li><a href="${backUrl}" class="folder-link back-link">..</a></li>\n`;
                    }

                    sortedFiles.forEach((file) => {
                        const filePath = path.join(fullPath, file);
                        const stats = fs.statSync(filePath);
                        const isDir = stats.isDirectory();
                        const href = path.join(url, file).replace(/\\/g, '/');

                        if (isDir) {
                            listItems += `<li><a href="${href}" class="folder-link">${file}</a></li>\n`;
                        } else {
                            listItems += `<li><a href="${href}" class="file-link">${file}</a></li>\n`;
                            // 🌟 新增：统计非文件夹的数量
                            fileCount++;
                        }
                    });

                    // 🌟 变化：返回对象而不仅是字符串
                    return { listItems, fileCount };
                } catch (e) {
                    console.error(`Error generating file list:`, e);
                    return { listItems: '', fileCount: 0 };
                }
            }

            // 统一生成HTML页面（新增 totalFiles 参数）
            function generateHtmlPage(
                url: string,
                content: string,
                isGalleryTree: boolean = false,
                totalFiles: number = 0
            ) {
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

                // 🌟 新增：生成统计信息的 HTML 结构
                const countBadgeHtml = `<div class="file-count-badge" style="margin-bottom: 15px; font-size: 14px; color: #666;">
                    <strong>共有 ${totalFiles} 个文件</strong>
                </div>`;

                const list = isGalleryTree
                    ? `${countBadgeHtml}<div class="gallery-tree">${content || '<div class="empty-message">No HTML files found</div>'}</div>`
                    : `${countBadgeHtml}
            <ul class="file-list">
                ${content || '<li class="empty-message">No files found</li>'}
            </ul>
            `;

                const html = templateString
                    .replace(/{{pageTitle}}/g, pageTitle)
                    .replace(/{{breadcrumb}}/g, breadcrumb)
                    .replace(/{{list}}/g, list)
                    .replace(/{{fileCount}}/g, totalFiles.toString()); // 提供一个新的占位符供外部模板使用

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
                        if (fs.existsSync(path.join(fullPath, 'index.html'))) {
                            return next();
                        }

                        let content = '';
                        let totalFiles = 0; // 🌟 记录总文件数
                        const isGalleryTree = url === '/apps/gallery' || url.startsWith('/gallery/');

                        if (isGalleryTree) {
                            content = `<p class="back-all-link"><a href="/apps" class="back-link">..</a></p>`;

                            // 🌟 传入计数器对象
                            const counter = { count: 0 };
                            content += buildGalleryTree(fullPath, url === '/' ? '' : url, 0, counter);
                            totalFiles = counter.count;
                        } else {
                            // 🌟 解构出列表和计数
                            const result = generateFileList(fullPath, url);
                            content = result.listItems;
                            totalFiles = result.fileCount;
                        }

                        // 🌟 传入 totalFiles
                        const html = generateHtmlPage(url, content, isGalleryTree, totalFiles);
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

// 底部默认的 404/500 代码保持不变...
// 可以在 getDefaultTemplate 中根据需要加入 {{fileCount}} 占位符
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
