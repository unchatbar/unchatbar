'use strict';

describe('Controller: unChat', function () {

    beforeEach(module('unchatbar'));

    var chatCTRL, stateParams, scope, PhoneBookService, BrokerService;

    beforeEach(inject(function ($controller, $rootScope, Broker, PhoneBook) {

        PhoneBookService = PhoneBook;
        stateParams = {};
        BrokerService = Broker;
        scope = $rootScope.$new();

        chatCTRL = function () {
            $controller('unChat', {
                $scope: scope,
                $stateParams: stateParams,
                Broker: BrokerService,
                PhoneBook: PhoneBookService

            });
        };
    }));

    describe('check methode', function () {
        beforeEach(function () {
            chatCTRL();
        });
        describe('init', function () {
            beforeEach(function () {
                spyOn(scope, 'getChannel').and.returnValue(true);
                spyOn(scope, 'getClientAllClients').and.returnValue(true);
                spyOn(scope, 'getClientsFromChannel').and.returnValue(true);
            });
            it('should call `$scope.getChannel`', function () {
                scope.init();
                expect(scope.getChannel).toHaveBeenCalled();
            });

            it('should call `$scope.getClientAllClients`', function () {
                scope.init();
                expect(scope.getClientAllClients).toHaveBeenCalled();
            });

            it('should call `$scope.getClientsFromChannel`', function () {
                scope.init();
                expect(scope.getClientsFromChannel).toHaveBeenCalled();
            });
        });
        describe('getChannel', function () {
            describe('group channel', function () {
                it('should set `$scope.channel` to group id', function () {
                    stateParams.groupId = 'testGroupId';

                    scope.getChannel();

                    expect(scope.channel).toBe('testGroupId');

                });
            });
            describe('user channel', function () {
                it('should set `$scope.channel` to group id', function () {
                    stateParams.clientId = 'testClientId';
                    spyOn(BrokerService, 'getPeerId').and.returnValue('ownPeerId');

                    scope.getChannel();

                    expect(scope.channel).toBe('ownPeerIdtestClientId');

                });
            });
        });

        describe('getClientAllClients', function () {
            beforeEach(function () {
                spyOn(PhoneBookService, 'getClientMap').and.returnValue({users: {id: 'userId'}});
            });
            it('should call `PhoneBook.getClientMap`', function () {
                scope.getClientAllClients();
                expect(PhoneBookService.getClientMap).toHaveBeenCalled();
            });

            it('should set return value from  `PhoneBook.getClientMap` to `$scope.clientMap`', function () {
                scope.getClientAllClients();
                expect(scope.clientMap).toEqual({users: {id: 'userId'}});
            });
        });

        describe('getClientsFromChannel', function () {
            describe('group channel', function () {
                beforeEach(function () {
                    stateParams.groupId = 'testGroupId';
                    spyOn(PhoneBookService, 'getGroup').and.returnValue({users: {id: 'userId'}});
                });
                it('should call `PhoneBook.getGroup` with groupId', function () {
                    scope.getClientsFromChannel();
                    expect(PhoneBookService.getGroup).toHaveBeenCalledWith('testGroupId');
                });
                it('should set `$scope.clientFromChannelMap` return users from PhoneBook.getGroup`', function () {
                    scope.getClientsFromChannel();

                    expect(scope.clientFromChannelMap).toEqual({id: 'userId'});

                });
            });
            describe('user channel', function () {
                beforeEach(function () {
                    stateParams.clientId = 'testClientId';
                    spyOn(PhoneBookService, 'getClient').and.returnValue({clientA: {id: 'userId'}});
                });
                it('should call `PhoneBook.getClient` with clientId', function () {
                    scope.getClientsFromChannel();
                    expect(PhoneBookService.getClient).toHaveBeenCalledWith('testClientId');
                });

                it('should set `$scope.clientFromChannelMap` return users from PhoneBook.getGroup`', function () {
                    scope.getClientsFromChannel();

                    expect(scope.clientFromChannelMap).toEqual([{clientA: {id: 'userId'}}]);
                });
            });
        });

    });

    describe('check events' , function(){
        beforeEach(function () {
            chatCTRL();
        });
        describe('PhoneBookUpdate', function(){
            it('should call `$scope.init`' , function(){
               spyOn(scope,'init').and.returnValue(true);
                scope.$broadcast('PhoneBookUpdate');
                scope.$apply();

                expect(scope.init).toHaveBeenCalled();
            });
        });

        describe('$stateChangeSuccess', function(){
            it('should call `$scope.init`' , function(){
                spyOn(scope,'init').and.returnValue(true);
                scope.$broadcast('$stateChangeSuccess');
                scope.$apply();

                expect(scope.init).toHaveBeenCalled();
            });
        });
    });
});