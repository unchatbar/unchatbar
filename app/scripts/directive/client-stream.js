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
            templateUrl: 'views/peer/client-stream.html',
            replace : true,
            scope : {
                streamId : '@'

            },
            link : function(scope){
                scope.close = function() {
                    var clientCall = Stream.getClientStream(scope.streamId);
                    if (clientCall) {
                        clientCall.call.close();
                    }
                };
                scope.streamType = '';
                var clientPeerId = Stream.getClientStream(scope.streamId).peerId;
                scope.user = PhoneBook.getClient(clientPeerId);
                var stream = Stream.getClientStream(scope.streamId).stream;

                if(stream.getVideoTracks()[0]) {
                    scope.streamType = 'video';
                } else {
                    scope.streamType = 'audio';
                }
            }
        };
    }
]);

