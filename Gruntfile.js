/*!
 *   Copyright 2014-2015 CoNWeT Lab., Universidad Politecnica de Madrid
 *
 *   Licensed under the Apache License, Version 2.0 (the "License");
 *   you may not use this file except in compliance with the License.
 *   You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 *   Unless required by applicable law or agreed to in writing, software
 *   distributed under the License is distributed on an "AS IS" BASIS,
 *   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *   See the License for the specific language governing permissions and
 *   limitations under the License.
 */


module.exports = function (grunt) {

    'use strict';

    grunt.initConfig({

        pkg: grunt.file.readJSON('package.json'),

        jshint: {
            options: {
                jshintrc: true
            },
            grunt: {
                options: {
                    jshintrc: '.jshintrc-node'
                },
                files: {
                    src: ['Gruntfile.js']
                }
            },
            test: {
                options: {
                    jshintrc: '.jshintrc-jasmine'
                },
                files: {
                    src: ['test/jsES5/*.js', '!test/fixtures/']
                }
            }
        },

        jasmine: {
            test:{
                src: ['dist/**/*.js'],
                options: {
                    specs: 'test/jsES5/*.spec.js',
                    helpers: ['test/helpers/*.js'],
                    vendor: ['test/vendor/*.js']
                }
            }
        },

        browserify: {
            dist: {
                options: {
                    transform: [
                        ["babelify", {
                            presets: ["es2015"]
                        }]
                    ]
                },
                files: {
                    "./dist/MockMP.js": ['node_modules/babel-polyfill/dist/polyfill.js', "./lib/vendor/MockMP.js"]
                }
            }
        },

        watch: {
            scripts: {
                files: "./lib/vendor/*.js",
                tasks: ["browserify"]
            }
        },

        eslint: {
            source: {
                files: [{
                    expand: true,
                    cwd: 'lib/vendor',
                    src: [
                        '**/*.js'
                    ]
                }]
            },
            test: {
                options: {
                    configFile: ".eslint-jasminerc"
                },
                files: [{
                    expand: true,
                    cwd: 'test/js',
                    src: [
                        '**/*.js'
                    ]
                }]
            }
        },

        uglify: {
            options: {
                mangle: false
            },
            my_target: {
                files: {
                    'dist/MockMP.js': ['dist/MockMP.js']
                }
            }
        },

        karma: {
            headless: {
                configFile: 'karma.conf.js',
                options: {
                    browsers: ['PhantomJS']
                }
            },

            debug: {
                configFile: 'karma.conf.js',
                options: {
                    singleRun: false
                }
            }
        },

        clean: {
            build: {
                src: ['dist', 'build']
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-jasmine');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-eslint');
    grunt.loadNpmTasks('grunt-browserify');
    grunt.loadNpmTasks("grunt-contrib-watch");
    grunt.loadNpmTasks('grunt-karma');

    grunt.registerTask('build', ['browserify', 'uglify']);

    grunt.registerTask('default', [
        'eslint',
        'clean:build',
        'karma:headless',
        'build',
        'jshint',
        'jasmine'
    ]);
};
