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


        $scope.$on('StreamAddClient' , function(){
            $scope.streamMap = Stream.getClientStreamMap();
        });

        $scope.$on('StreamDeleteClient' , function(){
            $scope.streamMap = Stream.getClientStreamMap();
        });

        $scope.$on('StreamAddClientToConference' , function(){
            $scope.streamConferenceMap = Stream.getConferenceClientsMap();
        });

        $scope.$on('StreamDeleteClientToConference' , function(){
            $scope.streamConferenceMap = Stream.getConferenceClientsMap();
        });

    }
]);