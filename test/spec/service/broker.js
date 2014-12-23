'use strict';

xdescribe('Serivce: Broker', function () {
    var brokerService, brokerProvider, brokerStorage,
        peerService, BrokerHeartbeatService;
    beforeEach(module('unchatbar', ['BrokerProvider', function (_brokerProvider) {
        brokerProvider = _brokerProvider;
        brokerProvider.setHost('host.de');
        brokerProvider.setPort(12345);
        brokerProvider.setPath('test/');

    }]));


    beforeEach(inject(function (Broker, Peer, BrokerHeartbeat) {
        brokerService = Broker;
        peerService = Peer;
        BrokerHeartbeatService = BrokerHeartbeat;
    }));

    describe('check methode', function () {

        describe('connectServer', function () {
            beforeEach(function () {
                spyOn(peerService, 'init').and.returnValue('peer');
                spyOn(brokerService, '_peerListener').and.returnValue(true);
                spyOn(BrokerHeartbeatService, 'start').and.returnValue(true);
            });
            it('should call Peer.init without peerId and provider options', inject(function ($sessionStorage) {
                $sessionStorage.broker.peerId = 'peerTest';
                brokerService.connectServer();

                expect(peerService.init).toHaveBeenCalledWith('peerTest', {host: 'host.de', port: 12345, path: 'test/'});
            }));
            it('should call _peerListener', function () {
                brokerService.connectServer();

                expect(brokerService._peerListener).toHaveBeenCalled();
            });
            it('should call BrokerHeartbeat', function () {
                brokerService.connectServer();

                expect(BrokerHeartbeatService.start).toHaveBeenCalled();
            });


        });

        describe('_peerListener', function () {
            var peer = {}, peerCallBack = {}, rootScope;
            beforeEach(inject(function ($rootScope) {
                rootScope = $rootScope;
                peer.on = function () {
                };
                spyOn(peerService, 'get').and.returnValue(peer);
                spyOn(peer, 'on').and.callFake(function (eventName, callBack) {
                    peerCallBack[eventName] = callBack;
                });
                brokerService._peerListener();
            }));

            describe('listener `open`', function () {
                it('should call peer.on with param `open`', function () {
                    expect(peer.on).toHaveBeenCalledWith('open', jasmine.any(Function));
                });
                it('should set peerid from callback storage peerId', inject(function ($sessionStorage) {
                    peerCallBack.open('newPeerId');
                    expect($sessionStorage.broker.peerId).toBe('newPeerId');
                }));
                it('should broadcast on $rootscope new peerid', function () {
                    spyOn(rootScope, '$broadcast').and.returnValue(true);
                    peerCallBack.open('newPeerId');
                    expect(rootScope.$broadcast).toHaveBeenCalledWith('peer:open', {id: 'newPeerId'});
                });
            });

            describe('listener `connection`', function () {
                it('should call peer.on with param `connection`', function () {
                    expect(peer.on).toHaveBeenCalledWith('connection', jasmine.any(Function));
                });
                it('should broadcast on $rootscope new peerid', function () {
                    spyOn(rootScope, '$broadcast').and.returnValue(true);
                    peerCallBack.connection('connection');
                    expect(rootScope.$broadcast).toHaveBeenCalledWith('client:connect', {connection: 'connection'});
                });
            });
            describe('listener `error`', function () {
                it('should call peer.on with param `error`', function () {
                    expect(peer.on).toHaveBeenCalledWith('error', jasmine.any(Function));
                });
            });

        });

        describe('connect', function () {
            var peer = {};
            beforeEach(function(){
                peer.connect = function(){};
                spyOn(peerService, 'get').and.returnValue(peer);

            });
            it('should call `peer.connect` with connect id' , function(){
                spyOn(peer,'connect').and.returnValue('clientConnection');

                brokerService.connect('clientId');

                expect(peer.connect).toHaveBeenCalledWith('clientId');
            });

            it('should broadcast `client:connect` with return from peer.connect' , inject(function($rootScope){
                spyOn(peer,'connect').and.returnValue('clientConnection');
                spyOn($rootScope,'$broadcast').and.returnValue(true);

                brokerService.connect('clientId');

                expect($rootScope.$broadcast).toHaveBeenCalledWith('client:connect', {
                    connection: 'clientConnection'
                });
            }));
        });

        describe('connect', function () {
            it('should return server id from peer ' , function(){
                spyOn(peerService, 'get').and.returnValue({id: 'OurId'});

                expect(brokerService.getPeerId()).toBe('OurId');
            });


        });
    });
})
;