/*
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

        jasmine: {
            test: {
                src: ['dist/**/*.js'],
                options: {
                    specs: 'test/jsES5/*.spec.js',
                    helpers: ['node_modules/babel-polyfill/dist/polyfill.js', 'test/helpers/*.js'],
                    vendor: ['test/vendor/*.js']
                }
            }
        },

        browserify: {
            dist: {
                options: {
                    transform: [
                        ["babelify", {
                            presets: ["es2015"],
                            plugins: [
                                ["babel-plugin-transform-builtin-extend", {
                                    globals: ["Error", "Array"]
                                }]
                            ]
                        }]
                    ]
                },
                files: {
                    "./dist/MockMP.js": ["./lib/vendor/MockMP.js"]
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
            grunt: {
                options: {
                    configFile: ".eslintrc-grunt",
                    useEslintrc: false
                },
                files: {
                    src: ['Gruntfile.js']
                }
            },
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
                    configFile: ".eslintrc-jasmine-es6",
                    useEslintrc: false
                },
                files: [{
                    expand: true,
                    cwd: 'test/js',
                    src: [
                        '**/*.js'
                    ]
                }]
            },
            testES5: {
                options: {
                    configFile: ".eslintrc-jasmine-es5",
                    useEslintrc: false
                },
                files: [{
                    expand: true,
                    cwd: 'test/jsES5',
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
            library: {
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
        },

        coveralls: {
            library: {
                src: 'build/coverage/phantomjs/lcov/lcov.info'
            }
        }

    });

    grunt.loadNpmTasks('grunt-contrib-jasmine');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-browserify');
    grunt.loadNpmTasks("grunt-contrib-watch");
    grunt.loadNpmTasks("grunt-coveralls");
    grunt.loadNpmTasks('grunt-karma');
    grunt.loadNpmTasks('gruntify-eslint');

    grunt.registerTask('build', ['browserify', 'uglify']);

    grunt.registerTask('default', [
        'eslint',
        'clean:build',
        'karma:headless',
        'build',
        'jasmine'
    ]);

    grunt.registerTask('ci', [
        'default',
        'coveralls'
    ]);
};
