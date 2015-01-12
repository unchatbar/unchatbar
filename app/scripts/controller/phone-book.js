'use strict';

/**
 * @ngdoc controller
 * @name  unchatbar.controller:phoneBook
 * @require $scope
 * @require $stateParams
 * @require MessageText
 * @require PhoneBook
 * @require Broker
 * @description
 *
 * select client/room for connection
 *
 */
angular.module('unchatbar').controller('phoneBook', ['$scope', '$stateParams','MessageText', 'PhoneBook','Broker',
    function ($scope,$stateParams, MessageText, PhoneBook, Broker) {
        $scope.form = {};
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
         *
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
         * @ngdoc property
         * @name ownPeerId
         * @propertyOf unchatbar.controller:phoneBook
         * @returns {String} own peer id
         */
        $scope.ownPeerId = Broker.getPeerId();

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

        /**
         * @ngdoc methode
         * @name createGroup
         * @methodOf unchatbar.controller:phoneBook
         * @description
         *
         * create new group
         *
         */
        $scope.createGroup = function () {
            PhoneBook.addGroup($scope.form.newGroupName);
            $scope.form.newGroupName = '';
        };

        /**
         * @ngdoc methode
         * @name init
         * @methodOf unchatbar.controller:phoneBook
         * @description
         *
         * init controller
         *
         */
        $scope.init = function() {
            $scope.getClientAndGroups();
            $scope.selectedUser = $stateParams.peerId || '';
            $scope.selectedGroup = $stateParams.groupId || '';
            if ($stateParams.peerId) {
                $scope.setClient($stateParams.peerId);
            } else if ($stateParams.groupId) {
                $scope.setGroup($stateParams.groupId);
            }
        };

        $scope.$on('$stateChangeSuccess',function(){
            $scope.init();
        });

        $scope.$on('PhoneBookUpdate', function () {
            $scope.getClientAndGroups();
        });




    }
]);