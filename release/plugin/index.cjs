"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/v1_0_5_theme/index.ts
var v1_0_5_theme_exports = {};
__export(v1_0_5_theme_exports, {
  default: () => fileServerPlugin
});
module.exports = __toCommonJS(v1_0_5_theme_exports);
var import_fs = __toESM(require("fs"), 1);
var import_path = __toESM(require("path"), 1);

// src/v1_0_5_theme/tempFolderDark.html?raw
var tempFolderDark_default = `<!doctype html>\r
<html lang="en">\r
    <head>\r
        <meta charset="UTF-8" />\r
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />\r
        <title>Demo List {{pageTitle}}</title>\r
        <style>\r
            /* \u6697\u8272\u4E3B\u9898 - \u53EA\u4FEE\u6539\u989C\u8272\uFF0C\u4FDD\u6301\u4E0E\u4EAE\u8272\u4E3B\u9898\u76F8\u540C\u7684\u5E03\u5C40\u548C\u5C3A\u5BF8 */\r
            body {\r
                background-color: #1a1a1a; /* \u4FEE\u6539\uFF1A\u4EAE\u8272 #f8f9fa \u2192 \u6697\u8272 #1a1a1a */\r
                color: #e0e0e0; /* \u4FEE\u6539\uFF1A\u4EAE\u8272 #212529 \u2192 \u6697\u8272 #e0e0e0 */\r
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Helvetica Neue', Arial, sans-serif;\r
                margin: 0;\r
                padding: 20px;\r
                font-size: 14px;\r
                line-height: 1.5;\r
            }\r
\r
            /* \u9762\u5305\u5C51\u5BFC\u822A - \u6697\u8272 */\r
            .breadcrumb {\r
                color: #a0a0a0; /* \u4FEE\u6539\uFF1A\u4EAE\u8272 #6c757d \u2192 \u6697\u8272 #a0a0a0 */\r
                margin-bottom: 20px;\r
                font-size: 13px;\r
                background-color: #2a2a2a; /* \u4FEE\u6539\uFF1A\u4EAE\u8272 #ffffff \u2192 \u6697\u8272 #2a2a2a */\r
                padding: 12px 16px;\r
                border-radius: 8px;\r
                box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2); /* \u4FEE\u6539\uFF1A\u9634\u5F71\u52A0\u6DF1 */\r
                border: 1px solid #3a3a3a; /* \u4FEE\u6539\uFF1A\u4EAE\u8272 #e9ecef \u2192 \u6697\u8272 #3a3a3a */\r
            }\r
            .breadcrumb-link {\r
                color: #4dabf7; /* \u4FEE\u6539\uFF1A\u4EAE\u8272 #0d6efd \u2192 \u6697\u8272 #4dabf7 */\r
                text-decoration: none;\r
                font-weight: 500;\r
                transition: all 0.2s;\r
                padding: 4px 8px;\r
                border-radius: 4px;\r
            }\r
            .breadcrumb-link:hover {\r
                background-color: #3a3a3a; /* \u4FEE\u6539\uFF1A\u4EAE\u8272 #e7f1ff \u2192 \u6697\u8272 #3a3a3a */\r
                color: #74c0fc; /* \u4FEE\u6539\uFF1A\u4EAE\u8272 #0a58ca \u2192 \u6697\u8272 #74c0fc */\r
                text-decoration: none;\r
            }\r
\r
            /* \u5185\u5BB9\u533A\u57DF */\r
            .content-area {\r
                margin-top: 20px;\r
            }\r
\r
            /* gallery\u6811\u5F62\u89C6\u56FE - \u6697\u8272 */\r
            .gallery-tree {\r
                font-family: 'SF Mono', 'Monaco', 'Consolas', 'Liberation Mono', monospace;\r
                line-height: 1.6;\r
                color: #e0e0e0; /* \u4FEE\u6539\uFF1A\u4EAE\u8272 #212529 \u2192 \u6697\u8272 #e0e0e0 */\r
            }\r
            \r
            /* \u6587\u4EF6\u5939\u9879 - \u6697\u8272\u4E3B\u9898 */\r
            .folder-item {\r
                cursor: default;\r
                margin: 6px 0;\r
                padding-left: 20px;\r
                position: relative;\r
            }\r
            /* .folder-item:hover {\r
                background-color: #2a2a2a;  \r
            } */\r
            .folder-name {\r
                color: #4dabf7; /* \u4FEE\u6539\uFF1A\u4EAE\u8272 #0d6efd \u2192 \u6697\u8272 #4dabf7 */\r
                text-decoration: none;\r
                display: inline-block;\r
                padding: 6px 12px;\r
                border-radius: 6px;\r
                font-weight: 500;\r
                background-color: #2a2a2a; /* \u4FEE\u6539\uFF1A\u4EAE\u8272 #e7f1ff \u2192 \u6697\u8272 #2a2a2a */\r
                border: 1px solid #3a3a3a; /* \u4FEE\u6539\uFF1A\u4EAE\u8272 #cfe2ff \u2192 \u6697\u8272 #3a3a3a */\r
                transition: all 0.2s;\r
            }\r
            .folder-name::before {\r
                content: '\u{1F4C1}';\r
                margin-right: 8px;\r
            }\r
            \r
            /* \u6587\u4EF6\u7F51\u683C\u5E03\u5C40 - \u4E09\u5217 */\r
            .file-grid {\r
                margin: 12px 0 20px 0;\r
                display: block;\r
            }\r
            .file-row {\r
                display: flex;\r
                margin: 8px 0;\r
            }\r
            .file-column {\r
                flex: 1;\r
                min-width: 0;\r
                margin: 0 6px;\r
                padding: 8px 12px;\r
                border-radius: 8px;\r
                transition: all 0.2s;\r
                background-color: #2a2a2a; /* \u4FEE\u6539\uFF1A\u4EAE\u8272 #ffffff \u2192 \u6697\u8272 #2a2a2a */\r
                border: 1px solid #3a3a3a; /* \u4FEE\u6539\uFF1A\u4EAE\u8272 #dee2e6 \u2192 \u6697\u8272 #3a3a3a */\r
                box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2); /* \u4FEE\u6539\uFF1A\u9634\u5F71\u52A0\u6DF1 */\r
            }\r
            .file-column:hover {\r
                background-color: #3a3a3a; /* \u4FEE\u6539\uFF1A\u4EAE\u8272 #f8f9fa \u2192 \u6697\u8272 #3a3a3a */\r
                transform: translateY(-2px);\r
                box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3); /* \u4FEE\u6539\uFF1A\u9634\u5F71\u52A0\u6DF1 */\r
                border-color: #4dabf7; /* \u4FEE\u6539\uFF1A\u4EAE\u8272 #0d6efd \u2192 \u6697\u8272 #4dabf7 */\r
            }\r
            .empty-column {\r
                background-color: transparent;\r
                border: 1px solid transparent;\r
                box-shadow: none;\r
            }\r
            .empty-column:hover {\r
                background-color: transparent;\r
                transform: none;\r
                box-shadow: none;\r
                border-color: transparent;\r
            }\r
            .html-file-link {\r
                color: #e0e0e0; /* \u4FEE\u6539\uFF1A\u4EAE\u8272 #212529 \u2192 \u6697\u8272 #e0e0e0 */\r
                text-decoration: none;\r
                display: block;\r
                white-space: nowrap;\r
                overflow: hidden;\r
                text-overflow: ellipsis;\r
                padding-left: 24px;\r
                position: relative;\r
                font-size: 13px;\r
            }\r
            .html-file-link:hover {\r
                color: #ffffff; /* \u4FEE\u6539\uFF1A\u4EAE\u8272 #0d6efd \u2192 \u6697\u8272 #ffffff */\r
            }\r
            .html-file-link::before {\r
                content: '\u{1F4C4}';\r
                position: absolute;\r
                left: 0;\r
                top: 0;\r
                color: #a0a0a0; /* \u4FEE\u6539\uFF1A\u4EAE\u8272 #6c757d \u2192 \u6697\u8272 #a0a0a0 */\r
            }\r
\r
            /* \u6587\u4EF6\u5217\u8868\u89C6\u56FE - \u6697\u8272\u4E3B\u9898 */\r
            .file-list {\r
                list-style: none;\r
                padding: 0;\r
                margin: 0;\r
            }\r
            .file-list li {\r
                margin: 6px 0;\r
            }\r
            .file-list a {\r
                text-decoration: none;\r
                padding: 10px 16px;\r
                display: block;\r
                border-radius: 8px;\r
                transition: all 0.2s;\r
                background-color: #2a2a2a; /* \u4FEE\u6539\uFF1A\u4EAE\u8272 #ffffff \u2192 \u6697\u8272 #2a2a2a */\r
                border: 1px solid #3a3a3a; /* \u4FEE\u6539\uFF1A\u4EAE\u8272 #dee2e6 \u2192 \u6697\u8272 #3a3a3a */\r
                box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2); /* \u4FEE\u6539\uFF1A\u9634\u5F71\u52A0\u6DF1 */\r
            }\r
            .file-list a:hover {\r
                transform: translateY(-2px);\r
                box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3); /* \u4FEE\u6539\uFF1A\u9634\u5F71\u52A0\u6DF1 */\r
            }\r
            .file-list a.folder-link {\r
                color: #4dabf7; /* \u4FEE\u6539\uFF1A\u4EAE\u8272 #0d6efd \u2192 \u6697\u8272 #4dabf7 */\r
                background-color: #2a2a2a; /* \u4FEE\u6539\uFF1A\u4EAE\u8272 #ffffff \u2192 \u6697\u8272 #2a2a2a */\r
                border: 1px solid #3a3a3a; /* \u4FEE\u6539\uFF1A\u4EAE\u8272 #cfe2ff \u2192 \u6697\u8272 #3a3a3a */\r
                padding-left: 48px;\r
                position: relative;\r
            }\r
            .file-list a.folder-link:hover {\r
                background-color: #3a3a3a; /* \u4FEE\u6539\uFF1A\u4EAE\u8272 #f8f9fa \u2192 \u6697\u8272 #3a3a3a */\r
                border-color: #4dabf7; /* \u4FEE\u6539\uFF1A\u4EAE\u8272 #0d6efd \u2192 \u6697\u8272 #4dabf7 */\r
            }\r
            .file-list a.folder-link::before {\r
                content: '\u{1F4C1}';\r
                position: absolute;\r
                left: 16px;\r
                top: 50%;\r
                transform: translateY(-50%);\r
                font-size: 16px;\r
            }\r
            .file-list a.back-link {\r
                color: #a0a0a0; /* \u4FEE\u6539\uFF1A\u4EAE\u8272 #6c757d \u2192 \u6697\u8272 #a0a0a0 */\r
                background-color: #2a2a2a; /* \u4FEE\u6539\uFF1A\u4EAE\u8272 #f8f9fa \u2192 \u6697\u8272 #2a2a2a */\r
                border: 1px solid #3a3a3a; /* \u4FEE\u6539\uFF1A\u4EAE\u8272 #e9ecef \u2192 \u6697\u8272 #3a3a3a */\r
            }\r
            .file-list a.back-link:hover {\r
                background-color: #3a3a3a; /* \u4FEE\u6539\uFF1A\u4EAE\u8272 #e9ecef \u2192 \u6697\u8272 #3a3a3a */\r
                border-color: #4dabf7; /* \u4FEE\u6539\uFF1A\u4EAE\u8272 #dee2e6 \u2192 \u6697\u8272 #4dabf7 */\r
            }\r
            .file-list a.back-link::before {\r
                content: '\u2190';\r
                margin-right: 8px;\r
            }\r
            .file-list a.file-link {\r
                color: #e0e0e0; /* \u4FEE\u6539\uFF1A\u4EAE\u8272 #212529 \u2192 \u6697\u8272 #e0e0e0 */\r
                background-color: #2a2a2a; /* \u4FEE\u6539\uFF1A\u4EAE\u8272 #ffffff \u2192 \u6697\u8272 #2a2a2a */\r
                border: 1px solid #3a3a3a; /* \u4FEE\u6539\uFF1A\u4EAE\u8272 #dee2e6 \u2192 \u6697\u8272 #3a3a3a */\r
                padding-left: 48px;\r
                position: relative;\r
            }\r
            .file-list a.file-link:hover {\r
                background-color: #3a3a3a; /* \u4FEE\u6539\uFF1A\u4EAE\u8272 #f8f9fa \u2192 \u6697\u8272 #3a3a3a */\r
                border-color: #4dabf7; /* \u4FEE\u6539\uFF1A\u4EAE\u8272 #0d6efd \u2192 \u6697\u8272 #4dabf7 */\r
            }\r
            .file-list a.file-link::before {\r
                content: '\u{1F4C4}';\r
                position: absolute;\r
                left: 16px;\r
                top: 50%;\r
                transform: translateY(-50%);\r
                font-size: 16px;\r
                color: #a0a0a0; /* \u4FEE\u6539\uFF1A\u4EAE\u8272 #6c757d \u2192 \u6697\u8272 #a0a0a0 */\r
            }\r
\r
            /* \u7A7A\u72B6\u6001 - \u6697\u8272 */\r
            .empty-message {\r
                color: #a0a0a0; /* \u4FEE\u6539\uFF1A\u4EAE\u8272 #6c757d \u2192 \u6697\u8272 #a0a0a0 */\r
                font-style: italic;\r
                text-align: center;\r
                padding: 32px;\r
                background-color: #2a2a2a; /* \u4FEE\u6539\uFF1A\u4EAE\u8272 #ffffff \u2192 \u6697\u8272 #2a2a2a */\r
                border-radius: 8px;\r
                border: 1px dashed #3a3a3a; /* \u4FEE\u6539\uFF1A\u4EAE\u8272 #dee2e6 \u2192 \u6697\u8272 #3a3a3a */\r
                box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2); /* \u4FEE\u6539\uFF1A\u9634\u5F71\u52A0\u6DF1 */\r
            }\r
\r
            /* \u54CD\u5E94\u5F0F\u8BBE\u8BA1 */\r
            @media (max-width: 768px) {\r
                body {\r
                    padding: 12px;\r
                }\r
                .file-row {\r
                    flex-direction: column;\r
                }\r
                .file-column {\r
                    margin: 4px 0;\r
                }\r
            }\r
        </style>\r
    </head>\r
    <body>\r
        <div class="breadcrumb">{{breadcrumb}}</div>\r
        <div class="content-area">{{list}}</div>\r
    </body>\r
</html>`;

