'use strict';
(function(mm) {

    function Callbacks() {
        //autoFire is when this event is executed only one time. 
        //And perhaps some handlers where attached after the event was release
        var autoFire = false,
            isSuspended = false,
            listOfCallbacks = [],
            bubbleErrors = true, //by default callbacks bubble's up errors
            lastCaller = null,
            lastArguments = null;

        this.empty = function() {
            listOfCallbacks = [];
            return true;
        };

        this.enableBubbleUpErrors = function(bool) {
            bubbleErrors = (bool === false) ? false : true; //by default true, Callbacks bubbles up errors
        };

        this.setAutoFireOnNewAdds = function(bool) {
            autoFire = bool;
        };

        //stops sending events if it is paused
        this.suspend = function(){
            isSuspended = true;
        };

        //start sending events again if it was paused
        this.resume = function(){
            isSuspended = false;
        };

        //add function/s to listen the event
        this.add = function() {
            for (var i = 0; i < arguments.length; i++) {
                var fn = arguments[i];
                if (fn && mm.isFunction(fn)) {
                    listOfCallbacks.push(fn);
                    if (autoFire) {
                        fireToEventHandler(lastCaller, fn, lastArguments);
                    }
                }
            }
        };

        // .fire() will fire the event binding to this(to this callback)
        // .fire(object) will fire event bindning to the first parameter object
        // .fire(object, parm1, param2... etc) will fire the event binding it to the first objcect, and the 
        // following parameters will be pass to the subscribed functions 
        // fire(null, param1, param2.. etce)  will fire the event binding it to, the rest of the params will be passed
        this.fire = function() {
            var args = arguments,
                context = this;
            if (arguments.length > 0 && mm.isObject(args[0])) {
                context = Array.prototype.splice.call(args, 0, 1)[0];
            }
            for (var i = 0; i < listOfCallbacks.length; i++) {
                fireToEventHandler(context, listOfCallbacks[i], args);
                if (autoFire) {
                    lastCaller = context;
                    lastArguments = args;
                }
            }
        };

        this.remove = function(fn) {
            var index = mm.inArray(listOfCallbacks, fn);
            if (mm.isFunction(fn) && index >= 0) {
                listOfCallbacks.splice(index, 1);
                return true;
            }
            return false;
        };

        function fireToEventHandler(context, callback, args) {
            try {
                if(!isSuspended){
                    args = (args) ? args : []; //ie8 bug
                    callback.apply(context, args);
                }
            } catch (err) {
                if (!bubbleErrors && console && console.error) {
                    if (err.stack) {
                        mm.console.error(err.stack);
                    } else {
                        mm.console.error('a function attached to Callbacks thorwed an error: ' + err);
                    }
                } else if (bubbleErrors) {
                    throw err;
                }
            }
        }
    }//end Callbacks

    //similar to $.callbacks
    //methods that supports: add, fire, remove and empty
    //mm.callbacks(false): does not bubble up errors
    mm.callbacks = function(bubbleUpErrors) {
        var callbacks = new Callbacks();
        callbacks.enableBubbleUpErrors(bubbleUpErrors);
        return callbacks;
    };

})(window.mm);
