'use strict';

/**
 * @ngdoc controller
 * @name  unchatbar.controller:phoneBookAdmin
 * @require $scope
 * @require $localStorage
 * @require Broker
 * @description
 *
 * phonebook administration
 *
 */

//TODO add groups config local Storage
angular.module('unchatbar').controller('phoneBookAdmin', ['$scope', 'MessageText', 'PhoneBook',
    function ($scope, MessageText, PhoneBook) {
        /**
         * @ngdoc property
         * @name clientList
         * @propertyOf unchatbar.controller:phoneBookAdmin
         * @returns {Object} map of all client
         */
        $scope.clientList = PhoneBook.getClientMap();

        /**
         * @ngdoc property
         * @name groupList
         * @propertyOf unchatbar.controller:phoneBookAdmin
         * @returns {Object} map of groups
         */
        $scope.groupList = PhoneBook.getGroupMap();

        /**
         * @ngdoc property
         * @name newGroupName
         * @propertyOf unchatbar.controller:phoneBookAdmin
         * @returns {Object} name of new group
         */
        $scope.newGroupName = '';

        /**
         * @ngdoc methode
         * @name removeClient
         * @methodOf unchatbar.controller:phoneBookAdmin
         * @params  {String} peerId id of client
         * @description
         *
         * remove client from phone book list
         *
         */
        $scope.removeClient = function (peerId) {
            PhoneBook.removeClient(peerId);
        };

        /**
         * @ngdoc methode
         * @name createGroup
         * @methodOf unchatbar.controller:phoneBookAdmin
         * @description
         *
         * create new group
         *
         */
        $scope.createGroup = function () {
            PhoneBook.addGroup($scope.newGroupName, []);
            $scope.newGroupName = '';
        };

        /**
         * @ngdoc methode
         * @name removeGroup
         * @methodOf unchatbar.controller:phoneBookAdmin
         * @params  {String} roomId id of room
         * @description
         *
         * remove group from phone book list
         *
         */
        $scope.removeGroup = function (roomId) {
            MessageText.sendRemoveGroup(roomId);
            PhoneBook.removeGroup(roomId);
        };

        /**
         * @ngdoc methode
         * @name getUserName
         * @methodOf unchatbar.controller:phoneBookAdmin
         * @params  {String} id peerId from Client
         * @description
         *
         * get name of client
         *
         */
        $scope.getUserName = function (id) {
            return PhoneBook.getClient(id).label || id;
        };

        $scope.$on('phonebook:update', function () {
            $scope.clientList = PhoneBook.getClientMap();
            $scope.groupList = PhoneBook.getGroupMap();
        });
    }
]);