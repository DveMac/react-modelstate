var React = require('react');
var ReactTestUtils = require('react/lib/ReactTestUtils');
var tape = require('tape');
var q = require('q');
var dataService = require('../common/dataService.js');
var ModelState = require('../../lib/ReactModelState');

module.exports = function run() {

  function createComponentWithModelState(modelState) {
    return React.createClass({
      mixins: [ModelState.Mixin],
      getInitialState: function () {
        return {
          colours: modelState
        }
      },
      render: function () {
        var data = ModelState.result(this.state.colours) || [];
        var items = data.map(function (d) {
          return React.DOM.div({ key: d.value }, d.color);
        });
        return React.DOM.div(null, items);
      }
    });
  }

  tape('processing of new data causes render', function (test) {

    test.plan(1);

    var modelState = ModelState('reacttest1', dataService.getColours);

    var list = createComponentWithModelState(modelState)({ take: 10 });

    ReactTestUtils.renderIntoDocument(list);

    test.equal(list.state.colours, modelState);

  });

  tape('uses props as default params to modelState', function (test) {

    test.plan(1);

    var List = React.createClass({
      mixins: [ModelState.Mixin],
      getInitialState: function () {
        return {
          colours: ModelState.wrap('reacttest2', dataService.getColours)
        }
      },
      render: function () {
        var data = ModelState.result(this.state.colours) || [];
        var items = data.map(function (d) {
          return React.DOM.div({ key: d.value, className: 'item' }, d.color);
        });
        return React.DOM.div(null, items);
      }
    });

    var list = List({ params: { take : 1}  });

    ReactTestUtils.renderIntoDocument(list);
    var items = ReactTestUtils.findRenderedDOMComponentWithClass(list, 'item');
    test.equal(items.length, 1);

  });

}