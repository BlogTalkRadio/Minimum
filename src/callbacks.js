'use strict';
(function (mm) {
	
	function Callbacks(){
		//_autoFire is when this event is executed only one time. 
    	//And perhaps some handlers where attached after the event was release
		this._autoFire = false;
		this._listOfCallbacks = [];
		this._bubbleErrors = false;
		this._lastCaller = null;
		this._lastArguments = null;
	}

    Callbacks.prototype.empty = function () {
        this._listOfCallbacks = [];
        return true;
    };

    Callbacks.prototype.enableBubbleUpErrors = function(bool){
    	this._bubbleErrors = (bool) ? true : false;
    };

    Callbacks.prototype.setAutoFireOnNewAdds = function(bool){
    	this._autoFire = bool;
    };
    
    Callbacks.prototype.add = function () {
        for (var i = 0; i < arguments.length; i++) {
            var fn = arguments[i];
            if (fn && mm.isFunction(fn)) {
                this._listOfCallbacks.push(fn);
                if (this._autoFire) {
                    this._fireToEventHandler(this._lastCaller, fn, 
                        this._lastArguments);
                }
            }
        }
    };

    // .fire() will fire the event binding to this
    // .fire(object) will fire event bindning to the first parameter object
    // .fire(object, parm1, param2... etc) will fire the event binding it to the first objcect, and the 
    // following parameters will be pass to the subscribed functions 
    // fire(null, param1, param2.. etce)  will fire the event binding it to, the rest of the params will be passed
    Callbacks.prototype.fire = function() {
        var args = arguments,
            context = this;
        if(arguments.length > 0 && mm.isObject(args[0])){
            context = Array.prototype.splice.call(args, 0, 1)[0];
        }
        for (var i = 0; i < this._listOfCallbacks.length; i++) {
            this._fireToEventHandler(context, this._listOfCallbacks[i], args);
            if(this._autoFire){
                this._lastCaller = context;
                this._lastArguments = args;
            }
        }
    };

    Callbacks.prototype.remove = function (fn) {
        var index = mm.inArray(this._listOfCallbacks, fn);
        if (mm.isFunction(fn) && index >= 0) {
            this._listOfCallbacks.splice(index, 1);
            return true;
        }
        return false;
    };

    Callbacks.prototype._fireToEventHandler = function (context, callback, args) {
        try {
            args = (args) ? args : []; //ie8 bug
            callback.apply(context, args);
        } 
        catch (err) {
            if (!this._bubbleErrors && console && console.error) {
                if(err.stack){
                    console.error(err.stack);
                }
                else{
                	console.error('a function attached to Callbacks thorwed an error: '+ err);
                }
            } else if(this._bubbleErrors) {
                throw err;
            }
        }
    };
    //end Callbacks

	//similar to $.callbacks
    //methods that supports: add, fire, remove and empty
    mm.callbacks = function (bubbleUpErrors) {
        var callbacks = new Callbacks();
        callbacks.enableBubbleUpErrors(bubbleUpErrors);
        return callbacks;
    };

})(window.mm);