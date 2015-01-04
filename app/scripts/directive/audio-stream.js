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
            templateUrl: 'views/peer/stream/audio.html',
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

