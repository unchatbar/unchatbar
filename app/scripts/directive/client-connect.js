'use strict';

/**
 * @author Lars Wiedemann
 * @ngdoc directive
 * @name webrtcApp.clientConnector
 * @restrict E
 * @description
 *
 * # activeConnection
 * dialog for client connection
 * # controller definition {@link webrtcApp.controller:clientConnector controller}

 *
 */

angular.module('webrtcApp').directive('clientConnect', ['broker','$rootScope',
    function (broker,$rootScope) {
        return {
            restrict: 'E', //E = element, A = attribute, C = class, M = comment
            templateUrl: 'views/peer/client-connector.html',
            controller: 'clientConnect'

        };
    }
]);
