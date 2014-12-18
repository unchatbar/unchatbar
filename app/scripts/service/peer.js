'use strict';

/**
 * @author Lars Wiedemann
 * @ngdoc service
 * @name unchatbar.brokerProvider
 * @description
 * # peer
 * config peer connection
 */
angular.module('unchatbar')
    .service('peer',['$window',
        function ($window) {
            var activeConnections = {};
            return {
               get : function () {
                   return $window.peer || {};
               }
            };
        }
    ]
);
