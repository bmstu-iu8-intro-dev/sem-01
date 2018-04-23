const info = require('./info');
const express = require('express');

const port = 8000;

function requestHandler(request, response) {
    console.log(request.url);

    const rx1 = request.query.rx1;
    const rx2 = request.query.rx2;
    const ry1 = request.query.ry1;
    const ry2 = request.query.ry2;
    const px = request.query.px;
    const py = request.query.py;

    if (!(rx1 && rx2 && ry1 && ry2 && px && py)) {
        response.writeHeader(400);
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

const app = express();
app.get('/', requestHandler);
app.listen(process.env.PORT || port, listenCallback);
