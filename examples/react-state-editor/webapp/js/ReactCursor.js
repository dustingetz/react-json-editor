define(['react'], function (ReactWithAddons) {
    'use strict';


    function Cursor(state, pendingGetter, path, commit) {
        // Please treat values as read-only
        this.value = getRefAtPath(state, path); // value to put in the DOM, use from render()

        // Please treat pending values as read-only
        this.pendingValue = function () {
            return getRefAtPath(pendingGetter(), path); // the current value right now, use in event handlers
        };

        /**
         * React's update immutability helper clones only the parts that changed, which is the value at the end
         * of the path. We temporarily append a $set directive to the end of the path, which is where nextValue
         * will replace what was at the end of path. We then walk up the right side of path, accumulating an
         * object which represents the subtree containing only path steps leading to the changed value.
         * Each iteration of reduceRight takes the object so far, starting with the changed value, and the
         * next path step, and returns a new object containing that path step as a key and the changed value as
         * a value.
         *
         * See http://facebook.github.io/react/docs/update.html for more information.
         *
         * @param nextValue
         * @returns {Cursor}
         */
        this.onChange = function (nextValue) {
            var nextState;

            if (path.length > 0) {
                nextState = ReactWithAddons.addons.update(
                    pendingGetter(),
                    path.concat('$set').reduceRight(unDeref, nextValue)
                );
            }
            else if (path.length === 0) {
                nextState = nextValue;
            }
            commit(nextState);
            return new Cursor(state, pendingGetter, path, commit);
        };

        this.refine = function (/* one or more paths through the tree */) {
            var nextPath = [].concat(path, flatten(arguments));
            return new Cursor(state, pendingGetter, nextPath, commit);
        };
    }


    /**
     * Example usages:
     * Cursor.build(this.state, this.setState.bind(this), _.cloneDeep);
     * Cursor.build(this.notState, function (nextState) { merge(this.notReactState, nextState); }.bind(this), _.identity);
     */
    Cursor.build = function (state, pendingGetter, commit) {
        return new Cursor(state, pendingGetter, [], commit);
    };


    function getRefAtPath(tree, paths) {
        return reduce(paths, deref, tree);
    }

    function deref(obj, key) {
        return obj[key];
    }

    /**
     * The opposite of deref
     *
     * @param obj
     * @param key
     * @returns {{}}, such that returnValue[key] === obj
     */
    function unDeref(obj, key) {
        var nextObj = {};
        nextObj[key] = obj;
        return nextObj;
    }

    function reduce(array, f, mzero) {
        return array.reduce(f, mzero);
    }

    function flatten(listOfLists) {
        return [].concat.apply([], listOfLists);
    }


    return Cursor;
});
