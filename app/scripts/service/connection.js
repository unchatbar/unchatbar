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
    .provider('Connection', function () {
        var useLocalStorage = false;


        /**
         * @ngdoc methode
         * @name setLocalStorage
         * @methodOf unchatbar.BrokerProvider
         * @params {String} path set path from peerServer
         * @description
         *
         * use local storage for store peerId
         *
         */
        this.setLocalStorage = function () {
            useLocalStorage = true;
        };


        this.$get = ['$rootScope', '$localStorage', '$sessionStorage', 'Profile', 'PhoneBook', 'Broker',
            function ($rootScope, $localStorage, $sessionStorage, Profile, PhoneBook, Broker) {
                var storage = useLocalStorage ? $localStorage : $sessionStorage;
                var storageMessages = storage.$default({
                    message: {
                        messages: {},
                        queue: {}
                    }
                }).message;

                var connections = {}, selectedClient = {};
                $rootScope.$on('changeProfile', function () {
                    _.forEach(connections, function (connection, peerId) {
                        connections[peerId].send({action: 'profile', profile: Profile.get()});
                    });
                });

                return {

                    setShowRoom: function (type, id) {
                        selectedClient = {
                            type: type,
                            id: id
                        };
                        $rootScope.$broadcast('roomSelected', {});
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
                    add: function (connection) {
                        connections[connection.peer] = connection;

                        connection.on('open', function () {
                            connection.send({action: 'profile', profile: Profile.get()});
                            this.sendFromQueue(connection.peer, connection);
                        }.bind(this));
                        connection.on('close', function () {
                            delete connections[connection.peer];
                        });
                        connection.on('data', function (data) {
                            if (data.action === 'removeGroup') {
                                $rootScope.$apply(function () {
                                    PhoneBook.removeGroup(data.id);
                                });
                            } else if (data.action === 'textMessage') {
                                $rootScope.$apply(function () {
                                    if (!storageMessages.messages[data.id]) {
                                        storageMessages.messages[data.id] = [];
                                    }
                                    storageMessages.messages[data.id].push({
                                        message: data.message,
                                        label: PhoneBook.getClient(data.from).label,
                                        roomName: data.group.label || '',
                                        roomId: data.group.id || '',
                                        own: false
                                    });

                                    if (data.group.id &&
                                        connection.peer === data.group.owner) {
                                        PhoneBook.copyGroupFromPartner(data.group.id, data.group);
                                    }
                                    $rootScope.$broadcast('getMessage');
                                });
                            } else if (data.action === 'profile') {
                                $rootScope.$apply(function () {
                                    $rootScope.$broadcast('client:sendProfile',
                                        {
                                            peer: connection.peer,
                                            profile: data.profile
                                        }
                                    );
                                });
                            }
                        });
                    },
                    getMessageList: function () {
                        return storageMessages.messages[selectedClient.id];
                    },
                    /**
                     * @ngdoc methode
                     * @name getPeerId
                     * @methodOf unchatbar.Peer
                     * @return {Object} created instance of peer
                     *
                     */
                    send: function (text) {
                        var group = {};
                        if (selectedClient.type) {
                            if (selectedClient.type === 'user') {
                                this.sendToUser(text);
                            } else if (selectedClient.type === 'group') {
                                this.sendToGroup(text);
                                group = PhoneBook.getRoom([selectedClient.id]);
                            }
                            if (!storageMessages.messages[selectedClient.id]) {
                                storageMessages.messages[selectedClient.id] = [];
                            }

                            storageMessages.messages[selectedClient.id].push({
                                message: text,
                                label: Profile.get().label,
                                roomName: group.label || '',
                                roomId: group.id || '',
                                own: true
                            });
                        }
                    },
                    sendToUser: function (text) {
                        var message = {
                            action: 'textMessage',
                            id: Broker.getPeerId(),
                            from: Broker.getPeerId(),
                            group: '',
                            message: text
                        };
                        if (connections[selectedClient.id] &&
                            connections[selectedClient.id].open === true) {
                            connections[selectedClient.id].send(message);
                        } else {

                            this.addToQueue(selectedClient.id, message);
                        }
                    },
                    sendToGroup: function (text) {
                        var message = {}, group = PhoneBook.getRoom([selectedClient.id]);
                        _.forEach(group.users, function (user) {
                            message = {
                                action: 'textMessage',
                                from: Broker.getPeerId(),
                                id: group.id,
                                group: group,
                                message: text
                            };
                            if (connections[user.id] && connections[user.id].open === true) {
                                connections[user.id].send(message);
                            } else {
                                this.addToQueue(user.id, message);

                            }
                        }.bind(this));
                    },
                    addToQueue: function (peerId, message) {
                        if (!storageMessages.queue[peerId]) {
                            storageMessages.queue[peerId] = [];
                        }
                        storageMessages.queue[peerId].push(message);

                    },
                    sendFromQueue: function (peerId, connection) {
                        if (storageMessages.queue[peerId]) {
                            _.forEach(storageMessages.queue[peerId], function (message) {
                                connection.send(message);
                            });
                            delete storageMessages.queue[peerId];
                        }
                    },
                    removeGroup: function (roomId) {
                        var groupUsers = PhoneBook.getRoom(roomId).users;
                        if (PhoneBook.getRoom([roomId]).owner === Broker.getPeerId()) {
                            _.forEach(groupUsers, function (user) {
                                var message = {
                                    action: 'removeGroup',
                                    id: roomId
                                };
                                if (connections[user.id]) {
                                    connections[user.id].send(message);
                                } else {
                                    this.addToQueue(user.id, message);
                                }
                            }.bind(this));
                        }
                    }
                };
            }
        ];
    }
);
