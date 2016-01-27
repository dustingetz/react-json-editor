import _ from 'lodash';
import React from 'react';
import {Cursor} from 'react-cursor';
import TreeView from 'react-treeview';
import JsonLeafEditor from './JsonLeafEditor';

class JsonEditor extends React.Component {
  render() {
    var editorCursor = this.props.targetCursor;
    return (
        <div>
          <TreeView className="JsonEditor"
                    source={buildConfig(editorCursor)}
                    toggleOnDoubleClick={this.props.toggleOnDoubleClick}
                    canToggle={this.props.canToggle} />
        </div>
    );
  }
}

JsonEditor.defaultProps = {
  targetCursor: undefined, // the app state that we're targetting
  toggleOnDoubleClick: false,
  canToggle: true
};

export default JsonEditor;