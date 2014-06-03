/** @jsx React.DOM */
define([
    'lodash', 'react', 'ReactCursor',
    'react-json-editor', 'text!textassets/DummyData.json'
], function (_, React, Cursor, JsonEditor, DummyData) {
    'use strict';


    var App = React.createClass({

        getInitialState: function () {
            // Dummy data courtesy of json-generator.com
            return JSON.parse(DummyData);
        },

        getPendingState: function () {
            return this._pendingState || this.state;
        },

        render: function () {
            var rootCursor = Cursor.build(this.state, this.getPendingState, this.setState.bind(this));
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
    });



    function entrypoint(rootEl) {
        React.renderComponent(<App />, rootEl);
    }

    return {
        entrypoint: entrypoint
    };
});