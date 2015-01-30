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
        this.$get = ['$rootScope', '$localStorage', '$sessionStorage', 'Broker', 'PhoneBook', 'Connection','Notify',
            function ($rootScope, $localStorage, $sessionStorage, Broker, PhoneBook, Connection, Notify) {


                var api =  {
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
                        messageInbox : {},
                        queue: {}
                    },

                    /**
                     * @ngdoc methode
                     * @name initStorage
                     * @methodOf unchatbar.MessageText
                     * @description
                     *
                     * init storage
                     */
                    initStorage: function () {
                        var storage = useLocalStorage ? $localStorage : $sessionStorage;
                        this._storageMessages = storage.$default({
                            message: {
                                messages: {},
                                messageInbox : {},
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
                        this._moveFromInboxToMessageStorage(this._selectedRoom.id);
                        return this._storageMessages.messages[this._selectedRoom.id] || [];
                    },

                    /**
                     * @ngdoc methode
                     * @name getMessageInbox
                     * @methodOf unchatbar.MessageText
                     * @returns {Array} list of all messages
                     * @description
                     *
                     * get onbox List
                     *
                     */
                    getMessageInbox: function () {
                        return this._storageMessages.messageInbox;
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
                        var message = this._getMessageObject( 'updateUserGroup',{
                            group: updateGroup
                        });
                        if (updateGroup.owner === Broker.getPeerId()) {
                            _.forEach(users, function (user) {
                                if (user.id !== Broker.getPeerId()) {
                                    Connection.send(user.id, message);
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
                        message = this._getMessageObject( 'removeGroup',{
                            roomId: roomId
                        });
                        _.forEach(groupUsers, function (user) {
                            if (Broker.getPeerId() !== user.id) {
                                if (user.id !== Broker.getPeerId()) {
                                    Connection.send(user.id, message);
                                    this._addToQueue(user.id, message);
                                }
                            }
                        }.bind(this));
                    },

                    /**
                     * @ngdoc methode
                     * @name addToInbox
                     * @methodOf unchatbar.MessageText
                     * @private
                     * @params {String} roomId id of room clientId or userId
                     * @params {String} from message from
                     * @params {Object} message message
                     * @description
                     *
                     * store message in storage inbox
                     *
                     */
                    addToInbox : function(roomId, from, message) {
                        if (!this._storageMessages.messageInbox[roomId]) {
                            this._storageMessages.messageInbox[roomId] = [];
                        }
                        this._storageMessages.messageInbox[roomId].push({
                            text: message.text,
                            user: from,
                            own: message.own
                        });
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
                        $rootScope.$broadcast('MessageTextGetMessage',{isRoomVisible : roomId === this._selectedRoom.id });
                    },

                    /**
                     * @ngdoc methode
                     * @name sendFromQueue
                     * @methodOf unchatbar.MessageText
                     * @private
                     * @params {String} peerId id of client
                     * @description
                     *
                     * send message from storage
                     *
                     */
                    sendFromQueue: function (peerId) {
                        if (this._storageMessages.queue[peerId]) {
                            _.forEach(this._storageMessages.queue[peerId], function (message) {
                                Connection.send(peerId, message);
                            }.bind(this));
                        }
                    },


                    /**
                     * @ngdoc methode
                     * @name sendFromQueue
                     * @methodOf unchatbar.MessageText
                     * @private
                     * @params {String} peerId id of client
                     * @description
                     *
                     * send message from storage
                     *
                     */
                    removeFromQueue: function (peerId,messageId) {
                        if (this._storageMessages.queue[peerId] &&
                            this._storageMessages.queue[peerId][messageId]
                        ) {
                            delete this._storageMessages.queue[peerId][messageId];
                        }
                        if (_.size(this._storageMessages.queue[peerId]) === 0) {
                            delete this._storageMessages.queue[peerId];
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
                        if (!this._storageMessages.messages[roomId]) {
                            this._storageMessages.messages[roomId] = [];
                        }
                        this._storageMessages.messages[roomId].push({
                            text: message.text,
                            user: from,
                            own: message.own
                        });
                    },

                    /**
                     * @ngdoc methode
                     * @name _moveFromInboxToMessageStorage
                     * @methodOf unchatbar.MessageText
                     * @private
                     * @params {String} roomId to move
                     * @description
                     *
                     * move messages from inbox to messages storage
                     *
                     */
                    _moveFromInboxToMessageStorage : function(roomId) {
                        if (this._storageMessages.messageInbox[roomId]) {
                            _.forEach(this._storageMessages.messageInbox[roomId], function(message){
                                api._addStoStorage(roomId,message.user,message);
                            }.bind(this));
                            delete this._storageMessages.messageInbox[roomId];
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
                            $rootScope.$broadcast('MessageTextMoveToStorage', {});
                        }


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
                        var message = this._getMessageObject( 'textMessage',{
                            text: text
                        });
                        Connection.send(this._selectedRoom.id, message);
                        this._addToQueue(this._selectedRoom.id,message);
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
                            message = this._getMessageObject( 'textMessage',{
                                groupId: group.id,
                                text: text
                            });
                        _.forEach(group.users, function (user) {
                            if (user.id !== Broker.getPeerId()) {
                                Connection.send(user.id, message);
                                this._addToQueue(user.id, message);
                            }
                        }.bind(this));
                        return message;
                    },

                    /**
                     * @ngdoc methode
                     * @name _getMessageObject
                     * @methodOf unchatbar.MessageText
                     * @private
                     * @params {Object} message message
                     * @returns {Object} message object
                     * @description
                     *
                     * get message object
                     *
                     */
                    _getMessageObject : function(action,message) {
                        message.id =  this._createUUID();
                        message.action =  action;
                        return message;
                    },

                    /**
                     * @ngdoc methode
                     * @name _createUUID
                     * @methodOf unchatbar.MessageText
                     * @private
                     * @description
                     *
                     * generate a uui id
                     *
                     */
                    _createUUID : function() {
                        function _p8(s) {
                            var p = (Math.random().toString(16)+'000000000').substr(2,8);
                            return s ? '-' + p.substr(0,4) + '-' + p.substr(4,4) : p ;
                        }
                        return _p8() + _p8(true) + _p8(true) + _p8();

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
                            this._storageMessages.queue[peerId] = {};
                        }
                        this._storageMessages.queue[peerId][message.id] = message;
                    }

                };

                return api;
            }
        ];
    }
);
