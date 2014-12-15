'use strict';

/**
 * @ngdoc overview
 * @name unchatbar
 * @description
 * # unchatbar
 *
 * Main module of the application.
 */
angular.module('unchatbar', ['cgNotify','ngStorage'])
    .run(['broker', function (broker) {
        broker.connect();
    }
    ]);
