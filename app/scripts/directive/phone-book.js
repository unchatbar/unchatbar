'use strict';

/**
 * @author Lars Wiedemann
 * @ngdoc directive
 * @name unchatbar.directive:phoneBook
 * @restrict E
 * @description
 *
 * save client connections , for recall
 *
 */
angular.module('unchatbar').directive('phoneBook', [
    function () {
        return {
            restrict: 'E', //E = element, A = attribute, C = class, M = comment
            templateUrl: 'views/peer/phone-book.html',
            controller: 'phoneBook'
        };
    }
]);

