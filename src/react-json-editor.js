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
            <TreeView nodeLabel={<code>{k}</code>}>
              <JsonEditor targetCursor={cur.refine(k)}/>
            </TreeView>
        );
      }
      else {
        return <div><code>{k}: </code><JsonLeafEditor cursor={cur.refine(k)} /></div>;
      }
    });

    return <div>{el}</div>;
  }
}

JsonEditor.defaultProps = {
  targetCursor: undefined // the app state that we're targeting
};

export default JsonEditor;