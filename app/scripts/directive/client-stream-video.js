'use strict';

/**
 * @author Lars Wiedemann
 * @ngdoc directive
 * @name unchatbar.directive:profile
 * @restrict E
 * @description
 *
 * save client connections , for recall
 *
 */
angular.module('unchatbar').directive('clientStreamVideo', ['Stream',
    function (Stream) {
        return {
            restrict: 'E', //E = element, A = attribute, C = class, M = comment
            templateUrl: 'views/peer/client-stream-video.html',
            replace : true,
            scope : {
                streamId : '@'
            },
            link : function(scope, element){
                element.prop('src', URL.createObjectURL(Stream.getClientStream(scope.streamId)));
            }
        };
    }
]);

