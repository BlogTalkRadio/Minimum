//All mm DOM related functions
'use strict';
(function(mm){

	var onDocumentReadyEvent = null;
	
	mm.hide = function (el) {
		el.style.display = 'none';
	};

	mm.show = function (el) {
		el.style.display = '';
	};

	mm.byId = function (id) {
		return document.getElementById(id);
	};

	mm.create = function (htmlElem) {
		return document.createElement(htmlElem);
	};

	mm.remove = function (el) {
		if (this.isElement(el)) {
		    throw 'you cannot remove a none Dom element or the element is already null';
		}
		el.parentNode.removeChild(el);
	};

	mm.append = function (el, parent) {
		parent.appendChild(el);
	};

	mm.isElement = function (o) {
		return isElement(o) || isNode(o);
    };

    //if text is set it will set the text
    //if text is empty you will get the actual text
    mm.text = function (el, text) {
        if (text) {
            if (typeof el.textContent !== 'undefined') {
                el.textContent = text;
            } else {
                el.innerText = text;
            }
        }

        return el.textContent || el.innerText;
    };

    mm.html = function (el, html) {
        if (html) {
            el.innerHTML = html;
        }
        return el.innerHTML;
    };

    mm.attr = function (el, attr, value) {
        if (value) {
            el.setAttribute(attr, value);
        }
        return el.getAttribute(attr);
    };

	mm.on = function (el, eventName, handler) {
		if (el.addEventListener) {
		    el.addEventListener(eventName, handler);
		} else {
		    el.attachEvent('on' + eventName, function () {
		        handler.call(el);
			});
		}
	};

	mm.off = function (el, eventName, handler) {
		if (el.removeEventListener) {
			el.removeEventListener(eventName, handler);
		} else {
			el.detachEvent('on' + eventName, handler);
		}
	};

	mm.onReady = function (fn) {
		if (!onDocumentReadyEvent) {
		    onDocumentReadyEvent = this.callbacks(true); // bubble up an error if the statring code generates an error
		    onDocumentReadyEvent.add(fn);
		    setOnDocumentReady();
		} else {
		    onDocumentReadyEvent.add(fn);
		}
	};

	// min.select(el, selector) looks insde the element
    // or min.select(selector) looks in all DOM
	mm.select = function (el, selector) {
		if (!this.isElement(el) && !selector) { //find the parent element
		    selector = el;
		    el = null;
		}
		if (!el) {
		    el = document;
		}
		return el.querySelectorAll(selector);
	};

	mm.addClass = function (el, className) {
	    if (el.classList) {
	        el.classList.add(className);
	    } else {
	        el.className += ' ' + className;
	    }
	};

    mm.removeClass = function (el, className) {
        if (el.classList) {
            el.classList.remove(className);
        } else {
            el.className = el.className.replace(new RegExp('(^|\\b)' + className.split(' ').join('|') + '(\\b|$)', 'gi'), ' ');
        }
    };

    mm.hasClass = function (el, className) {
        if (el.classList) {
            el.classList.contains(className);
        } else {
            new RegExp('(^| )' + className + '( |$)', 'gi').test(el.className);
        }
    };

	mm.toggleClass = function (el, className) {
	    if (el.classList) {
	        el.classList.toggle(className);
	    } else {
	        var classes = el.className.split(' ');
	        var existingIndex = -1;
	        for (var i = classes.length; i--;) {
	            if (classes[i] === className) {
	                existingIndex = i;
	            }
	        }
	        if (existingIndex >= 0) {
	            classes.splice(existingIndex, 1);
	        } else {
	            classes.push(className);
	        }

	        el.className = classes.join(' ');
	    }
	};

	//PRIVATE METHODS
	function setOnDocumentReady() {
        if (document.readyState !== 'loading' && document.readyState !== 'interactive') {
            onDocumentReadyEvent.fire();
        } else if (document.addEventListener) {
            document.addEventListener('DOMContentLoaded', function () {
                onDocumentReadyEvent.fire();
            });
        } else {
            document.attachEvent('onreadystatechange', function () {
                if (document.readyState !== 'loading') {
                    onDocumentReadyEvent.fire();
                }
            });
        }
        onDocumentReadyEvent.setAutoFireOnNewAdds(true);
    }

    //Returns true if it is a DOM node //copied from: http://stackoverflow.com/a/384380/187673
	function isNode(o) {
	    return (
	        typeof Node === 'object' ? o instanceof Node :
	        o && typeof o === 'object' && typeof o.nodeType === 'number' && typeof o.nodeName === 'string'
	    );
	}

	//Returns true if it is a DOM element //copied from: http://stackoverflow.com/a/384380/187673   
	function isElement(o) {
	    return (
	        typeof HTMLElement === 'object' ? o instanceof HTMLElement : //DOM2
	        o && typeof o === 'object' && o !== null && o.nodeType === 1 && typeof o.nodeName === 'string'
	    );
	}

})(window.mm);