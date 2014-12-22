'use strict';

/**
 * @author Lars Wiedemann
 * @ngdoc service
 * @name unchatbar.connection
 * @description
 *
 * Wrapper for window.peer lib
 *
 */
angular.module('unchatbar')
    .service('Connection',['$rootScope','Profile',
        function ($rootScope,Profile) {
            var connections = {},selectedClient;
            $rootScope.$on('changeProfile',function(){
                _.forEach(connections , function(connection,peerId){
                    connections[peerId].send({action: 'profile' , profile:Profile.get()});
                });
            });
            var scope = {};
            return {
                register : function (_scope) {
                    scope = _scope;
                },
                setClient : function (peerId){
                    selectedClient = peerId;
                },
                /**
                 * @ngdoc methode
                 * @name getPeerId
                 * @methodOf unchatbar.Peer
                 * @param {String} peerId Id of peer client
                 * @param {Object} options for peer server
                 * @description
                 *
                 * create instance of peer
                 *
                 */
                add : function (connection) {
                    connections[connection.peer] = connection;

                    connection.on('open',function() {
                        connection.send({action: 'profile', profile: Profile.get()});
                    });
                    connection.on('close',function(){
                        //delete connections[connection.peer];
                    });
                    connection.on('data',function(data){
                        if(data.action === 'textMessage') {
                            $rootScope.$apply(function () {
                                scope.$broadcast('getMessage',{message: data.message});
                            });
                        } else if (data.action === 'profile') {
                            $rootScope.$apply(function () {
                                $rootScope.$broadcast('client:sendProfile',
                                    {
                                        peer :connection.peer,
                                        profile :data.profile
                                    }
                                );
                            });
                        }
                    });
                },
                /**
                 * @ngdoc methode
                 * @name getPeerId
                 * @methodOf unchatbar.Peer
                 * @return {Object} created instance of peer
                 *
                 */
                send : function (message) {
                    if (connections[selectedClient]) {
                        connections[selectedClient].send({
                            'action': 'textMessage',
                            message : message}
                        );
                        return true;
                    } else {
                        return false;
                    }

                }
            };
        }
    ]
);
