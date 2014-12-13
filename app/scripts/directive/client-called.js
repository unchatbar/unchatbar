'use strict';

/**
 * @author Lars Wiedemann
 * @ngdoc directive
 * @name webrtcApp.clientCalled
 * @restrict E
 * @description
 *
 * include messageBox for all client connection
 * # controller definition {@link webrtcApp.controller:clientCalled controller}
 *
 */
angular.module('webrtcApp').directive('clientCalled', ['broker',
    function (broker) {
        return {
            restrict: 'E', //E = element, A = attribute, C = class, M = comment
            templateUrl: 'views/peer/connection/client-called.html',
            controller: 'clientCalled'


        };
    }
]);

