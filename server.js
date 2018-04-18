const info = require('./info');
const http = require('http');
const url = require('url');

const port = 8000;

function requestHandler(request, response) {
    console.log(request.url);

    let parsed = url.parse(request.url, true);
    let name = parsed.query['name'];
    if (!name) {
        response.end('I don\'t know!');
        return
    }

    try {
        console.log(`finding ${name}`);
        response.end(info.getInfoByName(name));
    }
    catch (e) {
        console.log(e);
        response.writeHead(404);
        response.end('I don\'t know!');
    }
}

function listenCallback(err) {
    if (err) {
        return console.log('something bad happened', err)
    }

    console.log(`server is listening on ${port}`)
}

const server = http.createServer(requestHandler);
server.listen(port, listenCallback);
