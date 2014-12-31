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
    .service('Stream', ['$rootScope','$q', 'Broker',
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
                    _stream:{
                        stream: {},
                        ownStream: {}
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
                        $rootScope.$on('peer:call',function(event,data){
                            console.log("LISTEN");
                                if (!this.getOwnStream().stream) {
                                    this.createOwnStream().then(function(stream) {
                                        data.call(stream.stream);
                                    });
                                } else {
                                    data.call(this.getOwnStream());
                                }
                        });
                        $rootScope.$on('peer:addStream' , function(event,data){
                            this._stream.stream.push(
                                {
                                'stream' : data.stream,
                                'src'    : this.getStreamSrc(data.stream)
                                }
                            );
                            $rootScope.$broadcast('stream:add');
                        }.bind(this));
                    },
                    callUser : function (peerId) {
                        var stream = this.getOwnStream();
                        if (stream.stream) {
                            Broker.connectStream(peerId,stream.stream);
                        } else {
                            this.createOwnStream().then(function(stream){
                                Broker.connectStream(peerId,stream.stream);
                            });
                        }
                    },

                    createOwnStream : function () {
                        var defer = $q.defer();
                        navigator.getUserMedia = this._getUserMediaApi();
                        if (navigator.getUserMedia === 0) {
                            defer.reject('no media api');
                        } else {
                            navigator.getUserMedia(
                                {
                                    video:true,
                                    audio:true
                                },
                                function(stream) {
                                    this._stream.ownStream = {
                                        stream : stream ,
                                        src : this.getStreamSrc(stream)

                                    };
                                    $rootScope.$broadcast('stream:add');
                                    defer.resolve(this._stream.ownStream);
                                }.bind(this),
                                function(error) {
                                    return defer.reject(error);
                                }
                            );
                        }

                        return defer.promise;
                    },

                    getOwnStream : function () {
                        return this._stream.ownStream;
                    },

                    getOwnStreamSrc : function () {
                        return this.getStreamSrc(this._stream.ownStream);
                    },

                    getClientStreamSrc : function () {
                        return this._stream.stream;
                    },

                    getStreamSrc : function (stream) {
                        return window.URL
                            ? window.URL.createObjectURL
                            : function(stream) {return stream;};
                    },

                    _getUserMediaApi : function () {
                        return navigator.getUserMedia ||
                        navigator.webkitGetUserMedia ||
                        navigator.mozGetUserMedia    ||
                        null;
                    }

                };
            }
    ]);
