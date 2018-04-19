let assert = require('assert');
let info = require('../info');


function test1(){
    it('Point (0, 0) in area [(-1, -1), (1, 1)]', function () {
        assert.equal(info.isPointInArea(0, 0, -1, -1, 1, 1), false);
    });
}

function test2(){
    it('Point (0, 0) not in area [(1, 1), (2, 2)]', function () {
        assert.equal(info.isPointInArea(0, 0, 1, 1, 2, 2), false);
    });

    it('Point (1.5, 0) not in area [(1, 1), (2, 2)]', function () {
        assert.equal(info.isPointInArea(1.5, 0, 1, 1, 2, 2), false);
    });
}


describe('Test isPointInArea', function() {

    describe('In area', test1);
    describe('Not in area', test2);

});
