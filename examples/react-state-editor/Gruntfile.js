/*global module:false*/
module.exports = function (grunt) {
    'use strict';

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        banner: '/*! <%= pkg.title || pkg.name %> - v<%= pkg.version %> - ' +
            '<%= grunt.template.today("yyyy-mm-dd") %>\n' +
            '<%= pkg.homepage ? "* " + pkg.homepage + "\\n" : "" %>' +
            '* Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author.name %>;' +
            ' Licensed <%= _.pluck(pkg.licenses, "type").join(", ") %> */\n',

        bower: {
            install: {
                options: {
                    copy: false,
                    install: true,
                    verbose: false,
                    cleanTargetDir: false,
                    cleanBowerDir: false,
                    bowerOptions: {}
                }
            }
        },

        subgrunt: {
            'wingspan-cursor': {
                'bower_components/wingspan-cursor': ['release']
            },
            'react-json-editor': {
                '../../': ['release']
            }
        },

        react: {
            dynamic_mappings: {
                files: [
                    {
                        expand: true,
                        cwd: 'webapp/js',
                        src: ['**/*.js'],
                        dest: 'webapp/js-built',
                        ext: '.js'
                    }
                ]
            }
        },

        less: {
            development: {
                options: {
                    paths: ['styles'],
                    ieCompat: true,
                    yuicompress: true,
                    report: 'min',
                    relativeUrls: true
                },
                files: {
                    'webapp/styles/App.css': 'webapp/styles/App.less'
                }
            }
        },

        requirejs: {
            options: {
                optimize: 'none',
                inlineText: true,
                useStrict: true,
                skipPragmas: true,
                preserveLicenseComments: true,

                baseUrl: 'js-built',

                paths: {
                    lodash: '../bower_components/lodash/dist/lodash.compat',
                    react: '../bower_components/react/react-with-addons',
                    'wingspan-cursor': '../bower_components/wingspan-cursor/dist/wingspan-cursor',
                    'react-json-editor': '../../../dist/react-json-editor'
                },

                shim: {
                    'lodash': { deps: [], exports: '_' },
                    'react-treeview': { deps: ['react'], exports: 'TreeView' }
                },

                uglify: {
                    toplevel: true,
                    ascii_only: true,
                    beautify: true,
                    max_line_length: 1000,
                    defines: { DEBUG: ['name', 'false'] },
                    no_mangle: true
                }
            },
            compile: {
                options: {
                    out: 'dist/react-json-editor.js',
                    include: ['almond', 'react-json-editor'], // react-treeview is bundled
                    exclude: ['require', 'lodash', 'react', 'wingspan-cursor']
                }
            }
        },

        copy: {
            'libs': {
                files: [
                    {
                        expand: true,
                        src: [
                            'bower_components/jquery/jquery.js',
                            'bower_components/lodash/dist/lodash.compat.js',
                            'bower_components/react/react-with-addons.js',
                            'bower_components/requirejs/require.js',
                            'bower_components/wingspan-cursor/dist/wingspan-cursor.js'
                        ],
                        dest: 'webapp/lib',
                        flatten: true,
                        filter: 'isFile'
                    },
                    {
                        expand: true,
                        cwd: 'react-json-editor/dist/',
                        src: ['react-json-editor.js', 'react-json-editor.css'],
                        dest: 'webapp/lib/react-json-editor/',
                        flatten: false
                    }

                ]
            }
        },

        clean: ['bower_components', 'dist']
    });

    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-requirejs');
    grunt.loadNpmTasks('grunt-bower-task');
    grunt.loadNpmTasks('grunt-react');
    grunt.loadNpmTasks('grunt-subgrunt');
    grunt.loadNpmTasks('grunt-contrib-less');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-copy');

    grunt.registerTask('default', ['bower:install', 'subgrunt', 'copy', 'react', 'less']);
    grunt.registerTask('release', ['clean', 'bower:install', 'subgrunt', 'copy', 'react', 'less', 'requirejs']);
};
