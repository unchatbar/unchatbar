'use strict';

angular.module('unchatbar').directive('popoverHtmlTemplatePopup', function () {
    return {
        restrict: 'EA',
        replace: true,
        scope: {title: '@', content: '@',template : '@', placement: '@', animation: '&', isOpen: '&'},
        templateUrl: 'views/bootstrap-ui/popover/popover-html-unsafe-popup.html'
    };
})

    .directive('popoverHtmlTemplate', ['$tooltip', function ($tooltip) {
        return $tooltip('popoverHtmlTemplate', 'popover', 'click');
    }]);