'use strict';
describe('Modules: ', function() {
  var mm = window.mm;
  
  it('should exist in Minimum', function() {
    expect(Boolean(mm.module)).toBe(true);
    expect(Boolean(mm.app)).toBe(true);
    expect(Boolean(mm.resolve)).toBe(true);
  });
  

  it('should resolve a simple dependency', function(){
  	
  	var returnedModuleValue;

  	mm.module('firstModule', function(){
  		return 'firstModule';
  	});

  	mm.module('secondModule', ['firstModule'], function(firstModule){
  		return firstModule + ' secondModule';
  	});

  	mm.resolve('secondModule', function(secondModule){
  		returnedModuleValue = secondModule;
  	});

  	expect(returnedModuleValue).toMatch('firstModule secondModule');

  });

});