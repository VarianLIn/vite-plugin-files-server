// src/index.ts
import fs from "fs";
import path from "path";

// src/temp.html?raw
var temp_default = `<!DOCTYPE html>\r
<html>\r
    <head>\r
        <meta charset="UTF-8" />\r
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />\r
        <title>listing directory {{url}}</title>\r
        <style>\r
            /* body {\r
                font-family: system-ui;\r
                padding: 2rem;\r
                max-width: 800px;\r
                margin: 0 auto;\r
            }\r
            h2 {\r
                border-bottom: 1px solid #eee;\r
                padding-bottom: 10px;\r
            }\r
            table {\r
                width: 100%;\r
                border-collapse: collapse;\r
            }\r
            td {\r
                padding: 8px;\r
                border-bottom: 1px solid #f5f5f5;\r
            }\r
            a {\r
                text-decoration: none;\r
                color: #646cff;\r
            }\r
            a:hover {\r
                text-decoration: underline;\r
            }\r
            ul,\r
            li {\r
                list-style: none;\r
                margin: 0;\r
                padding: 0;\r
            } */\r
            * {\r
                margin: 0;\r
                padding: 0;\r
                outline: 0;\r
            }\r
\r
            body {\r
                padding: 80px 100px;\r
                font: 13px 'Helvetica Neue', 'Lucida Grande', 'Arial';\r
                background: #ece9e9 -webkit-gradient(linear, 0% 0%, 0% 100%, from(#fff), to(#ece9e9));\r
                background: #ece9e9 -moz-linear-gradient(top, #fff, #ece9e9);\r
                background-repeat: no-repeat;\r
                color: #555;\r
                -webkit-font-smoothing: antialiased;\r
            }\r
            h1,\r
            h2,\r
            h3 {\r
                padding-left: 10px;\r
                font-size: 22px;\r
                color: #343434;\r
            }\r
            h1 em,\r
            h2 em {\r
                padding: 0 5px;\r
                font-weight: normal;\r
            }\r
            h1 {\r
                font-size: 60px;\r
            }\r
            h2 {\r
                margin-top: 10px;\r
            }\r
            h3 {\r
                margin: 5px 0 10px 0;\r
                padding-bottom: 5px;\r
                border-bottom: 1px solid #eee;\r
                font-size: 18px;\r
            }\r
            ul li {\r
                list-style: none;\r
            }\r
            ul li:hover {\r
                cursor: pointer;\r
                color: #2e2e2e;\r
            }\r
            ul li .path {\r
                padding-left: 5px;\r
                font-weight: bold;\r
            }\r
            ul li .line {\r
                padding-right: 5px;\r
                font-style: italic;\r
            }\r
            ul li:first-child .path {\r
                padding-left: 0;\r
            }\r
            p {\r
                line-height: 1.5;\r
            }\r
            a {\r
                color: #555;\r
                text-decoration: none;\r
            }\r
            a:hover {\r
                color: #303030;\r
            }\r
            #stacktrace {\r
                margin-top: 15px;\r
            }\r
            .directory h1 {\r
                margin-bottom: 15px;\r
                font-size: 18px;\r
            }\r
            ul#files {\r
                width: 100%;\r
                height: 100%;\r
                overflow: hidden;\r
            }\r
            ul#files li {\r
                float: left;\r
                width: 30%;\r
                line-height: 25px;\r
                margin: 1px;\r
            }\r
            ul#files li a {\r
                display: block;\r
                height: 25px;\r
                border: 1px solid transparent;\r
                -webkit-border-radius: 5px;\r
                -moz-border-radius: 5px;\r
                border-radius: 5px;\r
                overflow: hidden;\r
                white-space: nowrap;\r
            }\r
            ul#files li a:focus,\r
            ul#files li a:hover {\r
                background: rgba(255, 255, 255, 0.65);\r
                border: 1px solid #ececec;\r
            }\r
            ul#files li a.highlight {\r
                -webkit-transition: background 0.4s ease-in-out;\r
                background: #ffff4f;\r
                border-color: #e9dc51;\r
            }\r
            #search {\r
                display: block;\r
                position: fixed;\r
                top: 20px;\r
                right: 20px;\r
                width: 90px;\r
                -webkit-transition: width ease 0.2s, opacity ease 0.4s;\r
                -moz-transition: width ease 0.2s, opacity ease 0.4s;\r
                -webkit-border-radius: 32px;\r
                -moz-border-radius: 32px;\r
                -webkit-box-shadow: inset 0px 0px 3px rgba(0, 0, 0, 0.25), inset 0px 1px 3px rgba(0, 0, 0, 0.7),\r
                    0px 1px 0px rgba(255, 255, 255, 0.03);\r
                -moz-box-shadow: inset 0px 0px 3px rgba(0, 0, 0, 0.25), inset 0px 1px 3px rgba(0, 0, 0, 0.7),\r
                    0px 1px 0px rgba(255, 255, 255, 0.03);\r
                -webkit-font-smoothing: antialiased;\r
                text-align: left;\r
                font: 13px 'Helvetica Neue', Arial, sans-serif;\r
                padding: 4px 10px;\r
                border: none;\r
                background: transparent;\r
                margin-bottom: 0;\r
                outline: none;\r
                opacity: 0.7;\r
                color: #888;\r
            }\r
            #search:focus {\r
                width: 120px;\r
                opacity: 1;\r
            }\r
\r
            /*views*/\r
            #files span {\r
                display: inline-block;\r
                overflow: hidden;\r
                text-overflow: ellipsis;\r
                text-indent: 10px;\r
            }\r
            #files .name {\r
                background-repeat: no-repeat;\r
            }\r
            #files .icon .name {\r
                text-indent: 28px;\r
            }\r
\r
            /*tiles*/\r
            .view-tiles .name {\r
                width: 100%;\r
                background-position: 8px 5px;\r
            }\r
            .view-tiles .size,\r
            .view-tiles .date {\r
                display: none;\r
            }\r
\r
            /*details*/\r
            ul#files.view-details li {\r
                float: none;\r
                display: block;\r
                width: 90%;\r
            }\r
            ul#files.view-details li.header {\r
                height: 25px;\r
                background: #000;\r
                color: #fff;\r
                font-weight: bold;\r
            }\r
            .view-details .header {\r
                border-radius: 5px;\r
            }\r
            .view-details .name {\r
                width: 60%;\r
                background-position: 8px 5px;\r
            }\r
            .view-details .size {\r
                width: 10%;\r
            }\r
            .view-details .date {\r
                width: 30%;\r
            }\r
            .view-details .size,\r
            .view-details .date {\r
                text-align: right;\r
                direction: rtl;\r
            }\r
\r
            /*mobile*/\r
            @media (max-width: 768px) {\r
                body {\r
                    font-size: 13px;\r
                    line-height: 16px;\r
                    padding: 0;\r
                }\r
                #search {\r
                    position: static;\r
                    width: 100%;\r
                    font-size: 2em;\r
                    line-height: 1.8em;\r
                    text-indent: 10px;\r
                    border: 0;\r
                    border-radius: 0;\r
                    padding: 10px 0;\r
                    margin: 0;\r
                }\r
                #search:focus {\r
                    width: 100%;\r
                    border: 0;\r
                    opacity: 1;\r
                }\r
                .directory h1 {\r
                    font-size: 2em;\r
                    line-height: 1.5em;\r
                    color: #fff;\r
                    background: #000;\r
                    padding: 15px 10px;\r
                    margin: 0;\r
                }\r
                ul#files {\r
                    border-top: 1px solid #cacaca;\r
                }\r
                ul#files li {\r
                    float: none;\r
                    width: auto !important;\r
                    display: block;\r
                    border-bottom: 1px solid #cacaca;\r
                    font-size: 2em;\r
                    line-height: 1.2em;\r
                    text-indent: 0;\r
                    margin: 0;\r
                }\r
                ul#files li:nth-child(odd) {\r
                    background: #e0e0e0;\r
                }\r
                ul#files li a {\r
                    height: auto;\r
                    border: 0;\r
                    border-radius: 0;\r
                    padding: 15px 10px;\r
                }\r
                ul#files li a:focus,\r
                ul#files li a:hover {\r
                    border: 0;\r
                }\r
                #files .header,\r
                #files .size,\r
                #files .date {\r
                    display: none !important;\r
                }\r
                #files .name {\r
                    float: none;\r
                    display: inline-block;\r
                    width: 100%;\r
                    text-indent: 0;\r
                    background-position: 0 50%;\r
                }\r
                #files .icon .name {\r
                    text-indent: 41px;\r
                }\r
            }\r
            #files .icon-directory .name {\r
                background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAMAAAAoLQ9TAAAABGdBTUEAALGPC/xhBQAAAWtQTFRFAAAA/PPQ9Nhc2q402qQ12qs2/PTX2pg12p81+/LM89NE9dto2q82+/fp2rM22qY39d6U+/bo2qo2/frx/vz32q812qs12qE279SU8c4w9NZP+/LK//367s9y7s925cp0/vzw9t92//342po2/vz25s1579B6+OSO2bQ0/v799NyT8tE79dld8Msm+OrC/vzx79KA2IYs7s6I9d6R4cJe9+OF/PLI/fry79OF/v30//328tWB89RJ8c9p8c0u9eCf//7+9txs6sts5Mdr+++5+u2z/vrv+/fq6cFz8dBs8tA57cpq+OaU9uGs27Y8//799NdX/PbY9uB89unJ//z14sNf+emh+emk+vDc+uys9+OL8dJy89NH+eic8tN5+OaV+OWR9N2n9dtl9t529+KF9+GB9Nue9NdU8tR/9t5y89qW9dpj89iO89eG/vvu2pQ12Y4z/vzy2Ict/vvv48dr/vzz4sNg///+2Igty3PqwQAAAAF0Uk5TAEDm2GYAAACtSURBVBjTY2AgA2iYlJWVhfohBPg0yx38y92dS0pKVOVBAqIi6sb2vsWWpfrFeTI8QAEhYQEta28nCwM1OVleZqCAmKCEkUdwYWmhQnFeOStQgL9cySqkNNDHVJGbiY0FKCCuYuYSGRsV5KgjxcXIARRQNncNj09JTgqw0ZbkZAcK5LuFJaRmZqfHeNnpSucDBQoiEtOycnIz4qI9bfUKQA6pKKqAgqIKQyK8BgAZ5yfODmnHrQAAAABJRU5ErkJggg==);\r
            }\r
            #files .icon-text-html .name {\r
                background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAABGdBTUEAAK/INwWK6QAAABl0RVh0U29mdHdhcmUAQWRvYmUgSW1hZ2VSZWFkeXHJZTwAAAHtSURBVDjLjZM9T9tQFIYpQ5eOMBKlW6eWIQipa8RfQKQghEAKqZgKFQgmFn5AWyVDCipVQZC2EqBWlEqdO2RCpAssQBRsx1+1ndix8wFvfW6wcUhQsfTI0j33PD7n+N4uAF2E+/S5RFwG/8Njl24/LyCIOI6j1+v1y0ajgU64cSSTybdBSVAwSMmmacKyLB/DMKBpGkRRZBJBEJBKpXyJl/yABLTBtm1Uq1X2JsrlMnRdhyRJTFCpVEAfSafTTUlQoFs1luxBAkoolUqQZbmtJTYTT/AoHInOfpcwtVtkwcSBgrkDGYph+60oisIq4Xm+VfB0+U/P0Lvj3NwPGfHPTcHMvoyFXwpe7UmQtAqTUCU0D1VVbwTPVk5jY19Fe3ZfQny7CE51WJDXqpjeEUHr45ki9rIqa4dmQiJfMLItGEs/FcQ2ucbRmdnSYy5vYWyLx/w3EaMfLmBaDpMQvuDJ65PY8Dpnz3wpYmLtApzcrIAqmfrEgdZH1grY/a36w6Xz0DKD8ES25/niYS6+wWE8mWfByY8cXmYEJFYLkHUHtVqNQcltAvoLD3v7o/FUHsNvzlnwxfsCEukC/ho3yUHaBN5Buo17Ojtyl+DqrnvQgUtfcC0ZcAdkUeA+ye7eMru9AUGIJPe4zh509UP/AAfNypi8oj/mAAAAAElFTkSuQmCC);\r
            }\r
        </style>\r
    </head>\r
    <body class="directory">\r
        <div class="wrapper">\r
            <h1>{{headItem}}</h1>\r
            <ul id="files" class="view-tiles">\r
                {{listItems}}\r
            </ul>\r
        </div>\r
    </body>\r
</html>\r
`;

