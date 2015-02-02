// Karma configuration
// http://karma-runner.github.io/0.12/config/configuration-file.html
// Generated on 2014-12-05 using
// generator-karma 0.8.3

module.exports = function (config) {
    'use strict';

    config.set({
        // enable / disable watching file and executing tests whenever any file changes
        autoWatch: true,

        // base path, that will be used to resolve files and exclude
        basePath: '../',

        // testing framework to use (jasmine/mocha/qunit/...)
        frameworks: ['jasmine'],

        // list of files / patterns to load in the browser
        files: [
            // bower:
            'bower_components/es5-shim/es5-shim.js',
            'bower_components/angular/angular.js',
            'bower_components/json3/lib/json3.js',
            'bower_components/angular-notify/dist/angular-notify.js',
            'bower_components/peerjs/peer.js',
            'bower_components/ngstorage/ngStorage.js',
            'bower_components/lodash/dist/lodash.compat.js',
            'bower_components/angularjs-dropdown-multiselect/src/angularjs-dropdown-multiselect.js',
            'bower_components/angular-bootstrap/ui-bootstrap-tpls.js',
            'bower_components/angular-ui-router/release/angular-ui-router.js',
            'bower_components/unchatbar-user/app/scripts/app.js',
            'bower_components/unchatbar-user/app/scripts/run.js',
            'bower_components/unchatbar-user/app/scripts/template.js',
            'bower_components/unchatbar-user/app/scripts/provider/profile.js',
            'bower_components/unchatbar-user/app/scripts/controller/profile.js',
            'bower_components/unchatbar-user/app/scripts/directive/profile-admin.js',
            'bower_components/unchatbar-user/app/scripts/directive/profile.js',
            'bower_components/unchatbar-connection/app/scripts/app.js',
            'bower_components/unchatbar-connection/app/scripts/run.js',
            'bower_components/unchatbar-connection/app/scripts/template.js',
            'bower_components/unchatbar-connection/app/scripts/provider/broker.js',
            'bower_components/unchatbar-connection/app/scripts/provider/message-text.js',
            'bower_components/unchatbar-connection/app/scripts/service/connection.js',
            'bower_components/unchatbar-connection/app/scripts/service/peer.js',
            'bower_components/unchatbar-connection/app/scripts/service/stream.js',
            'bower_components/unchatbar-connection/app/scripts/directive/dialer.js',
            'bower_components/unchatbar-connection/app/scripts/controller/dialer.js',
            'bower_components/unchatbar-phone-book/app/scripts/app.js',
            'bower_components/unchatbar-phone-book/app/scripts/run.js',
            'bower_components/unchatbar-phone-book/app/scripts/template.js',
            'bower_components/unchatbar-phone-book/app/scripts/provider/phone-book.js',
            'bower_components/unchatbar-phone-book/app/scripts/directive/active-user.js',
            'bower_components/unchatbar-phone-book/app/scripts/directive/book-admin.js',
            'bower_components/unchatbar-phone-book/app/scripts/directive/book-stream.js',
            'bower_components/unchatbar-phone-book/app/scripts/directive/book.js',
            'bower_components/unchatbar-phone-book/app/scripts/directive/new-group.js',
            'bower_components/unchatbar-phone-book/app/scripts/controller/modal-stream-option.js',
            'bower_components/unchatbar-phone-book/app/scripts/controller/phone-book-admin.js',
            'bower_components/unchatbar-phone-book/app/scripts/controller/phone-book.js',
            // endbower
            'bower_components/angular-mocks/angular-mocks.js',
            'app/scripts/constants.js',
            'app/scripts/**/*.js',
            'test/mock/**/*.js',
            'test/spec/**/*.js',

        ],

        // list of files / patterns to exclude
        exclude: [
            'app/scripts/run.js',
            'app/scripts/config/*.js'
        ],

        // web server port
        port: 9000,

        // Start these browsers, currently available:
        // - Chrome
        // - ChromeCanary
        // - Firefox
        // - Opera
        // - Safari (only Mac)
        // - PhantomJS
        // - IE (only Windows)
        browsers: [
            'PhantomJS'
        ],

        // Which plugins to enable
        plugins: [
            'karma-phantomjs-launcher',
            'karma-jasmine',
            'karma-coverage'
        ],

        // Continuous Integration mode
        // if true, it capture browsers, run tests and exit
        singleRun: true,

        colors: true,

        // level of logging
        // possible values: LOG_DISABLE || LOG_ERROR || LOG_WARN || LOG_INFO || LOG_DEBUG
        logLevel: config.LOG_INFO,

        reporters: ['progress', 'coverage'],

        preprocessors: {
            // source files, that you wanna generate coverage for
            // do not include tests or libraries
            // (these files will be instrumented by Istanbul)
            'app/scripts/**/*.js': ['coverage']
        },

        // optionally, configure the reporter
        coverageReporter: {
            type : 'html',
            dir : '.tmp/coverage/'
        }
        // Uncomment the following lines if you are using grunt's server to run the tests
        // proxies: {
        //   '/': 'http://localhost:9000/'
        // },
        // URL root prevent conflicts with the site root
        // urlRoot: '_karma_'
    });
};
