'use strict';

/**
 * @author Lars Wiedemann
 * @ngdoc service
 * @name unchatbar.Connection
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
                /**
                 * @ngdoc methode
                 * @name init
                 * @methodOf unchatbar.Connection
                 * @description
                 *
                 * init listener
                 *
                 */
                init: function () {
                    $rootScope.$on('client:connect', function (event, data) {
                        this._add(data.connection);
                    }.bind(this));
                },

                /**
                 * @ngdoc methode
                 * @name send
                 * @methodOf unchatbar.Connection
                 * @params {String} id client peerId
                 * @params {String} message message for client
                 * @return {Boolean} send to client was successfully
                 * @description
                 *
                 * send message to client
                 *
                 */
                send: function (id, message) {
                    if (connectionMap[id] && connectionMap[id].open) {
                        connectionMap[id].send(message);
                        return true;
                    }
                    return false;
                },

                /**
                 * @ngdoc methode
                 * @name getMap
                 * @methodOf unchatbar.Connection
                 * @return {Object} list of all active client connections
                 * @description
                 *
                 * get map of all client connections
                 *
                 */
                getMap : function () {
                    return connectionMap;
                },
                /**
                 * @ngdoc methode
                 * @name add
                 * @methodOf unchatbar.Connection
                 * @param {Object} connection client connection
                 * @private
                 * @description
                 *
                 * add a new client connection
                 *
                 */
                _add: function (connection) {
                    connectionMap[connection.peer] = connection;

                    connection.on('open', function () {
                        /**
                         * @ngdoc event
                         * @name connection:open
                         * @eventOf unchatbar.Connection
                         * @eventType broadcast on root scope
                         * @param {String} peerId id of client
                         * @description
                         *
                         * new connection to client is open
                         *
                         */
                        $rootScope.$broadcast('connection:open', {peerId: connection.peer});
                    });
                    connection.on('close', function () {
                        delete connectionMap[connection.peer];
                    });
                    connection.on('data', function (data) {
                        $rootScope.$apply(function () {
                            /**
                             * @ngdoc event
                             * @name connection:getMessage:[action]
                             * @eventOf unchatbar.Connection
                             * @eventType broadcast on root scope
                             * @param {String} peerId id of client
                             * @param {Object} message message object
                             * @description
                             *
                             * receive message from client event name is dynamic
                             * `connection:getMessage:[data.action]`
                             *
                             */
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

