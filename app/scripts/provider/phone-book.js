'use strict';

/**
 * @author Lars Wiedemann
 * @ngdoc service
 * @name unchatbar.PhoneBookProvider
 * @description
 * # peer
 * config peer connection
 */
angular.module('unchatbar')
    .provider('PhoneBook', function () {
        var useLocalStorage = false;

        /**
         * @ngdoc methode
         * @name setLocalStorage
         * @methodOf unchatbar.PhoneBookProvider
         * @description
         *
         * use local storage for store peerId
         *
         */
        this.setLocalStorage = function () {
            useLocalStorage = true;
        };


        /**
         * @ngdoc service
         * @name unchatbar.PhoneBook
         * @require $rootScope
         * @require $sessionStorage
         * @require $localStorage
         * @require Broker
         * @description
         *          *
         * phonebook
         *
         */
        this.$get = ['$rootScope', '$sessionStorage', '$localStorage', 'Broker',
            function ($rootScope, $sessionStorage, $localStorage, Broker) {
                var storage = useLocalStorage ? $localStorage : $sessionStorage;
                var storagePhoneBook = storage.$default({
                    phoneBook: {
                        user: {},
                        groups: {}
                    }
                }).phoneBook;

                return {
                    /**
                     * @ngdoc methode
                     * @name init
                     * @methodOf unchatbar.PhoneBook
                     * @description
                     *
                     * init listener
                     *
                     */
                    init: function () {
                        $rootScope.$on('client:connect', function (event, data) {
                            if (!storagePhoneBook.user[data.connection.peer]) {
                                this.addClient(data.connection.peer, data.connection.peer);
                            }
                        }.bind(this));
                        $rootScope.$on('peer:open', function () {
                            _.forEach(storagePhoneBook.user, function (item) {
                                if (item.id) {
                                    Broker.connect(item.id);
                                }
                            });
                        });
                        $rootScope.$on('connection:getMessage:profile', function (event, data) {
                            this.updateClient(data.peerId, data.message.profile.label || '');
                        }.bind(this));

                        $rootScope.$on('connection:getMessage:removeGroup', function (event, data) {
                            this.removeGroup(data.peerId);
                        }.bind(this));
                    },

                    /**
                     * @ngdoc methode
                     * @name addClient
                     * @methodOf unchatbar.PhoneBook
                     * @params {String} id peerId from client
                     * @paranm {String} label name of client
                     * @description
                     *
                     * add new client
                     *
                     */
                    addClient: function (id, label) {
                        storagePhoneBook.user[id] = {
                            label: label,
                            id: id
                        };
                        this._sendUpdateEvent();

                    },

                    /**
                     * @ngdoc methode
                     * @name updateClient
                     * @methodOf unchatbar.PhoneBook
                     * @params {String} id peerId from client
                     * @paranm {String} label name of client
                     * @description
                     *
                     * update client
                     *
                     */
                    updateClient: function (id, label) {
                        storagePhoneBook.user[id] = {
                            label: label || id
                        };
                        this._sendUpdateEvent();
                    },

                    /**
                     * @ngdoc methode
                     * @name getClient
                     * @methodOf unchatbar.PhoneBook
                     * @params {String} clientId peerId from client
                     * @return {Object} client object
                     * @description
                     *
                     * get client by peerId
                     *
                     */
                    getClient: function (clientId) {
                        return storagePhoneBook.user[clientId] || '';
                    },

                    /**
                     * @ngdoc methode
                     * @name getClientMap
                     * @methodOf unchatbar.PhoneBook
                     * @return {Object} map of all clients
                     * @description
                     *
                     * get map of all clients
                     *
                     */
                    getClientMap: function () {
                        return storagePhoneBook.user;
                    },

                    /**
                     * @ngdoc methode
                     * @name getClientMap
                     * @methodOf unchatbar.PhoneBook
                     * @params {String} id peerId from client
                     * @return {Object} map of all clients
                     * @description
                     *
                     * remove client from phone book
                     *
                     */
                    removeClient: function (id) {
                        delete storagePhoneBook.user[id];
                        this._sendUpdateEvent();
                    },

                    /**
                     * @ngdoc methode
                     * @name copyGroupFromPartner
                     * @methodOf unchatbar.PhoneBook
                     * @params {String} id id of room
                     * @return {Object} option room info
                     * @description
                     *
                     * write a copy group in phonebook from owner of the group
                     *
                     */
                    copyGroupFromPartner: function (id, option) {

                        option.editable = false;
                        storagePhoneBook.groups[id] = option;
                        this._sendUpdateEvent();
                    },

                    /**
                     * @ngdoc methode
                     * @name addGroup
                     * @methodOf unchatbar.PhoneBook
                     * @params {String} name name of group
                     * @paranm {String} user user on group
                     * @description
                     *
                     * add new client
                     *
                     */
                    addGroup: function (name, user) {
                        var peerId = Broker.getPeerId();
                        if (peerId) {
                            var id = peerId + new Date().getTime();
                            storagePhoneBook.groups[id] = {
                                label: name,
                                users: user,
                                owner: peerId,
                                editable: true,
                                id: id
                            };
                        }
                        this._sendUpdateEvent();
                    },

                    /**
                     * @ngdoc methode
                     * @name getGroup
                     * @methodOf unchatbar.PhoneBook
                     * @params {String} groupId id of group
                     * @description
                     *
                     * get infor from a group
                     *
                     */
                    getGroup: function (groupId) {
                        return storagePhoneBook.groups[groupId];
                    },

                    /**
                     * @ngdoc methode
                     * @name removeGroup
                     * @methodOf unchatbar.PhoneBook
                     * @params {String} roomId id of room
                     * @description
                     *
                     * remove group from phone book
                     *
                     */
                    removeGroup: function (roomId) {
                        delete storagePhoneBook.groups[roomId];
                        this._sendUpdateEvent();
                    },

                    /**
                     * @ngdoc methode
                     * @name getGroupMap
                     * @methodOf unchatbar.PhoneBook
                     * @return {Object} get a map of all groups from phonebook
                     * @description
                     *
                     * remove group from phone book
                     *
                     */
                    getGroupMap: function () {
                        return storagePhoneBook.groups;
                    },

                    /**
                     * @ngdoc methode
                     * @name _sendUpdateEvent
                     * @methodOf unchatbar.PhoneBook
                     * @description
                     *
                     * broadcast an update event
                     *
                     */
                    _sendUpdateEvent: function () {
                        /**
                         * @ngdoc event
                         * @name phonebook:update
                         * @eventOf unchatbar.PhoneBook
                         * @eventType broadcast on root scope
                         * @description
                         *
                         * Broadcasted data in phonebook changed
                         *
                         */
                        $rootScope.$broadcast('phonebook:update', {});
                    }
                };
            }
        ];
    }
);
