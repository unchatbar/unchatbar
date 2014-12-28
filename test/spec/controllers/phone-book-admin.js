'use strict';

describe('Controller: phoneBook', function () {

    beforeEach(module('unchatbar'));

    var phoneBookCTRL, scope, PhoneBookService,MessageTextService;

    beforeEach(inject(function ($controller, $rootScope, MessageText, PhoneBook) {
        PhoneBookService = PhoneBook;
        scope = $rootScope.$new();
        MessageTextService = MessageText;
        phoneBookCTRL = function () {
            $controller('phoneBookAdmin', {
                $scope: scope,
                MessageText : MessageTextService,
                PhoneBook : PhoneBookService
            });
        };
    }));

    describe('check init', function () {
        beforeEach(function(){
            phoneBookCTRL();
        });

        it('should set `$scope.clientList` to empty object', function () {
            expect(scope.clientList).toEqual({});
        });

        it('should set `$scope.groupList` to empty object', function () {
            expect(scope.groupList).toEqual({});
        });

        it('should set `$scope.selectedUser` to empty string', function () {
            expect(scope.newGroupName).toBe('');
        });
    });
    describe('check methode', function () {
        describe('getClientAndGroups' , function() {
            beforeEach(function () {
                phoneBookCTRL();
                spyOn(PhoneBookService,'getClientMap').and.returnValue(
                    {'peerIdUser':'test'}
                );
                spyOn(PhoneBookService,'getGroupMap').and.returnValue(
                    {'userGroupId':'test'}
                );
                scope.getClientAndGroups();
            });
            it('should set `$scope.clientList` to return value from `PhoneBook.getClientMap`', function () {
                expect(scope.clientList).toEqual({'peerIdUser':'test'});
            });

            it('should set `$scope.groupList` to return value from `PhoneBook.getGroupMap`', function () {
                expect(scope.groupList).toEqual({'userGroupId':'test'});
            });

        });

        describe('removeClient' , function() {
            beforeEach(function () {
                phoneBookCTRL();

                spyOn(PhoneBookService,'getGroupMap').and.returnValue(
                    {'userGroupId':'test'}
                );
                scope.getClientAndGroups();
            });
            it('should set `$scope.clientList` to return value from `PhoneBook.getClientMap`', function () {
                spyOn(PhoneBookService,'removeClient').and.returnValue(true);

                scope.removeClient('userPeerId');

                expect(PhoneBookService.removeClient).toHaveBeenCalledWith('userPeerId');
            });

        });

        describe('createGroup' , function (){
            beforeEach(function(){
                phoneBookCTRL();
                spyOn(PhoneBookService,'addGroup').and.returnValue(true);
            });
            it('should call `PhoneBook.addGroup` with `$scope.PhoneBook.addGroup and empty array' , function() {
                scope.newGroupName = 'newGroup';
                scope.createGroup();

                expect(PhoneBookService.addGroup).toHaveBeenCalledWith('newGroup',[]);
            });
            it('should set `$scope.newGroupName` to empty string' , function() {
                scope.newGroupName = 'test';
                scope.createGroup('peerId');

                expect(scope.newGroupName).toBe('');
            });
        });

        describe('removeGroup' , function (){
            beforeEach(function(){
                phoneBookCTRL();

                spyOn(MessageTextService,'sendRemoveGroup').and.returnValue(true);
                spyOn(PhoneBookService,'removeGroup').and.returnValue(true);

            });
            it('should call `MessageText.sendRemoveGroup` with roomId' , function() {
                scope.removeGroup('roomId');
                expect(MessageTextService.sendRemoveGroup).toHaveBeenCalledWith('roomId');
            });

            it('should call `PhoneBook.removeGroup` with roomId' , function() {
                scope.removeGroup('roomId');
                expect(PhoneBookService.removeGroup).toHaveBeenCalledWith('roomId');
            });
        });
        describe('getUserName' , function () {
            beforeEach(function () {
                phoneBookCTRL();
                spyOn(PhoneBookService, 'getClient').and.returnValue({label:'test'});
            });
            it('should call `PhoneBook.getClient` with peerId' , function(){
                scope.getUserName('peerId');
                expect(PhoneBookService.getClient).toHaveBeenCalledWith('peerId');
            });
            it('should set return value `label` from PhoneBook.getClient' , function(){
                scope.getUserName('peerId');
                expect(scope.getUserName('peerId')).toBe('test');
            });
        });

    });
    describe('check event', function () {
        describe('phonebook:update', function () {
            beforeEach(function () {
                phoneBookCTRL();
            });
            it('should add connection to  `$scope.clientList`', function () {
                spyOn(scope,'getClientAndGroups').and.returnValue(true);
                scope.$broadcast('phonebook:update', {connection : {peer: 'conId','send': 'function'}});

                expect(scope.getClientAndGroups).toHaveBeenCalled();
            });
        });
    });


});
