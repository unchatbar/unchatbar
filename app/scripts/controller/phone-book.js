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

//TODO add groups config local Storage
angular.module('unchatbar').controller('phoneBook', ['$scope','$rootScope','$sessionStorage',
    'Broker','Connection','PhoneBook',
    function ($scope,$rootScope,$localStorage, Broker, Connection,PhoneBook) {


        /**
         * @ngdoc property
         * @name username
         * @propertyOf unchatbar.controller:phoneBook
         * @returns {Object} clientList map of all client connections
         */
        $scope.clientList = PhoneBook.getClientList();

        /**
         * @ngdoc property
         * @name groupList
         * @propertyOf unchatbar.controller:phoneBook
         * @returns {Object} list of groups
         */
        $scope.groupList = PhoneBook.getGroupList();

        /**
         * @ngdoc property
         * @name label
         * @propertyOf unchatbar.controller:phoneBook
         * @returns {Object} name of new group
         */
        $scope.label = '';
        $scope.selection = {
            type:'',
            data: ''
        };
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
            $scope.clientList = PhoneBook.removeClient(peerId);
        };

        $scope.createGroup = function () {
            if(PhoneBook.addGroup($scope.label,[])) {
                $scope.label = '';
            }
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
                if(item.id) {
                    Broker.connect(item.id);
                }
            });
            $scope.showList = false;
        };

        $scope.selectClient = function (peerId) {
            Connection.setShowRoom('user',peerId);
            $scope.showList = false;
        };

        $scope.selectRoom = function (roomId) {
            Connection.setShowRoom('group',roomId);
             $scope.showList = false;
        };

        $scope.removeRoom = function (roomId) {
            PhoneBook.deleteRoom(roomId);
        };


        $scope.$on('client:connect', function (event, data) {
            Connection.add(data.connection,data.connection.peer);
            if(!$scope.clientList[data.connection.peer]) {
                $scope.clientList = PhoneBook.addClient(data.connection.peer,data.connection.peer);
            }
        });

        $scope.$on('client:sendProfile', function (event, data) {
            $scope.clientList = PhoneBook.updateClient(data.peer,data.profile.label || data.peer);

        });
    }
]);