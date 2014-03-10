/** @jsx React.DOM */

var React         = require('react');
var ModelState    = require('../browser.js').ReactModelState;
var dataService   = require('../tests/common/dataService.js');

var List = React.createClass({

  mixins: [ModelState.Mixin],

  getInitialState: function () {
    return {
      entries: ModelState.wrap('entries', dataService.getEntries)
    };
  },

  render: function () {
    var pre = React.DOM.code(null, React.DOM.p(null, JSON.stringify(this.state)));
    var propsBlock = React.DOM.code(null, React.DOM.p(null, JSON.stringify(this.props)));
    var data = ModelState.result(this.state.entries) || [];
    var items = data.map(function (d) {
      return React.DOM.li({ key: d.id, className: 'item' }, d.title);
    });
    return React.DOM.div(null, pre,propsBlock, React.DOM.ol(null, items));
  }

});

module.exports = List;
