'use strict';

/**
 * @ngdoc controller
 * @name  unchatbar.controller:profile
 * @require $scope
 * @require $localStorage
 * @require Broker
 * @description
 *
 * manage user profile
 *
 */
angular.module('unchatbar').controller('profile', ['$scope', 'Profile','Broker',
    function ($scope, Profile,Broker) {
        $scope.peerId = Broker.getPeerId();
        /**
         * @ngdoc property
         * @name profile
         * @propertyOf unchatbar.controller:profile
         * @returns {String} name of user
         */
        $scope.profile = {};

        /**
         * @ngdoc property
         * @name showName
         * @propertyOf unchatbar.controller:profile
         * @returns {Boolean} editable name
         */
        $scope.showName = false;

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
            $scope.showName = false;
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
            $scope.showName = false;
            Profile.set($scope.profile);
            $scope.profile =  Profile.get();
        };
    }
]);