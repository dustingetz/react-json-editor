/* global require */
(function () {
    'use strict';

    require.config({
        baseUrl: 'js-built',
        paths: {
            'jquery': '../lib/jquery',
            'lodash': '../lib/lodash.compat',
            'react': '../lib/react-with-addons',
            'wingspan-cursor': '../lib/wingspan-cursor',
            'react-json-editor': '../../../../dist/react-json-editor'
        },
        shim: {
            'jquery': { deps: [], exports: '$' },
            'lodash': { deps: [], exports: '_' },
            'react': { deps: [], exports: 'React' },
            'wingspan-cursor': { deps: [], exports: 'WingspanCursor' },
            'react-json-editor': { deps: ['react', 'lodash', 'wingspan-cursor'], exports: 'JsonEditor' }
        }
    });
})();
