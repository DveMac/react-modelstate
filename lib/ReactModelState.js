var ModelState = require('./ModelState');
var q = require('q');
var Util = require('./util');
var asyncFlag = '____async';
var stateWillChange = 'stateWillChange';

var ReactModelState = (function () {

  function isString(val) {
    return (typeof val == 'string' || val instanceof String);
  }

  function withComponentModelStates(comp, fn) {
    var result = [];
    // TODO: memoize
    for (var k in comp.state) {
      var c = comp.state[k];
      if (ModelState.isModelState(c)) {
        result.push(fn(k, c));
      }
    }
    return result;
  }

  function setStateProxy(key, modelState, nextModelState) {
    var partialState = {};
    partialState[key] = nextModelState;
    this.setState(partialState);
    return partialState;
  }

  function result(modelState) {
    modelState = isString(modelState) ? this.state[modelState] : modelState;
    return ModelState.result(modelState);
  };

  var Mixin = {

    resolveModelStatesAsync: function (modelStates, cb) {
      var _this = this;
      _this[asyncFlag] = true;
      var promises = Util.map(modelStates, function (c, key) {
        var d = q.defer();
        c.on(stateWillChange, function (nc) {
          d.resolve(setStateProxy.call(_this, key, c, nc));
        });
        ModelState.process(c);
        return d.promise;
      });
      q.all(promises).then(function (data) {
        var state = Util.reduce(data, Util.extend, {});
        cb(null, state);
      }, cb.bind(null))
    },

    componentWillMount: function () {
      var _this = this;
      withComponentModelStates(_this, function (key, ms) {
        ms.on(stateWillChange, setStateProxy.bind(_this, key));
        ModelState.process(ms, _this.props);
      });
    },

    componentWillReceiveProps: function (nextProps) {
      withComponentModelStates(this, function (key, ms) {
        ModelState.process(ms, nextProps);
      });
    },

    shouldComponentUpdate: function (nextProps, nextState) {
      var _this = this, update = true;
      withComponentModelStates(_this, function (key, ms) {
        update &= ((key in nextState) && _this.state[key].dataFingerprint !== nextState[key].dataFingerprint)
      });
      return update;
    },

    componentWillUnmount: function () {
      withComponentModelStates(this, function (key, ms) {
        ms.off(stateWillChange);
      });
    }

  };

  return {
    wrap: ModelState.wrap,
    result: result,
    Mixin: Mixin
  };

}());

module.exports = ReactModelState;
