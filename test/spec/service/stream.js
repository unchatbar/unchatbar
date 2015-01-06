'use strict';

describe('Serivce: Profile', function () {
    var rootScope, BrokerService, StreamService, ProfileService;
    beforeEach(module('unchatbar'));


    beforeEach(inject(function ($rootScope, Broker, Stream, Profile) {
        rootScope = $rootScope;
        StreamService = Stream;
        BrokerService = Broker;
        ProfileService = Profile;
    }));

    describe('check methode', function () {

        describe('init', function () {
            var callObject;
            beforeEach(function () {
                StreamService.init();
                callObject = {
                    metadata: {streamOption: 'streamOption'},
                    answer: function () {
                    }
                };
            });
            it('should call `Stream._onBrokerCall` with connection and streamOption', function () {
                spyOn(StreamService, '_onBrokerCall').and.returnValue(true);
                rootScope.$broadcast('BrokerPeerCall', {client: callObject});
                expect(StreamService._onBrokerCall).toHaveBeenCalledWith(callObject, 'streamOption');
            });
        });

        describe('_onBrokerCall', function () {
            var connection;
            beforeEach(inject(function ($q) {
                spyOn(StreamService, '_createOwnStream').and.callFake(function () {
                    var defer = $q.defer();
                    defer.resolve('stream');
                    return defer.promise;
                });
                connection = {
                    answer: function () {
                    }
                };
                spyOn(StreamService, '_listenOnClientStreamConnection').and.returnValue(true);

            }));
            it('should call Stream._createOwnStream with streamOption', function () {
                StreamService._onBrokerCall(connection, 'streamOption');

                expect(StreamService._createOwnStream).toHaveBeenCalledWith('streamOption');
            });

            it('should call connection.answer with stream', function () {
                spyOn(connection, 'answer').and.returnValue(true);
                StreamService._onBrokerCall(connection, 'streamOption');
                rootScope.$apply();
                expect(connection.answer).toHaveBeenCalledWith('stream');
            });

            it('should call Stream._listenOnClientStreamConnection with connection', function () {
                StreamService._onBrokerCall(connection, 'streamOption');
                rootScope.$apply();
                expect(StreamService._listenOnClientStreamConnection).toHaveBeenCalledWith(connection);
            });
        });

        describe('callUser', function () {
            beforeEach(function () {
                spyOn(StreamService, '_listenOnClientStreamConnection').and.returnValue(true);
                spyOn(BrokerService, 'connectStream').and.returnValue('streamCall');
                spyOn(ProfileService, 'get').and.returnValue('userProfile');

            });
            beforeEach(inject(function ($q) {
                spyOn(StreamService, '_createOwnStream').and.callFake(function () {
                    var defer = $q.defer();
                    defer.resolve('stream');
                    return defer.promise;
                });
                StreamService.callUser('peerId', 'streamOption');
                rootScope.$apply();
            }));
            it('should call `Broker.connectStream` with peerId and stream', function () {
                expect(BrokerService.connectStream).toHaveBeenCalledWith('peerId', 'stream', {
                    profile: 'userProfile',
                    type: 'single',
                    streamOption: 'streamOption'
                });
            });
            it('should call `Stream._listenOnClientStreamConnection', function () {
                expect(StreamService._listenOnClientStreamConnection).toHaveBeenCalledWith('streamCall');
            });

        });

        describe('callConference', function () {
            beforeEach(inject(function ($q) {
                spyOn(StreamService, '_listenOnClientStreamConnection').and.returnValue(true);
                spyOn(StreamService, 'getConferenceClientsMap').and.returnValue({peerIdA: 'data', 'peerIdB': 'dataB'});
                spyOn(BrokerService, 'connectStream').and.returnValue('streamCall');
                spyOn(ProfileService, 'get').and.returnValue('userProfile');
                spyOn(StreamService, '_createOwnStream').and.callFake(function () {
                    var defer = $q.defer();
                    defer.resolve('stream');
                    return defer.promise;
                });
                StreamService.callConference('peerId', 'streamOption');
                rootScope.$apply();
            }));


            it('should call `Broker.connectStream` with peerId and stream', function () {
                expect(BrokerService.connectStream).toHaveBeenCalledWith('peerId', 'stream',
                    {
                        profile: 'userProfile',
                        streamOption: 'streamOption',
                        type: 'conference',
                        conferenceUser: ['peerIdA', 'peerIdB']

                    });
            });
            it('should call `Stream._listenOnClientStreamConnection', function () {
                expect(StreamService._listenOnClientStreamConnection).toHaveBeenCalledWith('streamCall');
            });

        });

        describe('getOwnStream', function () {
            beforeEach(function () {
                spyOn(StreamService, '_getOwnStreamKeyByOption').and.returnValue('storageKey');
            });
            it('should call `Stream._getOwnStreamKeyByOption`', function () {
                StreamService.getOwnStream('streamOption');
                expect(StreamService._getOwnStreamKeyByOption).toHaveBeenCalledWith('streamOption');
            });
            it('should return value from `Stream._stream.ownStream`', function () {
                StreamService._stream.ownStream = {
                    storageKey: 'testValue'
                };
                expect(StreamService.getOwnStream('streamOption')).toBe('testValue');
            });
        });

        describe('getClientStream', function () {
            it('should return value from `Stream._stream.stream[streamId]`', function () {
                StreamService._stream.stream.single = {test: 'testValue', nextKey: 'XX'};
                expect(StreamService.getClientStream('test')).toBe('testValue');
            });
        });

        describe('getClientStreamMap', function () {
            it('should return value from `Stream._stream.stream`', function () {
                StreamService._stream.stream.single = 'streamMap';
                expect(StreamService.getClientStreamMap()).toBe('streamMap');
            });
        });

        describe('getConferenceClientsMap', function () {
            it('should return value from `Stream._stream.stream.conference`', function () {
                StreamService._stream.stream.conference = 'streamMap';
                expect(StreamService.getConferenceClientsMap()).toBe('streamMap');
            });
        });

        describe('_listenOnClientStreamConnection', function () {
            var streamEventTrigger = {peer: 'peerId', metadata: {}}, call;
            beforeEach(function () {
                streamEventTrigger = {peer: 'peerId', metadata: {}};
                call = {
                    on: function (event, callback) {
                        streamEventTrigger[event] = callback;
                    }
                };
            });

            it('should call param `call` with `stream`', function () {
                spyOn(call, 'on').and.returnValue(true);

                StreamService._listenOnClientStreamConnection(call);

                expect(call.on).toHaveBeenCalledWith('stream', jasmine.any(Function));
            });

            it('should call param `close` with `stream`', function () {
                spyOn(call, 'on').and.returnValue(true);

                StreamService._listenOnClientStreamConnection(call);

                expect(call.on).toHaveBeenCalledWith('close', jasmine.any(Function));
            });

            describe('trigger event stream' , function(){
                beforeEach(function(){
                    spyOn(StreamService,'_onStreamSingle').and.returnValue(true);
                    spyOn(StreamService,'_onStreamConference').and.returnValue(true);
                    StreamService._listenOnClientStreamConnection(call);
                });
                it('should call `Stream._onStreamSingle` with connection object and stream' , function(){
                    streamEventTrigger.metadata = {
                        type : 'single'
                    };
                    streamEventTrigger.stream('stream');
                    expect(StreamService._onStreamSingle).toHaveBeenCalledWith(streamEventTrigger,'stream');
                });
                it('should call `Stream._onStreamConference` with connection object and stream' , function(){
                    streamEventTrigger.metadata = {
                        type : 'conference'
                    };
                    streamEventTrigger.stream('stream');
                    expect(StreamService._onStreamConference).toHaveBeenCalledWith(streamEventTrigger,'stream');
                });
            });

            describe('trigger event close' , function(){
                beforeEach(function(){
                    spyOn(StreamService,'_onStreamSingleClose').and.returnValue(true);
                    spyOn(StreamService,'_onStreamConferenceClose').and.returnValue(true);
                    StreamService._listenOnClientStreamConnection(call);
                    streamEventTrigger.peerId = 'peerId';
                });
                it('should call `Stream._onStreamSingle` with peerId' , function(){
                    streamEventTrigger.metadata = {
                        type : 'single'
                    };

                    streamEventTrigger.close();

                    expect(StreamService._onStreamSingleClose).toHaveBeenCalledWith('peerId');
                });
                it('should call `Stream._onStreamConference` with peerId' , function(){
                    streamEventTrigger.metadata = {
                        type : 'conference'
                    };

                    streamEventTrigger.close();

                    expect(StreamService._onStreamConferenceClose).toHaveBeenCalledWith('peerId');
                });
            });
        });
        describe('_onStreamSingleClose' , function(){
            it('should remove stream from `Stream._stream.stream`', function () {
                StreamService._stream.stream.single = {
                    'peerId': 'stream'
                };
                StreamService._onStreamSingleClose('peerId');

                expect(StreamService._stream.stream.single).toEqual({});

            });

            it('should broadcast `StreamDeleteClient`', function () {
                StreamService._stream.stream.single = {
                    'peerId': 'stream'
                };

                spyOn(rootScope, '$broadcast').and.returnValue(true);

                StreamService._onStreamSingleClose('peerId');



                expect(rootScope.$broadcast).toHaveBeenCalledWith('StreamDeleteClient');
            });
        });

        describe('_onStreamConferenceClose' , function(){
            it('should remove stream from `Stream._stream.stream`', function () {
                StreamService._stream.stream.conference = {
                    'peerId': 'stream'
                };
                StreamService._onStreamConferenceClose('peerId');

                expect(StreamService._stream.stream.conference).toEqual({});

            });

            it('should broadcast `StreamDeleteClientToConference`', function () {
                StreamService._stream.stream.conference = {
                    'peerId': 'stream'
                };
                spyOn(rootScope, '$broadcast').and.returnValue(true);

                StreamService._onStreamConferenceClose('peerId');

                expect(rootScope.$broadcast).toHaveBeenCalledWith('StreamDeleteClientToConference');
            });
        });

        describe('_onStreamConference' , function(){
            beforeEach(function () {
                spyOn(StreamService, 'callConference').and.returnValue(true);
                spyOn(StreamService, 'getOwnStream').and.returnValue('stream');

            });
            it('should call `Stream.callConference` with peerId', function () {
                spyOn(StreamService, 'getConferenceClient').and.returnValue(null);
                var connection = {
                    peer: 'peerId',
                    data: 'test',
                    metadata : {
                        streamOption: 'streamOption',
                        conferenceUser: ['peerIdA']
                    }
                };
                StreamService._onStreamConference(connection,'stream');

                expect(StreamService.callConference).toHaveBeenCalledWith('peerIdA', 'streamOption');
            });
            it('should not call `Stream.callConference` peerId when peerId is stored in conference', function () {
                spyOn(StreamService, 'getConferenceClient').and.returnValue('connection');
                var connection = {
                    peer: 'peerId',
                    data: 'test',
                    metadata : {
                        streamOption: 'streamOption',
                        conferenceUser: ['peerIdA']
                    }
                };
                StreamService._onStreamConference(connection,'stream');
                expect(StreamService.callConference).not.toHaveBeenCalled();
            });

            it('should set stream to `Stream._stream.stream`', function () {
                spyOn(StreamService, 'getConferenceClient').and.returnValue('connection');
                var connection = {
                    peer: 'peerId',
                    data: 'test',
                    metadata : {
                        streamOption: 'streamOption',
                        conferenceUser: ['peerIdA']
                    }
                };
                StreamService._onStreamConference(connection,'stream');

                expect(StreamService._stream.stream.conference).toEqual({
                    peerId: {
                        stream: 'stream',
                        peerId: 'peerId',
                        call: connection
                    }
                });
            });

            it('should broadcast `StreamAddClientToConference`', function () {
                spyOn(rootScope, '$broadcast').and.returnValue(true);
                spyOn(StreamService, 'getConferenceClient').and.returnValue('connection');
                var connection = {
                    peer: 'peerId',
                    data: 'test',
                    metadata : {
                        streamOption: 'streamOption',
                        conferenceUser: ['peerIdA']
                    }
                };
                StreamService._onStreamConference(connection,'stream');

                expect(rootScope.$broadcast).toHaveBeenCalledWith('StreamAddClientToConference');
            });
        });

        describe('_onStreamSingle' , function(){
            it('should set stream to `Stream._stream.stream`', function () {
                StreamService._stream.stream.single = {};

                StreamService._onStreamSingle({peer: 'peerId', data: 'test'},'stream');

                expect(StreamService._stream.stream.single).toEqual({
                    peerId: {
                        stream: 'stream',
                        peerId: 'peerId',
                        call: {peer: 'peerId', data: 'test'}
                    }
                });
            });

            it('should broadcast `StreamAddClient`', function () {
                spyOn(rootScope, '$broadcast').and.returnValue(true);

                StreamService._onStreamSingle({peer: 'peerId', data: 'test'},'stream');

                expect(rootScope.$broadcast).toHaveBeenCalledWith('StreamAddClient');
            });
        });

        describe('_createOwnStream', function () {
            describe('userMedia api is not available', function () {
                beforeEach(function () {
                    spyOn(StreamService, '_getUserMediaApi').and.returnValue(0);
                });
                it('should reject an error', function () {
                    StreamService._createOwnStream().then(function () {

                    }).catch(function (error) {
                        expect(error).toBe('no media api');
                    });
                    rootScope.$apply();
                });
            });
            describe('use stream from cache', function () {
                it('should return cache stream', function () {
                    var streamFromCache = '';
                    spyOn(StreamService, 'getOwnStream').and.returnValue('cacheStream');
                    spyOn(StreamService, '_getUserMediaApi').and.returnValue(true);
                    StreamService._createOwnStream('streamOption').then(function (stream) {
                        streamFromCache = stream;
                    });
                    rootScope.$apply();
                    expect(streamFromCache).toBe('cacheStream');
                });

            });
            describe('userMedia api is available', function () {

                var userMediaSuccess, userMediaError,
                    fakeUserMedia = {
                        api: function (option, onSuccess, onError) {
                            userMediaSuccess = onSuccess;
                            userMediaError = onError;
                        }
                    };
                beforeEach(function () {
                    spyOn(StreamService, 'getOwnStream').and.returnValue(null);
                    spyOn(fakeUserMedia, 'api').and.callThrough();
                    spyOn(StreamService, '_getUserMediaApi').and.returnValue(fakeUserMedia.api);

                });
                it('should call api with audi/video option an success/error Methode', function () {
                    StreamService._createOwnStream('streamOption');
                    rootScope.$apply();
                    expect(fakeUserMedia.api).toHaveBeenCalledWith(
                        'streamOption',
                        jasmine.any(Function),
                        jasmine.any(Function)
                    );
                });
                describe('userMedia return error', function () {
                    it('should reject error', function () {
                        var error = '';
                        StreamService._createOwnStream()
                            .then(function () {

                            })
                            .catch(function (err) {
                                error = err;
                            });
                        userMediaError('MediaError');
                        rootScope.$apply();
                        expect(error).toBe('MediaError');
                    });
                });
                describe('userMedia was successfull', function () {
                    var streamReturn = {};
                    beforeEach(function () {
                        spyOn(StreamService, '_getOwnStreamKeyByOption').and.returnValue('storageKey');
                        spyOn(rootScope, '$broadcast').and.returnValue(true);
                        StreamService._stream.ownStream = {};
                        StreamService._createOwnStream('streamOption').then(function (stream) {
                            streamReturn = stream;
                        });

                    });

                    it('should set stream to `Stream._stream.ownStream`', function () {
                        userMediaSuccess('stream');

                        expect(StreamService._stream.ownStream).toEqual({storageKey: 'stream'});
                    });
                    it('should call `Stream._getOwnStreamKeyByOption`', function () {
                        userMediaSuccess('stream');

                        expect(StreamService._getOwnStreamKeyByOption).toHaveBeenCalledWith('streamOption');

                    });
                    it('should broadcast `StreamAddClient`', function () {
                        userMediaSuccess('stream');

                        expect(rootScope.$broadcast).toHaveBeenCalledWith('StreamAddOwn', {streamOption: 'streamOption'});
                    });

                    it('should return stream', function () {
                        userMediaSuccess('stream');

                        rootScope.$apply();

                        expect(streamReturn).toBe('stream');
                    });
                });
            });
        });

        describe('_getOwnStreamKeyByOption', function () {
            it('should return all key as string from object', function () {
                expect(StreamService._getOwnStreamKeyByOption({
                    test: 'value',
                    testX: 'value2'
                })).toBe('test_valuetestX_value2');
            });
        });
    });
});