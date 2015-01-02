'use strict';

/**
 * @ngdoc controller
 * @name  unchatbar.controller:phoneBook
 * @require $scope
 * @require MessageText
 * @require PhoneBook
 * @description
 *
 * display streams
 *
 */
angular.module('unchatbar').controller('stream', ['$scope', 'Stream',
    function ($scope, Stream) {
        $scope.streamList = [];

        $scope.$on('stream:add' , function(){
            $scope.streamList = Stream.getClientStreamMap();
        });

    }
]);