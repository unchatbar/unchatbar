'use strict';

/**
 * @ngdoc overview
 * @name unchatbar
 * @description
 * # unchatbar
 *
 * Main module of the application.
 */
angular.module('unchatbar', [
    'constants',
    'unchatbar-connection',
    'unchatbar-user',
    'cgNotify',
    'ngStorage',
    'ui.router',
    'ui.bootstrap',
    'angularjs-dropdown-multiselect'
]);