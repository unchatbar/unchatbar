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
         * @require $rootScope
         * @require $sessionStorage
         * @require $localStorage
         * @require Connection
         * @description
         *
         * manage user profile
         *
         */
        this.$get = ['$rootScope', '$localStorage', '$sessionStorage', 'Connection',
            function ($rootScope, $localStorage, $sessionStorage, Connection) {

                var storage = useLocalStorage ? $localStorage : $sessionStorage;
                storage = storage.$default({
                    profile: {}
                });

                return {
                    /**
                     * @ngdoc methode
                     * @name init
                     * @methodOf unchatbar.Profile
                     * @description
                     *
                     * init listener
                     *
                     */
                    init: function () {
                        $rootScope.$on('connection:open', function (event, data) {
                            Connection.send(data.peerId, {action: 'profile', profile: this.get()});
                        }.bind(this));
                    },

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
                     * @parms {Object} profile information to profile
                     * @description
                     *
                     * set profile
                     *
                     */
                    set: function (profile) {
                        storage.profile = profile;
                        this._sendProfileUpdate();
                    },

                    /**
                     * @ngdoc methode
                     * @name sendProfileUpdate
                     * @methodOf unchatbar.Profile
                     * @private
                     * @description
                     *
                     * send profile update to all connected clients
                     *
                     */
                    _sendProfileUpdate: function () {
                        _.forEach(Connection.getMap(), function (connection, peerId) {
                            Connection.send(peerId, {action: 'profile', profile: this.get()});
                        }.bind(this));
                    }


                };
            }
        ];
    }
);
