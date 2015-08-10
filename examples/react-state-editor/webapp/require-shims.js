/* global require */
(function () {
    'use strict';

    require.config({
        baseUrl: 'js-built',
        paths: {
            'jquery': '../lib/jquery',
            'lodash': '../lib/lodash.compat',
            'react': '../lib/react-with-addons',
            'react-cursor': '../lib/react-cursor',
            'react-json-editor': '../../../../dist/react-json-editor'
        },
        shim: {
            'jquery': { deps: [], exports: '$' },
            'lodash': { deps: [], exports: '_' },
            'react': { deps: [], exports: 'React' },
            'react-cursor': { deps: [], exports: 'ReactCursor' },
            'react-json-editor': { deps: ['react', 'lodash', 'react-cursor'], exports: 'JsonEditor' }
        }
    });
})();
