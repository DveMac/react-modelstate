# react-modelstate

Disconnect model state and component state


### Usage

Wrap any function that returns a promise or has a callback as last argument:

`var myModelState = ModelState.wrap(name, fn, /* optional args */, /* component props */)`

*component props are automatically passed to the wrapped function*

Access the most current result: 

`var data = ModelState.result(myModelState)`

Data is automatically updated, if necessary, when state or props change.


### Example

```

var List = React.createClass({

  // --- Add the ModelState Mixin ---
  mixins: [ModelState.Mixin],

  getInitialState: function () {
    return {
      // --- wrap any function that returns a promise or has a callback as last argument
      entries: ModelState.wrap('entries', dataService.getEntries)
    };
  },

  render: function () {
	// --- access the result of any modelState change using .result()
    var data = ModelState.result(this.state.entries) || [];
    var items = data.map(function (d) {
      return React.DOM.li({ key: d.id, className: 'item' }, d.title);
    });
    return React.DOM.div(null, React.DOM.ol(null, items));
  }

});

```

### Demo

```
npm install
node ./example/server.js
open http://localhost:3000
```