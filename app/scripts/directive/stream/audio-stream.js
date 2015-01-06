'use strict';

/**
 * @author Lars Wiedemann
 * @ngdoc directive
 * @name unchatbar.directive:audioStream
 * @restrict E
 * @description
 *
 * output audio stream
 *
 */
angular.module('unchatbar').directive('audioStream', ['Stream',
    function (Stream) {
        return {
            restrict: 'E', //E = element, A = attribute, C = class, M = comment
            templateUrl: 'views/peer/stream/type/audio.html',
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

