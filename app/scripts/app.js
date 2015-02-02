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
    'cgNotify',
    'ngStorage',
    'ui.router',
    'ui.bootstrap',
    'angularjs-dropdown-multiselect',
    'unchatbar-user',
    'unchatbar-connection',
    'unchatbar-phone-book',


]);