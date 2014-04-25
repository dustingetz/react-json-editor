/** @jsx React.DOM */
define([
    'lodash', 'react', 'wingspan-cursor',
    'PrettyJson',
    'react-treeview'
], function (_, React, Cursor, PrettyJson, TreeView) {
    'use strict';


    var JsonEditor = React.createClass({
        getDefaultProps: function () {
            return {
                targetCursor: undefined, // the app state that we're targetting
                toggleOnDoubleClick: false,
                canToggle: true
            };
        },

        getInitialState: function () {
            // JsonEditor is stateful because it is a diagnostic component.
            // We want to be able to attach to an app's state without needing to
            // add aditional keys to the app state to maintain uncommitted values.
            return {};
        },

        componentWillMount: function () {
            //// initialize the editor with the target state
            //this.props.editorCursor.onChange(this.props.targetCursor.value);

            // componentWillMount is allowed to call this.setState, but can't cause a setState
            // at the root. Thus writing to a cursor here will cause:
            // Uncaught Error: Invariant Violation: receiveComponent(...): Can only update a mounted component.
            //
            // As a work around, we will not initialize the editor state until we click on something.
        },

        shouldComponentUpdate: function (nextProps, nextState) {
            var unchanged =
                // cursor is a special object with function values - not JSON serializable
                _.isEqual(_.omit(this.props, 'targetCursor'), _.omit(nextProps, 'targetCursor')) &&
                // but the JsonEditor understands cursors so we can do the right thing
                _.isEqual(this.props.targetCursor.value, nextProps.targetCursor.value) &&
                _.isEqual(this.state, nextState);
            return !unchanged;
        },

        render: function () {
            var editorCursor = Cursor.build(this.state, this.setState.bind(this), _.cloneDeep);
            var targetCursor = this.props.targetCursor;

            return (
                <div>
                    <button onClick={_.partial(this.initializeEditor, editorCursor, targetCursor)}>attach</button>
                    <button onClick={_.partial(this.commitEditor, editorCursor, targetCursor)}>commit</button>
                    <TreeView className="JsonEditor"
                        source={buildConfig(editorCursor)}
                        toggleOnDoubleClick={this.props.toggleOnDoubleClick}
                        canToggle={this.props.canToggle} />
                </div>
            );
        },

        initializeEditor: function (editorCursor, targetCursor) {
            editorCursor.onChange(targetCursor.value);
        },

        commitEditor: function (editorCursor, targetCursor) {
            targetCursor.onChange(editorCursor.value);

            // this line causes the prior onChange to have no effect - don't know why
            //editorCursor.onChange({});
        }
    });



    var JsonLeafEditor = React.createClass({
        getDefaultProps: function () {
            return {
                cursor: undefined
            };
        },

        getInitialState: function () {
            // Stringified value includes "type" - e.g. strings are quoted.
            return {
                jsValue: JSON.stringify(this.props.cursor.value, undefined, 2)
            };
        },

        componentWillReceiveProps: function (nextProps) {
            this.setState({
                jsValue: JSON.stringify(nextProps.cursor.value, undefined, 2)
            })
        },

        render: function () {
            var classes = _.compact([
                'JsonLeafEditor',
                this.isDirty() ? 'dirty' : null,
                !this.isValid() ? 'invalid' : null
            ]);

            return (
                <span className={classes.join(' ')}>
                    <input value={this.state.jsValue} onChange={this.onChange}
                    style={{background: 'transparent'}}/>
                    <button onClick={this.commit} disabled={!this.isValid()}>commit</button>
                </span>
                );
        },

        onChange: function (e) {
            this.setState({ jsValue: e.target.value });
        },

        commit: function () {
            this.props.cursor.onChange(JSON.parse(this.state.jsValue));
        },

        isValid: function () {
            try {
                JSON.parse(this.state.jsValue);
                return true;
            }
            catch (e) {
                return false;
            }
        },

        isDirty: function () {
            if (!this.isValid()) return false; // we're invalid, not dirty
            var unmodified = _.isEqual(JSON.parse(this.state.jsValue), this.props.cursor.value);
            return !unmodified;
        },

        shouldComponentUpdate: function (nextProps, nextState) {
            return !(_.isEqual(this.props.cursor.value, nextProps.cursor.value) &&
                     _.isEqual(this.state, nextState));
        }
    });


// time to parse it into a format the tree view recognizes
// [
//   {displayNode: bla, children: [bla, bla]},
//   {displayNode: bla, children: [bla, bla]},
// ]

    function buildConfigArray (nodes) {
        // array of cursors
        // convert the array into an object where the key is the index
        var xs = _.object(_.map(nodes, function (node, i) {
            return [i, node];
        }));

        return _.map(xs, buildConfigObject); // recursion
    }

    function buildConfigObject (cursor, key) {
        var node = cursor.value;
        // node is an: object, array, or primitive
        // if its an array, we need to turn it into a map, and name each element in the array

        if (node instanceof Array) {
            // expand Cursor[List[T]] into List[Cursor[T]]
            var acc = [];
            _.each(cursor.value, function (el, i) {
                acc.push(cursor.refine(i));
            });

            return {
                displayNode: displayNodeLabel(key + ' [' + node.length + ']'),
                children: buildConfigArray(acc) // list of refined cursors
            };
        }
        else if (node instanceof Object) { // {a:'a', b:'b'}
            return {
                displayNode: displayNodeLabel(key),
                children: mapCursorKV(cursor, buildConfigObject)   // recursion
            };
        }
        else { // primitive
            return {
                displayNode: displayLeaf(key, cursor)
            };
        }
    }

    function buildConfig (rootNode) {
        if (rootNode instanceof Array) return buildConfigArray(rootNode);
        return [buildConfigObject(rootNode, 'root')];
    }

    function displayLeaf (key, cursor) {
        return (
            <span key={key}>
                <code>{key}: </code>
                <span>{cursor.value}</span>
                <JsonLeafEditor cursor={cursor} />
            </span>
        );
    }

    function displayNodeLabel (label) {
        return (<code key={label}>{label}</code>);
    }

    function mapCursorKV (cursor, f) {
        // map over the kv pairs, using f(cursor.refine[key], key) rather than f(obj[key], key)
        var acc = [];
        _.each(_.keys(cursor.value), function (key) {
            var val = f(cursor.refine(key), key);
            acc.push(val); // not [key, val]
        });
        return acc; // like _.map, it is call site's responsibility to call _.object if desired
    }



    return JsonEditor;

});