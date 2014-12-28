'use strict';

describe('Controller: connectionCenter', function () {

    beforeEach(module('unchatbar'));

    var connectionCenterCTRL, scope;

    beforeEach(inject(function ($controller, $rootScope) {
        scope = $rootScope.$new();

        connectionCenterCTRL = function () {
            $controller('connectionCenter', {
                $scope: scope

            });
        };
    }));

    describe('check init', function () {
        beforeEach(function () {
            connectionCenterCTRL();
        });

        it('should set `scope.showPanel` to be empty string', function () {
            expect(scope.showPanel).toEqual('');
        });
    });

    describe('check methode', function () {
        beforeEach(function(){
            connectionCenterCTRL();
        });
        describe('setView', function () {
            it('should set `$scope.showPanel` to viewName' , function(){
                scope.setView('test');
                expect(scope.showPanel).toBe('test');
            });
            it('should broadcast `setView` with viewname' , function(){
                spyOn(scope,'$broadcast').and.returnValue(true);
                scope.setView('test');
                expect(scope.$broadcast).toHaveBeenCalledWith('setView',{name:'test'});
            });
        });
    });


});
