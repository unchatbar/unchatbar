'use strict';

/**
 * @ngdoc overview
 * @name webrtcApp
 * @description
 * # webrtcApp
 *
 * Main module of the application.
 */
angular.module('webrtcApp', ['cgNotify','ngStorage'])
    .run(['broker', function (broker) {
        broker.connect();
    }
    ]);
