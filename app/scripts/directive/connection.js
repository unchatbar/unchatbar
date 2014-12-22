'use strict';

/**
 * @author Lars Wiedemann
 * @ngdoc directive
 * @name unchatbar.directive:messageData
 * @restrict E
 * @description
 *
 * single client connection
 *
 */
angular.module('unchatbar').directive('connection', [
    function() {
        return {
            restrict: 'E', //E = element, A = attribute, C = class, M = comment

            templateUrl: 'views/peer/connection.html',
            controller: 'connection'

        };
    }
]);
