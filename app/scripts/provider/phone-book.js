'use strict';

/**
 * @author Lars Wiedemann
 * @ngdoc service
 * @name unchatbar.BrokerProvider
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


        /**
         * @ngdoc service
         * @name unchatbar.Broker
         * @description
         * # peer
         * peer service
         */
        this.$get = ['$rootScope','$sessionStorage','$localStorage','Broker',
            function ($rootScope, $sessionStorage,$localStorage,Broker) {
                var storage = useLocalStorage ? $localStorage : $sessionStorage;
                var storagePhoneBook = storage.$default({
                    phoneBook: {
                        user: {},
                        groups: {}
                    }
                }).phoneBook;

                function getUniqueId () {
                    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
                    var id = '';
                    for (var i = 0; i < 5; i++) {
                        id += possible.charAt(Math.floor(Math.random() * possible.length));
                    }
                    return id;
                }

                return {
                    init: function () {
                        $rootScope.$on('client:connect', function (event, data) {
                            if (!storagePhoneBook.user[data.connection.peer] ) {
                                this.addClient(data.connection.peer, data.connection.peer);
                            }
                        }.bind(this));
                        $rootScope.$on('peer:open', function () {
                            _.forEach(storagePhoneBook.user, function (item) {
                                if(item.id) {
                                    Broker.connect(item.id);
                                }
                            });
                        });
                        $rootScope.$on('connection:getMessage:profile',function(event,data){
                            this.updateClient(data.peerId,data.message.profile.label || '');
                        }.bind(this));

                        $rootScope.$on('connection:getMessage:removeGroup', function (event,data) {
                            this.removeGroup(data.peerId);
                        }.bind(this));
                    },
                    addClient : function (id,label){
                        storagePhoneBook.user[id] = {
                            label:label,
                            id: id
                        };
                        this.sendUpdateEvent();

                    },
                    updateClient : function (id,label){
                        storagePhoneBook.user[id] = {
                            label:label,
                            id: id
                        };
                        this.sendUpdateEvent();
                        return this.getClientList();

                    },
                    getClient : function(clientId){
                        return storagePhoneBook.user[clientId] || '';
                    },
                    getClientList : function(){
                        return storagePhoneBook.user;
                    },
                    removeClient : function(id){
                        delete storagePhoneBook.user[id];
                        this.sendUpdateEvent();
                    },
                    copyGroupFromPartner : function (id,option) {

                        option.editable = false;
                        storagePhoneBook.groups[id] = option;
                        this.sendUpdateEvent();
                    },
                    addGroup : function(name,user){
			            var peerId = Broker.getPeerId();
                        if(peerId) {
                            var id = getUniqueId();
                            storagePhoneBook.groups[id] = {
                                label: name,
                                users: user,
                                owner: peerId,
                                editable : true,
                                id : id
                            };
                        }
                        this.sendUpdateEvent();
                    },
                    getRoom : function (roomId) {
                        return storagePhoneBook.groups[roomId];
                    },
                    removeGroup : function(roomId){
                        delete storagePhoneBook.groups[roomId];
                        this.sendUpdateEvent();
                    },
                    getGroupList : function(){
                        return storagePhoneBook.groups;
                    },
                    sendUpdateEvent : function(){
                        $rootScope.$broadcast('phonebook:update',{});
                    }



                };
            }
        ];
    }
);
