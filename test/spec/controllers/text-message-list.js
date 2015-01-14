'use strict';

describe('Controller: connection', function () {

    beforeEach(module('unchatbar'));

    var connectionCTRL, scope, rootScope, ProfileService, PhoneBookService, MessageTextService;

    beforeEach(inject(function ($controller, $rootScope, MessageText, PhoneBook, Profile) {
        scope = $rootScope.$new();
        rootScope = $rootScope;
        MessageTextService = MessageText;
        PhoneBookService = PhoneBook;
        ProfileService = Profile;
        connectionCTRL = function () {
            $controller('textMessageList', {
                $scope: scope,
                $rootScope: rootScope,
                MessageText: MessageTextService,
                PhoneBook: PhoneBookService,
                Profile: ProfileService

            });
        };
    }));

    describe('check init', function () {
        it('should set `$scope.isOpen` to false , if connect.open is false', function () {
            connectionCTRL();

            expect(scope.isOpen).toBeFalsy();
        });

        it('should set `$scope.isRoomSelected` to false', function () {
            connectionCTRL();

            expect(scope.isRoomSelected).toBeFalsy();
        });

        it('should set `$scope.message` to empty string', function () {
            connectionCTRL();

            expect(scope.message).toBe('');
        });

        it('should set `$scope.messageList` to empty array', function () {
            connectionCTRL();

            expect(scope.messageList).toEqual([]);
        });
    });

    describe('check methode', function () {
        beforeEach(function () {
            connectionCTRL();
        });

        describe('send', function () {
            beforeEach(function () {
                spyOn(MessageTextService, 'send').and.returnValue(true);

            });
            it('should call `MessageText.send` width `$scope.message`', function () {
                scope.message = 'test';

                scope.send();

                expect(MessageTextService.send).toHaveBeenCalledWith('test');
            });
            it('should push `$scope.messageList` width `$scope.message` and property `own` true', function () {
                scope.message = 'test';
                spyOn(MessageTextService, 'getMessageList').and.returnValue(['newList']);

                scope.send();

                expect(scope.messageList).toEqual(['newList']);
            });

            it('should set `$scope.message` to empty string', function () {
                scope.message = 'test';
                spyOn(MessageTextService, 'getMessageList').and.returnValue(['newList']);

                scope.send();

                expect(scope.message).toBe('');
            });
        });

        describe('getProfileName', function () {
            it('should return label from `Profile.get` ', function () {
                spyOn(ProfileService, 'get').and.returnValue({label: 'test'});
                expect(scope.getProfileName()).toBe('test');
            });

        });

        describe('getUserName' , function () {
            beforeEach(function () {
                connectionCTRL();
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
        beforeEach(function () {
            connectionCTRL();
        });
        describe('MessageTextGetMessage', function () {
            describe('$scope.isOpen is true', function () {
                beforeEach(function () {
                    scope.isOpen = true;
                });

                it('should set `$scope.messageList` to value from MessageText.getMessageList', function () {
                    spyOn(MessageTextService, 'getMessageList').and.returnValue(['newList']);
                    scope.messageList = [];

                    scope.$broadcast('MessageTextGetMessage', {});

                    expect(scope.messageList).toEqual(['newList']);
                });
            });

        });

        describe('MessageTextSetRoom', function() {
            beforeEach(function(){
                spyOn(MessageTextService, 'getMessageList').and.returnValue(['newList']);
            });
            it('should set `$scope.messageList` to return value of `MessageText.getMessageList`' , function(){
                scope.isRoomSelected = false;

                scope.$broadcast('MessageTextSetRoom', {});

                expect(scope.messageList).toEqual(['newList']);
            });
        });


    });

});
