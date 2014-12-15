'use strict';

describe('Serivce: Broker', function () {
    var brokerService, brokerProvider, sessionStorage;
    beforeEach(module('unchatbar', ['brokerProvider', function (_brokerProvider) {
        brokerProvider = _brokerProvider;
        brokerProvider.setHost('host.de');
        brokerProvider.setPort(12345);
        brokerProvider.setPath('test/');

    }]));


    beforeEach(inject(function (broker) {
        brokerService = broker;


    }));
    describe('check methode', function () {

        describe('connect', function () {
            it('should call Peer', function () {
                spyOn(window, 'Peer').and.callThrough();
                brokerService.connect();
                expect(window.Peer).toHaveBeenCalledWith('', {host: 'host.de', port: 12345, path: 'test/'});
            });

            //TODO Test Listener
        });

        describe('getPeerId', function () {
            it('should call Peer', function () {
                spyOn(window, 'Peer').and.returnValue({
                    on: function () {
                    }, id: 'test'
                });

                brokerService.connect();

                expect(brokerService.getPeerId()).toBe('test');
            });
        });
        //TODO Test connectToClient
    });
})
;