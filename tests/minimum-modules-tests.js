'use strict';
describe('Modules: ', function() {
  var mm = window.mm;
  
  it('should exist in minimum', function() {
    expect(Boolean(mm.module)).toBe(true);
    expect(Boolean(mm.app)).toBe(true);
    expect(Boolean(mm.resolve)).toBe(true);
  });
  
});