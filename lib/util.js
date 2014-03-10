function forEach(o, iter, ctx) {
  for(var k in o) {
    iter.call(ctx, o[k], k)
  }
}

var isArray = Array.isArray || function (obj) {
  return toString.call(obj) === "[object Array]";
};

function noop() {
}

function isFunction(obj) {
  return !!(obj && obj.constructor && obj.call && obj.apply);
}

function reduce(o, iter, m) {
  m = m || o[0];
  forEach(o, function (v, k) {
    iter(m, v, k);
  });
  return m;
}

function extend(o, p) {
  forEach(p, function (v, k) {
    if (!o.hasOwnProperty(k)){
      o[k] = v;
    }
  })
  return o;
}

function pick(o, p) {
  var result = {};
  if (!isArray(p)) {
    throw new Error('Params arg must be an array');
  }
  forEach(o, function (v, k) {
    if (!!~p.indexOf(k)) {
      result[k] = v;
    }
  });
  return result;
}

function map(o, iter, ctx) {
  var result = [];

  forEach(o, function () {
    result.push(iter.apply(ctx, arguments));
  }, ctx);

  return result;
}


module['exports'] = {
  forEach: forEach,
  pick: pick,
  isFunction: isFunction,
  isArray: isArray,
  noop: noop,
  extend: extend,
  map: map,
  reduce: reduce
};