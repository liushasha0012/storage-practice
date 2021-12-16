const http = require("http");
const fs = require("fs");
const url = require("url");
const path = require("path")

// 获取后缀名
const getExt = (extName) => {
    switch(extName) {
      case '.html': return 'text/html';
      case '.css': return 'text/css';
      case '.js': return 'text/javascript';
      default: return 'text/html';
    }
}

const port = 9083;

let partFilePath = '';

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

	// 默认加载路径
	if (pathName == '/') {
		pathName = "/index.html";
    }

    // 实践1 + 实践2中的静态资源缓存
    // if (pathName == '/dist/manage.js') {
    //     partFilePath = path.resolve(__dirname, '../');
    // } else {
    //     partFilePath =  path.resolve(__dirname, '../src/manage/')
    // }
    
    // 实践2中的websocket
    if (pathName == '/dist/manage2.js') {
        partFilePath = path.resolve(__dirname, '../');
    } else {
        partFilePath =  path.resolve(__dirname, '../src/manage2/')
    }
    
	//获取文件后缀名
    let extName = path.extname(pathName);
 
	fs.readFile(partFilePath + pathName, (err, data) => {
		if (err) { 
            res.writeHead(200, {"Content-Type": "text/html;charset=utf-8"});
            res.write("error");
            res.end();
		} else {
			// 获取对应后缀的文件类型
            let ext = getExt(extName);

            // 设置请求头
            res.writeHead(200, {"Content-Type": ext + "; charset=utf-8"});
			res.write(data); //返回请求文件
			res.end();
		}
	});
});


