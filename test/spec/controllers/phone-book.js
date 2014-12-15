'use strict';

describe('Controller: phoneBook', function () {

    beforeEach(module('unchatbar'));

    var phoneBookCTRL, scope, brokerService;

    beforeEach(inject(function ($controller, $rootScope, broker) {
        brokerService = broker;
        scope = $rootScope.$new();
        phoneBookCTRL = function () {
            $controller('phoneBook', {
                $scope: scope,
                broker : brokerService
            });
        }
    }));

    describe('check init', function () {
        beforeEach(function () {
            spyOn(brokerService,'getMapOfClientCalled').and.returnValue({clientList :''});
            phoneBookCTRL();
        });
        it('should call broker.getMapOfClientCalled', function () {
            expect(brokerService.getMapOfClientCalled).toHaveBeenCalled();
        });
        it('should have an empty username by init', function () {
            expect(scope.clientList).toEqual({clientList :''});
        });
    });
    describe('check methode', function () {
        describe('removeClient' , function (){
            var removeWasSuccessfull = true;
            beforeEach(function(){
                phoneBookCTRL();
                spyOn(brokerService,'removeClientCalled').and.callFake(function() {
                    return removeWasSuccessfull;
                });

                scope.clientList = {};
            })
            it('should call `broker.removeClientCalled` width peerId' , function() {
                removeWasSuccessfull = true;

                scope.removeClient('peerId');

                expect(brokerService.removeClientCalled).toHaveBeenCalledWith('peerId');
            });
            it('should not call `broker.getMapOfClientCalled` when remove was unsuccuessfully' , function() {
                spyOn(brokerService,'getMapOfClientCalled').and.returnValue(true);
                removeWasSuccessfull = false;

                scope.removeClient('peerId');

                expect(brokerService.getMapOfClientCalled).not.toHaveBeenCalled();
            });
            it('should call `broker.getMapOfClientCalled` when remove was succuessfully' , function() {
                spyOn(brokerService,'getMapOfClientCalled').and.returnValue(true);
                removeWasSuccessfull = true;

                scope.removeClient('peerId');

                expect(brokerService.getMapOfClientCalled).toHaveBeenCalled();
            });
            it('should set cope.clientList` to return value of `broker.getMapOfClientCalled`' , function() {
                spyOn(brokerService,'getMapOfClientCalled').and.returnValue({newList: ''});
                removeWasSuccessfull = true;

                scope.removeClient('peerId');

                expect(scope.clientList).toEqual({newList: ''});
            });

        });
        describe('connectClient' , function (){
            it('should call `connectToClient` with peerId' ,function (){
                phoneBookCTRL();
                spyOn(brokerService,'connectToClient').and.returnValue(true);

                scope.connectClient('peerId');

                expect(brokerService.connectToClient).toHaveBeenCalledWith('peerId');
            });
        });

    });
    describe('check event', function () {
        describe('peer:clientConnect', function () {
            beforeEach(function () {
                spyOn(brokerService,'getMapOfClientCalled').and.returnValue({NewclientList :''});
                phoneBookCTRL();
            });
            it('should call `broker.getMapOfClientCalled`', function () {
                scope.$broadcast('peer:clientConnect', {connectId: 'conId'});
                expect(brokerService.getMapOfClientCalled).toHaveBeenCalled();
            });
            it('should set ` $scope.clientList` to `{NewclientList :\'\'}`', function () {
                scope.$broadcast('peer:clientConnect', {connectId: 'conId'});
                expect(scope.clientList).toEqual({NewclientList :''});
            });
        });
    });


});
