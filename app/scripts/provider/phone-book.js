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
                     * @name getMapOfClientCalled
                     * @methodOf unchatbar.broker
                     * @return {Object} map of called client's
                     * @description
                     *
                     * get called connections from storage
                     *
                     */
                    //Rename in getMap
                    getMap: function () {
                        return storage.connections;
                    },
                    remove: function (peerId) {
                        return delete storage.connections[peerId];
                    },
                    add: function (peerId) {
                        storage.connections[peerId] = true;
                    }
                };
            }
        ]
    }
);
