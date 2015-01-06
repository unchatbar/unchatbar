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
angular.module('unchatbar').directive('ownStreamVideo', ['Stream',
    function (Stream) {
        return {
            restrict: 'E', //E = element, A = attribute, C = class, M = comment
            templateUrl: 'views/peer/stream/stream-video.html',
            replace : true,
            link : function(scope, element, attrs){
                scope.isVisible = false;
                scope.$on('stream:addOwn' , function(event,data) {
                    scope.isVisible = true;
                    element.prop('src', URL.createObjectURL(Stream.getOwnStream(data.streamOption)));//myURL.createObjectURL(scope.stream));
                });

            }
        };
    }
]);

