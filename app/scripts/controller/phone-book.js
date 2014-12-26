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
angular.module('unchatbar').controller('phoneBook', ['$scope','$rootScope','MessageText','PhoneBook',
    function ($scope,$rootScope, MessageText,PhoneBook) {


        /**
         * @ngdoc property
         * @name username
         * @propertyOf unchatbar.controller:phoneBook
         * @returns {Object} clientList map of all client connections
         */
        $scope.clientList = PhoneBook.getClientList();
        $scope.selectedUser = '';
        $scope.selectedRoom = '';
        /**
         * @ngdoc property
         * @name groupList
         * @propertyOf unchatbar.controller:phoneBook
         * @returns {Object} list of groups
         */
        $scope.groupList = PhoneBook.getGroupList();


        $scope.selectClient = function (peerId) {
            MessageText.setRoom('user',peerId);
            $scope.selectedRoom = '';
            $scope.selectedUser = $scope.clientList[peerId].label;

        };

        $scope.selectRoom = function (roomId) {
            MessageText.setRoom('group',roomId);
            $scope.selectedRoom = $scope.groupList[roomId].label;
            $scope.selectedUser = '';
        };

        $scope.$on('phonebook:update', function(){
           $scope.clientList = PhoneBook.getClientList();
           $scope.groupList = PhoneBook.getGroupList();
       });


    }
]);