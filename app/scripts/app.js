'use strict';

/**
 * @ngdoc overview
 * @name unchatbar
 * @description
 * # unchatbar
 *
 * Main module of the application.
 */
angular.module('unchatbar', ['constants','cgNotify','ngStorage','angularjs-dropdown-multiselect'])
    .run(['Broker', function (Broker) {
        Broker.connectServer();
    }
    ]);
