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
            MessageText.sendRemoveGroup(roomId,PhoneBook.getGroup(roomId).users);
            PhoneBook.removeGroup(roomId);
            $state.go('chat');
        };

        /**
         * @ngdoc methode
         * @name addUserToGroup
         * @methodOf unchatbar.controller:phoneBookAdmin
         * @params {String} user id of client
         * @description
         *
         * add new user to group
         *
         */
        $scope.addUserToGroup = function(){
            if($scope.selectedGroup) {
                var users = $scope.groupMap[$scope.selectedGroup].users;
                MessageText.sendGroupUpdateToUsers(users,$scope.groupMap[$scope.selectedGroup]);
                PhoneBook.updateGroup($scope.selectedGroup,$scope.groupMap[$scope.selectedGroup]);
            }
        };

        /**
         * @ngdoc methode
         * @name addUserToGroup
         * @methodOf unchatbar.controller:phoneBookAdmin
         * @params {String} user id of client
         * @description
         *
         * add new user to group
         *
         */
        $scope.removeUserFromGroup = function(){
            if($scope.selectedGroup) {
                var users = PhoneBook.getGroup($scope.selectedGroup).users;
                MessageText.sendGroupUpdateToUsers(users,$scope.groupMap[$scope.selectedGroup]);
                PhoneBook.updateGroup($scope.selectedGroup,$scope.groupMap[$scope.selectedGroup]);
            }
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
         * @name streamToConferenceByGroupId
         * @methodOf unchatbar.controller:phoneBookAdmin
         * @params {String} peerId id of client
         * @description
         *
         * create conference for group
         *
         */
        $scope.streamToConferenceByGroupId = function (roomId) {
            $modal.open({
                templateUrl: 'views/peer/modal/streamOption.html',
                controller: 'modalStreamOption',
                size: 'sm'
            }).result.then(function (streamOption) {
                    Stream.createOwnStream(streamOption).then(function (stream) {
                        _.forEach($scope.groupMap[roomId].users, function (user) {
                            Stream.callConference(roomId, user.id, streamOption,stream);
                        });
                    });
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