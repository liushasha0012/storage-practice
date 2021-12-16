const path = require("path")
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const {execFile} = require('child_process');
const redis = require("redis");
const client = redis.createClient(6379, '127.0.0.1');

app.use(bodyParser.json());
 
var port = 9999;
 
//Allow CORS
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin,Content-Type,Accept,X-Original-Header1,X-Original-Header2");
    next();
});

const doShell = (cmd) => {
    let str = cmd;
    let result = {};
    console.log('doShell')
    return new Promise((resolve, reject) => {
        execFile(str, (err, stdout, stderr) => {
            if (err) {
                console.log('stderr')
                console.log(stderr)
                console.log(err)
                result.errCode = 500;
                result.err = stderr;
                reject(result);
            } else {
                console.log('stdout')
                console.log(stdout)
                result.errCode = 200;
                result.data = stdout;
                resolve(result);
            }
        })
    })
}
app.get('/create', (req, res, next) => {
    res.status(200);

    let sh = path.resolve(__dirname, '../create-branch.sh');

    doShell(sh).then((result) => {
        res.json(result);
    }).catch((err) => {
        console.log(err)
        res.json({
            error: err
        });
    });
    next();
});
app.post('/test', bodyParser.json(), (req, res, next) => {
    res.status(200);
    let sh = path.resolve(__dirname, '../create-branch.sh');
    
    doShell(sh).then((res1) => {
        // res.send('hello world');
        res.json(res1);
    }).catch((err) => {
        console.log(err)
        res.json({
            error: err
        });
    });
});

app.post('/staging', bodyParser.json(), (req, res, next) => {
    res.status(200);
    let sh = path.resolve(__dirname, '../staging.sh');
    doShell(sh).then((res1) => {
        res.json(res1);
    }).catch((err) => {
        res.json({
            error: err
        });
    });
});
app.post('/production', bodyParser.json(), (req, res, next) => {
    res.status(200);
    let sh = path.resolve(__dirname, '../production.sh');
    doShell(sh).then((res1) => {
        res.json(res1);
    }).catch((err) => {
        res.json({
            error: err
        });
    });
});
app.post('/cache1', bodyParser.json(), (req, res, next) => {
    res.status(200);
    const data = req.body;
    if (data) {

        client.on("error", (error) => {
            console.error(error);
        });
           
        client.set("max-age", data.time, redis.print);
        client.expire('max-age', 30 * 24 * 60 * 60); // 设置过期时间

        res.json({
            success: true,
        });
    } else {
        res.json({
            success: false,
            message: '强缓存时间设置有误'
        });
    }
});

app.post('/weak-cache', bodyParser.json(), (req, res, next) => {
    res.status(200);
    const data = req.body;
    if (data) {

        client.on("error", (error) => {
            console.error(error);
        });
           
        client.set("use-weak-cache", data.useWeakcCache, redis.print);
        client.expire('use-weak-cache', 30 * 24 * 60 * 60); // 设置过期时间

        res.json({
            success: true,
        });
    } else {
        res.json({
            success: false,
            message: '协商缓存时间设置有误'
        });
    }
});

app.post('/api', bodyParser.json(), (req, res, next) => {
    res.status(200);
    const data = req.body;
    if (data) {
        let message = "Hi,there! You say " + data.message;
        res.json({
            output: message
        });
    } else {
        let message = 'error:message not found.';
        res.json({
            error: message
        });
    }
});

app.listen(port);
console.log('Server started on port:' + port);