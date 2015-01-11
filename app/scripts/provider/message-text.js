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
        this.$get = ['$rootScope', '$localStorage', '$sessionStorage', 'Broker', 'PhoneBook', 'Connection',
            function ($rootScope, $localStorage, $sessionStorage, Broker, PhoneBook, Connection) {


                return {
                    /**
                     * @ngdoc methode
                     * @name _selectedRoom
                     * @propertyOf unchatbar.Broker
                     * @private
                     * @returns {Object} selected room
                     *
                     */
                    _selectedRoom: {},

                    /**
                     * @ngdoc methode
                     * @name _storageMessages
                     * @propertyOf unchatbar.Broker
                     * @private
                     * @returns {Object} message storage
                     *
                     */
                    _storageMessages: {
                        messages: {},
                        queue: {}
                    },

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
                        $rootScope.$on('ConnectionOpen', function (event, data) {
                            this._sendFromQueue(data.peerId);
                        }.bind(this));
                        $rootScope.$on('ConnectionGetMessagetextMessage', function (event, data) {
                            this._addStoStorage(data.message.group.id || data.peerId, data.peerId, data.message);
                        }.bind(this));
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
                        this._selectedRoom = {};
                        if (id) {
                            this._selectedRoom = {
                                type: type,
                                id: id
                            };
                        }
                        /**
                         * @ngdoc event
                         * @name MessageTextSetRoom
                         * @eventOf unchatbar.MessageText
                         * @eventType broadcast on root scope
                         * @description
                         *
                         * Broadcasted after active chatroom set
                         *
                         */
                        $rootScope.$broadcast('MessageTextSetRoom', {});
                    },
                    /**
                     * @ngdoc methode
                     * @name isRoomOpen
                     * @methodOf unchatbar.MessageText
                     * @params {String} type type of room `user` or group
                     * @params {String} id id of user or id of group
                     * @description
                     *
                     * define active room
                     *
                     */
                    isRoomOpen: function () {
                        return this._selectedRoom.id ? true : false;
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
                        return this._storageMessages.messages[this._selectedRoom.id] || [];
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
                        if (this._selectedRoom.type) {
                            if (this._selectedRoom.type === 'user') {
                                message = this._sendToUser(text);
                            } else if (this._selectedRoom.type === 'group') {
                                message = this._sendToGroup(text);
                            }
                            message.own = true;
                            this._addStoStorage(this._selectedRoom.id, this._selectedRoom.id, message);
                        }
                    },
                    /**
                     * @ngdoc methode
                     * @name sendGroupUpdateToUsers
                     * @methodOf unchatbar.MessageText
                     * @params {Array} users array of users from group
                     * @params {Object} updateGroup updates group
                     * @description
                     *
                     * send message for delete room, to all users from group
                     *
                     */
                    sendGroupUpdateToUsers: function (users, updateGroup) {
                        var message = {
                            action: 'updateUserGroup',
                            group: updateGroup
                        };
                        if (updateGroup.owner === Broker.getPeerId()) {
                            _.forEach(users, function (user) {
                                if (Connection.send(user.id, message) === false) {
                                    this._addToQueue(user.id, message);
                                }
                            }.bind(this));
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
                        var groupUsers = {}, message = {};
                        groupUsers = PhoneBook.getGroup(roomId).users;
                        message = {
                            action: 'removeGroup',
                            roomId: roomId
                        };
                        if (PhoneBook.getGroup(roomId).owner !== Broker.getPeerId()) {
                            if (Connection.send(PhoneBook.getGroup(roomId).owner, message) === false) {
                                this._addToQueue(PhoneBook.getGroup(roomId).owner, message);
                            }

                        }
                        _.forEach(groupUsers, function (user) {
                            if (Broker.getPeerId() !== user.id) {
                                if (Connection.send(user.id, message) === false) {
                                    this._addToQueue(user.id, message);
                                }
                            }
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
                    _initStorage: function () {
                        var storage = useLocalStorage ? $localStorage : $sessionStorage;
                        this._storageMessages = storage.$default({
                            message: {
                                messages: {},
                                queue: {}
                            }
                        }).message;
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

                        if (!this._storageMessages.messages[roomId]) {
                            this._storageMessages.messages[roomId] = [];
                        }
                        message.group = message.group || {};
                        this._storageMessages.messages[roomId].push({
                            text: message.text,
                            user: from,
                            group: message.group,
                            own: message.own
                        });
                        //WTF
                        if (message.group.owner && message.group.owner === from) {
                            PhoneBook.copyGroupFromPartner(message.group.id, message.group);
                        }
                        /**
                         * @ngdoc event
                         * @name MessageTextGetMessage
                         * @eventOf unchatbar.MessageText
                         * @eventType broadcast on root scope
                         * @description
                         *
                         * new message added
                         *
                         */
                        $rootScope.$broadcast('MessageTextGetMessage');
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
                        if (Connection.send(this._selectedRoom.id, message) === false) {
                            this._addToQueue(this._selectedRoom.id, message);
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
                        var group = PhoneBook.getGroup(this._selectedRoom.id),
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
                        if (!this._storageMessages.queue[peerId]) {
                            this._storageMessages.queue[peerId] = [];
                        }
                        this._storageMessages.queue[peerId].push(message);

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
                        if (this._storageMessages.queue[peerId]) {
                            _.forEach(this._storageMessages.queue[peerId], function (message, index) {
                                if (Connection.send(peerId, message)) {
                                    this._storageMessages.queue[peerId].splice(index);
                                }
                            }.bind(this));
                            if (this._storageMessages.queue[peerId].length === 0) {
                                delete this._storageMessages.queue[peerId];
                            }
                        }

                    }
                };
            }
        ];
    }
);
