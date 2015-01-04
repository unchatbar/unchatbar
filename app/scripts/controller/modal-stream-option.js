'use strict';

/**
 * @ngdoc controller
 * @name  unchatbar.controller:streamOption
 * @require $scope
 * @require Stream
 * @description
 *
 * display streams
 *
 */
angular.module('unchatbar').controller('modalStreamOption', ['$scope', '$modalInstance', 'Stream',
    function ($scope, $modalInstance) {

        $scope.videoCall = function () {
            $modalInstance.close({
                video: true,
                audio: true
            });
        };

        $scope.audiCall = function () {
            $modalInstance.close({
                video: false,
                audio: true
            });
        };
    }
]);