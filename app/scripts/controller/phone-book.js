'use strict';

/**
 * @ngdoc controller
 * @name  unchatbar.controller:phoneBook
 * @require $scope
 * @require MessageText
 * @require PhoneBook
 * @description
 *
 * select client/room for connection
 *
 */
angular.module('unchatbar').controller('phoneBook', ['$scope', 'MessageText', 'PhoneBook',
    function ($scope, MessageText, PhoneBook) {
        /**
         * @ngdoc property
         * @name clientMap
         * @propertyOf unchatbar.controller:phoneBook
         * @returns {Object} map of all client
         */
        $scope.clientMap = {};

        /**
         * @ngdoc property
         * @name groupMap
         * @propertyOf unchatbar.controller:phoneBook
         * @returns {Object} map of groups
         */
        $scope.groupMap = {};

        /**
         * @ngdoc property
         * @name selectedUser
         * @propertyOf unchatbar.controller:phoneBook
         * @returns {String} name of selcted user
         */
        $scope.selectedUser = '';

        /**
         * @ngdoc property
         * @name selectedGroup
         * @propertyOf unchatbar.controller:phoneBook
         * @returns {String} name of group
         */
        $scope.selectedGroup = '';

        /**
         * @ngdoc methode
         * @name getClientAndGroups
         * @methodOf unchatbar.controller:phoneBook
         * @params {String} peerId id of client
         * @description
         *
         * get user and groups
         *
         */
        $scope.getClientAndGroups = function () {
            $scope.clientMap = PhoneBook.getClientMap();
            $scope.groupMap = PhoneBook.getGroupMap();
        };

        /**
         * @ngdoc methode
         * @name selectClient
         * @methodOf unchatbar.controller:phoneBook
         * @params {String} peerId id of client
         * @description
         *
         * select room for single client chat
         *
         */
        $scope.selectClient = function (peerId) {
            MessageText.setRoom('user', peerId);
            $scope.selectedGroup = '';
            $scope.selectedUser = $scope.clientMap[peerId].label;

        };

        /**
         * @ngdoc methode
         * @name selectGroup
         * @methodOf unchatbar.controller:phoneBook
         * @params {String} peerId id of client
         * @description
         *
         * select room for group chat
         *
         */
        $scope.selectGroup = function (roomId) {
            MessageText.setRoom('group', roomId);
            $scope.selectedGroup = $scope.groupMap[roomId].label;
            $scope.selectedUser = '';
        };

        $scope.$on('phonebook:update', function () {
            $scope.getClientAndGroups();
        });

    }
]);