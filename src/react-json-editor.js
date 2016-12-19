import _ from 'lodash';
import React from 'react';
import {Cursor} from 'react-cursor';
import TreeView from 'react-treeview';
import JsonLeafEditor from './JsonLeafEditor';
import "react-treeview/react-treeview.css";

class JsonEditor extends React.Component {
  render() {
    var cur = this.props.targetCursor;
    var val = cur.value();

    console.assert(_.isArray(val) || _.isObject(val), 'todo');

    const el = _.map(val, (v, k) => {
      if (_.isArray(v) || _.isObject(v)) {
        return (
            <TreeView nodeLabel={<code>{k}</code>} defaultCollapsed={this.props.initialExpandedLevels <= 0}>
              <JsonEditor targetCursor={cur.refine(k)} initialExpandedLevels={this.props.initialExpandedLevels - 1}/>
            </TreeView>
        );
      }
      else {
        return <div key={k}><code>{k}: </code><JsonLeafEditor cursor={cur.refine(k)} /></div>;
      }
    });

    return <div>{el}</div>;
  }
}

JsonEditor.defaultProps = {
  initialExpandedLevels: 0,
  targetCursor: undefined // the app state that we're targeting
};

export default JsonEditor;