/** @jsx React.DOM */
define([
    'lodash', 'react', 'wingspan-cursor',
    'react-json-editor'
], function (_, React, Cursor, JsonEditor) {
    'use strict';


    var App = React.createClass({

        getInitialState: function () {
            return {
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
                    { name: 'Alice', id: 0 },
                    { name: 'Bob', id: 1 },
                    { name: 'Charlie', id: 2 },
                    { name: 'David', id: 3 }
                ]
            };
        },


        render: function () {
            var rootCursor = Cursor.build(this.state, this.setState.bind(this), _.cloneDeep);
            return (
                <div className="App">
                    <div>
                        State
                        <pre>{JSON.stringify(this.state, undefined, 2)}</pre>
                    </div>
                    <div>
                        Editor
                        <JsonEditor cursor={rootCursor} />
                    </div>
                </div>
            );
        }
    });



    function entrypoint(rootEl) {
        React.renderComponent(<App />, rootEl);
    }

    return {
        entrypoint: entrypoint
    };
});