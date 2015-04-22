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
    'unchatbar-user',
    'unchatbar-connection',
    'unchatbar-contact',
    'unchatbar-data-chat',
    'unchatbar-stream',
    'unchatbar-notification',
    'gettext'
]);
