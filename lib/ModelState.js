var q = require('q');
var Util = require('./util.js');
var adler32 = require('react/lib/adler32');

q.longStackJumpLimit = 0;

function checksum(o) {
  // TODO: is this the most suitable checksum method?
  return adler32(JSON.stringify(o));
}

function slice(arr, idx) {
  return Array.prototype.slice.call(arr, idx || 0);
}

function logError() {
  console.log.apply(console, arguments);
}

var modelStateIdent = '___mdlst';

var ModelState = (function () {

  var _internal = {};

  function _addListener(event, cb) {
    if (!Util.isFunction(cb)) {
      throw new Error("ModelState event listener must be a function");
    }
    _internal[this.name].listeners[event] = cb;
  }

  function _removeListener(event) {
    if (_internal[this.name].listeners[event]) {
      delete _internal[this.name].listeners[event];
    }
  }

  function _publish(event, ic, fingerprint) {
    var cb = _internal[ic.name].listeners[event];
    if (cb && ic.modelState.dataFingerprint !== fingerprint) {
      var nextModelState = Util.extend({ dataFingerprint: fingerprint }, ic.modelState);
      //ic.modelState.dataFingerprint = fingerprint;
      (_internal[ic.name].listeners[event] || Util.noop)(ic.modelState, nextModelState);
    }
  }

  function _processData(ic, data) {
    var dataFingerprint;
    data = processData(data);
    dataFingerprint = getDataFingerprint(data);
    ic.data = data;
    _publish('stateWillChange', ic, dataFingerprint);
  }

  function processData(data) {
    return data;
  }

  function getDataFingerprint(data) {
    return checksum(data);
  }

  function InternalContract(ms, fn, args) {
    this.name = ms.name;
    this.fn = fn;
    this.data = undefined;
    this.args = args;
    this.listeners = {};
    this.modelState = ms;
  }

  InternalContract.prototype.process = function () {

    var d = q.defer(),
      p = d.promise,
      args = slice(this.args).concat(arguments.length ? slice(arguments) : []);

    p.then(_processData.bind(null, _internal[this.name]), logError);
    // TODO: middleware here

    if (args.length < this.fn.length - 1) {
      return d.reject("Insufficient args passed to process()");
    }

    args.push(function (err, data) {
      if (!!err) {
        this.reject(err);
      }
      this.resolve(data);
    }.bind(d));

    var r = this.fn.apply(null, args);

    if (r && r.then) {
      // this is probably a promise result
      r.then(d.resolve, d.reject);
    }
  };

  InternalContract.prototype.result = function () {
    var _this = this;
    return _this.data;
  };

  // ----------------------------------------------

  function ModelState(name) {
    this.name = name;
    this.dataFingerprint = null;
    this[modelStateIdent] = 1;
  }

  ModelState.prototype.on = function on(event, cb) {
    _addListener.call(this, event, cb);
  };

  ModelState.prototype.off = function off(event) {
    _removeListener.call(this, event);
  };

  function wrap(name, fn) {
    if (name in _internal) {
      // TODO: this shouldnt matter
      throw new Error('ModelState with name ' + name + ' already exists');
    }
    if (arguments.length < 2) {
      throw new Error("create requires a name and function or object to wrap");
    }
    var args = slice(arguments, 2);
    var ms = new ModelState(name);
    _internal[name] = new InternalContract(ms, fn, args);
    return ms;
  }

  function isModelState(o) {
    return o && (modelStateIdent in o);
  }

  function process() {
    var args = slice(arguments), c = args.length ? args.shift() : Util.noop;
    if (!isModelState(c)) {
      throw new Error("The first param to process() must be instance of ModelState.");
    }
    _internal[c.name].process.apply(_internal[c.name], args);
  }

  function result(c) {
    var name = c.name || c;
    return (name in _internal) ? _internal[name].result() : undefined;
  }

  return {
    wrap: wrap,
    isModelState: isModelState,
    process: process,
    result: result
  };
}());

module.exports = ModelState;