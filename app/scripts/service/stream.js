'use strict';

/**
 * @author Lars Wiedemann
 * @ngdoc service
 * @name unchatbar.Stream
 * @description
 * # peer
 * config storage for Stream
 */
angular.module('unchatbar')
    .service('Stream', ['$rootScope', '$q', 'Broker',
        function ($rootScope, $q, Broker) {


            return {
                /**
                 * @ngdoc methode
                 * @name _storageProfile
                 * @propertyOf unchatbar.Profile
                 * @private
                 * @returns {Object} user/group storage
                 *
                 */
                _stream: {
                    stream: {},
                    ownStream: null
                },
                /**
                 * @ngdoc methode
                 * @name init
                 * @methodOf unchatbar.Profile
                 * @description
                 *
                 * init listener
                 *
                 */
                init: function () {
                    $rootScope.$on('peer:call', function (event, data) {
                        if (this.getOwnStream() !== null) {
                            data.client.answer(this.getOwnStream());
                        } else {
                            this.createOwnStream().then(function (stream) {
                                data.client.answer(stream);
                            });
                        }
                        this.listenOnClientAnswer(data.client);

                        $rootScope.$broadcast('stream:add', {});
                    }.bind(this));
                },
                callUser: function (peerId) {
                    var stream = this.getOwnStream();
                    if (stream === null) {
                        this.createOwnStream().then(function (stream) {
                            this.listenOnClientAnswer(Broker.connectStream(peerId, stream));
                        }.bind(this));
                    } else {
                        this.listenOnClientAnswer(Broker.connectStream(peerId, stream));
                    }
                },
                getClientStream: function (streamId) {
                    return this._stream.stream[streamId];
                },
                listenOnClientAnswer: function (call) {
                    call.on('stream', function (stream) {
                        this._stream.stream[stream.id] = stream;
                        $rootScope.$apply(function () {
                            $rootScope.$broadcast('stream:add');
                        });
                    }.bind(this));
                },

                createOwnStream: function () {
                    var defer = $q.defer();
                    navigator.getUserMedia = this._getUserMediaApi();
                    if (navigator.getUserMedia === 0) {
                        defer.reject('no media api');
                    } else {
                        navigator.getUserMedia(
                            {
                                video: true,
                                audio: true
                            },
                            function (stream) {
                                this._stream.ownStream = stream;
                                $rootScope.$broadcast('stream:add');
                                defer.resolve(stream);
                            }.bind(this),
                            function (error) {
                                return defer.reject(error);
                            }
                        );
                    }

                    return defer.promise;
                },

                getOwnStream: function () {
                    return this._stream.ownStream || null;
                },

                getClientStreamMap : function () {
                    return this._stream.stream;
                },

                _getUserMediaApi: function () {
                    return ( navigator.getUserMedia ||
                    navigator.webkitGetUserMedia ||
                    navigator.mozGetUserMedia ||
                    navigator.msGetUserMedia);
                }

            };
        }
    ]);
