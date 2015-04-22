'use strict';

angular.module('unchatbar')
  .config(['$compileProvider', function ($compileProvider) {
    $compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|ftp|mailto|file|blob):/);
  }]);
