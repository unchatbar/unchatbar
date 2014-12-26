'use strict';

/**
 * @ngdoc controller
 * @name  unchatbar.controller:connection
 * @require $scope
 * @require MessageText
 * @require PhoneBook
 * @require Profile
 * @description
 *
 * single client connection
 *
 */
angular.module('unchatbar').controller('connection', ['$scope', 'MessageText', 'PhoneBook', 'Profile',
    function ($scope, MessageText, PhoneBook, Profile) {
        /**
         * @ngdoc property
         * @name isOpen
         * @propertyOf unchatbar.controller:connection
         * @returns {Boolean} is chat open
         */
        $scope.isOpen = false;

        /**
         * @ngdoc property
         * @name isRoomSelected
         * @propertyOf unchatbar.controller:connection
         * @returns {Boolean} is room selected
         */
        $scope.isRoomSelected = false;

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
         *
         */
        $scope.send = function () {
            MessageText.send($scope.message);
            $scope.messageList = MessageText.getMessageList();
            $scope.message = '';
        };

        /**
         * @ngdoc methode
         * @name getUserName
         * @methodOf unchatbar.controller:connection
         * @params {String} id client id
         * @description
         *
         * get the name of user
         *
         */
        $scope.getUserName = function (id) {
            return PhoneBook.getClient(id).label || id;
        };

        /**
         * @ngdoc methode
         * @name getProfileName
         * @methodOf unchatbar.controller:connection
         * @params {String} id of user
         * @description
         *
         * get own username
         *
         */
        $scope.getProfileName = function () {
            return Profile.get().label || 'no profile name';
        };

        $scope.$on('chat:getMessage', function () {
            if ($scope.isOpen) {
                $scope.messageList = MessageText.getMessageList();
            }
        });

        $scope.$on('chat:setRoom', function () {
            $scope.isRoomSelected = true;
            $scope.messageList = MessageText.getMessageList();
        });

        $scope.$on('setView', function (event, data) {
            $scope.isOpen = data.name === 'chat';
        });

    }
]);