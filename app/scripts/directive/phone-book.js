'use strict';

/**
 * @author Lars Wiedemann
 * @ngdoc directive
 * @name unchatbar.clientCalled
 * @restrict E
 * @description
 *
 * include messageBox for all client connection
 * # controller definition {@link unchatbar.controller:clientCalled controller}
 *
 */
angular.module('unchatbar').directive('phoneBook', ['broker',
    function (broker) {
        return {
            restrict: 'E', //E = element, A = attribute, C = class, M = comment
            templateUrl: 'views/peer/phone-book.html',
            controller: 'phoneBook'
        };
    }
]);

