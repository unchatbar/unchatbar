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


        $scope.selectClient = function (peerId) {
            Connection.setShowRoom('user',peerId);
            $scope.showList = false;
            $scope.$emit('selectUser',{name:$scope.clientList[peerId].label });
        };

        $scope.selectRoom = function (roomId) {
            Connection.setShowRoom('group',roomId);
            $scope.showList = false;
            $scope.$emit('selectGroup',{name:$scope.groupList[roomId].label });
        };

       $scope.$on('phonebook:update', function(){
           $scope.clientList = PhoneBook.getClientList();
           $scope.groupList = PhoneBook.getGroupList();
       });
    }
]);