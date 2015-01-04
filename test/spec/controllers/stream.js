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
    });
    describe('check event', function () {
        beforeEach(function(){
            streamCTRL();
        });
        it('should set return value from `Stream.getClientStreamMap` to `$scope.streamMap`' , function(){
           spyOn(StreamService,'getClientStreamMap').and.returnValue({test:'data'});
            scope.$broadcast('stream:add', {});

            expect(scope.streamMap).toEqual({test:'data'});
        });

        it('should set return value from `Stream.getClientStreamMap` to `$scope.streamMap`' , function(){
            spyOn(StreamService,'getClientStreamMap').and.returnValue({test:'data'});
            scope.$broadcast('stream:delete', {});

            expect(scope.streamMap).toEqual({test:'data'});
        });


    });
});
