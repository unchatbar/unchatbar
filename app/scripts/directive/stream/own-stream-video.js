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
            link : function(scope, element){
                scope.isVisible = false;
                scope.$on('StreamAddOwn' , function(event,data) {
                    scope.isVisible = true;
                    element.prop('src', URL.createObjectURL(Stream.getOwnStream(data.streamOption)));//myURL.createObjectURL(scope.stream));
                });
                scope.$on('StreamCloseOwn' , function() {
                    scope.isVisible = false;
                    element.prop('src', '');
                });


            }
        };
    }
]);

