Minimum  [![Build Status](https://semaphoreci.com/api/v1/projects/ef844dbb-bb42-4c3a-a267-e6353bcdebfe/581126/shields_badge.svg)](https://semaphoreci.com/elranu/minimum)
========
>All in one replacement for jQuery with DI and modules, very lightweight yet very powerful

Why and when to use Minimum? 
--------------------------------------

- Because we did not want to "copy and paste" code each time we wanted to use code from: [YOU MIGHT NOT NEED JQUERY](http://youmightnotneedjquery.com/).  Also we have copied some little code from [_lodash](http://lodash.com). 
- We needed a small footprint.  **8k minified - 3k gziped**
- We needed that works on IE8 and newer versions
- We needed a small DI framework module pattern for our Javascript vanilla projects
- We needed a similar functionality to [jQuery.Callbacks()](https://api.jquery.com/jQuery.Callbacks/) to easily and explicitly manage events. 

How to use Minimum? 
--------------------------
Minimum is really easy to use. The Minimum  shortcut is just `mm`

**Some examples**:

**Http request example**: 
```
function getData(url, callback){
	if (!mm.isFunction(callback)) {
	    throw 'callback should be a function';
    }
	mm.getJSON(url, function (data) {
	            callback(data);
	        },
	        function onError(err) {
	            throw 'Failed request to get the data. Error: ' + err;
	        });
}
```
>Check the main `mm` functions such as `ajax`, `foreach`, `inArray`, `getScript`, `extend`, `getQueryStringValues`,  etc: https://github.com/BlogTalkRadio/Minimum/blob/master/src/minimum.js

**DOM Examples**:
```
var timeLineElem = mm.byId('timeline');
mm.addClass(timeLineElem , 'superClass');
mm.removeClass(timeLineElem , 'uglyClass');
mm.text(timeLineElem , 'some cooltext');
var text = mm.text(timeLineElem);

mm.onReady(function(){
//do cool stuff wen the dom is loaded
});

```
>When manipulating DOM elements the element is always the first parameter. 
>See all the DOM functions: https://github.com/BlogTalkRadio/Minimum/blob/master/src/dom.js

Dependency Injection, modules and application
--------------------------------------------------------

Minimum modules are really similar to Angular ones. 

```
mm.module('firstModule', function(){
	return { description: 'mm is cool'};
});

mm.module('complexModule', ['firstModule'], function(firstModule){
	
	return { print : function(){
						mm.console.log('Print description: ' + moduleName.description);
				    }
	};
});

mm.app(['complexModule'], function('complexModule'){
	complexModule.print();
});
```

**`mm.module(moduleName, [dependencyArray], func)`**
- moduleName | string: name of the module
- dependencyArray | array of strings | optional : is the array of dependencies that required the module to execute
- func | function: the function to be executed, only once. This function will get the dependencies by parameters, in the same order as the dependecyArray. 

**`mm.app([dependencyArray], func)`**
app will be only executed once when the Dom is loaded. It only supports one "app" module.
- dependencyArray | array of strings | optional : is the array of dependencies that required the module to execute
- func | function: the function to be executed, only once. This function will get the dependencies by parameters, in the same order as the dependencyArray. 

Callbacks
-----------
Minimum Callbacks are almost equal to [jQuery.Callbacks()](https://api.jquery.com/jQuery.Callbacks/) . So basically is a object to manage callbacks lists. The idea is to mange the list of callbacks in an explicit way:  

**Example**
```
var businessObject = {};
businessObject._businessEvent = mm.callbacks();
businessObject.doSomething = function(){
		this._businessEvent.fire();
};
businessObject.onBusinessEvent = businessObject._businessEvent.add;


businessObject.onBusinessEvent(function(){
	console.log('Hello Callbacks');
});
businessObject.onBusinessEvent(function(){
	console.log('Bye Callbacks');
});

businessObject.doSomething();
///--> print 'Hello Callbacks'
///--> print 'Bye Callbacks'
```

`mm.callbacks` has some other features like: 
- `suspend` and `resume` the execution of the events callbacks, it was a good solution for binding and unbind UI controls.  
- `setAutoFireOnNewAdds`: is used to autofire events for new listeners that where attached after the business fire.
- `mm.callbacks(false)`: is to make that any error that could be thrown by a listener function, is not bubble up. So the execution of your app is not stop. **note:** the trapped errors will be shown always in the console. 

Check callbacks code and tests: 
https://github.com/BlogTalkRadio/Minimum/blob/master/src/callbacks.js
https://github.com/BlogTalkRadio/Minimum/blob/master/tests/callbacks-tests.js

Contribute
------------
If you wanna add any code from [YOU MIGHT NOT NEED JQUERY](http://youmightnotneedjquery.com/), just send the PR.
