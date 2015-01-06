'use strict';

describe('Serivce: Profile', function () {
    var ProfileService, rootScope, sessionStorage, ConnectionService;
    beforeEach(module('unchatbar'));


    beforeEach(inject(function ($rootScope, $sessionStorage, Connection, Profile ) {
        rootScope = $rootScope;
        ProfileService = Profile;
        sessionStorage = $sessionStorage;
        ConnectionService = Connection;
    }));

    describe('check methode', function () {

        describe('init', function () {
            beforeEach(function () {
                spyOn(ProfileService, '_initStorage').and.returnValue(true);
                ProfileService.init();
            });
            it('should call PhoneBook._initStorage', function () {
                expect(ProfileService._initStorage).toHaveBeenCalled();
            });
            describe('check listener `ConnectionOpen`' , function(){
               it('should call `Connection.send` with peerId ,action `profile` and userprofile' , function(){
                 spyOn(ProfileService,'get').and.returnValue('profile');
                 spyOn(ConnectionService,'send').and.returnValue(true);
                 rootScope.$broadcast('ConnectionOpen',{peerId: 'peerId'});

                 expect(ConnectionService.send).toHaveBeenCalledWith('peerId',{action:'profile' ,profile :'profile'});

               });
            });
        });

        describe('_initStorage', function () {
            var sessionStorage = {};
            beforeEach(inject(function ($sessionStorage) {
                sessionStorage = $sessionStorage;
                spyOn(sessionStorage, '$default').and.returnValue({test: 'data'});
                ProfileService._initStorage();
            }));
            it('should call `$sessionStorage.$default` with object', function () {
                expect(sessionStorage.$default).toHaveBeenCalledWith({
                    profile: {}
                });
            });
            it('should set  `MessageTextService._storage` return value from `$sessionStorage.$default`', function () {
                expect(ProfileService._storageProfile).toEqual({test: 'data'});
            });
        });

        describe('get' , function(){
            it('should return profile from storage' , function(){
                ProfileService._storageProfile.profile = 'test';
                expect(ProfileService.get()).toBe('test');
            });
        });

        describe('set' , function(){
            it('should set data to storage' , function(){
                ProfileService._storageProfile.profile = '';
                ProfileService.set('test');
                expect(ProfileService._storageProfile.profile).toBe('test');
            });
            it('should call `profile._sendProfileUpdate`' , function(){
                spyOn(ProfileService,'_sendProfileUpdate').and.returnValue(true);
                ProfileService.set('test');
                expect(ProfileService._sendProfileUpdate).toHaveBeenCalled();
            });
        });

        describe('_sendProfileUpdate' , function(){
            beforeEach(function(){
                spyOn(ConnectionService,'getMap').and.returnValue({'userId' : 'data'});
                spyOn(ConnectionService,'send').and.returnValue(true);
                spyOn(ProfileService,'get').and.returnValue('profile');

            });
            it('should call `Connection.getMap`' , function(){
                ProfileService._sendProfileUpdate();

                expect(ConnectionService.getMap).toHaveBeenCalled();
            });

            it('should call `Connection.send` with userid and profile' , function(){
                ProfileService._sendProfileUpdate();

                expect(ConnectionService.send).toHaveBeenCalledWith('userId',{action:'profile' ,profile :'profile'});
            });
        });

    });
});