/* global module */
var path = require("path");

module.exports = function (config) {
    "use strict";
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
            module: {
                rules: [
                    // transpile all files except testing sources with babel as usual
                    {
                        test: /\.js$/,
                        exclude: /(node_modules|bower_components)/,
                        use: {
                            loader: 'babel-loader',
                            options: {
                                presets: ['es2015'],
                                plugins: [
                                    ["babel-plugin-transform-builtin-extend", {
                                        globals: ["Error", "Array"]
                                    }]
                                ]
                            }
                        },
                    },
                    // transpile and instrument only testing sources with istanbul-instrumenter-loader
                    {
                        test: /\.js$/,
                        include: path.resolve('lib/vendor/'),
                        loader: 'istanbul-instrumenter-loader',
                        options: {
                            esModules: true,
                            produceSourceMap: true,
                            autoWrap: true,
                        }
                    }
                ]
            },
            resolve: {
                modules: [
                    __dirname,
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
            reporters: [
                {
                    type: 'text-summary'
                },
                {
                    type: 'lcov',
                    dir: 'build/coverage',
                    subdir: normalizationBrowserName("lcov")
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
