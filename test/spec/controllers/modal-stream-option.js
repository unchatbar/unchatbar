'use strict';

describe('Controller: modalStreamOption', function () {

    beforeEach(module('unchatbar'));

    var modalCTRL, scope, brokerService, modalInstance;

    beforeEach(inject(function ($controller, $rootScope, Broker) {
        scope = $rootScope.$new();
        brokerService = Broker;
        modalInstance = {
            close:function(){}
        };
        modalCTRL = function () {
            $controller('modalStreamOption', {
                $scope: scope,
                Broker: brokerService,
                $modalInstance : modalInstance

            });
        };
    }));

    describe('check methode', function () {
        beforeEach(function () {
            spyOn(brokerService, 'getPeerId').and.returnValue('');
            modalCTRL();
        });
        describe('videoCall' , function(){
            it('should call `$modalInstance.close` with audio/video true' , function(){
                spyOn(modalInstance,'close').and.returnValue(true);
                scope.videoCall();
                expect(modalInstance.close).toHaveBeenCalledWith({
                    video: true,
                    audio: true
                });
            });
        });
        describe('audiCall' , function(){
            it('should call `$modalInstance.close` with audio:true video: false' , function(){
                spyOn(modalInstance,'close').and.returnValue(true);
                scope.audiCall();
                expect(modalInstance.close).toHaveBeenCalledWith({
                    video: false,
                    audio: true
                });
            });
        });

    });


});
