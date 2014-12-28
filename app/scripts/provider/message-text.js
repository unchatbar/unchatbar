'use strict';

/**
 * @author Lars Wiedemann
 * @ngdoc service
 * @name unchatbar.MessageTextProvider
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
         * @methodOf unchatbar.MessageTextProvider
         * @description
         *
         * use local storage for store messages
         *
         */
        this.setLocalStorage = function () {
            useLocalStorage = true;
        };

        /**
         * @ngdoc service
         * @name unchatbar.MessageText
         * @require $rootScope
         * @require $sessionStorage
         * @require $localStorage
         * @require Broker
         * @require PhoneBook
         * @require Connection
         * @description
         *
         * store send receive text messages
         *
         */
        this.$get = ['$rootScope', '$localStorage', '$sessionStorage', 'Broker',  'PhoneBook', 'Connection',
            function ($rootScope, $localStorage, $sessionStorage, Broker,  PhoneBook, Connection) {
                var selectedRoom = {},
                    storageMessages={
                        messages: {},
                        queue: {}
                    };


                return {
                    /**
                     * @ngdoc methode
                     * @name init
                     * @methodOf unchatbar.MessageText
                     * @description
                     *
                     * init listener
                     *
                     */
                    init: function () {
                        this._initStorage();
                        $rootScope.$on('connection:open', function (event, data) {
                            this._sendFromQueue(data.peerId);
                        }.bind(this));
                        $rootScope.$on('connection:getMessage:textMessage', function (event, data) {
                            this._addStoStorage(data.message.group.id || data.peerId, data.peerId, data.message);
                        }.bind(this));
                    },

                    /**
                     * @ngdoc methode
                     * @name _initStorage
                     * @methodOf unchatbar.MessageText
                     * @description
                     *
                     * init storage
                     */
                    _initStorage : function(){
                        var storage = useLocalStorage ? $localStorage : $sessionStorage;
                        storageMessages = storage.$default({
                            message: {
                                messages: {},
                                queue: {}
                            }
                        }).message;
                    },
                    /**
                     * @ngdoc methode
                     * @name setRoom
                     * @methodOf unchatbar.MessageText
                     * @params {String} type type of room `user` or group
                     * @params {String} id id of user or id of group
                     * @description
                     *
                     * define active room
                     *
                     */
                    setRoom: function (type, id) {
                        selectedRoom = {
                            type: type,
                            id: id
                        };
                        /**
                         * @ngdoc event
                         * @name chat:setRoom
                         * @eventOf unchatbar.MessageText
                         * @eventType broadcast on root scope
                         * @description
                         *
                         * Broadcasted after active chatroom set
                         *
                         */
                        $rootScope.$broadcast('chat:setRoom', {});
                    },

                    /**
                     * @ngdoc methode
                     * @name getMessageList
                     * @methodOf unchatbar.MessageText
                     * @returns {Array} list of all messages
                     * @description
                     *
                     * getMessageList for active room
                     *
                     */
                    getMessageList: function () {
                        return storageMessages.messages[selectedRoom.id] || [];
                    },

                    /**
                     * @ngdoc methode
                     * @name send
                     * @methodOf unchatbar.MessageText
                     * @params {String} text message text
                     * @description
                     *
                     * send message to active room
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
                            this._addStoStorage(selectedRoom.id, selectedRoom.id, message);
                        }
                    },

                    /**
                     * @ngdoc methode
                     * @name sendRemoveGroup
                     * @methodOf unchatbar.MessageText
                     * @params {String} roomId id of room
                     * @description
                     *
                     * send message for delete room, to all users from group
                     *
                     */
                    sendRemoveGroup: function (roomId) {
                        var groupUsers = PhoneBook.getGroup(roomId).users,
                            message = {
                                action: 'removeGroup',
                                id: roomId
                            };
                        if (PhoneBook.getGroup([roomId]).owner === Broker.getPeerId()) {
                            _.forEach(groupUsers, function (user) {
                                if (Connection.send(user.id, message) === false) {
                                    this._addToQueue(user.id, message);
                                }
                            }.bind(this));
                        }
                    },

                    /**
                     * @ngdoc methode
                     * @name _addStoStorage
                     * @methodOf unchatbar.MessageText
                     * @private
                     * @params {String} roomId id of room clientId or userId
                     * @params {String} from message from
                     * @params {Object} message message
                     * @description
                     *
                     * store message in storage
                     *
                     */
                    _addStoStorage: function (roomId, from, message) {

                        if (!storageMessages.messages[roomId]) {
                            storageMessages.messages[roomId] = [];
                        }
                        storageMessages.messages[roomId].push({
                            text: message.text,
                            user: from,
                            group: message.group || {},
                            own: message.own || false
                        });

                        if (message.group && message.group.id && from === message.group.owner) {
                            PhoneBook.copyGroupFromPartner(message.group.id, message.group);
                        }
                        /**
                         * @ngdoc event
                         * @name chat:getMessage
                         * @eventOf unchatbar.MessageText
                         * @eventType broadcast on root scope
                         * @description
                         *
                         * new message added
                         *
                         */
                        $rootScope.$broadcast('chat:getMessage');
                    },

                    /**
                     * @ngdoc methode
                     * @name _sendToUser
                     * @methodOf unchatbar.MessageText
                     * @private
                     * @params {String} text mesage text
                     * @returns {Object} message object
                     * @description
                     *
                     * send message to single user from active user room
                     *
                     */
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

                    /**
                     * @ngdoc methode
                     * @name _sendToUser
                     * @methodOf unchatbar.MessageText
                     * @private
                     * @params {String} text mesage text
                     * @returns {Object} message object
                     * @description
                     *
                     * send message to all users from active group room
                     *
                     */
                    _sendToGroup: function (text) {
                        var group = PhoneBook.getGroup([selectedRoom.id]),
                            message = {
                                action: 'textMessage',
                                from: Broker.getPeerId(),
                                group: group || {},
                                text: text
                            };
                        if (group.owner !== Broker.getPeerId()) {
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

                    /**
                     * @ngdoc methode
                     * @name _addToQueue
                     * @methodOf unchatbar.MessageText
                     * @private
                     * @params {String} peerId id of client
                     * @returns {Object} message object
                     * @description
                     *
                     * store message, send send later
                     *
                     */
                    _addToQueue: function (peerId, message) {
                        if (!storageMessages.queue[peerId]) {
                            storageMessages.queue[peerId] = [];
                        }
                        storageMessages.queue[peerId].push(message);

                    },

                    /**
                     * @ngdoc methode
                     * @name _sendFromQueue
                     * @methodOf unchatbar.MessageText
                     * @private
                     * @params {String} peerId id of client
                     * @description
                     *
                     * send message from storage
                     *
                     */
                    _sendFromQueue: function (peerId) {
                        if (storageMessages.queue[peerId]) {
                            _.forEach(storageMessages.queue[peerId], function (message, index) {
                                if (Connection.send(peerId, message)) {
                                    delete storageMessages.queue[peerId][index];
                                }
                            });
                            if (storageMessages.queue[peerId].length === 0) {
                                delete storageMessages.queue[peerId];
                            }
                        }
                        this.closeConnection(peerId);
                    }
                };
            }
        ];
    }
);
