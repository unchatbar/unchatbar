'use strict';

/**
 * @ngdoc controller
 * @name  unchatbar.controller:connectionCenter
 * @require $scope
 * @description
 *
 * set active view
 *
 */

angular.module('unchatbar').controller('connectionCenter', ['$scope',
    function ($scope) {
        /**
         * @ngdoc property
         * @name showPanel
         * @propertyOf unchatbar.controller:connectionCenter
         * @returns {String} name of panel to show
         */
        $scope.showPanel = '';

        /**
         * @ngdoc methode
         * @name send
         * @methodOf unchatbar.controller:connectionCenter
         * @params {String} viewName name of view
         * @description
         *
         * show/hide view
         *
         */
        $scope.setView = function (viewName) {
            $scope.showPanel = $scope.showPanel === viewName ? '' : viewName;
            /**
             * @ngdoc event
             * @name setView
             * @eventOf unchatbar.controller:connectionCenter
             * @eventType broadcast on scope
             * @param {String} name of active panel
             * @description
             *
             * Broadcasted after `$scope.showPanel`changed
             *
             */
            $scope.$broadcast('setView', {name: $scope.showPanel});
        };

    }
]);