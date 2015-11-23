'use strict';
describe('Modules: ', function() {
    var mm = window.mm;

    it('should exist in Minimum', function() {
        expect(Boolean(mm.module)).toBe(true);
        expect(Boolean(mm.app)).toBe(true);
        expect(Boolean(mm.resolve)).toBe(true);
        expect(Boolean(mm.resolveApp)).toBe(true);
    });


    it('should resolve a simple dependency', function() {
        var returnedModuleValue = null;
        mm.module('firstModule', function() {
            return 'firstModule';
        });
        
        mm.module('secondModule', ['firstModule'], function(firstModule) {
            return firstModule + ' secondModule';
        });

        mm.resolve('secondModule', function(secondModule) {
            returnedModuleValue = secondModule;
        });

        expect(returnedModuleValue).toMatch('firstModule secondModule');
    });

    it('should resolve a simple app dependency', function() {
        var returnedModuleValue = null;
        mm.module('firstModule2', function() {
            return 'firstModule';
        });

        mm.module('secondModule2', ['firstModule2'], function(firstModule) {
            return firstModule + ' secondModule';
        });

        mm.app(['secondModule2'], function(secondModule) {
            returnedModuleValue =  secondModule + ' app';
        });
        
        mm.resolveApp();

        expect(returnedModuleValue).toMatch('firstModule secondModule app');
    });

});
