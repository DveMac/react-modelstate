var React       = require('react');
var ReactMount  = require('react/lib/ReactMount');
var ReactAsync  = require('react-async');
var List        = require('./List.jsx');

ReactMount.allowFullPageRender = true;

var App = React.createClass({
  mixins: [ReactAsync.Mixin],

  getInitialStateAsync: function(cb) {
    setTimeout(function() {
      cb(null, {message: 'Hello, here are some colours, server rendered!'});
    }, 0);
  },

  onClick: function (show, event) {
    event.preventDefault();
    this.setState({
      take: show || 10
    });
  },

  render: function() {
    return React.DOM.html(null,
      React.DOM.body(null,
        React.DOM.h1(null, this.state.message || 'Loading...'),
        List({ params: { take: this.state.take || 10 }}),
        React.DOM.button({ onClick: this.onClick.bind(this,3) }, 'Show 3'),
        React.DOM.button({ onClick: this.onClick.bind(this,6) }, 'Show 6')));
  }
});



if (typeof window !== 'undefined') {
  React.renderComponent(App(), document);
}

module.exports = App;
