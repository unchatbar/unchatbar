'use strict';

/**
 * @ngdoc controller
 * @name  unchatbar.controller:phoneBook
 * @require $scope
 * @require $localStorage
 * @require Broker
 * @description
 *
 * save client connections , for recall
 *
 */
angular.module('unchatbar').controller('phoneBook', ['$scope','$rootScope','$sessionStorage','Broker','Connection',
    function ($scope,$rootScope,$localStorage, Broker, Connection) {
        var storagePhoneBook = $localStorage.$default({
            phoneBook: {
                connections: {}
            }
        }).phoneBook;
        /**
         * @ngdoc property
         * @name username
         * @propertyOf unchatbar.controller:phoneBook
         * @returns {Object} clientList map of all client connections
         */
        $scope.clientList = storagePhoneBook.connections;

     $scope.selectClient = 'no selection';
        /**
         * @ngdoc methode
         * @name removeClient
         * @methodOf unchatbar.controller:phoneBook
         * @params  {String} peerId id of client
         * @description
         *
         * remove client from phone book list
         *
         */
        $scope.removeClient = function (peerId) {
            delete $scope.clientList[peerId];
        };

        /**
         * @ngdoc methode
         * @name removeClient
         * @methodOf unchatbar.controller:phoneBook
         * @params  {String} peerId id of client
         * @description
         *
         * create connection to client
         *
         */
        $scope.$on('peer:open', function () {
            $scope.init();
        });
        $scope.init = function () {
            _.forEach($scope.clientList, function (item, peer) {
                Broker.connect(peer);
            });
            $scope.showList = false;
        };

        $scope.selectClient = function (peerId) {
            $scope.selectClient = $scope.clientList[peerId].name || peerId;
            Connection.setClient(peerId);
            $scope.showList = false;
        };


        $scope.$on('client:connect', function (event, data) {
            Connection.add(data.connection);
            if(!$scope.clientList[data.connection.peer]) {
                $scope.clientList[data.connection.peer] = {};
            }
        });

        $scope.$on('client:sendProfile', function (event, data) {
            if($scope.clientList[data.peer]) {
                $scope.clientList[data.peer] = data.profile;
            }
        });
    }
]);