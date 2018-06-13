
(function(global) {

	const _DATASET = global._DATASET || {
		index:   {},
		entries: {}
	};


	fetch('../dataset/lychee/strainer.pkg').then(raw => raw.json()).then(data => {

		if (data instanceof Object) {

			for (let url in data) {

				_DATASET.index[url] = data[url];


				let path = url;
				if (path.startsWith('/libraries')) {
					path = path.substr('/libraries'.length);
				}

				if (path.startsWith('/lychee/api')) {
					path = '/lychee' + path.substr('/lychee/api'.length);
				}

				if (path.endsWith('.json')) {

					fetch('../dataset' + path).then(raw => raw.json()).then(entry => {
						_DATASET.entries[url] = entry;
					});

				}

			}

		}

	});



	global._DATASET = _DATASET;

})(typeof window !== 'undefined' ? window : this);

