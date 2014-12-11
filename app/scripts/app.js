'use strict';

/**
 * @ngdoc overview
 * @name webrtcApp
 * @description
 * # webrtcApp
 *
 * Main module of the application.
 */
angular.module('webrtcApp', [])
    .run(['broker', function (broker) {
        broker.connect();
    }
    ]);
