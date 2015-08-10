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
            'react-cursor': {
                'bower_components/react-cursor': ['release']
            },
            'react-json-editor': {
                '../../': ['default']
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
                            'bower_components/react-cursor/dist/react-cursor.js'
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
};
