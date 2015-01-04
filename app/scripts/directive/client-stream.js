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
angular.module('unchatbar').directive('clientStream', ['Stream',
    function (Stream) {
        return {
            restrict: 'E', //E = element, A = attribute, C = class, M = comment
            templateUrl: 'views/peer/client-stream.html',
            replace : true,
            scope : {
                streamId : '@'

            },
            link : function(scope){
                scope.streamType = '';
                var stream = Stream.getClientStream(scope.streamId);
                if(stream.getVideoTracks()[0]) {
                    scope.streamType = 'video';
                } else {
                    scope.streamType = 'audio';
                }
            }
        };
    }
]);

