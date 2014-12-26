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
        this.$get = ['$rootScope', 'notify', '$localStorage', '$sessionStorage','Connection',
            function ($rootScope, notify, $localStorage, $sessionStorage,Connection) {

                var storage = useLocalStorage ? $localStorage : $sessionStorage;
                storage = storage.$default({
                    profile: {

                    }
                });

                return {
                    init: function (){
                        $rootScope.$on('connection:open',function(event,data){
                            Connection.send(data.peerId,{action: 'profile', profile: this.get()});
                        }.bind(this));
                    },
                    sendProfileUpdate: function () {
                        _.forEach(Connection.getList(), function (connection, peerId) {
                            Connection.send(peerId,{action: 'profile', profile: this.get()});
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
                     * @description
                     *
                     * set profile
                     *
                     */
                    set: function (profile) {
                        storage.profile = profile;
                        this.sendProfileUpdate();
                    }


                };
            }
        ];
    }
);
