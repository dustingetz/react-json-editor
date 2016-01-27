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

    if (_.isArray(val) || _.isObject(val)) {
      const treeview = _.map(val, (v, k) => {
        const label = <span className="node">{k}</span>;
        return <TreeView nodeLabel={label}><JsonEditor targetCursor={cur.refine(k)}/></TreeView>
      });

      return <div>{treeview}</div>;
    }
    else {
      return <div>{JSON.stringify(val)}</div>
    }
  }
}

JsonEditor.defaultProps = {
  targetCursor: undefined, // the app state that we're targetting
  toggleOnDoubleClick: false,
  canToggle: true
};

export default JsonEditor;