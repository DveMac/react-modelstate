var data = require('./data.json');
var entries = require('./entries.json');
var q = require('q');

var dataService = {

  getColours: function (props, cb) {
    console.log('DataService', 'getColours');
    setTimeout(function () {
      var take = (props && props.params && props.params.take) || 10;
      cb(null, data.slice(0, take));
    }, 50)
  },

  getEntries: function (props, cb) {
    console.log('DataService', 'getEntries', props);
    setTimeout(function () {
      var take = (props && props.params && props.params.take) || 100;
      cb(null, entries.slice(0, take));
    }, 50)
  },

  getColoursPromise: function (props) {
    var d = q.defer();
    setTimeout(function () {
      var take = (props && props.params && props.params.take) || 10;
      d.resolve(data.slice(0, take));
    }, 50);
    return d.promise;
  },

  getColoursPromiseReject: function (arg1, arg2) {
    var d = q.defer();
    setTimeout(function () {
      d.reject("it broke");
    }, 50);
    return d.promise;
  },

  src: data
};

module.exports = dataService;
