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
            replace : true,
            scope : {
                streamId : '@',
                type : '@'

            },
            link : function(scope){

                function getClientStream () {
                    if (scope.type === 'conference') {
                        return Stream.getConferenceClient(scope.streamId);
                    } else if (scope.type === 'single') {
                        return Stream.getClientStream(scope.streamId);
                    }
                }
                var clientPeerId = getClientStream().peerId;
                scope.streamType = '';

                scope.user = PhoneBook.getClient(clientPeerId);
                var stream = getClientStream().stream;

                if(stream.getVideoTracks()[0]) {
                    scope.streamType = 'video';
                } else {
                    scope.streamType = 'audio';
                }
                scope.close = function() {
                    var clientCall = getClientStream();
                    if (clientCall) {
                        clientCall.call.close();
                    }
                };

            }
        };
    }
]);

