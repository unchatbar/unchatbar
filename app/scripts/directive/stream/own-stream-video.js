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
                    var stream = Stream.getOwnStream(data.streamOption);
                    if(stream && stream.getVideoTracks()[0]) {
                        element.prop('src', URL.createObjectURL(stream.getVideoTracks()[0]));
                    }
                });
                scope.$on('StreamCloseOwn' , function() {
                    scope.isVisible = false;
                    element.prop('src', '');
                });


            }
        };
    }
]);

