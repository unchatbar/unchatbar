'use strict';

/**
 * @author Lars Wiedemann
 * @ngdoc directive
 * @name unchatbar.messageData
 * @restrict E
 * @description
 *
 * # activeConnection
 * message box for text-data
 * # controller definition {@link unchatbar.controller:clientMessageData controller}

 *
 */
angular.module('unchatbar').directive('connection', ['$rootScope',
    function($rootScope) {
        return {
            restrict: 'E', //E = element, A = attribute, C = class, M = comment
            scope: {
                connect: '=',
                connectionIndex : '='
            },
            templateUrl: 'views/peer/connection.html',
            controller: 'connection',
            link : function (scope) {
                scope.connect.on('open',function(){
                    $rootScope.$apply(function() {
                        scope.$broadcast('clientConnection:open');
                    });
                });
                scope.connect.on('close',function(){
                    scope.$broadcast('clientConnection:close');

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
