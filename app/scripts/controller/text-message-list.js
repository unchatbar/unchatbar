'use strict';

/**
 * @ngdoc controller
 * @name  unchatbar.controller:textMessageList
 * @require $scope
 * @require $stateParams
 * @require MessageText
 * @require PhoneBook
 * @require Profile
 * @description
 *
 * single client connection
 *
 */
angular.module('unchatbar').controller('textMessageList', ['$scope', '$stateParams','MessageText', 'PhoneBook', 'Profile',
    function ($scope,$stateParams, MessageText, PhoneBook, Profile) {


        /**
         * @ngdoc property
         * @name isRoomSelected
         * @propertyOf unchatbar.controller:textMessageList
         * @returns {Boolean} is room selected
         */
        $scope.isRoomSelected = false;

        /**
         * @ngdoc property
         * @name message
         * @propertyOf unchatbar.controller:textMessageList
         * @returns {String} user message text
         */
        $scope.message = '';

        /**
         * @ngdoc property
         * @name message
         * @propertyOf unchatbar.controller:textMessageList
         * @returns {Array} list of all messages
         */
        $scope.messageList = [];

        /**
         * @ngdoc methode
         * @name send
         * @methodOf unchatbar.controller:textMessageList
         * @description
         *
         * send message to client
         *
         */
        $scope.send = function () {
            var users = [];
            if($stateParams.groupId) {
                users = PhoneBook.getGroup($stateParams.groupId).users;
            }
            MessageText.send($scope.message,users);
            $scope.messageList = MessageText.getMessageList();
            $scope.message = '';
        };

        /**
         * @ngdoc methode
         * @name getUserName
         * @methodOf unchatbar.controller:textMessageList
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
         * @name init
         * @methodOf unchatbar.controller:textMessageList
         * @params {String} id of user
         * @description
         *
         * init controller
         *
         */
        $scope.init = function () {
            $scope.isRoomSelected = ($stateParams.peerId || $stateParams.groupId);
            $scope.messageList = MessageText.getMessageList();
        };


        /**
         * @ngdoc methode
         * @name getProfileName
         * @methodOf unchatbar.controller:textMessageList
         * @params {String} id of user
         * @description
         *
         * get own username
         *
         */
        $scope.getProfileName = function () {
            return Profile.get().label;
        };

        $scope.$on('MessageTextSetRoom',function(){
            $scope.init();
        });

        $scope.$on('MessageTextGetMessage', function () {
            $scope.messageList = MessageText.getMessageList();
        });
    }
]);