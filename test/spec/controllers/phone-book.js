'use strict';

describe('Controller: phoneBook', function () {

    beforeEach(module('unchatbar'));

    var phoneBookCTRL, scope, PhoneBookService,MessageTextService;

    beforeEach(inject(function ($controller, $rootScope, MessageText, PhoneBook) {
        PhoneBookService = PhoneBook;
        scope = $rootScope.$new();
        MessageTextService = MessageText;
        phoneBookCTRL = function () {
            $controller('phoneBook', {
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
            it('should set `$scope.clientMap` to return value from `PhoneBook.getClientMap`', function () {
                expect(scope.clientMap).toEqual({'peerIdUser':'test'});
            });

            it('should set `$scope.groupMap` to return value from `PhoneBook.getGroupMap`', function () {
                expect(scope.groupMap).toEqual({'userGroupId':'test'});
            });

        });

        describe('selectClient' , function (){
            beforeEach(function(){
                phoneBookCTRL();
                spyOn(MessageTextService,'setRoom').and.returnValue(true);
                scope.clientMap = {'peerId': {label: 'test'}};
            });
            it('should call `MessageText.setRoom` with `user` and peerId' , function() {
                scope.selectClient('peerId');

                expect(MessageTextService.setRoom).toHaveBeenCalledWith('user','peerId');
            });
            it('should set `$scope.selectedGroup` to empty string' , function() {
                scope.selectedGroup = 'test';
                scope.selectClient('peerId');

                expect(scope.selectedGroup).toBe('');
            });

            it('should set `$scope.selectedUser` object from `$scope.clientMap` ' , function() {
                scope.selectedGroup = 'test';
                scope.selectedUser = '';

                scope.selectClient('peerId');

                expect(scope.selectedUser).toBe('test');
            });

        });

        describe('selectGroup' , function (){
            beforeEach(function(){
                phoneBookCTRL();
                scope.groupMap = {'roomId': {label: 'testRoom'}};

                spyOn(MessageTextService,'setRoom').and.returnValue(true);

            });
            it('should call `MessageText.setRoom` with `user` and roomId' , function() {
                scope.selectGroup('roomId');

                expect(MessageTextService.setRoom).toHaveBeenCalledWith('group','roomId');
            });
            it('should set `$scope.selectedUser` to empty string' , function() {
                scope.selectedUser = 'test';
                scope.selectGroup('roomId');

                expect(scope.selectedUser).toBe('');
            });

            it('should set `$scope.selectedUser` object from `$scope.clientMap` ' , function() {
                scope.selectGroup('roomId');

                expect(scope.selectedGroup).toBe('testRoom');
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
