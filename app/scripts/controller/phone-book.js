'use strict';

/**
 * @ngdoc controller
 * @name  unchatbar.controller:phoneBook
 * @require $scope
 * @require broker
 * @description
 *
 * show all client connections
 * #controller of this directive
 * #{@link unchatbar.clientCalled directive}
 *
 */
angular.module('unchatbar').controller('phoneBook', ['$scope','Broker','$localStorage',
    function ($scope,Broker,$localStorage) {
        var storagePhoneBook = $localStorage.$default({
            phoneBook: {
                connections: {}
            }
        }).phoneBook
        /**
         * @ngdoc property
         * @name username
         * @propertyOf unchatbar.controller:phoneBook
         * @returns {Object} clientList map of all client connections
         */
        $scope.clientList = storagePhoneBook.connections;

     
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
        $scope.connectClient = function (peerId) {
            Broker.connect(peerId);
        };

        $scope.$on('client:connect', function (event, data) {
            $scope.clientList[data.connection.peer] = true;

        });

    }
]);