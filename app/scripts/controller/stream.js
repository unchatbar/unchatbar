'use strict';

/**
 * @ngdoc controller
 * @name  unchatbar.controller:stream
 * @require $scope
 * @require Stream
 * @description
 *
 * display streams
 *
 */
angular.module('unchatbar').controller('stream', ['$scope', 'Stream',
    function ($scope, Stream) {

        /**
         * @ngdoc property
         * @name streamMap
         * @propertyOf unchatbar.controller:stream
         * @returns {Object} map of all client stream's
         */
        $scope.streamMap = {};

        /**
         * @ngdoc property
         * @name streamConferenceMap
         * @propertyOf unchatbar.controller:stream
         * @returns {Object} map of all client from conference
         */
        $scope.streamConferenceMap = {};


        $scope.$on('stream:add' , function(){
            $scope.streamMap = Stream.getClientStreamMap();
        });

        $scope.$on('stream:delete' , function(){
            $scope.streamMap = Stream.getClientStreamMap();
        });

        $scope.$on('stream:conferenceUser:add' , function(){
            $scope.streamConferenceMap = Stream.getConferenceClientsMap();
        });

        $scope.$on('stream:conferenceUser:delete' , function(){
            $scope.streamConferenceMap = Stream.getConferenceClientsMap();
        });

    }
]);