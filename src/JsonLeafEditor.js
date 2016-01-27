import _ from 'lodash';
import React from 'react';
import {Cursor} from 'react-cursor';
import TreeView from 'react-treeview';
import "./react-json-editor.css";

class JsonLeafEditor extends React.Component {
  constructor(props) {
    super(props);
    // Stringified value includes "type" - e.g. strings are quoted.
    this.state = {
      jsValue: JSON.stringify(this.props.cursor.value(), undefined, 2),
      editing: false
    };

    this.onChange = (e) => this.setState({ jsValue: e.target.value });
    this.edit = () => this.setState({ editing: true });
    this.commit = () => {
      this.props.cursor.set(JSON.parse(this.state.jsValue));
      this.setState({ editing: false });
    };
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      jsValue: JSON.stringify(nextProps.cursor.value(), undefined, 2)
    })
  }

  render() {
    var classes = _.compact([
      'JsonLeafEditor',
      this.isDirty() ? 'dirty' : null,
      !this.isValid() ? 'invalid' : null
    ]);

    var leaf = (this.state.editing
        ? [(<input key="0" value={this.state.jsValue} onChange={this.onChange} style={{background: 'transparent'}}/>),
      (<button key="1" onClick={this.commit} disabled={!this.isValid()}>commit</button>)]
        : [(<code key="2" className="editButton" onClick={this.edit}>{this.state.jsValue}</code>)]);

    return <span className={classes.join(' ')}>{leaf}</span>;
  }

  isValid() {
    try {
      JSON.parse(this.state.jsValue);
      return true;
    }
    catch (e) {
      return false;
    }
  }

  isDirty() {
    if (!this.isValid()) return false; // we're invalid, not dirty
    var unmodified = _.isEqual(JSON.parse(this.state.jsValue), this.props.cursor.value());
    return !unmodified;
  }
}

JsonLeafEditor.defaultProps = {
  cursor: undefined
};

export default JsonLeafEditor;
