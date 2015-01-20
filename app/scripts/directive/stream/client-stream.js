'use strict';

/**
 * @author Lars Wiedemann
 * @ngdoc directive
 * @name unchatbar.directive:clientStream
 * @restrict E
 * @description
 *
 * output client stream
 *
 */
angular.module('unchatbar').directive('clientStream', ['Stream','PhoneBook',
    function (Stream, PhoneBook) {
        return {
            restrict: 'E', //E = element, A = attribute, C = class, M = comment
            templateUrl: 'views/peer/stream/client-stream.html',
            //replace : true,
            scope : {
                stream : '=',
                type : '='

            },
            controller : function($scope){
                $scope.streamId =$scope.stream.peerId;
                    $scope.user = PhoneBook.getClient($scope.stream.peerId);


                $scope.close = function() {
                    var call = $scope.stream.call;
                    if( $scope.stream.call.open) {
                        call.close();
                    } else {
                        if(call.metadata.type === 'single' ) {
                            Stream.removeSingleStreamClose($scope.stream.peerId);
                        } else if(call.metadata.type === 'conference'){
                            Stream.removeConferenceStreamClose($scope.stream.peerId);
                        }

                    }
                    //Send remove Action to client

                };

                $scope.buildStream = function() {
                    var stream = $scope.stream.stream;
                    if(stream && stream.getVideoTracks()[0]) {
                        $scope.streamType = 'video';
                    } else if (stream) {
                        $scope.streamType = 'audio';
                    } else {
                        $scope.streamType = 'isCalling';
                    }
                };
                $scope.buildStream();
            },
            link : function (scope) {

                scope.$watch('stream', function(newValue, oldValue) {
                    scope.buildStream();
                }, false);
            }
        };
    }
]);

