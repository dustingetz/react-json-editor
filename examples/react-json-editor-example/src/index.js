import _ from 'lodash';
import React from 'react';
import ReactDOM from 'react-dom';
import {Cursor} from 'react-cursor';
import JsonEditor from 'react-json-editor';
import "./styles.css";

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      a: 10,
      b: '20',
      c: null,
      d: {
        foo: {
          bar: 42,
          baz: 55,
          buzz: 'womp'
        }
      },
      e: [
        {name: 'Alice', id: 0},
        {name: 'Bob', id: 1},
        {name: 'Charlie', id: 2},
        {name: 'David', id: 3}
      ]
    };
  }

  render() {
    var rootCursor = Cursor.build(this);
    return (
        <div className="App">
          <div>
            State
            <pre>{JSON.stringify(this.state, undefined, 2)}</pre>
          </div>
          <div>
            Editor
            <JsonEditor targetCursor={rootCursor} />
          </div>
          <div>
            Second editor, because we can
            <JsonEditor targetCursor={rootCursor} />
          </div>
        </div>
    );
  }
}

window.app = ReactDOM.render(<App/>, document.getElementById('root'));
