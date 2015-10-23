'use strict';
describe('Callbacks: ', function() {
	
	//setup variables to test
	var mm = window.mm,
		callback1,
  		listener = { 
  			name : 'Listener Addams',
  			onSomething : function(){
  				return this.name;
  			},
  			onSomeError : function(){
  				return this.uwuwi.duwqyuwq; //to throws an error
  			}
		},
		caller = {
			name: 'Caller McFly',
			fireFromThis : function(arg){
				callback1.fire(this, arg);
			},
			fireAnon : function(){
				callback1.fire();
			},
			fireWithOneParam : function(arg){
				callback1.fire(null, arg);
			},
		};

	beforeEach(function() {
    	callback1 = mm.callbacks('test1');
  	});

	afterEach(function() {
		callback1 = null;
	});

	it('should exist in Minimum', function() {
		expect(Boolean(mm.callbacks)).toBe(true);
	});

	it('should create a Callback and fire', function(){

		spyOn(listener, 'onSomething').and.callThrough();
		
		callback1.add(listener.onSomething);
		caller.fireAnon();

		expect(listener.onSomething).toHaveBeenCalled();
		expect(listener.onSomething.calls.first().returnValue).toBeUndefined();
		listener.onSomething.calls.reset();
	});

	it('should create a Callback and fire binding to this', function(){
			var fireArgument = 'hola';

		spyOn(listener, 'onSomething').and.callThrough();
		
		callback1.add(listener.onSomething);
		caller.fireFromThis(fireArgument);

		expect(listener.onSomething).toHaveBeenCalledWith(fireArgument);
		expect(listener.onSomething.calls.first().returnValue).toEqual(caller.name);
		listener.onSomething.calls.reset();
	});

	it('should create a callback and fire with one parameter', function(){
			var fireArgument = 'hola';

		spyOn(listener, 'onSomething').and.callThrough();
		
		callback1.add(listener.onSomething);
		caller.fireWithOneParam(fireArgument);

		expect(listener.onSomething).toHaveBeenCalledWith(null, fireArgument);
		expect(listener.onSomething.calls.first().returnValue).toBeUndefined();
		listener.onSomething.calls.reset();
	});

	it('a Callback should add functions and remove them', function(){

		spyOn(listener, 'onSomething').and.callThrough();
		
		callback1.add(listener.onSomething);
		callback1.empty(); //test empty
		caller.fireAnon();
		expect(listener.onSomething).not.toHaveBeenCalled();
		listener.onSomething.calls.reset();

		callback1.add(listener.onSomething);
		callback1.remove(listener.onSomething); //test remove
		caller.fireAnon();
		expect(listener.onSomething).not.toHaveBeenCalled();
		listener.onSomething.calls.reset();
	});

	it('a listener attached method to Callbacks, should not bubble up errors', function(){

		spyOn(listener, 'onSomething').and.callThrough();
		spyOn(listener, 'onSomeError').and.callThrough();

		callback1.add(listener.onSomeError);
		callback1.add(listener.onSomething); 
		
		caller.fireAnon();
		expect(listener.onSomething).toHaveBeenCalled();
		expect(listener.onSomeError).toHaveBeenCalled();
		
		listener.onSomething.calls.reset();
	});

	it('a listener attached method to Callbacks, should bubble up errors', function(){

		callback1 = mm.callbacks('test1', true); //new callbacks configured to bubbule up Errors
		
		spyOn(listener, 'onSomething').and.callThrough();
		spyOn(listener, 'onSomeError').and.callThrough();

		callback1.add(listener.onSomeError);
		callback1.add(listener.onSomething); 
		
		expect(function(){caller.fireAnon();}).toThrowError();
		expect(listener.onSomeError).toHaveBeenCalled();
		expect(listener.onSomething).not.toHaveBeenCalled();
		
		
		listener.onSomething.calls.reset();
	});


  
});