'use strict';

describe('Controller: profile', function () {

    beforeEach(module('unchatbar'));

    var streamCTRL, scope, StreamService;

    beforeEach(inject(function ($controller, $rootScope, Stream) {
        scope = $rootScope.$new();
        StreamService = Stream;
        streamCTRL = function () {
            $controller('stream', {
                $scope: scope,
                Stream : StreamService
            });
        };
    }));

    describe('check init', function () {
        it('should set `$scope.streamMap` to emty object' , function(){
            streamCTRL();
            expect(scope.streamMap).toEqual({});
        });

        it('should set `$scope.streamConferenceMap` to emty object' , function(){
            streamCTRL();
            expect(scope.streamConferenceMap).toEqual({});
        });
    });

    describe('closeOwnStream' , function(){
        beforeEach(function(){
            streamCTRL();
            spyOn(StreamService,'closeAllOwnMedia').and.returnValue(true);
        });
        it('should call `Stream.closeAllOwnMedia` when no conference and stream connection is active' , function(){
            scope.streamConferenceMap ={};
            scope.streamMap ={};
            scope.closeOwnStream();

            expect(StreamService.closeAllOwnMedia).toHaveBeenCalled();
        });
        it('should not call `Stream.closeAllOwnMedia` when conference and stream connection is active' , function(){
            scope.streamConferenceMap ={'connection' : 'data'};
            scope.streamMap ={'connection' : 'data'};
            scope.closeOwnStream();

            expect(StreamService.closeAllOwnMedia).not.toHaveBeenCalled();
        });
    });

    describe('check event', function () {
        beforeEach(function(){
            streamCTRL();
            spyOn(scope,'closeOwnStream').and.returnValue(true);
        });

        describe('StreamDeleteClient' , function(){
            it('should set return value from `Stream.getClientStreamMap` to `$scope.streamMap`' , function(){
                spyOn(StreamService,'getClientStreamMap').and.returnValue({test:'data'});
                scope.$broadcast('StreamDeleteClient', {});

                expect(scope.streamMap).toEqual({test:'data'});
            });
            it('should set return value from `Stream.getClientStreamMap` to `$scope.streamMap`' , function(){
                spyOn(StreamService,'getClientStreamMap').and.returnValue({test:'data'});
                scope.$broadcast('StreamDeleteClient', {});

                expect(scope.closeOwnStream).toHaveBeenCalled();
            });
        });
        describe('StreamAddClientToConference' , function() {
            it('should set return value from `Stream.getConferenceClientsMap` to `$scope.streamConferenceMap`', function () {
                spyOn(StreamService, 'getConferenceClientsMap').and.returnValue({test: 'data'});
                scope.$broadcast('StreamAddClientToConference', {});

                expect(scope.streamConferenceMap).toEqual({test: 'data'});
            });
        });

        describe('StreamDeleteClientToConference' , function() {
            it('should set return value from `Stream.getConferenceClientsMap` to `$scope.streamConferenceMap`', function () {
                spyOn(StreamService, 'getConferenceClientsMap').and.returnValue({test: 'data'});
                scope.$broadcast('StreamDeleteClientToConference', {});

                expect(scope.streamConferenceMap).toEqual({test: 'data'});
            });

            it('should set return value from `Stream.getConferenceClientsMap` to `$scope.streamConferenceMap`', function () {
                spyOn(StreamService, 'getConferenceClientsMap').and.returnValue({test: 'data'});
                scope.$broadcast('StreamDeleteClientToConference', {});

                expect(scope.closeOwnStream).toHaveBeenCalled();
            });
        });


    });
});
