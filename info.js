
function inRange(a, begin, end) {
    return (a < end) && (begin < a);
}

function isPointInArea(px, py, rx1, ry1, rx2, ry2) {
    let minX = Math.min(rx1, rx2);
    let maxX = Math.max(rx1, rx2);
    let minY = Math.min(ry1, ry2);
    let maxY = Math.max(ry1, ry2);

    let pointIn = px > minX && px < maxX
        && py > minY && py < maxY;

    return pointIn
}

exports.isPointInArea = isPointInArea;