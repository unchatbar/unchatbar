'use strict';

/**
 * @author Lars Wiedemann
 * @ngdoc service
 * @name unchatbar.directive:clientConnector
 * @restrict E
 * @description
 *
 * build client connection
 *
 */

angular.module('unchatbar').directive('dialer', [
    function ( ) {
        return {
            restrict: 'E', //E = element, A = attribute, C = class, M = comment
            templateUrl: 'views/peer/dialer.html',
            controller: 'dialer'
        };
    }
]);
