/* global module */
var path = require("path");
module.exports = function (config) {
    'use strict';
    config.set({
        autoWatch: true,
        singleRun: true,

        frameworks: ['jasmine-jquery', 'jasmine'],

        files: [
            'node_modules/babel-polyfill/dist/polyfill.js',
            "test/js/*.spec.js"
        ],

        proxies: {
            '/base': '/base/src'
        },

        browsers: ['PhantomJS'],

        preprocessors: {
            "test/js/*.spec.js": ["webpack"]
        },

        webpack: {
            // webpack configuration
            isparta: {
                embedSource: true,
                noAutoWrap: true,
                // these babel options will be passed only to isparta and not to babel-loader
                babel: {
                    presets: ['es2015']
                }
            },
            module: {
                // preLoaders: [
                //     // transpile all files except testing sources with babel as usual
                //     {
                //         test: /\.js$/,
                //         exclude: [
                //             path.resolve('node_modules/')
                //         ],
                //         loader: 'babel'
                //     },
                //     // transpile and instrument only testing sources with isparta
                //     {
                //         test: /^(?!mockMashup).+\.js$/,
                //         include: path.resolve('lib/vendor/'),
                //         loader: 'isparta'
                //     }
                // ],
                loaders: [
                    // transpile all files except testing sources with babel as usual
                    {
                        test: /\.js$/,
                        exclude: [
                            path.resolve('node_modules/')
                        ],
                        loader: 'babel',
                        query: {
                            presets: ['es2015']
                        }
                    },
                    // transpile and instrument only testing sources with isparta
                    {
                        test: /\.js$/,
                        include: path.resolve('lib/vendor/'),
                        loader: 'isparta'
                    }
                ]
            },
            resolve: {
                modulesDirectories: [
                    "",
                    "lib",
                    "node_modules"
                ]
            }
        },

        webpackMiddleware: {
            // webpack-dev-middleware configuration
            noInfo: true
        },

        // https://github.com/usrz/javascript-karma-verbose-reporter ??
        // https://github.com/mlex/karma-spec-reporter ??
        reporters: ['coverage', 'nested'],
        colors: true,

        nestedReporter: {
            color: {
                should: 'red',
                browser: 'yellow'
            },
            icon: {
                failure: '✘ ',
                indent: 'ட ',
                browser: ''
            }
        },

        coverageReporter: {
            instrumenters: {isparta: require('isparta')},
            instrumenter: {
                'lib/vendor/*.js': 'isparta'
            },
            instrumenterOptions: {
                isparta: { babel : { presets: "es2015" } }
            },

            reporters: [
                {
                    type: 'text-summary'
                },
                {
                    type: 'cobertura',
                    dir: 'build/coverage',
                    subdir: normalizationBrowserName("xml")
                },
                {
                    type: 'json',
                    dir: 'build/coverage',
                    subdir: normalizationBrowserName("json")
                },
                {
                    type: 'html',
                    dir: 'build/coverage/',
                    subdir: normalizationBrowserName("html")
                }
            ]
        }
    });

    function normalizationBrowserName(extra) {
        return function (browser) {
            return browser.toLowerCase().split(/[ /-]/)[0] + '/' + extra;
        };
    }
};
