'use strict';

/**
 * @author Lars Wiedemann
 * @ngdoc directive
 * @name unchatbar.clientMessages
 * @restrict E
 * @description
 *
 * # activeConnection
 * contains all called clients
 * # controller definition {@link unchatbar.controller:clientMessages controller}
 *
 */
angular.module('unchatbar').directive('connectionCenter', ['broker',
    function (broker) {
        return {
            restrict: 'E', //E = element, A = attribute, C = class, M = comment
            templateUrl: 'views/peer/connection-center.html',
            controller: 'connectionCenter'

        };
    }
]);
