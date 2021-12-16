const path = require("path")
const express = require('express');
const app = express();
const expressWs = require('express-ws')(app);

const bodyParser = require('body-parser');
// 实践1中用的是http协议，实践2中用的是websocket协议
// spawn可以将脚本的输出内容实时输出，然后用websocket将输出实时返回给客户端（浏览器）
const {execFile, spawn} = require('child_process');

app.use(bodyParser.json());

const port = 10000;



//Allow CORS
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin,Content-Type,Accept,X-Original-Header1,X-Original-Header2");
    next();
});

app.ws('/create', (ws, req) => {
    ws.on('message', (message) => {
        console.log('server received: %s', message);
    });
    let sh = path.resolve(__dirname, '../create-branch.sh');

    const ls = spawn(sh);

    ls.stdout.on('data', (data) => {
        ws.send(`${data}`)
    });
    
    ls.stderr.on('data', (data) => {
        ws.send(`${data}`)
    });
    
    ls.on('close', (code) => {
        ws.send(`child process exited with code ${code}`)
        ws.send('create end');
    });

    // execFile(sh, (err, stdout, stderr) => {
    //     if (err) {
    //         ws.send(stderr)
    //     } else {
    //         ws.send(stdout)
    //     }
    // });
})
app.ws('/staging', (ws, req) => {
    ws.on('message', (message) => {
        console.log('server received: %s', message);
    });
    let sh = path.resolve(__dirname, '../staging.sh');

    const ls = spawn(sh);

    ls.stdout.on('data', (data) => {
        ws.send(`${data}`)
    });
    
    ls.stderr.on('data', (data) => {
        ws.send(`${data}`)
    });
    
    ls.on('close', (code) => {
        ws.send(`child process exited with code ${code}`)
        ws.send('staging end');
    });

})
app.ws('/production', (ws, req) => {
    ws.on('message', (message) => {
        console.log('server received: %s', message);
    });
    let sh = path.resolve(__dirname, '../production.sh');

    const ls = spawn(sh);

    ls.stdout.on('data', (data) => {
        ws.send(`${data}`)
    });
    
    ls.stderr.on('data', (data) => {
        ws.send(`${data}`)
    });
    
    ls.on('close', (code) => {
        ws.send(`child process exited with code ${code}`)
        ws.send('production end');
    });
})

app.listen(port);
console.log('Server started on port:' + port);