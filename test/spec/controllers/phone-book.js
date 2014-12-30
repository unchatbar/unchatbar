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

            });
            it('should set `$scope.clientMap` to return value from `PhoneBook.getClientMap`', function () {
                scope.getClientAndGroups();

                expect(scope.clientMap).toEqual({'peerIdUser':'test'});
            });

            it('should set `$scope.groupMap` to return value from `PhoneBook.getGroupMap`', function () {
                scope.getClientAndGroups();

                expect(scope.groupMap).toEqual({'userGroupId':'test'});
            });

            it('should reset `$scope.selectedGroup` if not in grouList', function () {
                scope.selectedGroup = 'xx';
                spyOn(scope,'setGroup').and.returnValue(true);
                scope.getClientAndGroups();

                expect(scope.setGroup).toHaveBeenCalled();
            });

            it('should reset `$scope.selectedGroup` if not in grouList', function () {
                scope.selectedUser = 'xx';
                spyOn(scope,'setClient').and.returnValue(true);
                scope.getClientAndGroups();

                expect(scope.setClient).toHaveBeenCalled();
            });

        });

        describe('setClient' , function (){
            beforeEach(function(){
                phoneBookCTRL();
                spyOn(MessageTextService,'setRoom').and.returnValue(true);
                scope.clientMap = {'peerId': {label: 'test'}};
            });
            it('should call `MessageText.setRoom` with `user` and peerId' , function() {
                scope.setClient('peerId');

                expect(MessageTextService.setRoom).toHaveBeenCalledWith('user','peerId');
            });
            it('should set `$scope.selectedGroup` to empty string' , function() {
                scope.selectedGroup = 'test';
                scope.setClient('peerId');

                expect(scope.selectedGroup).toBe('');
            });

            it('should set `$scope.selectedUser` object from `$scope.clientMap` ' , function() {
                scope.selectedGroup = 'test';
                scope.selectedUser = '';

                scope.setClient('peerId');

                expect(scope.selectedUser).toBe('peerId');
            });

        });

        describe('setGroup' , function (){
            beforeEach(function(){
                phoneBookCTRL();
                scope.groupMap = {'roomId': {label: 'testRoom'}};

                spyOn(MessageTextService,'setRoom').and.returnValue(true);

            });
            it('should call `MessageText.setRoom` with `user` and roomId' , function() {
                scope.setGroup('roomId');

                expect(MessageTextService.setRoom).toHaveBeenCalledWith('group','roomId');
            });
            it('should set `$scope.selectedUser` to empty string' , function() {
                scope.selectedUser = 'test';
                scope.setGroup('roomId');

                expect(scope.selectedUser).toBe('');
            });

            it('should set `$scope.selectedUser` object from `$scope.clientMap` ' , function() {
                scope.setGroup('roomId');

                expect(scope.selectedGroup).toBe('roomId');
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
