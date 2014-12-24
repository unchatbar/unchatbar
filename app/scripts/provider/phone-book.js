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
        this.$get = ['$rootScope','$sessionStorage','$sessionStorage','$localStorage','Broker',
            function ($rootScope, $sessionStorage,$localStorage,Broker) {
                var storage = useLocalStorage ? $localStorage : $sessionStorage;
                var storagePhoneBook = storage.$default({
                    phoneBook: {
                        user: {},
                        groups: {}
                    }
                }).phoneBook;


                return {
                    addClient : function (id,label){
                        storagePhoneBook.user[id] = {
                            label:label,
                            id: id
                        };
                        return this.getClientList();

                    },
                    updateClient : function (id,label){
                        storagePhoneBook.user[id] = {
                            label:label,
                            id: id
                        };
                        return this.getClientList();

                    },
                    getClient : function(clientId){
                        return storagePhoneBook.user[clientId];
                    },
                    getClientList : function(){
                        return storagePhoneBook.user;
                    },
                    removeClient : function(id){
                        delete storagePhoneBook.groups[id];
                        return this.getClientList();
                    },
                    addGroup : function(name,user){
                        if(Broker.getPeerId()) {
                            var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
                            var id = '';
                            for (var i = 0; i < 5; i++) {
                                id += possible.charAt(Math.floor(Math.random() * possible.length));
                            }
                            storagePhoneBook.groups[id] = {
                                label: name,
                                users: user,
                                owner: Broker.getPeerId()
                            };
                            return this.getGroupList();
                        }
                        return this.getGroupList();
                    },
                    getRoom : function (roomId) {
                        return storagePhoneBook.groups[roomId];
                    },
                    deleteRoom : function(roomId){
                        delete storagePhoneBook.groups[roomId];
                        return this.getGroupList();
                    },
                    getGroupList : function(){
                        return storagePhoneBook.groups;
                    }

                };
            }
        ];
    }
);
