'use strict';

describe('Serivce: Profile', function () {
    var rootScope, BrokerService, StreamService;
    beforeEach(module('unchatbar'));


    beforeEach(inject(function ($rootScope, Broker, Stream) {
        rootScope = $rootScope;
        StreamService = Stream;
        BrokerService = Broker;
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

            describe('check listener `peer:call`', function () {
                beforeEach(function () {
                    spyOn(StreamService, '_listenOnClientAnswer').and.returnValue(true);
                });
                describe('has own Data stream', function () {
                    beforeEach(function () {
                        StreamService.init();
                        spyOn(StreamService, 'getOwnStream').and.returnValue('stream');
                    });
                    it('should call `Stream.getOwnStream` with peerId ,action `profile` and userprofile', function () {

                        spyOn(callObject, 'answer').and.returnValue(true);
                        rootScope.$broadcast('peer:call', {client: callObject});

                        expect(StreamService.getOwnStream).toHaveBeenCalledWith('streamOption');
                    });
                    it('should call `call.answer` with peerId ,action `profile` and userprofile', function () {

                        spyOn(callObject, 'answer').and.returnValue(true);
                        rootScope.$broadcast('peer:call', {client: callObject});

                        expect(callObject.answer).toHaveBeenCalledWith('stream');
                    });

                    it('should call `Stream._listenOnClientAnswer` with peerId ,action `profile` and userprofile', function () {
                        spyOn(callObject, 'answer').and.returnValue(true);
                        rootScope.$broadcast('peer:call', {client: callObject});
                        rootScope.$apply();

                        expect(StreamService._listenOnClientAnswer).toHaveBeenCalledWith({
                            metadata: {streamOption: 'streamOption'},
                            answer: jasmine.any(Function)
                        });
                    });
                });

                describe('has not own Data stream', function () {
                    beforeEach(inject(function ($q) {
                        StreamService.init();

                        spyOn(StreamService, 'getOwnStream').and.returnValue(null);
                        spyOn(StreamService, '_createOwnStream').and.callFake(function () {
                            var defer = $q.defer();
                            defer.resolve('stream');
                            return defer.promise;
                        });

                    }));

                    it('should call `Stream.getOwnStream` with peerId ,action `profile` and userprofile', function () {

                        spyOn(callObject, 'answer').and.returnValue(true);
                        rootScope.$broadcast('peer:call', {client: callObject});

                        expect(StreamService.getOwnStream).toHaveBeenCalledWith('streamOption');
                    });

                    it('should call `cal.answer` with peerId ,action `profile` and userprofile', function () {
                        spyOn(callObject, 'answer').and.returnValue(true);
                        rootScope.$broadcast('peer:call', {client: callObject});
                        rootScope.$apply();

                        expect(callObject.answer).toHaveBeenCalledWith('stream');
                    });

                    it('should call `Stream._listenOnClientAnswer` with peerId ,action `profile` and userprofile', function () {
                        spyOn(callObject, 'answer').and.returnValue(true);
                        rootScope.$broadcast('peer:call', {client: callObject});
                        rootScope.$apply();

                        expect(StreamService._listenOnClientAnswer).toHaveBeenCalledWith({
                            metadata: {streamOption: 'streamOption'},
                            answer: jasmine.any(Function)
                        });
                    });
                });

            });
        });

        describe('callUser', function () {
            beforeEach(function () {
                spyOn(StreamService, '_listenOnClientAnswer').and.returnValue(true);
                spyOn(BrokerService, 'connectStream').and.returnValue('streamCall');
            });
            describe('has own stream', function () {
                beforeEach(function () {
                    spyOn(StreamService, 'getOwnStream').and.returnValue('stream');
                    StreamService.callUser('peerId', 'streamOption');
                });
                it('should call `Broker.connectStream` with peerId and stream', function () {
                    expect(BrokerService.connectStream).toHaveBeenCalledWith('peerId', 'stream', {streamOption: 'streamOption'});
                });
                it('should call `Stream._listenOnClientAnswer', function () {
                    expect(StreamService._listenOnClientAnswer).toHaveBeenCalledWith('streamCall');
                });
            });

            describe('has no own stream', function () {
                beforeEach(inject(function ($q) {
                    spyOn(StreamService, 'getOwnStream').and.returnValue(null);
                    spyOn(StreamService, '_createOwnStream').and.callFake(function () {
                        var defer = $q.defer();
                        defer.resolve('stream');
                        return defer.promise;
                    });
                    StreamService.callUser('peerId', 'streamOption');
                    rootScope.$apply();
                }));
                it('should call `Broker.connectStream` with peerId and stream', function () {
                    expect(BrokerService.connectStream).toHaveBeenCalledWith('peerId', 'stream', {streamOption: 'streamOption'});
                });
                it('should call `Stream._listenOnClientAnswer', function () {
                    expect(StreamService._listenOnClientAnswer).toHaveBeenCalledWith('streamCall');
                });
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
                StreamService._stream.stream = {test: 'testValue', nextKey: 'XX'};
                expect(StreamService.getClientStream('test')).toBe('testValue');
            });
        });

        describe('getClientStreamMap', function () {
            it('should return value from `Stream._stream.stream`', function () {
                StreamService._stream.stream = 'streamMap';
                expect(StreamService.getClientStreamMap()).toBe('streamMap');
            });
        });

        describe('_listenOnClientAnswer', function () {
            var streamEventTrigger = {peer: 'peerId'},call;
            beforeEach(function () {
                streamEventTrigger = {peer: 'peerId'};
                call = {
                    on: function (event, callback) {
                        streamEventTrigger[event] = callback;
                    }
                };


            });

            it('should call param `call` with `stream`', function () {
                spyOn(call, 'on').and.returnValue(true);

                StreamService._listenOnClientAnswer(call);

                expect(call.on).toHaveBeenCalledWith('stream', jasmine.any(Function));
            });

            it('should call param `close` with `stream`', function () {
                spyOn(call, 'on').and.returnValue(true);

                StreamService._listenOnClientAnswer(call);

                expect(call.on).toHaveBeenCalledWith('close', jasmine.any(Function));
            });
            describe('trigger close event', function () {
                beforeEach(function () {
                    StreamService._listenOnClientAnswer(call);
                });
                it('should remove stream from `Stream._stream.stream`', function () {
                    StreamService._stream.stream = {
                        'peerId' : 'stream'
                    };
                    streamEventTrigger.close();

                    expect(StreamService._stream.stream).toEqual({});

                });

                it('should broatcast `stream:delete`', function () {
                    StreamService._stream.stream = {
                        'peerId' : 'stream'
                    };

                    spyOn(rootScope, '$broadcast').and.returnValue(true);

                    streamEventTrigger.close();

                    expect(rootScope.$broadcast).toHaveBeenCalledWith('stream:delete');
                });
            });
            describe('trigger stream event', function () {
                beforeEach(function () {
                    StreamService._listenOnClientAnswer(call);
                });

                it('should set stream to `Stream._stream.stream`', function () {
                    StreamService._stream.stream = {};

                    streamEventTrigger.stream({id: 'StreamId', data: 'test'});

                    expect(StreamService._stream.stream).toEqual({
                        peerId: {
                            stream: {
                                id: 'StreamId',
                                data: 'test'
                            },
                            peerId: 'peerId',
                            call: {
                                peer: 'peerId',
                                stream: jasmine.any(Function),
                                close: jasmine.any(Function)
                            }
                        }
                    });
                });

                it('should broatcast `stream:add`', function () {
                    StreamService._stream.stream = {};
                    spyOn(rootScope, '$broadcast').and.returnValue(true);
                    streamEventTrigger.stream({id: 'StreamId', data: 'test'});

                    expect(rootScope.$broadcast).toHaveBeenCalledWith('stream:add');
                });
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
            describe('userMedia api is available', function () {

                var userMediaSuccess, userMediaError,
                    fakeUserMedia = {
                        api: function (option, onSuccess, onError) {
                            userMediaSuccess = onSuccess;
                            userMediaError = onError;
                        }
                    };
                beforeEach(function () {
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
                    it('should broadcast `stream:add`', function () {
                        userMediaSuccess('stream');

                        expect(rootScope.$broadcast).toHaveBeenCalledWith('stream:add');
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
                expect(StreamService._getOwnStreamKeyByOption({test: 'value', testX: 'value2'})).toBe('test_testX');
            });
        });
    });
});