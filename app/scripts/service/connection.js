'use strict';

/**
 * @author Lars Wiedemann
 * @ngdoc service
 * @name unchatbar.connection
 * @description
 *
 * Wrapper for window.peer lib
 *
 */
angular.module('unchatbar')
    .service('Connection', ['$rootScope',
        function ($rootScope) {
            var connectionMap = {};

            return {
                init: function () {
                    $rootScope.$on('client:connect', function (event, data) {
                        this.add(data.connection);
                    }.bind(this));
                },
                send: function (id, message) {
                    if (connectionMap[id] && connectionMap[id].open) {
                        connectionMap[id].send(message);
                        return true;
                    }
                    return false;
                },
                getList : function () {
                    return connectionMap;
                },
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
                add: function (connection) {
                    connectionMap[connection.peer] = connection;

                    connection.on('open', function () {
                        $rootScope.$broadcast('connection:open', {peerId: connection.peer});
                    });
                    connection.on('close', function () {
                        delete connectionMap[connection.peer];
                    });
                    connection.on('data', function (data) {
                        $rootScope.$apply(function () {
                            $rootScope.$broadcast('connection:getMessage:' + data.action,
                                {
                                    peerId: connection.peer,
                                    message: data
                                }
                            );
                        });

                    });
                }
            };
        }
    ]);

