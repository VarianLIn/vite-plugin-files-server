import { Plugin } from 'vite';

interface FilesServerOptions {
    enable?: boolean;
    root?: string;
    theme?: 'dark' | 'light';
}
declare function fileServerPlugin(options?: FilesServerOptions): Plugin;

export { fileServerPlugin as default };
