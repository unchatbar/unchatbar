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

angular.module('webrtcApp').directive('dialer', ['broker', '$rootScope',
    function (broker, $rootScope) {
        return {
            restrict: 'E', //E = element, A = attribute, C = class, M = comment
            templateUrl: 'views/peer/dialer.html',
            controller: 'dialer',
            scope: {
                autocallFromPhonebook: '='
            },
            link: function (scope, element, attr) {
                if (scope.autocallFromPhonebook === true) {
                    _.forEach(broker.getMapOfClientCalled(), function (value, connectionId) {
                        broker.connectToClient(connectionId);
                    })
                }
            }

        };
    }
]);
