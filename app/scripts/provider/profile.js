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

                var api = {
                    /**
                     * @ngdoc methode
                     * @name _storageProfile
                     * @propertyOf unchatbar.Profile
                     * @private
                     * @returns {Object} user/group storage
                     *
                     */
                    _storageProfile:{
                        profile: {}
                    },
                    /**
                     * @ngdoc methode
                     * @name initStorage
                     * @methodOf unchatbar.Profile
                     * @description
                     *
                     * init storage
                     */
                    initStorage : function(){
                        var storage = useLocalStorage ? $localStorage : $sessionStorage;
                        this._storageProfile = storage.$default({
                            profile: {}
                        });

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
                        return _.clone(this._storageProfile.profile);
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
                        this._storageProfile.profile = profile;
                        this._sendProfileUpdate();
                        /**
                         * @ngdoc event
                         * @name profileUpdate
                         * @eventOf unchatbar.Profile
                         * @eventType broadcast on root scope
                         * @description
                         *
                         * send notic profile update
                         *
                         */
                        $rootScope.$broadcast('profileUpdate');
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

                return api;
            }
        ];
    }
);
