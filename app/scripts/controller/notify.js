'use strict';

/**
 * @ngdoc controller
 * @name  unchatbar.controller:notify
 * @require $scope
 * @require Profile
 * @require Broker
 * @description
 *
 * login to peer
 *
 */
angular.module('unchatbar').controller('notify', ['$scope', 'MessageText',
    function ($scope, MessageText) {
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
        $scope.$on('MessageTextGetMessage',function(){
            $scope.getUnreadMessages();

        });

        $scope.$on('MessageTextMoveToStorage',function(){
            $scope.getUnreadMessages();
        });

    }
]);