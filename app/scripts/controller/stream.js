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

        /**
         * @ngdoc methode
         * @name closeOwnStream
         * @methodOf unchatbar.controller:stream
         * @description
         *
         * close all own media stream if no client stream is active
         *
         */
        $scope.closeOwnStream = function() {
            if (_.size($scope.streamConferenceMap) === 0 &&
                _.size($scope.streamMap) === 0){
                Stream.closeAllOwnMedia();
            }
        };

        $scope.$on('StreamAddClient' , function(){
            $scope.streamMap = Stream.getClientStreamMap();
        });

        $scope.$on('StreamDeleteClient' , function(){
            $scope.streamMap = Stream.getClientStreamMap();
            $scope.closeOwnStream();
        });

        $scope.$on('StreamAddClientToConference' , function(){
            $scope.streamConferenceMap = Stream.getConferenceClientsMap();
        });

        $scope.$on('StreamDeleteClientToConference' , function(){
            $scope.streamConferenceMap = Stream.getConferenceClientsMap();
            $scope.closeOwnStream();
        });


    }
]);