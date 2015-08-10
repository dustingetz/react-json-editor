/** @jsx React.DOM */
define([
    'lodash', 'react', 'react-cursor', 'react-treeview'
], function (_, React, Cursor, TreeView) {
    'use strict';

    var JsonLeafEditor = React.createClass({
        getDefaultProps: function () {
            return {
                cursor: undefined
            };
        },

        getInitialState: function () {
            // Stringified value includes "type" - e.g. strings are quoted.
            return {
                jsValue: JSON.stringify(this.props.cursor.value, undefined, 2),
                editing: false
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

            var leaf = (this.state.editing
                ? [(<input key="0" value={this.state.jsValue} onChange={this.onChange} style={{background: 'transparent'}}/>),
                (<button key="1" onClick={this.commit} disabled={!this.isValid()}>commit</button>)]
                : [(<code key="2" className="editButton" onClick={this.edit}>{this.state.jsValue}</code>)]);

            return (
                <span className={classes.join(' ')}>
                    {leaf}
                </span>
                );
        },

        onChange: function (e) {
            this.setState({ jsValue: e.target.value });
        },

        commit: function () {
            this.props.cursor.onChange(JSON.parse(this.state.jsValue));
            this.setState({ editing: false });
        },

        edit: function () {
            this.setState({ editing: true });
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

    return JsonLeafEditor;
});
