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
            templateUrl: 'views/peer/stream/video.html',
            replace : true,
            scope : {
                streamId : '@'
            },
            link : function(scope, element){
                element.prop('src', URL.createObjectURL(Stream.getClientStream(scope.streamId).stream));
            }
        };
    }
]);

