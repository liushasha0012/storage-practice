const http = require("http");
const fs = require("fs");
const url = require("url");
const path = require("path")

const redis = require("redis");
const client = redis.createClient(6379, '127.0.0.1');

const port = 9082;
let partFilePath = '';
let fullFilePath = '';
// let maxAge = 120;
// let useWeakcCache = 1;

// 不缓存
let maxAge = 0;
let useWeakcCache = 0;

// 获取后缀名
const getExt = (extName) => {
    switch(extName) {
      case '.html': return 'text/html';
      case '.css': return 'text/css';
      case '.js': return 'text/javascript';
      default: return 'text/html';
    }
}

const server = http.createServer();

server.listen(port, () => {
    console.log(`服务器正在端口号${port}上运行`);
});

server.on('request', (req, res) => {
    let pathName = url.parse(req.url).pathname; //转换为url对象

    if (pathName == '/favicon.ico') {
        res.end();
        return;
    }

	//默认加载路径
	if (pathName == '/') {
		pathName = "/index.html";
    }

    if (pathName == '/dist/home.js') {
        partFilePath = path.resolve(__dirname, '../');
    } else {
        partFilePath =  path.resolve(__dirname, '../src/home/')
    }
    
	//获取文件后缀名
    let extName = path.extname(pathName);
    fullFilePath = partFilePath + pathName;

    // redis 获取相应值
    client.on("error", (error) => {
        console.error(error);
    });
    client.get("max-age", (err, value) => {
        if (err) {
            throw err;
        }
        maxAge = +value;
        console.log('maxAge:', maxAge);
    });
    client.get("use-weak-cache", (err, value) => {
        if (err) {
            throw err;
        }
        useWeakcCache = +value;
        console.log('useWeakcCache:', useWeakcCache);
    });

	fs.readFile(fullFilePath, (err, data) => {
		if (err) { 
            res.writeHead(200, {"Content-Type": "text/html;charset=utf-8"});
            res.write("error");
            res.end();
		} else {
            if (pathName == '/index.html') {
                res.writeHead(200, {
                    "Content-Type": "text/html; charset=utf-8",
                });
                res.write(data); 
                res.end();
            } else {
                // 获取对应后缀的文件类型
                let ext = getExt(extName);
                let stat = fs.statSync(fullFilePath);
                // ETag 一般由 last_modified 与 content_length 组成
                let Etag = `${data.length.toString(16)}${stat.mtime.toString(16)}`;
                
                // 根据useWeakcCache的值来判断是否要使用协商缓存
                if (useWeakcCache) {
                    if (req.headers['if-modified-since'] === stat.mtime.toUTCString() || (req.headers['if-none-match'] === Etag)) { 
                        // mtime为文件内容改变的时间戳
                        // 文件未变更，缓存还可以用，返回新的过期时间，不用返回响应体，浏览器会去用缓存的内容
                        res.writeHead(304, {
                            'Cache-Control': `max-age=${maxAge}, public`,
                            'Last-Modified': stat.mtime.toUTCString(), // 资源的最近修改时间 （GMT标准格式）
                            'Etag': Etag,
                        });
                        res.end();
                    } else {
                        // 文件变更，要返回新的文件内容
                        res.writeHead(200, {
                            "Content-Type": ext + "; charset=utf-8",
                            'Cache-Control': `max-age=${maxAge}, public`,
                            'Last-Modified': stat.mtime.toUTCString(),
                            'Etag': Etag,
                        });
                        res.write(data); 
                        res.end();
                    }
                } else {
                    res.writeHead(200, {
                        "Content-Type": ext + "; charset=utf-8",
                        'Cache-Control': `max-age=${maxAge}, public`,
                        'Last-Modified': stat.mtime.toUTCString(),
                        'Etag': Etag,
                    });
                    res.write(data); 
                    res.end();
                }
            }
		}
	});
});