// src/index.ts
function fileServerPlugin(options = {}) {
  const { enable = true } = options;
  return {
    name: "vite-plugin-files-server",
    // 必须唯一
    // 核心钩子：配置开发服务器
    configureServer(server) {
      if (!enable) return;
      server.middlewares.use((req, res, next) => {
        const url = req.url ? decodeURIComponent(req.url.split("?")[0]) : "/";
        if (url.startsWith("/@") || url.includes("vite")) {
          return next();
        }
        const projectRoot = server.config.root;
        const fullPath = path.join(projectRoot, url);
        try {
          if (fs.existsSync(fullPath) && fs.statSync(fullPath).isDirectory()) {
            if (fs.existsSync(path.join(fullPath, "index.html"))) {
              return next();
            }
            let urlSplitArray = url.split("/");
            if (urlSplitArray[urlSplitArray.length - 1] == "") urlSplitArray = urlSplitArray.slice(0, -1);
            let headItem = '<a href="/">\u{1F3E0}\uFE0E</a> / ';
            urlSplitArray.forEach((p) => {
              p && (headItem += `<a href="/${p}">${p}</a> / `);
            });
            const files = fs.readdirSync(fullPath);
            const listItems = files.map((file) => {
              const filePath = path.join(fullPath, file);
              const isDir = fs.statSync(filePath).isDirectory();
              const href = path.join(url, file).replace(/\\/g, "/");
              const item = `
                                    <li>
                                        <a href="${href}" class="icon ${isDir ? "icon-directory" : "icon-html icon-text-html"}"> 
                                            <span class="name">${file}</span> 
                                        </a>
                                    </li>`;
              return item;
            }).join("");
            urlSplitArray = urlSplitArray.slice(0, -1);
            let backUrl = urlSplitArray.join("/");
            const backItem = `
                            <li>
                                <a href="${backUrl}" class="icon icon-directory"><span class="name">..</span></a>
                            </li>`;
            let fullList = urlSplitArray.length > 1 ? backItem + listItems : listItems;
            const html = temp_default.replace(/{{title}}/g, `Index of ${url}`).replace(/{{headItem}}/g, headItem).replace(/{{url}}/g, url).replace(/{{listItems}}/g, fullList);
            res.setHeader("Content-Type", "text/html");
            res.end(html);
            return;
          } else if (!fs.existsSync(fullPath)) {
            res.statusCode = 404;
            const html = "404 Not Found";
            res.setHeader("Content-Type", "text/html");
            res.end(html);
            return;
          }
        } catch (e) {
          console.error("File Server Plugin Error:", e);
        }
        next();
      });
    }
  };
}
export {
  fileServerPlugin as default
};
