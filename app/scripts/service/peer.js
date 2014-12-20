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
                 * @name getPeerId
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
                 * @name getPeerId
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
