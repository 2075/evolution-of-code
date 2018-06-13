
(function(global) {

	global.addEventListener('load', _ => {

		let hljs = global.hljs || null;
		if (hljs !== null) {
			hljs.initHighlightingOnLoad();
		}

	}, true);

})(typeof window !== 'undefined' ? window : this);

