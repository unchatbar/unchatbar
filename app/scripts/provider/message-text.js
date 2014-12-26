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
    .provider('MessageText', function () {
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


        this.$get = ['$rootScope', '$localStorage', '$sessionStorage', 'Broker', 'Profile', 'PhoneBook', 'Connection',
            function ($rootScope, $localStorage, $sessionStorage, Broker, Profile, PhoneBook, Connection) {
                var storage = useLocalStorage ? $localStorage : $sessionStorage;
                var storageMessages = storage.$default({
                    message: {
                        messages: {},
                        queue: {}
                    }
                }).message;
                var selectedRoom = {};


                return {
                    init: function () {
                        $rootScope.$on('connection:open', function (event, data) {
                            this._sendFromQueue(data.peerId);
                        }.bind(this));
                        $rootScope.$on('connection:getMessage:textMessage', function (event, data) {
                            this._addNewMessage(data.message.group.id || data.peerId,data.peerId, data.message);
                        }.bind(this));
                    },

                    setRoom: function (type, id) {
                        selectedRoom = {
                            type: type,
                            id: id
                        };
                        $rootScope.$broadcast('roomSelected', {});
                    },

                    getMessageList: function () {
                        return storageMessages.messages[selectedRoom.id] || [];
                    },

                    /**
                     * @ngdoc methode
                     * @name getPeerId
                     * @methodOf unchatbar.Peer
                     * @return {Object} created instance of peer
                     *
                     */
                    send: function (text) {
                        var message = {};
                        if (selectedRoom.type) {

                            if (selectedRoom.type === 'user') {
                                message = this._sendToUser(text);
                            } else if (selectedRoom.type === 'group') {
                                message = this._sendToGroup(text);
                            }
                            message.own = true;
                            this._addNewMessage(selectedRoom.id,selectedRoom.id,message);
                        }
                    },

                    sendRemoveGroup: function (roomId) {
                        var groupUsers = PhoneBook.getRoom(roomId).users,
                            message = {
                                action: 'removeGroup',
                                id: roomId
                            };
                        if (PhoneBook.getRoom([roomId]).owner === Broker.getPeerId()) {
                            _.forEach(groupUsers, function (user) {
                                if (Connection.send(user.id, message) === false) {
                                    this._addToQueue(user.id, message);
                                }
                            }.bind(this));
                        }
                    },

                    _addNewMessage: function (room,from, message) {

                        if (!storageMessages.messages[room]) {
                            storageMessages.messages[room] = [];
                        }
                        storageMessages.messages[room].push({
                            text: message.text,
                            user: message.from,
                            group: message.group || {},
                            own: message.own || false
                        });

                        if (message.group && message.group.id && from === message.group.owner) {
                            PhoneBook.copyGroupFromPartner(message.group.id, message.group);
                        }
                        $rootScope.$broadcast('getMessage');
                    },

                    _sendToUser: function (text) {
                        var message = {
                            action: 'textMessage',
                            from: Broker.getPeerId(),
                            group: '',
                            text: text
                        };
                        if (Connection.send(selectedRoom.id, message) === false) {
                            this._addToQueue(selectedRoom.id, message);
                        }
                        return message;
                    },

                    _sendToGroup: function (text) {
                        var group = PhoneBook.getRoom([selectedRoom.id]),
                            message = {
                                action: 'textMessage',
                                from: Broker.getPeerId(),
                                group: group || {},
                                text: text
                            };
                        if(group.owner !== Broker.getPeerId()) {
                            if (Connection.send(group.owner, message) === false) {
                                this._addToQueue(group.owner, message);
                            }
                        }
                        _.forEach(group.users, function (user) {
                            if (Connection.send(user.id, message) === false) {
                                this._addToQueue(user.id, message);
                            }
                        }.bind(this));
                        return message;
                    },

                    _addToQueue: function (peerId, message) {
                        if (!storageMessages.queue[peerId]) {
                            storageMessages.queue[peerId] = [];
                        }
                        storageMessages.queue[peerId].push(message);

                    },

                    _sendFromQueue: function (peerId) {
                        if (storageMessages.queue[peerId]) {
                            _.forEach(storageMessages.queue[peerId], function (message, index) {
                                Connection.send(peerId, message);
                                delete storageMessages.queue[peerId][index];
                            });
                            delete storageMessages.queue[peerId];
                        }
                    }


                };
            }
        ];
    }
);
