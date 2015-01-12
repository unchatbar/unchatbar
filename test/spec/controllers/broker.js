'use strict';

describe('Controller: broker', function () {

    beforeEach(module('unchatbar'));

    var brokerCTRL, scope, brokerService, state;

    beforeEach(inject(function ($controller, $rootScope,$state, Broker) {
        brokerService = Broker;
        state = $state;
        scope = $rootScope.$new();

        brokerCTRL = function () {
            $controller('broker', {
                $scope: scope,
                $state : state,
                Broker : brokerService
            });
        };
    }));

    describe('check init', function () {
        it('should set `$scope.peerId` to emty string' , function(){
            brokerCTRL();
            expect(scope.peerId).toBe('');
        });
    });
    describe('check methode', function () {
        beforeEach(function(){
            brokerCTRL();
        });
        describe('login' , function(){
            beforeEach(function(){
                spyOn(brokerService,'setPeerId').and.returnValue(true);
                spyOn(brokerService,'connectServer').and.returnValue(true);
                spyOn(state,'go').and.returnValue(true);
                scope.peerId = 'newPeerId';
                scope.login();
            });
            it('should call `Broker.setPeerId` with `$scope.peerId`' , function(){
                expect(brokerService.setPeerId).toHaveBeenCalledWith('newPeerId');
            });
            it('should call `Broker.connectServer`' , function(){
                expect(brokerService.connectServer).toHaveBeenCalled();
            });
            it('call `state.go` with `chat`' , function(){
                expect(state.go).toHaveBeenCalledWith('chat');
            });
        });
    });
});
