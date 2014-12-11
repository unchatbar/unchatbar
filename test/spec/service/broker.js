'use strict';

describe('Serivce: Broker', function () {
    var broker, brokerProvider;
    beforeEach(module('webrtcApp', ['brokerProvider', function (_brokerProvider) {
        brokerProvider = _brokerProvider;
    }]));


    beforeEach(inject(['broker', function (_broker) {
        broker = _broker;
    }]));
    describe('check methode', function () {
        describe('connect', function () {
            it('should call Peer', function () {
                brokerProvider.setHost('host.de');
                brokerProvider.setPort(12345);
                brokerProvider.setPath('test/');
                spyOn(window, 'Peer').and.callThrough();
                broker.connect();
                expect(window.Peer).toHaveBeenCalledWith({host: 'host.de', port: 12345, path: 'test/'});
            });

            //TODO Test Listener
        });

        describe('getPeerId', function () {
            it('should call Peer', function () {
                spyOn(window, 'Peer').and.returnValue({on : function() {},id : 'test'});

                broker.connect();

                expect(broker.getPeerId()).toBe('test');
            });
        });
        //TODO Test connectToClient
    });
});