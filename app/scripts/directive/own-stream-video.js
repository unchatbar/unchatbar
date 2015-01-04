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
            templateUrl: 'views/peer/stream-video.html',
            replace : true,
            link : function(scope, element, attrs){
                scope.$on('stream:add' , function() {
                    element.prop('src', URL.createObjectURL(Stream.getOwnStream()));//myURL.createObjectURL(scope.stream));
                });

            }
        };
    }
]);

