'use strict';

/**
 * @ngdoc controller
 * @name  unchatbar.controller:phoneBookAdmin
 * @require $scope
 * @require $stateParams
 * @require $modal
 * @require MessageText
 * @require PhoneBook
 * @require Stream
 * @description
 *
 * phonebook administration
 *
 */

angular.module('unchatbar').controller('phoneBookAdmin', [
    '$scope', '$state','$stateParams','$modal','MessageText','PhoneBook','Stream',
    function ($scope,$state, $stateParams,$modal, MessageText, PhoneBook, Stream) {

        /**
         * @ngdoc property
         * @name selectedUser
         * @propertyOf unchatbar.controller:phoneBookAdmin
         * @returns {String} name of selcted user
         *
         */
        $scope.selectedUser = '';


        /**
         * @ngdoc property
         * @name selectedGroup
         * @propertyOf unchatbar.controller:phoneBookAdmin
         * @returns {String} name of group
         */
        $scope.selectedGroup = '';

        /**
         * @ngdoc property
         * @name clientMap
         * @propertyOf unchatbar.controller:phoneBookAdmin
         * @returns {Object} map of all client
         */
        $scope.clientMap = {};

        /**
         * @ngdoc property
         * @name groupMap
         * @propertyOf unchatbar.controller:phoneBookAdmin
         * @returns {Object} map of groups
         */
        $scope.groupMap = {};

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
            $state.go('chat');
        };

        /**
         * @ngdoc methode
         * @name getClientAndGroups
         * @methodOf unchatbar.controller:phoneBookAdmin
         * @params {String} peerId id of client
         * @description
         *
         * get user and groups
         *
         */
        $scope.getClientAndGroups = function () {
            $scope.clientMap = PhoneBook.getClientMap();
            $scope.groupMap = PhoneBook.getGroupMap();
            $scope.selectedUser = $stateParams.peerId || '';
            $scope.selectedGroup = $stateParams.groupId || '';
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
            $state.go('chat');
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

        /**
         * @ngdoc methode
         * @name streamToClient
         * @methodOf unchatbar.controller:phoneBookAdmin
         * @params {String} peerId id of client
         * @description
         *
         * stream audio/video to client
         *
         */
        $scope.streamToClient = function (peerId) {
            $modal.open({
                templateUrl: 'views/peer/modal/streamOption.html',
                controller: 'modalStreamOption',
                size: 'sm'
            }).result.then(function (streamOption) {
                    Stream.callUser(peerId,streamOption);
                });
        };

        /**
         * @ngdoc methode
         * @name streamToConference
         * @methodOf unchatbar.controller:phoneBookAdmin
         * @params {String} peerId id of client
         * @description
         *
         * call client for conference
         *
         */
        $scope.streamToConference = function (peerId) {
            $modal.open({
                templateUrl: 'views/peer/modal/streamOption.html',
                controller: 'modalStreamOption',
                size: 'sm'
            }).result.then(function (streamOption) {
                    Stream.callConference(peerId,streamOption);
                });
        };

        $scope.$on('PhoneBookUpdate', function () {
            $scope.getClientAndGroups();
        });

        $scope.$on('$stateChangeSuccess',function(){
            $scope.selectedUser = $stateParams.peerId || '';
            $scope.selectedGroup = $stateParams.groupId || '';
        });


    }
]);