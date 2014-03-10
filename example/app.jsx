/** @jsx React.DOM */

var React       = require('react');
var List        = require('./List.jsx');

var HelloWorld  = React.createClass({

  getInitialState: function () {
    return {
      params: {
        take: 10
      }
    };
  },

  clickHandler: function (show, event) {
    event.preventDefault();
    this.setState({ params: { take: show } });
  },

  render: function () {
    return (
      <div>
        <h1>Hello!</h1>
        <button onClick={this.clickHandler.bind(this, 10)}>Show 10</button>
        <button onClick={this.clickHandler.bind(this, 100)}>Show 100</button>
        <List params={this.state.params} />
      </div>
      );
  }
});


React.renderComponent(
  <HelloWorld date={new Date()} />, document.getElementById('example')
);

