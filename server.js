const info = require('./info');
const http = require('http');
const url = require('url');

const port = 8000;

function requestHandler(request, response) {
    console.log(request.url);

    let parsed = url.parse(request.url, true);
    let rx1 = parsed.query['rx1'];
    let rx2 = parsed.query['rx2'];
    let ry1 = parsed.query['ry1'];
    let ry2 = parsed.query['ry2'];
    let px = parsed.query['px'];
    let py = parsed.query['py'];

    if (!(rx1 && rx2 && ry1 && ry2 && px && py)) {
        response.end('Invalid query');
        return
    }

    if (info.isPointInArea(
        parseFloat(px), parseFloat(py),
        parseFloat(rx1), parseFloat(ry1),
        parseFloat(rx2), parseFloat(ry2))) {

        response.end('Point in Area');
    }
    else {
        response.end('Point not in Area');
    }
}

function listenCallback(err) {
    if (err) {
        return console.log('something bad happened', err)
    }

    console.log(`server is listening on ${port}`)
}

const server = http.createServer(requestHandler);
server.listen(process.env.PORT || port, listenCallback);
