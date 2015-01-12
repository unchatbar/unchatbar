'use strict';

/**
 * @ngdoc controller
 * @name  unchatbar.controller:broker
 * @require $scope
 * @require Profile
 * @require Broker
 * @description
 *
 * login to peer
 *
 */
angular.module('unchatbar').controller('broker', ['$scope', '$state', 'Broker',
    function ($scope, $state,Broker) {

        /**
         * @ngdoc property
         * @name peerId
         * @propertyOf unchatbar.controller:broker
         * @returns {String} peerId peerId from PeerServer
         */
        $scope.peerId = '';


        /**
         * @ngdoc methode
         * @name login
         * @methodOf unchatbar.controller:broker
         * @description
         *
         * set broker id
         *
         */
        $scope.login = function() {
            Broker.setPeerId($scope.peerId);
            Broker.connectServer();
            $state.go('chat');
        };

    }
]);