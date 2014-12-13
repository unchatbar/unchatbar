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
angular.module('webrtcApp').directive('messageData', ['broker','$rootScope','notify',
    function(broker,$rootScope,notify) {
        return {
            restrict: 'E', //E = element, A = attribute, C = class, M = comment
            scope: {
                connect: '=',
                connectionIndex : '='
            },
            templateUrl: 'views/peer/connection/message/data.html',
            controller: 'clientMessageData',
            link : function (scope) {
                scope.connect.on('open',function(){
                    notify({
                        message:'connect to ' + scope.connect.peer + ' succesfull',
                        classes:'alert alert-success',
                        templateUrl : ''
                    });
                    $rootScope.$apply(function() {
                        scope.$broadcast('clientConnection:open');
                    });
                });
                scope.connect.on('close',function(){
                    notify({
                        message:'connect to ' + scope.connect.peer + ' closed',
                        classes:'alert alert-info',
                        templateUrl : ''
                    });
                    $rootScope.$apply(function() {
                        scope.$broadcast('clientConnection:open');
                    });
                });

                scope.connect.on('data',function(data){
                    $rootScope.$apply(function() {
                        scope.$broadcast('clientConnection:data',data);
                    });
                });
            }
        };
    }
]);
