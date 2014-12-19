'use strict';

/**
 * @author Lars Wiedemann
 * @ngdoc service
 * @name unchatbar.phoneBookProvider
 * @description
 * # peer
 * config peer connection
 */
angular.module('unchatbar')
    .provider('PhoneBook',function () {
        var useLocalStorage = false;
        /**
         * @ngdoc methode
         * @name setLocalStroage
         * @methodOf unchatbar.phoneBookProvider
         * @params {String} path set path from peerServer
         * @description
         *
         * use local storage for phone book store
         *
         */
        this.setLocalStorage = function () {
            useLocalStorage = true;
        }
        /**
         * @ngdoc service
         * @name unchatbar.PhoneBook
         * @description
         * # peer
         * peer service
         */
        this.$get = ['$localStorage', '$sessionStorage',
            function ($localStorage, $sessionStorage) {
                var storage = useLocalStorage ? $localStorage : $sessionStorage,
                    storage = storage.$default({
                        phoneBook: {
                            connections: {}
                        }
                    }).phoneBook;

                return {
                    /**
                     * @ngdoc methode
                     * @name getMap
                     * @methodOf unchatbar.PhoneBook
                     * @return {Object} map of called client's
                     * @description
                     *
                     * get called connections from storage
                     *
                     */
                    getMap: function () {
                        return storage.connections;
                    },

                    /**
                     * @ngdoc methode
                     * @name remove
                     * @methodOf unchatbar.PhoneBook
                     * @params {String] perrId Peerid from Client
                     * @return {Object} remove was successfull
                     * @description
                     *
                     * remove Client from phone book
                     *
                     */
                    remove: function (peerId) {
                        return delete storage.connections[peerId];
                    },

                    /**
                     * @ngdoc methode
                     * @name add
                     * @methodOf unchatbar.PhoneBook
                     * @params {String] perrId Peerid from Client
                     * @return {Object} remove was successfull
                     * @description
                     *
                     * add Client to phone book
                     *
                     */
                    add: function (peerId) {
                        storage.connections[peerId] = true;
                    }
                };
            }
        ]
    }
);
