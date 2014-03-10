var tape = require('tape');
var dataService = require('../common/dataService.js');
var ModelState = require('../../lib/ModelState');

module.exports = function run() {


  tape('can wrap fn that returns promise', function (test) {

    test.plan(1);

    var ms = ModelState.wrap('test1', dataService.getColoursPromise);

    ms.on('stateWillChange', function (state) {
      test.ok(ModelState.result(state));
    });

    ModelState.process(ms, { take: 10 });

  });

  tape('wrap args are passed to wrappie before process() args', function (test) {

    test.plan(4);

    var params = { cat: 10 }, fixed = 2;
    var ms = ModelState.wrap('test3', function(p, f, cb) {
      dataService.getColours(p, cb);
      test.equal(p, params)
    }, params);

    ms.on('stateWillChange', function (state, nextState) {
      test.ok(ModelState.result(state));
      test.notOk(state.dataFingerprint);
      test.ok(nextState.dataFingerprint);
    });

    ModelState.process(ms, fixed);

  });

  tape('default args can be changed and are used', function (test) {

    test.plan(3);

    var params = { cat: 10 }, fixed = 2;
    var ms = ModelState.wrap('test4', function(p, f, cb) {
      dataService.getColours(p, cb);
      test.equal(p, params)
    }, params, fixed);

    ms.on('stateWillChange', function (state) {
      test.ok(ModelState.result(state));
    });

    ModelState.process(ms);

    params.cat = 15;

    ModelState.process(ms);

  });

  tape('process calls listeners method when successful', function (test) {

    test.plan(1);

    var ms = ModelState.wrap('test5', dataService.getColours);

    ms.on('stateWillChange', function (state) {
      test.ok(ModelState.result(state));
    });

    ModelState.process(ms, {});

  });

  tape('result can be called before process is run', function (test) {

    test.plan(2);

    var ms = ModelState.wrap('test2', dataService.getColours);

    var r1 = ModelState.result(ms);
    test.notOk(r1);

    ms.on('stateWillChange', function () {
      var r2 = ModelState.result(ms);
      test.deepEqual(r2, dataService.src);
    });

    ModelState.process(ms, {});

  });

  tape('result data can be accessed many times', function (test) {

    test.plan(3);

    var ms = ModelState.wrap('test6', dataService.getColours);

    ms.on('stateWillChange', function () {
      test.deepEqual(ModelState.result(ms), dataService.src);
      test.deepEqual(ModelState.result(ms), dataService.src);
      setTimeout(function () {
        test.deepEqual(ModelState.result(ms), dataService.src);
      }, 50);
    });

    ModelState.process(ms, {});

  });

};