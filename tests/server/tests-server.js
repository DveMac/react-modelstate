var React = require('react');
var ReactTestUtils = require('react/lib/ReactTestUtils');
var _ = require('lodash');
var Async = require('react-async');
var ModelState = require('../../lib/ReactModelState.js');
var tape = require('tape');
var dataService = require('../common/dataService.js');
var superagent = require('superagent');


tape('renderComponentToString', function (test) {

  test.plan(1);

  var List = React.createClass({
    mixins: [ModelState.Mixin, Async.Mixin],
    getInitialStateAsync: function (cb) {
      var stateContracts = {
        colours: ModelState.wrap('colours', dataService.getColours)
      };
      this.resolveModelStatesAsync(stateContracts, cb);
    },
    render: function () {
      var data = ModelState.result(this.state.colours) || [];
      var items = data.map(function (d) {
        return React.DOM.div({ key: d.value, className: 'item' }, d.color);
      });
      return React.DOM.div(null, items);
    }
  });

  var list = List({ params: { take: 10 } });

  Async.renderComponentToStringWithAsyncState(list, function(err, markup) {
    if (err) { throw err; }
    console.log(markup);
    test.equal(markup.indexOf('red') > 0, true, 'component div has red');
  });

//  test.ok(node.classList.contains('button'), 'component has button class');
//  ReactTestUtils.Simulate.click(comp.refs.google);

});