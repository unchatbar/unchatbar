'use strict';

/**
 * @author Lars Wiedemann
 * @ngdoc service
 * @name unchatbar.DataConnection
 * @description
 *
 * handle data connection
 *
 */
angular.module('unchatbar')
    .service('DataConnection', ['$rootScope', 'Broker', 'PhoneBook',
        function ($rootScope, Broker, PhoneBook) {
            var activeConnections = {};

            return {
                /**
                 * @ngdoc methode
                 * @name connectServer
                 * @methodOf unchatbar.DataConnection
                 * @description
                 *
                 * init listener for client data connection's
                 *
                 */
                init: function () {
                    $rootScope.$on('client:connect', function (event, data) {
                        this.addConnection(data.connection);
                    }.bind(this));
                },

                /**
                 * @ngdoc methode
                 * @name addConnection
                 * @methodOf unchatbar.DataConnection
                 * @param {Object} connection client connection
                 * @description
                 *
                 * store new connection
                 *
                 */
                addConnection: function (connection) {
                    PhoneBook.add(connection.peer);
                    activeConnections[connection.peer] = connection;
                    $rootScope.$broadcast('peer:clientConnect', {
                        connectId: connection.peer,
                        connection: connection
                    });
                },
                /**
                 * @ngdoc methode
                 * @name getMapOfActiveClients
                 * @methodOf unchatbar.DataConnection
                 * @return {Object} map of active connection's
                 * @description
                 *
                 * store new connection
                 *
                 */
                getMapOfActiveClients: function () {
                    return activeConnections;
                },
                /**
                 * @ngdoc methode
                 * @name removeClientFromCalledMap
                 * @methodOf unchatbar.DataConnection
                 * @return {String} connection id
                 * @description
                 *
                 * remove connection from active connection list
                 *
                 */
                removeClientFromCalledMap: function (connectionId) {
                    delete activeConnections[connectionId];
                }
            };
        }
    ]
);
