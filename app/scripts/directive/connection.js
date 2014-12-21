'use strict';

/**
 * @author Lars Wiedemann
 * @ngdoc directive
 * @name unchatbar.directive:messageData
 * @restrict E
 * @description
 *
 * single client connection
 *
 */
angular.module('unchatbar').directive('connection', ['$rootScope','Profile',
    function($rootScope,Profile) {
        return {
            restrict: 'E', //E = element, A = attribute, C = class, M = comment
            scope: {
                connect: '=',
                connectionIndex : '=',
                profile : '@'
            },
            templateUrl: 'views/peer/connection.html',
            controller: 'connection',
            link : function (scope) {
                //TODO Refaktor
                scope.profile = {};
                scope.connect.on('open',function(){
                    scope.connect.send({action: 'profile' , profile:Profile.get()});
                    $rootScope.$apply(function() {
                        scope.$broadcast('clientConnection:open');
                    });
                });
                scope.$on('changeProfile',function(){
                    scope.connect.send({action: 'profile' , profile:Profile.get()});
                });

                scope.connect.on('close',function(){
                    scope.$broadcast('clientConnection:close');

                });

                scope.connect.on('data',function(data){
                    if(data.action === 'textMessage') {
                        $rootScope.$apply(function () {
                            scope.$broadcast('clientConnection:data', data.message || '');
                        });
                    } else if (data.action === 'profile') {
                        $rootScope.$apply(function () {
                            scope.profile = data.profile;
                            $rootScope.$broadcast('client:sendProfile',
                                {
                                    peer :scope.connect.peer,
                                    profile :data.profile
                                }
                            );
                        });
                    }
                });
            }
        };
    }
]);
