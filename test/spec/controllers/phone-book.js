'use strict';

describe('Controller: phoneBook', function () {

    beforeEach(module('unchatbar'));

    var phoneBookCTRL, StreamService, stateParams, scope, PhoneBookService, MessageTextService, modal;

    beforeEach(inject(function ($controller, $rootScope, MessageText, PhoneBook, Stream, $modal) {
        PhoneBookService = PhoneBook;
        StreamService = Stream;
        stateParams = {};
        modal = $modal;
        scope = $rootScope.$new();
        MessageTextService = MessageText;
        phoneBookCTRL = function () {
            $controller('phoneBook', {
                $scope: scope,
                $modal: modal,
                $stateParams: stateParams,
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
            expect(scope.selectedUser).toBe('');
        });

        it('should set `$scope.selectedGroup` to empty string', function () {
            expect(scope.selectedGroup).toBe('');
        });
    });
    describe('check methode', function () {
        describe('init', function () {
            beforeEach(function () {
                phoneBookCTRL();
            });
            it('should call `$scope.getClientAndGroups`', function () {
                spyOn(scope, 'getClientAndGroups').and.returnValue(true);
                scope.init();
                expect(scope.getClientAndGroups).toHaveBeenCalled();
            });
            describe('$stateParams.peerId is set', function () {
                beforeEach(function () {
                    spyOn(scope, 'setClient').and.returnValue(true);
                    stateParams.peerId = 'testPeer';
                });
                it('should call `$scope.setClient` with `$stateParams.peerId`', function () {
                    scope.init();

                    expect(scope.setClient).toHaveBeenCalledWith('testPeer');
                });
            });
            describe('$stateParams.groupId is set', function () {
                beforeEach(function () {
                    spyOn(scope, 'setGroup').and.returnValue(true);
                    stateParams.groupId = 'testGroup';
                });
                it('should call `$scope.setGroup` with `$stateParams.groupId`', function () {
                    scope.init();

                    expect(scope.setGroup).toHaveBeenCalledWith('testGroup');
                });
            });

        });

        describe('createGroup', function () {
            beforeEach(function () {
                phoneBookCTRL();
                spyOn(PhoneBookService, 'addGroup').and.returnValue(true);
            });
            it('should call `PhoneBook.addGroup` with `$scope.PhoneBook.addGroup and empty array', function () {
                scope.form.newGroupName = 'newGroup';
                scope.createGroup();

                expect(PhoneBookService.addGroup).toHaveBeenCalledWith('newGroup', []);
            });
            it('should set `$scope.newGroupName` to empty string', function () {
                scope.form.newGroupName = 'test';
                scope.createGroup('peerId');

                expect(scope.form.newGroupName).toBe('');
            });
        });

        describe('getClientAndGroups', function () {
            beforeEach(function () {
                phoneBookCTRL();
                spyOn(PhoneBookService, 'getClientMap').and.returnValue(
                    {'peerIdUser': 'test'}
                );
                spyOn(PhoneBookService, 'getGroupMap').and.returnValue(
                    {'userGroupId': 'test'}
                );

            });
            it('should set `$scope.clientMap` to return value from `PhoneBook.getClientMap`', function () {
                scope.getClientAndGroups();

                expect(scope.clientMap).toEqual({'peerIdUser': 'test'});
            });

            it('should set `$scope.groupMap` to return value from `PhoneBook.getGroupMap`', function () {
                scope.getClientAndGroups();

                expect(scope.groupMap).toEqual({'userGroupId': 'test'});
            });

            it('should reset `$scope.selectedGroup` if not in grouList', function () {
                scope.selectedGroup = 'xx';
                spyOn(scope, 'setGroup').and.returnValue(true);
                scope.getClientAndGroups();

                expect(scope.setGroup).toHaveBeenCalled();
            });

            it('should reset `$scope.selectedGroup` if not in grouList', function () {
                scope.selectedUser = 'xx';
                spyOn(scope, 'setClient').and.returnValue(true);
                scope.getClientAndGroups();

                expect(scope.setClient).toHaveBeenCalled();
            });

        });

        describe('setClient', function () {
            beforeEach(function () {
                phoneBookCTRL();
                spyOn(MessageTextService, 'setRoom').and.returnValue(true);
                scope.clientMap = {'peerId': {label: 'test'}};
            });
            it('should call `MessageText.setRoom` with `user` and peerId', function () {
                scope.setClient('peerId');

                expect(MessageTextService.setRoom).toHaveBeenCalledWith('user', 'peerId');
            });
            it('should set `$scope.selectedGroup` to empty string', function () {
                scope.selectedGroup = 'test';
                scope.setClient('peerId');

                expect(scope.selectedGroup).toBe('');
            });

            it('should set `$scope.selectedUser` object from `$scope.clientMap` ', function () {
                scope.selectedGroup = 'test';
                scope.selectedUser = '';

                scope.setClient('peerId');

                expect(scope.selectedUser).toBe('peerId');
            });

        });

        describe('setGroup', function () {
            beforeEach(function () {
                phoneBookCTRL();
                scope.groupMap = {'roomId': {label: 'testRoom'}};

                spyOn(MessageTextService, 'setRoom').and.returnValue(true);

            });
            it('should call `MessageText.setRoom` with `user` and roomId', function () {
                scope.setGroup('roomId');

                expect(MessageTextService.setRoom).toHaveBeenCalledWith('group', 'roomId');
            });
            it('should set `$scope.selectedUser` to empty string', function () {
                scope.selectedUser = 'test';
                scope.setGroup('roomId');

                expect(scope.selectedUser).toBe('');
            });

            it('should set `$scope.selectedUser` object from `$scope.clientMap` ', function () {
                scope.setGroup('roomId');

                expect(scope.selectedGroup).toBe('roomId');
            });

        });


    });
    describe('check event', function () {
        describe('$stateChangeSuccess' , function(){
           it('should call `$scope.init` ' , function(){
               phoneBookCTRL();
               spyOn(scope,'init').and.returnValue();

               scope.$broadcast('$stateChangeSuccess');

               expect(scope.init).toHaveBeenCalled();
           });
        });

        describe('PhoneBookUpdate', function () {
            beforeEach(function () {
                phoneBookCTRL();
            });
            it('should add connection to  `$scope.clientList`', function () {
                spyOn(scope, 'getClientAndGroups').and.returnValue(true);
                scope.$broadcast('PhoneBookUpdate', {connection: {peer: 'conId', 'send': 'function'}});

                expect(scope.getClientAndGroups).toHaveBeenCalled();
            });

        });
    });


});
