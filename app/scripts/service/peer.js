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
            var peerInstance;
            return {
                /**
                 * @ngdoc methode
                 * @name init
                 * @methodOf unchatbar.Peer
                 * @param {String} peerId Id of peer client
                 * @param {Object} options for peer server
                 * @description
                 *
                 * create instance of peer
                 *
                 */
               init : function (peerId,options) {
                    peerInstance = new $window.Peer(peerId,options);
               },
                /**
                 * @ngdoc methode
                 * @name get
                 * @methodOf unchatbar.Peer
                 * @return {Object} created instance of peer
                 *
                 */
               get : function () {
                   return  peerInstance || {};
               }
            };
        }
    ]
);
