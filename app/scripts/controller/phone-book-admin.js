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
angular.module('unchatbar').controller('phoneBookAdmin', ['$scope','$rootScope','$sessionStorage',
    'MessageText','PhoneBook',
    function ($scope,$rootScope,$localStorage, MessageText,PhoneBook) {


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
            PhoneBook.removeClient(peerId);
        };

        $scope.createGroup = function () {
            PhoneBook.addGroup($scope.label,[]);
            $scope.label = '';
        };

        $scope.removeGroup = function (roomId) {
            MessageText.sendRemoveGroup(roomId);
            PhoneBook.removeGroup(roomId);
        };

        $scope.$on('phonebook:update', function(){
            $scope.clientList = PhoneBook.getClientList();
            $scope.groupList = PhoneBook.getGroupList();
        });
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

        $scope.getUserName = function (id) {
            return PhoneBook.getClient(id).label || id;
        };


        $scope.$on('client:sendProfile', function (event, data) {
            $scope.clientList = PhoneBook.updateClient(data.peer,data.profile.label || data.peer);

        });
    }
]);