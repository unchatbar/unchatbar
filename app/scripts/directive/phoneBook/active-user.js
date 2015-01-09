'use strict';

/**
 * @author Lars Wiedemann
 * @ngdoc directive
 * @name unchatbar.directive:activeUser
 * @restrict E
 * @description
 *
 * output active user
 *
 */
angular.module('unchatbar').directive('activeUser', [
    function () {
        return {
            restrict: 'E', //E = element, A = attribute, C = class, M = comment
            replace: true,
            templateUrl:'views/peer/phoneBook/active-user.html',
            controller: 'phoneBookAdmin'
        };
    }
]);

