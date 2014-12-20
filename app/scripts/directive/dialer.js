'use strict';

/**
 * @author Lars Wiedemann
 * @ngdoc service
 * @name unchatbar.clientConnector
 * @restrict E
 * @description
 *
 * # activeConnection
 * dialog for client connection
 * # controller definition {@link unchatbar.controller:clientConnector controller}

 *
 */

angular.module('unchatbar').directive('dialer', ['$rootScope', 'Broker',
    function ($rootScope, Broker ) {
        return {
            restrict: 'E', //E = element, A = attribute, C = class, M = comment
            templateUrl: 'views/peer/dialer.html',
            controller: 'dialer',
            scope: {
                autocallFromPhonebook: '='
            }


        };
    }
]);
