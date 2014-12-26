'use strict';

/**
 * @author Lars Wiedemann
 * @ngdoc directive
 * @name unchatbar.directive:textMessageList
 * @restrict E
 * @description
 *
 * single client connection
 *
 */
angular.module('unchatbar').directive('textMessageList', [
    function() {
        return {
            restrict: 'E', //E = element, A = attribute, C = class, M = comment
            templateUrl: 'views/peer/text-message-list.html',
            controller: 'connection'

        };
    }
]);
