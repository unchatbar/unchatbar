'use strict';

/**
 * @author Lars Wiedemann
 * @ngdoc directive
 * @name unchatbar.directive:videoStream
 * @restrict E
 * @description
 *
 * output video stream
 *
 */
angular.module('unchatbar').directive('videoStream', ['Stream',
    function (Stream) {
        return {
            restrict: 'E', //E = element, A = attribute, C = class, M = comment
            templateUrl: 'views/peer/stream/type/video.html',
            replace : true,
            scope : {
                streamId : '@',
                type : '@'
            },
            link : function(scope, element){
                if (scope.type === 'conference') {
                    element.prop('src', URL.createObjectURL(Stream.getConferenceClient(scope.streamId).stream));
                } else if (scope.type === 'single') {
                    element.prop('src', URL.createObjectURL(Stream.getClientStream(scope.streamId).stream));
                }
            }
        };
    }
]);

