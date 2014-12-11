'use strict';

/**
 * @author Lars Wiedemann
 * @ngdoc directive
 * @name webrtcApp.messageData
 * @restrict E
 * @description
 *
 * # activeConnection
 * message box for text-data
 * # controller definition {@link webrtcApp.controller:clientMessageData controller}

 *
 */
angular.module('webrtcApp').directive('messageData', ['broker','$rootScope',
    function(broker,$rootScope) {
        return {
            restrict: 'E', //E = element, A = attribute, C = class, M = comment
            scope: {
                connect: '=',
                connectionIndex : '='
            },
            templateUrl: 'views/peer/connection/message/data.html',
            controller: 'clientMessageData',
            link : function (scope) {
                scope.connect.on('clientConnection:open',function(){
                    $rootScope.$apply(function() {
                        scope.$broadcast('connection:open');
                    });
                });
                scope.connect.on('clientConnection:close',function(){
                    $rootScope.$apply(function() {
                        scope.$broadcast('connection:open');
                    });
                });

                scope.connect.on('clientConnection:data',function(data){
                    $rootScope.$apply(function() {
                        scope.$broadcast('connection:data',data);
                    });
                });
            }
        };
    }
]);
