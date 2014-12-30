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

            if ($scope.selectedGroup && !$scope.groupMap[$scope.selectedGroup]) {
                $scope.setGroup('');
            }

            if ($scope.selectedUser && !$scope.clientMap[$scope.selectedUser]) {
                $scope.setClient('');
            }
        };

        /**
         * @ngdoc methode
         * @name setClient
         * @methodOf unchatbar.controller:phoneBook
         * @params {String} peerId id of client
         * @description
         *
         * select room for single client chat
         *
         */
        $scope.setClient = function (peerId) {
            MessageText.setRoom('user', peerId);
            $scope.selectedGroup = '';
            $scope.selectedUser = peerId;

        };

        /**
         * @ngdoc methode
         * @name setGroup
         * @methodOf unchatbar.controller:phoneBook
         * @params {String} peerId id of client
         * @description
         *
         * select room for group chat
         *
         */
        $scope.setGroup = function (roomId) {
            MessageText.setRoom('group', roomId);
            $scope.selectedGroup = roomId;
            $scope.selectedUser = '';
        };

        $scope.$on('phonebook:update', function () {
            $scope.getClientAndGroups();
        });

    }
]);