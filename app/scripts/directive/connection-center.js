'use strict';

/**
 * @author Lars Wiedemann
 * @ngdoc directive
 * @name unchatbar.directive:connectionCenter
 * @restrict E
 * @description
 *
 *  handle all connection
 *
 */
angular.module('unchatbar').directive('connectionCenter', [
    function () {
        return {
            restrict: 'E', //E = element, A = attribute, C = class, M = comment
            templateUrl: 'views/peer/connection-center.html',
            controller: 'connectionCenter'
        };
    }
]);
