'use strict';

/**
 * @author Lars Wiedemann
 * @ngdoc directive
 * @name webrtcApp.clientMessages
 * @restrict E
 * @description
 *
 * # activeConnection
 * contains all called clients
 * # controller definition {@link webrtcApp.controller:clientMessages controller}
 *
 */
angular.module('webrtcApp').directive('clientMessages', ['broker',
    function (broker) {
        return {
            restrict: 'E', //E = element, A = attribute, C = class, M = comment
            templateUrl: 'views/peer/connection/client-messages.html',
            controller: 'clientMessages',

        };
    }
]);
