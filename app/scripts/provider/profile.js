'use strict';

/**
 * @author Lars Wiedemann
 * @ngdoc service
 * @name unchatbar.ProfileProvider
 * @description
 * # peer
 * config storage for user profile
 */
angular.module('unchatbar')
    .provider('Profile', function () {

        var useLocalStorage = false;

        /**
         * @ngdoc methode
         * @name setLocalStorage
         * @methodOf unchatbar.ProfileProvider
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
         * @name unchatbar.Profile
         * @description
         *
         * manage user profile
         *
         */
        this.$get = ['$rootScope', 'notify', '$localStorage', '$sessionStorage',
            function ($rootScope, notify, $localStorage, $sessionStorage) {

                var storage = useLocalStorage ? $localStorage : $sessionStorage;
                storage = storage.$default({
                    profile: {

                    }
                });

                return {
                    /**
                     * @ngdoc methode
                     * @name get
                     * @methodOf unchatbar.Profile
                     * @description
                     *
                     * get profile
                     *
                     */
                    get: function () {
                       return _.clone(storage.profile);
                    },

                    /**
                     * @ngdoc methode
                     * @name set
                     * @methodOf unchatbar.Profile
                     * @description
                     *
                     * set profile
                     *
                     */
                    set: function (profile) {
                        storage.profile = profile;
                        $rootScope.$broadcast('changeProfile',{});
                    }


                };
            }
        ];
    }
);
