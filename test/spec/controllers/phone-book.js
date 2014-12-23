'use strict';

xdescribe('Controller: phoneBook', function () {

    beforeEach(module('unchatbar'));

    var phoneBookCTRL, scope, brokerService,localStorage;

    beforeEach(inject(function ($controller, $rootScope, $localStorage, Broker) {
        brokerService = Broker;
        scope = $rootScope.$new();
        localStorage = $localStorage;
        phoneBookCTRL = function () {
            $controller('phoneBook', {
                $scope: scope,
                $localStorage : localStorage,
                broker : brokerService
            });
        };
    }));

    describe('check init', function () {
        beforeEach(function () {
            spyOn(localStorage,'$default').and.returnValue({
                phoneBook: {
                    connections: {}
                }
            });
            phoneBookCTRL();
        });
        it('should call `$localStorage.$default` with phone Book object', function () {
            expect(localStorage.$default).toHaveBeenCalledWith({
                phoneBook: {
                    connections: {}
                }
            });
        });
        it('should have an empty username by init', function () {
            expect(scope.clientList).toEqual({});
        });
    });
    describe('check methode', function () {
        describe('removeClient' , function (){
            beforeEach(function(){
                phoneBookCTRL();
                scope.clientList = {'removePeer' : 'test','noRemove' : 'test'};
            });
            it('should remove key `removePeer`  from `scope.clientList `' , function() {
                scope.removeClient('removePeer');

                expect(scope.clientList ).toEqual({'noRemove' : 'test'});
            });


        });
        describe('connectClient' , function (){
            it('should call `connectToClient` with peerId' ,function (){
                phoneBookCTRL();
                spyOn(brokerService,'connect').and.returnValue(true);

                scope.connectClient('peerId');

                expect(brokerService.connect).toHaveBeenCalledWith('peerId');
            });
        });

    });
    describe('check event', function () {
        describe('peer:clientConnect', function () {
            beforeEach(function () {
                phoneBookCTRL();
                scope.clientList = {};
            });
            it('should add connection to  `$scope.clientList`', function () {
                scope.$broadcast('client:connect', {connection : {peer: 'conId','send': 'function'}});
                expect(scope.clientList).toEqual({conId: {}});
            });
        });

        describe('client:sendProfile', function () {
            beforeEach(function () {
                phoneBookCTRL();
                scope.clientList = {};
            });
            it('should update clientList with profile', function () {
                scope.clientList = {'test' : {}};
                scope.$broadcast('client:sendProfile',  {peer: 'test','profile': {name:'test'}});
                expect(scope.clientList).toEqual({test : {name:'test'}});
            });

        });
    });


});
