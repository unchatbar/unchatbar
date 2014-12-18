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
    .service('DataConnection', ['$rootScope', 'Broker', 'PhoneBook',
        function ($rootScope, Broker, PhoneBook) {
            var activeConnections = {};

            return {
                init: function () {
                    $rootScope.$on('client:connect', function (event, data) {
                        this.addConnection(data.connection);
                    }.bind(this));
                },
                connect: function (id) {
                    this.addConnection(Broker.connect(id));
                },
                /**
                 * @ngdoc methode
                 * @name connectToClient
                 * @params {String} id peer id from client
                 * @methodOf unchatbar.broker
                 * @description
                 *
                 * connect to client by client peer id
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
                 * @methodOf unchatbar.broker
                 * @return {Object} map of active connection
                 * @description
                 *
                 * get map of called called clients
                 *
                 */
                getMapOfActiveClients: function () {
                    return activeConnections;
                },
                /**
                 * @ngdoc methode
                 * @name removeClientFromCalledMap
                 * @params {String} connectionId connection id of client
                 * @methodOf unchatbar.broker
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
