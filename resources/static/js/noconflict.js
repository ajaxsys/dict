(function($){

	if ($ && ($ instanceof Function) && ($('<a>') instanceof jQuery)) {
		// emove all jQuery variables from the global scope (including jQuery itself).
		window.__dict_jquery__ = $.noConflict(true);
	}

})(window.jQuery);