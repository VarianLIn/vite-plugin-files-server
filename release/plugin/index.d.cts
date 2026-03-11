import { Plugin } from 'vite';

interface FilesServerOptions {
    enable?: boolean;
    root?: string;
}
declare function fileServerPlugin(options?: FilesServerOptions): Plugin;

export { fileServerPlugin as default };