// src/v1_0_5_theme/tempFolderLight.html?raw
var tempFolderLight_default = `<!doctype html>\r
<html lang="en">\r
    <head>\r
        <meta charset="UTF-8" />\r
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />\r
        <title>Demo List {{pageTitle}}</title>\r
        <style>\r
            /* \u4EAE\u8272\u4E3B\u9898 - \u6574\u4F53\u660E\u4EAE\u98CE\u683C */\r
            body {\r
                background-color: #f8f9fa;\r
                color: #212529;\r
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Helvetica Neue', Arial, sans-serif;\r
                margin: 0;\r
                padding: 20px;\r
                font-size: 14px;\r
                line-height: 1.5;\r
            }\r
\r
            /* \u9762\u5305\u5C51\u5BFC\u822A - \u4EAE\u8272 */\r
            .breadcrumb {\r
                color: #6c757d;\r
                margin-bottom: 20px;\r
                font-size: 13px;\r
                background-color: #ffffff;\r
                padding: 12px 16px;\r
                border-radius: 8px;\r
                box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);\r
                border: 1px solid #e9ecef;\r
            }\r
            .breadcrumb-link {\r
                color: #0d6efd;\r
                text-decoration: none;\r
                font-weight: 500;\r
                transition: all 0.2s;\r
                padding: 4px 8px;\r
                border-radius: 4px;\r
            }\r
            .breadcrumb-link:hover {\r
                background-color: #e7f1ff;\r
                color: #0a58ca;\r
                text-decoration: none;\r
            }\r
\r
            /* \u5185\u5BB9\u533A\u57DF */\r
            .content-area {\r
                margin-top: 20px;\r
            }\r
\r
            /* gallery\u6811\u5F62\u89C6\u56FE - \u4EAE\u8272 */\r
            .gallery-tree {\r
                font-family: 'SF Mono', 'Monaco', 'Consolas', 'Liberation Mono', monospace;\r
                line-height: 1.6;\r
                color: #212529;\r
            }\r
            \r
            /* \u6587\u4EF6\u5939\u9879 - \u4EAE\u8272\u4E3B\u9898 */\r
            .folder-item {\r
                cursor: default;\r
                margin: 6px 0;\r
                padding-left: 20px;\r
                position: relative;\r
            }\r
            .folder-item:hover {\r
                background-color: #f8f9fa;\r
            }\r
            .folder-name {\r
                color: #0d6efd;\r
                text-decoration: none;\r
                display: inline-block;\r
                padding: 6px 12px;\r
                border-radius: 6px;\r
                font-weight: 500;\r
                background-color: #e7f1ff;\r
                border: 1px solid #cfe2ff;\r
                transition: all 0.2s;\r
            }\r
            .folder-name::before {\r
                content: '\u{1F4C1}';\r
                margin-right: 8px;\r
            }\r
            \r
            /* \u6587\u4EF6\u7F51\u683C\u5E03\u5C40 - \u4E09\u5217 */\r
            .file-grid {\r
                margin: 12px 0 20px 0;\r
                display: block;\r
            }\r
            .file-row {\r
                display: flex;\r
                margin: 8px 0;\r
            }\r
            .file-column {\r
                flex: 1;\r
                min-width: 0;\r
                margin: 0 6px;\r
                padding: 8px 12px;\r
                border-radius: 8px;\r
                transition: all 0.2s;\r
                background-color: #ffffff;\r
                border: 1px solid #dee2e6;\r
                box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);\r
            }\r
            .file-column:hover {\r
                background-color: #f8f9fa;\r
                transform: translateY(-2px);\r
                box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);\r
                border-color: #0d6efd;\r
            }\r
            .empty-column {\r
                background-color: transparent;\r
                border: 1px solid transparent;\r
                box-shadow: none;\r
            }\r
            .empty-column:hover {\r
                background-color: transparent;\r
                transform: none;\r
                box-shadow: none;\r
                border-color: transparent;\r
            }\r
            .html-file-link {\r
                color: #212529;\r
                text-decoration: none;\r
                display: block;\r
                white-space: nowrap;\r
                overflow: hidden;\r
                text-overflow: ellipsis;\r
                padding-left: 24px;\r
                position: relative;\r
                font-size: 13px;\r
            }\r
            .html-file-link:hover {\r
                color: #0d6efd;\r
            }\r
            .html-file-link::before {\r
                content: '\u{1F4C4}';\r
                position: absolute;\r
                left: 0;\r
                top: 0;\r
                color: #6c757d;\r
            }\r
\r
            /* \u6587\u4EF6\u5217\u8868\u89C6\u56FE - \u4EAE\u8272\u4E3B\u9898 */\r
            .file-list {\r
                list-style: none;\r
                padding: 0;\r
                margin: 0;\r
            }\r
            .file-list li {\r
                margin: 6px 0;\r
            }\r
            .file-list a {\r
                text-decoration: none;\r
                padding: 10px 16px;\r
                display: block;\r
                border-radius: 8px;\r
                transition: all 0.2s;\r
                background-color: #ffffff;\r
                border: 1px solid #dee2e6;\r
                box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);\r
            }\r
            .file-list a:hover {\r
                transform: translateY(-2px);\r
                box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);\r
            }\r
            .file-list a.folder-link {\r
                color: #0d6efd;\r
                background-color: #ffffff;\r
                border: 1px solid #cfe2ff;\r
                padding-left: 48px;\r
                position: relative;\r
            }\r
            .file-list a.folder-link:hover {\r
                background-color: #f8f9fa;\r
                border-color: #0d6efd;\r
            }\r
            .file-list a.folder-link::before {\r
                content: '\u{1F4C1}';\r
                position: absolute;\r
                left: 16px;\r
                top: 50%;\r
                transform: translateY(-50%);\r
                font-size: 16px;\r
            }\r
            .file-list a.back-link {\r
                color: #6c757d;\r
                background-color: #f8f9fa;\r
                border: 1px solid #e9ecef;\r
            }\r
            .file-list a.back-link:hover {\r
                background-color: #e9ecef;\r
                border-color: #dee2e6;\r
            }\r
            .file-list a.back-link::before {\r
                content: '\u2190';\r
                margin-right: 8px;\r
            }\r
            .file-list a.file-link {\r
                color: #212529;\r
                background-color: #ffffff;\r
                border: 1px solid #dee2e6;\r
                padding-left: 48px;\r
                position: relative;\r
            }\r
            .file-list a.file-link:hover {\r
                background-color: #f8f9fa;\r
                border-color: #0d6efd;\r
            }\r
            .file-list a.file-link::before {\r
                content: '\u{1F4C4}';\r
                position: absolute;\r
                left: 16px;\r
                top: 50%;\r
                transform: translateY(-50%);\r
                font-size: 16px;\r
                color: #6c757d;\r
            }\r
\r
            /* \u7A7A\u72B6\u6001 - \u4EAE\u8272 */\r
            .empty-message {\r
                color: #6c757d;\r
                font-style: italic;\r
                text-align: center;\r
                padding: 32px;\r
                background-color: #ffffff;\r
                border-radius: 8px;\r
                border: 1px dashed #dee2e6;\r
                box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);\r
            }\r
\r
            /* \u54CD\u5E94\u5F0F\u8BBE\u8BA1 */\r
            @media (max-width: 768px) {\r
                body {\r
                    padding: 12px;\r
                }\r
                .file-row {\r
                    flex-direction: column;\r
                }\r
                .file-column {\r
                    margin: 4px 0;\r
                }\r
            }\r
        </style>\r
    </head>\r
    <body>\r
        <div class="breadcrumb">{{breadcrumb}}</div>\r
        <div class="content-area">{{list}}</div>\r
    </body>\r
</html>`;

