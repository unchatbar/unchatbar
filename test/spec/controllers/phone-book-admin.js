'use strict';

describe('Controller: phoneBook', function () {

    beforeEach(module('unchatbar'));

    var phoneBookCTRL, scope, stateParams, StreamService, PhoneBookService, MessageTextService, modal, state;

    beforeEach(inject(function ($controller, $rootScope, $modal,$state, MessageText, PhoneBook, Stream) {
        PhoneBookService = PhoneBook;
        scope = $rootScope.$new();
        StreamService = Stream;
        modal = $modal;
        state = $state;
        stateParams = {};
        MessageTextService = MessageText;
        phoneBookCTRL = function () {
            $controller('phoneBookAdmin', {
                $scope: scope,
                $modal: modal,
                $state: state,
                $stateParams : stateParams,
                MessageText: MessageTextService,
                PhoneBook: PhoneBookService
            });
        };
    }));

    describe('check init', function () {
        beforeEach(function () {
            phoneBookCTRL();
        });

        it('should set `$scope.clientMap` to empty object', function () {
            expect(scope.clientMap).toEqual({});
        });

        it('should set `$scope.groupMap` to empty object', function () {
            expect(scope.groupMap).toEqual({});
        });

        it('should set `$scope.selectedUser` to empty string', function () {
            expect(scope.newGroupName).toBe('');
        });
    });
    describe('check methode', function () {
        describe('getClientAndGroups', function () {
            beforeEach(function () {
                stateParams = {
                    peerId : 'testPeerId',
                    groupId : 'testGroupId'
                };
                phoneBookCTRL();
                spyOn(PhoneBookService, 'getClientMap').and.returnValue(
                    {'peerIdUser': 'test'}
                );
                spyOn(PhoneBookService, 'getGroupMap').and.returnValue(
                    {'userGroupId': 'test'}
                );

                scope.getClientAndGroups();
            });
            it('should set `$scope.clientMap` to return value from `PhoneBook.getClientMap`', function () {
                expect(scope.clientMap).toEqual({'peerIdUser': 'test'});
            });

            it('should set `$scope.groupMap` to return value from `PhoneBook.getGroupMap`', function () {
                expect(scope.groupMap).toEqual({'userGroupId': 'test'});
            });

            it('should set `$stateParams.peerId` to `$scope.selectedUser`', function () {
                expect(scope.selectedUser).toBe('testPeerId');
            });

            it('should set `$stateParams.groupId` to `$scope.selectedGroup`', function () {
                expect(scope.selectedGroup).toBe('testGroupId');
            });

        });

        describe('removeClient', function () {
            beforeEach(function () {
                phoneBookCTRL();
                spyOn(state,'go').and.returnValue(true);
                spyOn(PhoneBookService, 'removeClient').and.returnValue(true);
                spyOn(PhoneBookService, 'getGroupMap').and.returnValue(
                    {'userGroupId': 'test'}
                );
                scope.getClientAndGroups();
            });
            it('should call `PhoneBookService.removeClient` with peerId', function () {
                scope.removeClient('userPeerId');

                expect(PhoneBookService.removeClient).toHaveBeenCalledWith('userPeerId');
            });

            it('should call `$state.go` with `chat`' , function(){
                scope.removeClient('userPeerId');

                expect(state.go).toHaveBeenCalledWith('chat');
            });


        });

        describe('removeGroup', function () {
            beforeEach(function () {
                phoneBookCTRL();
                spyOn(state,'go').and.returnValue(true);
                spyOn(MessageTextService, 'sendRemoveGroup').and.returnValue(true);
                spyOn(PhoneBookService, 'removeGroup').and.returnValue(true);

            });
            it('should call `MessageText.sendRemoveGroup` with roomId', function () {
                scope.removeGroup('roomId');
                expect(MessageTextService.sendRemoveGroup).toHaveBeenCalledWith('roomId');
            });

            it('should call `PhoneBook.removeGroup` with roomId', function () {
                scope.removeGroup('roomId');
                expect(PhoneBookService.removeGroup).toHaveBeenCalledWith('roomId');
            });

            it('should call `$state.go` with `chat`' , function(){
                scope.removeClient('userPeerId');

                expect(state.go).toHaveBeenCalledWith('chat');
            });
        });

        describe('getUserName', function () {
            beforeEach(function () {
                phoneBookCTRL();
                spyOn(PhoneBookService, 'getClient').and.returnValue({label: 'test'});
            });
            it('should call `PhoneBook.getClient` with peerId', function () {
                scope.getUserName('peerId');
                expect(PhoneBookService.getClient).toHaveBeenCalledWith('peerId');
            });
            it('should set return value `label` from PhoneBook.getClient', function () {
                scope.getUserName('peerId');
                expect(scope.getUserName('peerId')).toBe('test');
            });
        });

        describe('streamToClient', function () {
            it('should call `modal.open`', inject(function ($q) {
                spyOn(modal, 'open').and.callFake(function () {
                    var defer = $q.defer();
                    return {result: defer.promise};
                });

                phoneBookCTRL();
                scope.streamToClient('peerId');
                expect(modal.open).toHaveBeenCalled();
            }));
            describe('after $modal.open', function () {
                beforeEach(inject(function ($q) {
                    spyOn(modal, 'open').and.callFake(function () {
                        var defer = $q.defer();
                        defer.resolve('streamOption');
                        return {result: defer.promise};
                    });
                }));

                it('should call `Stream.callUser` with peerId', function () {
                    spyOn(StreamService, 'callUser').and.returnValue(true);
                    phoneBookCTRL();

                    scope.streamToClient('peerId');
                    scope.$digest();
                    expect(StreamService.callUser).toHaveBeenCalledWith('peerId', 'streamOption');
                });
            });
        });

        describe('streamToConference', function () {
            it('should call `modal.open`', inject(function ($q) {
                spyOn(modal, 'open').and.callFake(function () {
                    var defer = $q.defer();
                    return {result: defer.promise};
                });

                phoneBookCTRL();
                scope.streamToConference('peerId');
                expect(modal.open).toHaveBeenCalled();
            }));
            describe('after $modal.open', function () {
                beforeEach(inject(function ($q) {
                    spyOn(modal, 'open').and.callFake(function () {
                        var defer = $q.defer();
                        defer.resolve('streamOption');
                        return {result: defer.promise};
                    });
                }));

                it('should call `Stream.callUser` with peerId', function () {
                    spyOn(StreamService, 'callConference').and.returnValue(true);
                    phoneBookCTRL();

                    scope.streamToConference('peerId');
                    scope.$digest();
                    expect(StreamService.callConference).toHaveBeenCalledWith('peerId', 'streamOption');
                });
            });
        });
    });


    describe('check event', function () {

        describe('$stateChangeSuccess' , function(){
            it('should set `$scope.selectedUser` from `$stateParams.peerId` ' , function(){
                phoneBookCTRL();
                stateParams.peerId = 'testPeerId';

                scope.$broadcast('$stateChangeSuccess');

                expect(scope.selectedUser).toBe('testPeerId');
            });

            it('should set `$scope.selectedGroup` from `$stateParams.groupId` ' , function(){
                phoneBookCTRL();
                stateParams.groupId = 'testGroupId';

                scope.$broadcast('$stateChangeSuccess');

                expect(scope.selectedGroup).toBe('testGroupId');
            });
        });

        describe('PhoneBookUpdate', function () {
            beforeEach(function () {
                phoneBookCTRL();
            });
            it('should add connection to  `$scope.clientMap`', function () {
                spyOn(scope, 'getClientAndGroups').and.returnValue(true);
                scope.$broadcast('PhoneBookUpdate', {connection: {peer: 'conId', 'send': 'function'}});

                expect(scope.getClientAndGroups).toHaveBeenCalled();
            });
        });
    });


});
