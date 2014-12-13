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

angular.module('webrtcApp').directive('dialer', ['broker','$rootScope',
    function (broker,$rootScope) {
        return {
            restrict: 'E', //E = element, A = attribute, C = class, M = comment
            templateUrl: 'views/peer/dialer.html',
            controller: 'dialer',
            link : function () {
                _.forEach(broker.getMapOfClientCalled(),function(value,connectionId){
                    broker.connectToClient(connectionId);
                })
            }

        };
    }
]);
