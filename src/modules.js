'use strict';
(function(mm) {

    var diContainer = null;
    ///Injector
    function Injector() {
        var app, self = this, isAppResolved = false,
            modules = {};

        this.resolve = function(deps, func, scope) {
            if (!deps || deps.length <= 0) {
                return function() {
                    return func.apply(scope || {});
                };
            }

            for (var i = 0; i < deps.length; i++) {
                var dep = deps[i];
                var module = modules[dep];
                if (!module.result && !module.hasResult) {
                    var resolvedFunc = this.resolve(module.deps, module.func, module.scope);
                    module.result = resolvedFunc();
                    module.hasResult = true; //in case the function does not return nothing
                }
            }

            return function() {
                var args = [];
                for (var i = 0; i < deps.length; i++) {
                    args.push(modules[deps[i]].result);
                }
                return func.apply(scope || {}, args);
            };
        };

        this.module = function(name, deps, func, scope) {
            if (mm.isFunction(deps)) {
                func = deps;
                deps = null;
            }
            if (deps && !mm.isArray(deps)) {
                throw 'In module ' + name + ' the depedencies are not an array format.';
            }
            modules[name] = {
                deps: deps,
                func: func,
                scope: scope,
                result: null,
                name: name
            }; //name prop is for easy debug 
        };

        this.app = function(deps, func, scope) {
            if (!deps && !mm.isArray(deps)) {
                throw 'the dependiencies of an app cannot be null and must be an array';
            }
            if (!func && !mm.isFunction(func)) {
                throw 'the second parameter of an app cannot be null and must be an function';
            }
            app = {
                deps: deps,
                func: func,
                scope: scope
            };
        };

        this.resolveApp = function(){
            if (app && !isAppResolved) {
                var myApp = self.resolve(app.deps, app.func, app.scope);
                myApp();
                isAppResolved = true;
                return true;
            }
            return false;
        };

        mm.onReady(function() {
            self.resolveApp();
        });
    } //end injector

    //mm.resolve:  resolves the dependencies in the moment
    //deps can be a string or an array
    mm.resolve = function(deps, func, scope) {
        diContainer = diContainer || new Injector();
        deps = (mm.isString(deps)) ? [deps] : deps;
        var resolved = diContainer.resolve(deps, func, scope);
        resolved.apply(scope || {});
    };

    mm.resolveApp = function(){
        diContainer = diContainer || new Injector();
        return diContainer.resolveApp();
    };

    mm.app = function(deps, func, scope) {
        diContainer = diContainer || new Injector();
        diContainer.app(deps, func, scope);
    };

    mm.module = function(name, deps, func, scope) {
        diContainer = diContainer || new Injector();
        diContainer.module(name, deps, func, scope);
    };

})(window.mm);
