'use strict';

/**
 * @author Lars Wiedemann
 * @ngdoc directive
 * @name unchatbar.directive:phoneBookAdmin
 * @restrict E
 * @description
 *
 * phonebook administration
 *
 */
angular.module('unchatbar').directive('phoneBookAdmin', [
    function () {
        return {
            restrict: 'E', //E = element, A = attribute, C = class, M = comment
            replace: true,
            templateUrl:'views/peer/phone-book-admin.html',
            controller: 'phoneBookAdmin'
        };
    }
]);

