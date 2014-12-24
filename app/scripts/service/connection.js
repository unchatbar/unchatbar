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
    .service('Connection',['$rootScope','Profile','PhoneBook',
        function ($rootScope,Profile,PhoneBook) {
            var connections = {},selectedClient= {};
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
                setShowRoom : function (type,id){
                    selectedClient = {
                        type : type,
                        id:id
                    };
                    scope.$broadcast('roomSelected',{});
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
                        delete connections[connection.peer];
                    });
                    connection.on('data',function(data){
                        if(data.action === 'textMessage') {
                            $rootScope.$apply(function () {
                                scope.$broadcast('getMessage',{message: data.message,label:data.label});
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
                send : function (text) {
                    if (selectedClient.type) {
                        if (selectedClient.type === 'user') {
                          this.sendToUser(text);
                        } else if (selectedClient.type === 'group') {
                         this.sendToGroup(text);
                        }
                    }
                },
                sendToUser : function (text) {
                    var message = {
                        action: 'textMessage',
                        type: 'user',
                        label: PhoneBook.getClient(selectedClient.id).label,
                        message: text
                        };
                    if (connections[selectedClient.id] &&
                        connections[selectedClient.id].open === true) {
                        connections[selectedClient.id].send(message);
                    } else {
                        this.addToQue(selectedClient.id,message);
                    }
                },
                sendToGroup : function (text) {
                    var message = {},room = PhoneBook.getRoom([selectedClient.id]);
                    _.forEach(room.users, function (user) {
                        message = {
                            action: 'textMessage',
                            type: 'group',
                            label: room.label,
                            groupinfo: room,
                            message: text
                        };
                        if (connections[user.id] && connections[user.id].open === true) {
                            connections[user.id].send(message);
                        } else {
                            this.addToQue(user.id,message);

                        }
                    }.bind(this));
                },
                addToQue : function(peerId,message) {
                    //TODO Store
                    console.log('ADD TO QUE',peerId,message);
                }
            };
        }
    ]
);
