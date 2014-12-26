'use strict';

/**
 * @ngdoc controller
 * @name  unchatbar.controller:connection
 * @require $scope
 * @require $rootScope
 * @require notify
 * @description
 *
 * single client connection
 *
 */
angular.module('unchatbar').controller('connection', ['$scope', '$rootScope',
    'notify','MessageText','PhoneBook','Profile',
    function ($scope, $rootScope, notify,MessageText,PhoneBook,Profile) {
        $scope.isOpen = false;


        $scope.showSendButton = false;
        /**
         * @ngdoc property
         * @name message
         * @propertyOf unchatbar.controller:connection
         * @returns {String} user message text
         */
        $scope.message = '';

        /**
         * @ngdoc property
         * @name message
         * @propertyOf unchatbar.controller:connection
         * @returns {Array} list of all messages
         */
        $scope.messageList = [];



        /**
         * @ngdoc methode
         * @name send
         * @methodOf unchatbar.controller:connection
         * @description
         *
         * send message to client
         * TODO Send in own directive
         */
        $scope.send = function () {
            MessageText.send($scope.message);
            $scope.messageList = MessageText.getMessageList();
            $scope.message = '';
        };

        // Receive messages
        $scope.$on('getMessage', function (event, data) {
            if ( $scope.isOpen) {
                $scope.messageList = MessageText.getMessageList();
            }
        });

        $scope.getUserName = function (id) {
            return PhoneBook.getClient(id).label || id;
        };

        $scope.getProfileName = function () {
            return Profile.get().label || 'no profile name';
        };


        $scope.$on('roomSelected', function (event, data) {
            $scope.showSendButton = true;
            $scope.messageList = MessageText.getMessageList();
        });

        $scope.$on('setView',function(event,data){
            $scope.isOpen = data.name === 'chat' ? true : false;
        });

    }
]);