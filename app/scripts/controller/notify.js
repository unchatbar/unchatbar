'use strict';

/**
 * @ngdoc controller
 * @name  unchatbar.controller:notify
 * @require $scope
 * @require MessageText
 * @require PhoneBook
 * @description
 *
 * login to peer
 *
 */
angular.module('unchatbar').controller('notify', ['$scope', 'MessageText','PhoneBook',
    function ($scope, MessageText, PhoneBook) {
        /**
         * @ngdoc property
         * @name unreadMessages
         * @propertyOf unchatbar.controller:notify
         * @returns {Object} unreadMessages new messages for all roomy
         */
        $scope.unreadMessages = {};

        /**
         * @ngdoc property
         * @name countUnreadMessages
         * @propertyOf unchatbar.controller:notify
         * @returns {Number} count of unread messages
         */
        $scope.countUnreadMessages = 0;

        /**
         * @ngdoc methode
         * @name getUnreadMessages
         * @methodOf unchatbar.controller:broker
         * @description
         *
         * get all unread text messages
         *
         */
        $scope.getUnreadMessages = function() {
            $scope.unreadMessages = MessageText.getMessageInbox();
            $scope.countUnreadMessages = 0;
            _.forEach($scope.unreadMessages,function(room){
                $scope.countUnreadMessages+=parseInt(_.size(room));
            });
        };

        /**
         * @ngdoc methode
         * @name getClient
         * @methodOf unchatbar.controller:notify
         * @params {String} clientId id of client
         * @returns {Object} client object
         * @description
         *
         * get cient object
         *
         */
        $scope.getClient = function (clientId) {
            return PhoneBook.getClient(clientId);
        };

        /**
         * @ngdoc methode
         * @name getGroup
         * @methodOf unchatbar.controller:notify
         * @params {String} roomId id of room
         * @returns {String} room name
         * @description
         *
         * get group name
         *
         */
        $scope.getGroup = function (roomId) {
            return PhoneBook.getGroup(roomId);
        };



        $scope.$on('MessageTextGetMessage',function(){
            $scope.getUnreadMessages();

        });

        $scope.$on('MessageTextMoveToStorage',function(){
            $scope.getUnreadMessages();
        });

    }
]);