'use strict';

/**
 * @author Lars Wiedemann
 * @ngdoc service
 * @name unchatbar.Peer
 * @description
 *
 * Wrapper for window.peer lib
 *
 */
angular.module('unchatbar')
    .service('Peer',['$window',
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
