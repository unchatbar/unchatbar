'use strict';

describe('Serivce: phoneBook', function () {
    var BrokerService, rootScope, sessionStorage, PhoneBookService;
    beforeEach(module('unchatbar'));


    beforeEach(inject(function ($rootScope, MessageText, Broker, $sessionStorage, PhoneBook ) {
        rootScope = $rootScope;
        BrokerService = Broker;
        sessionStorage = $sessionStorage;
        PhoneBookService = PhoneBook;
    }));

    describe('check methode', function () {

        describe('init', function () {
            beforeEach(function () {
                spyOn(PhoneBookService, '_initStorage').and.returnValue(true);
                PhoneBookService.init();
            });
            it('should call PhoneBook._initStorage', function () {
                expect(PhoneBookService._initStorage).toHaveBeenCalled();
            });
            describe('check listener `BrokerPeerConnection`', function () {
                beforeEach(function () {
                    spyOn(PhoneBookService, 'addClient').and.returnValue(true);
                    spyOn(PhoneBookService, 'getClientMap').and.returnValue({'peerId': true});
                });
                it('should call `PhoneBook.getClientMap`', function () {
                    rootScope.$broadcast('BrokerPeerConnection', {connection: {peer: 'xx'}});
                    rootScope.$apply();
                    expect(PhoneBookService.getClientMap).toHaveBeenCalled();
                });

                describe('user is not in phonebook', function () {
                    it('should call `PhoneBook.addClient`', function () {
                        rootScope.$broadcast('BrokerPeerConnection', {connection: {peer: 'newPeerId'}});
                        expect(PhoneBookService.addClient).toHaveBeenCalledWith('newPeerId', 'newPeerId');
                    });
                });

                describe('user is in phonebook', function () {
                    it('should call `PhoneBook.addClient`', function () {
                        rootScope.$broadcast('BrokerPeerConnection', {connection: {peer: 'peerId'}});
                        expect(PhoneBookService.addClient).not.toHaveBeenCalled();
                    });
                });
            });

            describe('check listener `BrokerPeerOpen`', function () {
                beforeEach(function () {
                    spyOn(PhoneBookService, 'getClientMap').and.returnValue([{id: 'userId'}]);
                    spyOn(BrokerService, 'connect').and.returnValue(true);
                });
                it('should call `PhoneBook.getClientMap`', function () {
                    rootScope.$broadcast('BrokerPeerOpen');
                    expect(PhoneBookService.getClientMap).toHaveBeenCalled();
                });
                it('should call `Broker.connect` with user id', function () {
                    rootScope.$broadcast('BrokerPeerOpen');
                    expect(BrokerService.connect).toHaveBeenCalledWith('userId');
                });
            });

            describe('check listener `connection:getMessage:profile`', function () {
                it('should call `PhoneBook.updateClient` with peerId and label from profile', function () {
                    spyOn(PhoneBookService, 'updateClient').and.returnValue(true);
                    rootScope.$broadcast('connection:getMessage:profile',
                        {
                            peerId: 'peerId',
                            message: {
                                profile: {
                                    label: 'testLabel'
                                }
                            }
                        });
                    expect(PhoneBookService.updateClient).toHaveBeenCalledWith('peerId', 'testLabel');
                });
            });

            describe('check listener `connection:getMessage:removeGroup`', function () {
                it('should call `PhoneBook.removeGroup` with peerId and label from profile', function () {
                    spyOn(PhoneBookService, 'removeGroup').and.returnValue(true);
                    rootScope.$broadcast('connection:getMessage:removeGroup',
                        {
                            message:{id: 'peerId'}
                        });
                    expect(PhoneBookService.removeGroup).toHaveBeenCalledWith('peerId');
                });
            });

        });

        describe('_initStorage', function () {
            var sessionStorage = {};
            beforeEach(inject(function ($sessionStorage) {
                sessionStorage = $sessionStorage;
                spyOn(sessionStorage, '$default').and.returnValue({phoneBook: {test: 'data'}});
                PhoneBookService._initStorage();
            }));
            it('should call `$sessionStorage.$default` with object', function () {
                expect(sessionStorage.$default).toHaveBeenCalledWith({
                    phoneBook: {
                        user: {},
                        groups: {}
                    }
                });
            });
            it('should set  `MessageTextService._storage` return value from `$sessionStorage.$default`', function () {
                expect(PhoneBookService._storagePhoneBook).toEqual({test: 'data'});
            });
        });

        describe('addClient', function () {
            it('should set id and label to `_storagePhoneBook.user`' , function(){
                PhoneBookService._storagePhoneBook.user = {};

                PhoneBookService.addClient('peerId','testLabel');

                expect(PhoneBookService._storagePhoneBook.user).toEqual(
                    {
                        peerId : {
                            id: 'peerId',
                            label : 'testLabel'
                        }
                    }
                );
            });
            it('should call `PhoneBook._sendUpdateEvent`' , function(){
               spyOn(PhoneBookService,'_sendUpdateEvent').and.returnValue(true);

               PhoneBookService.addClient('peerId','testLabel');

               expect(PhoneBookService._sendUpdateEvent).toHaveBeenCalled();
            });
        });

        describe('updateClient', function () {
            it('should change  label from `_storagePhoneBook.user`' , function(){
                PhoneBookService._storagePhoneBook.user = {'peerId' : {label: 'changeMe'}};

                PhoneBookService.updateClient('peerId','testLabel');

                expect(PhoneBookService._storagePhoneBook.user).toEqual(
                    {
                        peerId : {
                            label : 'testLabel',
                            id: 'peerId'
                        }
                    }
                );
            });
            it('should call `PhoneBook._sendUpdateEvent`' , function(){
                spyOn(PhoneBookService,'_sendUpdateEvent').and.returnValue(true);

                PhoneBookService.updateClient('peerId','testLabel');

                expect(PhoneBookService._sendUpdateEvent).toHaveBeenCalled();
            });
        });

        describe('getClient', function(){
            it('should return single user `_storagePhoneBook.user`' , function(){
                PhoneBookService._storagePhoneBook.user = {'testId' : 'xx'};
                expect(PhoneBookService.getClient('testId')).toBe('xx');
            });
        });

        describe('getClientMap', function(){
            it('should return all users from `_storagePhoneBook.user`' , function(){
                PhoneBookService._storagePhoneBook.user = {'testId' : 'xx'};
                expect(PhoneBookService.getClientMap()).toEqual({'testId' : 'xx'});
            });
        });

        describe('removeClient', function(){
            it('should remove single user fro `_storagePhoneBook.user`' , function(){
                PhoneBookService._storagePhoneBook.user = {'testId' : 'xx',testIdNoRemove : 'aa'};

                PhoneBookService.removeClient('testId');

                expect(PhoneBookService._storagePhoneBook.user).toEqual({testIdNoRemove : 'aa'});
            });

            it('should call `PhoneBook._sendUpdateEvent`' , function(){
                spyOn(PhoneBookService,'_sendUpdateEvent').and.returnValue(true);

                PhoneBookService.removeClient('peerId');

                expect(PhoneBookService._sendUpdateEvent).toHaveBeenCalled();
            });
        });

        describe('copyGroupFromPartner', function () {
            it('should set id and label to `_storagePhoneBook.user`' , function(){
                PhoneBookService._storagePhoneBook.groups = {};

                PhoneBookService.copyGroupFromPartner('peerId',{label:'test'});

                expect(PhoneBookService._storagePhoneBook.groups).toEqual(
                    {
                        peerId : {
                            editable: false,
                            label : 'test'
                        }
                    }
                );
            });
            it('should call `PhoneBook._sendUpdateEvent`' , function(){
                spyOn(PhoneBookService,'_sendUpdateEvent').and.returnValue(true);

                PhoneBookService.copyGroupFromPartner('peerId',{});

                expect(PhoneBookService._sendUpdateEvent).toHaveBeenCalled();
            });
        });

        describe('copyGroupFromPartner', function () {
            describe('client has no peer id' , function () {
                beforeEach(function(){
                    spyOn(BrokerService,'getPeerId').and.returnValue('');
                    it('it should store nothing' , function(){
                        PhoneBookService._storagePhoneBook.groups = {};

                        PhoneBookService.addGroup('groupName',['users']);

                        expect(PhoneBookService._storagePhoneBook.groups).toEqual({});
                    });
                });
            });
            describe('client has peer id' , function () {
                beforeEach(function(){
                    spyOn(BrokerService,'getPeerId').and.returnValue('peerId');
                    spyOn(PhoneBookService,'createNewGroupId').and.returnValue('groupId');
                });

                it('should set id and label to `_storagePhoneBook.user`' , function(){
                    PhoneBookService._storagePhoneBook.groups = {};

                    PhoneBookService.addGroup('groupName',['users']);

                    expect(PhoneBookService._storagePhoneBook.groups).toEqual(
                        {
                            groupId : {
                                label: 'groupName',
                                users: ['users'],
                                owner : 'peerId',
                                editable: true,
                                id: 'groupId'
                            }
                        }
                    );
                });

                it('should call `PhoneBook._sendUpdateEvent`' , function(){
                    spyOn(PhoneBookService,'_sendUpdateEvent').and.returnValue(true);

                    PhoneBookService.addGroup('groupName',['users']);

                    expect(PhoneBookService._sendUpdateEvent).toHaveBeenCalled();
                });
            });

        });

        describe('getGroup', function(){
            it('should return single group `_storagePhoneBook.group`' , function(){
                PhoneBookService._storagePhoneBook.groups = {'testId' : 'xx'};
                expect(PhoneBookService.getGroup('testId')).toBe('xx');
            });
        });

        describe('removeGroup', function(){
            it('should remove single user from `_storagePhoneBook.group`' , function(){
                PhoneBookService._storagePhoneBook.groups = {'testId' : 'xx',testIdNoRemove : 'aa'};

                PhoneBookService.removeGroup('testId');

                expect(PhoneBookService._storagePhoneBook.groups).toEqual({testIdNoRemove : 'aa'});
            });

            it('should call `PhoneBook._sendUpdateEvent`' , function(){
                spyOn(PhoneBookService,'_sendUpdateEvent').and.returnValue(true);

                PhoneBookService.removeGroup('peerId');

                expect(PhoneBookService._sendUpdateEvent).toHaveBeenCalled();
            });
        });

        describe('getGroupMap', function(){
            it('should return all groups from `_storagePhoneBook.groups`' , function(){
                PhoneBookService._storagePhoneBook.groups = {'testId' : 'xx'};
                expect(PhoneBookService.getGroupMap()).toEqual({'testId' : 'xx'});
            });
        });

        describe('_sendUpdateEvent', function(){
            it('should call `$rootScope.$broadcast` with `PhoneBookUpdate` ' , function(){
                spyOn(rootScope,'$broadcast').and.returnValue(true);
                PhoneBookService._sendUpdateEvent();

                expect(rootScope.$broadcast).toHaveBeenCalledWith('PhoneBookUpdate', {});

            });
        });
    });
});