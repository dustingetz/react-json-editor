react-json-editor
=================

A generic JSON editor, specifically designed for attaching to React state values.

This project uses submodules, so **clone with `--recursive`**.

## Build the library

    grunt

## Build the example

    cd examples/react-state-editor
    grunt

 * Use a static HTTP server to serve from the repo root directory, not the example root.
 * Navigate to `http://localhost/examples/react-state-editor/webapp/`

 ## FAQ

 I get an error like this:

>    ! Running "less:development" (less) task
>    ! >> FileError: '../react-treeview/react-treeview.css' wasn't found in styles/react-json-editor.less on line 1, column 1:
>    ! >> 1 @import (less) "../react-treeview/react-treeview.css";
>    ! >> 2
>    ! Warning: Error compiling LESS. Use --force to continue.
>    !
>    ! Aborted due to warnings.
> >> Use --force to continue.
>
> Aborted due to warnings.

You didn't clone with `--recursive`. Type `git submodule init && git submodule update` to fix this, or reclone with `--recursive`.