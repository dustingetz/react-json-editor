import _ from 'lodash';
import React from 'react';
import {Cursor} from 'react-cursor';
import TreeView from 'react-treeview';
import JsonLeafEditor from './JsonLeafEditor';

var css = require("react-treeview/react-treeview.css");

class JsonEditor extends React.Component {
  render() {
    var cur = this.props.targetCursor;
    var val = cur.value();

    console.assert(_.isArray(val) || _.isObject(val), 'todo');

    const el = _.map(val, (v, k) => {
      if (_.isArray(v) || _.isObject(v)) {
        return <JsonEditor targetCursor={cur.refine(k)}
                           nodeLabel={k}/>;
      }
      else {
        return <div>{k}: {JSON.stringify(v)}</div>;
      }
    });

    return <TreeView nodeLabel={this.props.nodeLabel}>{el}</TreeView>
  }
}

JsonEditor.defaultProps = {
  targetCursor: undefined, // the app state that we're targeting
  nodeLabel: <span>root</span>
};

export default JsonEditor;