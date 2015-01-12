'use strict';

/**
 * @ngdoc controller
 * @name  unchatbar.controller:profile
 * @require $scope
 * @require Profile
 * @require Broker
 * @description
 *
 * manage user profile
 *
 */
angular.module('unchatbar').controller('profile', ['$scope', 'Profile','Broker',
    function ($scope, Profile,Broker) {
        /**
         * @ngdoc property
         * @name peerId
         * @propertyOf unchatbar.controller:profile
         * @returns {String} peerId peerId from PeerServer
         */

        $scope.peerId = Broker.getPeerId();
        /**
         * @ngdoc property
         * @name profile
         * @propertyOf unchatbar.controller:profile
         * @returns {String} name of user
         */
        $scope.profile = {};


        /**
         * @ngdoc methode
         * @name init
         * @methodOf unchatbar.controller:profile
         * @description
         *
         * init controller
         *
         */
        $scope.init = function(){
            $scope.profile =  Profile.get();
        };
        /**
         * @ngdoc methode
         * @name update
         * @methodOf unchatbar.controller:profile
         * @description
         *
         * update user profile
         *
         */
        $scope.update = function () {
            Profile.set($scope.profile);
            $scope.profile =  Profile.get();

        };

        $scope.$on('profileUpdate' , function(){
           $scope.init();
        });
    }
]);