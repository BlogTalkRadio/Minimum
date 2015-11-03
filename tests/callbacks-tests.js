'use strict';
describe('Callbacks: ', function() {
    //setup objects to test
    var mm = window.mm,
        callbackEvent,
        listener = {
            name: 'Listener Addams',
            getName: function() {
                return this.name;
            },
            getError: function() {
                return this.uwuwi.duwqyuwq; //to throws an error
            }
        },
        caller = {
            name: 'Caller McFly',
            onEvent: null,
            fireFromThis: function(arg) {
                callbackEvent.fire(this, arg);
            },
            fireAnon: function() {
                callbackEvent.fire();
            },
            fireWithOneParam: function(arg) {
                callbackEvent.fire(null, arg);
            },
            fireOnEvent : function(){
                if(this.onEvent){
                    this.onEvent();
                }
            }
        };

    beforeEach(function() {
        callbackEvent = mm.callbacks();
    });

    afterEach(function() {
        callbackEvent = null;
        //clean spies
        if (listener.getName.calls) {
            listener.getName.calls.reset();
        }
        if (console.calls) {
            console.calls.reset();
        }
    });

    it('should exist in Minimum', function() {
        expect(Boolean(mm.callbacks)).toBe(true);
    });

    it('should create a Callback and fire', function() {
        spyOn(listener, 'getName').and.callThrough();

        callbackEvent.add(listener.getName);
        caller.fireAnon();

        expect(listener.getName).toHaveBeenCalled();
        expect(listener.getName.calls.first().returnValue).toBeUndefined();
    });

    it('should create a Callback and fire binding to this', function() {
        var fireArgument = 'hola';

        spyOn(listener, 'getName').and.callThrough();

        callbackEvent.add(listener.getName);
        caller.fireFromThis(fireArgument);

        expect(listener.getName).toHaveBeenCalledWith(fireArgument);
        expect(listener.getName.calls.first().returnValue).toEqual(caller.name);
    });

    it('should create a callback and fire with one or more parameters', function() {
        var fireArgument = 'hola';

        spyOn(listener, 'getName').and.callThrough();

        callbackEvent.add(listener.getName);
        caller.fireWithOneParam(fireArgument);

        expect(listener.getName).toHaveBeenCalledWith(null, fireArgument);
        expect(listener.getName.calls.first().returnValue).toBeUndefined();
    });

    it('should add functions and remove them', function() {
        spyOn(listener, 'getName').and.callThrough();

        callbackEvent.add(listener.getName);
        callbackEvent.empty(); //test empty
        caller.fireAnon();
        expect(listener.getName).not.toHaveBeenCalled();
        listener.getName.calls.reset();

        callbackEvent.add(listener.getName);
        callbackEvent.remove(listener.getName); //test remove
        caller.fireAnon();
        expect(listener.getName).not.toHaveBeenCalled();
    });

    it('a listener attached method to Callbacks, should bubble up errors by default', function() {
        spyOn(listener, 'getName').and.callThrough();
        spyOn(listener, 'getError').and.callThrough();

        callbackEvent.add(listener.getError);
        callbackEvent.add(listener.getName);

        expect(caller.fireAnon).toThrowError();
        expect(listener.getError).toHaveBeenCalled();
        expect(listener.getName).not.toHaveBeenCalled();
    });

    it('a listener attached method to Callbacks, should not bubble up errors when is setup', function() {
        callbackEvent = mm.callbacks(false); //new callbacks configured not to bubbule up Errors

        spyOn(listener, 'getName').and.callThrough();
        spyOn(listener, 'getError').and.callThrough();
        spyOn(console, 'error');

        callbackEvent.add(listener.getError);
        callbackEvent.add(listener.getName);

        caller.fireAnon();
        expect(console.error).toHaveBeenCalled();
        expect(listener.getName).toHaveBeenCalled();
        expect(listener.getError).toHaveBeenCalled();
    });

    it('should be posible to pause event fires', function(){
        spyOn(listener, 'getName').and.callThrough();

        callbackEvent.add(listener.getName);
        callbackEvent.pause();
        caller.fireAnon();
        expect(listener.getName).not.toHaveBeenCalled();

        callbackEvent.play();
        caller.fireAnon();
        expect(listener.getName).toHaveBeenCalled();
    });

    it('should keep "this" ', function() {
        var executed = false;
        caller.onEvent = callbackEvent.fire;

        callbackEvent.add(function(){
            executed = true;
        });

        caller.fireOnEvent();
        expect(executed).toBe(true);
    });
});