// src/v1_0_5_theme/index.ts
function fileServerPlugin(options = {}) {
  const { enable = true, root = "", theme = "dark" } = options;
  return {
    name: "vite-plugin-files-server",
    configureServer(server) {
      if (!enable) return;
      let templateString;
      try {
        if (theme === "light") {
          templateString = tempFolderLight_default;
        } else {
          templateString = tempFolderDark_default;
        }
      } catch (e) {
        console.error("Failed to load template:", e);
        templateString = tempFolderDark_default;
      }
      function buildGalleryTree(dirPath, baseUrl = "", depth = 0) {
        try {
          const files = import_fs.default.readdirSync(dirPath);
          let html = "";
          files.sort((a, b) => {
            const aPath = import_path.default.join(dirPath, a);
            const bPath = import_path.default.join(dirPath, b);
            const aIsDir = import_fs.default.statSync(aPath).isDirectory();
            const bIsDir = import_fs.default.statSync(bPath).isDirectory();
            if (aIsDir && !bIsDir) return -1;
            if (!aIsDir && bIsDir) return 1;
            return a.localeCompare(b);
          });
          const folderItems = [];
          const htmlFiles = [];
          files.forEach((file) => {
            const filePath = import_path.default.join(dirPath, file);
            const relativePath = import_path.default.join(baseUrl, file).replace(/\\/g, "/");
            try {
              const stats = import_fs.default.statSync(filePath);
              if (stats.isDirectory()) {
                folderItems.push({ file, filePath, relativePath });
              } else if (import_path.default.extname(file).toLowerCase() === ".html" || import_path.default.extname(file).toLowerCase() === ".htm") {
                htmlFiles.push({ file, relativePath });
              }
            } catch (e) {
              console.error(`Error reading ${filePath}:`, e);
            }
          });
          folderItems.forEach(({ file, filePath, relativePath }) => {
            html += `<div class="folder-item">
                            <a class="folder-name">${file}</a>
                        </div>`;
            const subTree = buildGalleryTree(filePath, relativePath, depth + 1);
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
                html += `<div class="file-column">
                                    <a href="${relativePath}" class="html-file-link">${file}</a>
                                </div>`;
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
          return "";
        }
      }
      function generateFileList(fullPath, url) {
        try {
          const files = import_fs.default.readdirSync(fullPath);
          let listItems = "";
          const sortedFiles = files.sort((a, b) => {
            const aPath = import_path.default.join(fullPath, a);
            const bPath = import_path.default.join(fullPath, b);
            const aIsDir = import_fs.default.statSync(aPath).isDirectory();
            const bIsDir = import_fs.default.statSync(bPath).isDirectory();
            if (aIsDir && !bIsDir) return -1;
            if (!aIsDir && bIsDir) return 1;
            return a.localeCompare(b);
          });
          if (url !== "/") {
            const backUrl = url.split("/").slice(0, -1).join("/") || "/";
            listItems += `<li><a href="${backUrl}" class="folder-link back-link">..</a></li>
`;
          }
          sortedFiles.forEach((file) => {
            const filePath = import_path.default.join(fullPath, file);
            const stats = import_fs.default.statSync(filePath);
            const isDir = stats.isDirectory();
            const href = import_path.default.join(url, file).replace(/\\/g, "/");
            if (isDir) {
              listItems += `<li><a href="${href}" class="folder-link">${file}</a></li>
`;
            } else {
              listItems += `<li><a href="${href}" class="file-link">${file}</a></li>
`;
            }
          });
          return listItems;
        } catch (e) {
          console.error(`Error generating file list:`, e);
          return "";
        }
      }
      function generateHtmlPage(url, content, isGalleryTree = false) {
        let urlSplitArray = url.split("/").filter(Boolean);
        let breadcrumb = "";
        if (url === "/") {
          breadcrumb = '<a href="/" class="breadcrumb-link">/</a>';
        } else {
          breadcrumb = '<a href="/" class="breadcrumb-link">Home</a> ';
          urlSplitArray.forEach((p, index) => {
            const href = "/" + urlSplitArray.slice(0, index + 1).join("/");
            breadcrumb += `<a href="${href}" class="breadcrumb-link"> / ${p}</a>`;
            if (index < urlSplitArray.length - 1) {
              breadcrumb += " ";
            }
          });
        }
        const pageTitle = url === "/" ? "/" : url;
        const list = isGalleryTree ? `<div class="gallery-tree">${content || '<div class="empty-message">No HTML files found</div>'}</div>` : `
            <ul class="file-list">
                ${content || '<li class="empty-message">No files found</li>'}
            </ul>
            `;
        const html = templateString.replace(/{{pageTitle}}/g, pageTitle).replace(/{{breadcrumb}}/g, breadcrumb).replace(/{{list}}/g, list);
        return html;
      }
      server.middlewares.use((req, res, next) => {
        const url = req.url ? decodeURIComponent(req.url.split("?")[0]) : "/";
        if (url.startsWith("/@") || url.includes("vite")) {
          return next();
        }
        const projectRoot = server.config.root;
        const fullPath = import_path.default.join(projectRoot, url);
        try {
          if (import_fs.default.existsSync(fullPath) && import_fs.default.statSync(fullPath).isDirectory()) {
            if (import_fs.default.existsSync(import_path.default.join(fullPath, "index.html"))) {
              return next();
            }
            let content = "";
            const isGalleryTree = url === "/apps/gallery" || url.startsWith("/gallery/");
            if (isGalleryTree) {
              content = buildGalleryTree(fullPath, url === "/" ? "" : url);
            } else {
              content = generateFileList(fullPath, url);
            }
            const html = generateHtmlPage(url, content, isGalleryTree);
            res.setHeader("Content-Type", "text/html");
            res.end(html);
            return;
          } else if (!import_fs.default.existsSync(fullPath)) {
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
function setStatus404(res, url, theme) {
  res.statusCode = 404;
  res.setHeader("Content-Type", "text/html");
  if (theme === "light") {
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
function setStatus500(res, error, theme) {
  console.error("File Server Plugin Error:", error);
  res.statusCode = 500;
  if (theme === "light") {
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
    res.end("Internal Server Error");
  }
}
