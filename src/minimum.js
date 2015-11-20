// mm is a mini jQuery replacement based on code from http://youmightnotneedjquery.com/
// mm also uses code from lodash and jQuery
// mm is a short-cut of the word Minimum
// mm supports IE8+
/*global ActiveXObject*/
'use strict';
(function() {

    var mm = new Minimum(); //a Minimum to use as self;
    window.mm = mm;

    function Minimum() {

        /** Used for native method references. */
        var objectProto = Object.prototype;
         /* Used to resolve the [`toStringTag`](http://ecma-international.org/ecma-262/6.0/#sec-object.prototype.tostring)
         * of values.
         */
        var objToString = objectProto.toString,
            funcTag = '[object Function]';
        this.noop = function() {};
        
        //to prevent console errors in ie8
        this.console = window.console || {
                                            log: this.noop,
                                            warn: this.noop,
                                            error: this.noop,
                                            info: this.noop,
                                            debug: this.noop
                                        };

        // serializes an object as a query string to be sent via a form
        // we're using the same name as jquery uses
        this.serialize = function(instance, prefix) {
            var serialized = [];

            prefix = prefix ? prefix + '.' : '';

            for (var key in instance) {
                if (instance.hasOwnProperty(key)) {
                    var value = instance[key];

                    if (!value) {
                        serialized.push(prefix + key + '=');
                    } else if (typeof value === 'number' || typeof value === 'string') {
                        serialized.push(prefix + key + '=' + value);
                    } else if (this.isArray(value)) {
                        for (var index = 0; index < value.length; index++) {
                            serialized.push(prefix + key + '[]=' + value[index]);
                        }
                    } else if (this.isFunction(value)) {
                        continue;
                    } else {
                        serialized.push(this.serialize(value, key));
                    }
                }
            }

            return serialized.join('&');
        };

        this.proxy = function(fn, context) {
            var args, slice = Array.prototype.slice;
            if (!mm.isFunction(fn)) {
                return undefined;
            }

            args = slice.call(arguments, 2);
            return function() {
                return fn.apply(context || this, args.concat(slice.call(arguments)));
            };
        };

        this.ajax = function(method, url, data, onSuccessFn, onErrorFn, alwaysFn, isJSON) {
            var request = (window.XMLHttpRequest) ? new XMLHttpRequest() : new ActiveXObject('Microsoft.XMLHTTP');
            request.open(method, url, true);
            if (isJSON) {
                request.setRequestHeader('Content-Type', 'application/json');
                request.setRequestHeader('Accept', 'application/json');
            } else {
                request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
            }

            request.onreadystatechange = function() {
                if (this.readyState === 4) {

                    var responseContentType = this.getResponseHeader('content-type');

                    var responseData;

                    if (responseContentType &&
                        (responseContentType.indexOf('application/json') > -1 || responseContentType.indexOf('text/json') > -1)) {
                        responseData = JSON.parse(this.responseText);
                    } else {
                        responseData = this.responseText;
                    }

                    if (this.status >= 200 && this.status < 400) {
                        if (mm.isFunction(onSuccessFn)) {
                            onSuccessFn(responseData);
                        }
                    } else {
                        if (mm.isFunction(onErrorFn)) {
                            onErrorFn(responseData);
                        }
                    }

                    if (mm.isFunction(alwaysFn)) {
                        alwaysFn(responseData);
                    }
                }
            };

            if (data) {
                data = isJSON ? JSON.stringify(data) : this.serialize(data);
            }

            request.send(data);
        };

        this.get = function(url, onSuccessFn, onErrorFn, alwaysFn, isJSON) {
            this.ajax('GET', url, null, onSuccessFn, onErrorFn, alwaysFn, isJSON);
        };

        this.getJSON = function(url, onSuccessFn, onErrorFn, alwaysFn) {
            this.ajax('GET', url, null, onSuccessFn, onErrorFn, alwaysFn, true);
        };

        this.post = function(url, data, onSuccessFn, onErrorFn, alwaysFn, isJSON) {
            this.ajax('POST', url, data, onSuccessFn, onErrorFn, alwaysFn, isJSON);
        };

        this.postJSON = function(url, data, onSuccessFn, onErrorFn, alwaysFn) {
            this.ajax('POST', url, data, onSuccessFn, onErrorFn, alwaysFn, true);
        };

        this.put = function(url, data, onSuccessFn, onErrorFn, alwaysFn, isJSON) {
            this.ajax('PUT', url, data, onSuccessFn, onErrorFn, alwaysFn, isJSON);
        };

        this.putJSON = function(url, data, onSuccessFn, onErrorFn, alwaysFn) {
            this.ajax('PUT', url, data, onSuccessFn, onErrorFn, alwaysFn, true);
        };

        this.$delete = function(url, data, onSuccessFn, onErrorFn, alwaysFn, isJSON) {
            this.ajax('DELETE', url, data, onSuccessFn, onErrorFn, alwaysFn, isJSON);
        };

        this.deleteJSON = function(url, data, onSuccessFn, onErrorFn, alwaysFn) {
            this.ajax('DELETE', url, data, onSuccessFn, onErrorFn, alwaysFn, true);
        };

        this.loadArray = function(url, onLoadFn) {
            if (!this.isFunction(onLoadFn)) {
                throw 'onLoadFn parameter must be a function';
            }

            var request = new XMLHttpRequest();
            request.open('GET', url, true);
            request.responseType = 'arraybuffer';

            request.onload = function() {
                onLoadFn(request.response);
            };

            request.send();
        };

        this.getScript = function(url, callback) {
            // adding the script tag to the head as suggested before
            var head = document.getElementsByTagName('head')[0];
            var script = document.createElement('script');
            script.type = 'text/javascript';
            script.src = url;

            if (!callback) {
                callback = this.noop;
            }

            // bind the event to the callback function 
            if (script.addEventListener) {
                script.addEventListener('load', callback, false); // IE9+, Chrome, Firefox
            } else if (script.readyState) { // IE8
                script.onreadystatechange = function() {
                    if (script.readyState === 'loaded' || script.readyState === 'complete') {
                        callback();
                    }
                };
            }

            // fire the loading
            head.appendChild(script);
        };

        this.extend = function(out) {
            out = out || {};
            for (var i = 1; i < arguments.length; i++) {
                if (!arguments[i]) {
                    continue;
                }

                for (var key in arguments[i]) {
                    if (arguments[i].hasOwnProperty(key)) {
                        out[key] = arguments[i][key];
                    }
                }
            }
            return out;
        };

        this.inArray = function(array, item) {
            for (var i = 0; i < array.length; i++) {
                if (array[i] === item) {
                    return i;
                }
            }
            return -1;
        };

        this.forEach = function(array, fn, scope) {
            for (var i = 0; i < array.length; i++) {
                fn.call(scope, array[i], i);
            }
        };

        ///If url is empty gets the url form window.location
        this.getQueryStringValues = function(url, getHashValues) {
            if (!url) {
                url = (getHashValues) ? window.location.hash : window.location.search;
            }
            var j = {},
                q = ((getHashValues) ? url.replace(/\#/, '').replace(/\?/, '') : url.replace(/\?/, '')).split('&');
            this.forEach(q, function(i) {
                var arr = i.split('=');
                j[arr[0]] = arr[1];
            });
            return j;
        };

        this.pushArray = function(array1, array2) {
            if (Boolean(array1.concat)) {
                return array1.concat(array2);
            } else {
                return array1.push.apply(array1, array2);
            }
        };

        this.isArray = function isArray(obj) {
            return Object.prototype.toString.call(obj) === '[object Array]';
        };

        this.getHashValues = function(url) {
            return this.getQueryStringValues(url, true);
        };

        this.map = function(arr, fn) {
            var results = [];
            for (var i = 0; i < arr.length; i++) {
                results.push(fn(arr[i], i));
            }
            return results;
        };

        /**
         * Checks if `value` is classified as a `Function` object.
         *
         * @static
         * @memberOf _
         * @category Lang
         * @param {*} value The value to check.
         * @returns {boolean} Returns `true` if `value` is correctly classified, else `false`.
         * @example
         *
         * _.isFunction(_);
         * // => true
         *
         * _.isFunction(/abc/);
         * // => false
         */
        this.isFunction = function(value) {
            // The use of `Object#toString` avoids issues with the `typeof` operator
            // in Safari 8 which returns 'object' for typed array constructors, and
            // PhantomJS 1.9 which returns 'function' for `NodeList` instances.
            return this.isObject(value) && objToString.call(value) === funcTag;
        };

        /**
         * Checks if `value` is the [language type](https://es5.github.io/#x8) of `Object`.
         * (e.g. arrays, functions, objects, regexes, `new Number(0)`, and `new String('')`)
         *
         * @static
         * @memberOf _
         * @category Lang
         * @param {*} value The value to check.
         * @returns {boolean} Returns `true` if `value` is an object, else `false`.
         * @example
         *
         * _.isObject({});
         * // => true
         *
         * _.isObject([1, 2, 3]);
         * // => true
         *
         * _.isObject(1);
         * // => false
         */
        this.isObject = function(value) {
            // Avoid a V8 JIT bug in Chrome 19-20.
            // See https://code.google.com/p/v8/issues/detail?id=2291 for more details.
            var type = typeof value;
            return !!value && (type === 'object' || type === 'function');
        };

        this.isString = function(value) {
            return typeof value === 'string';
        };

    } //end Minimum
})();
