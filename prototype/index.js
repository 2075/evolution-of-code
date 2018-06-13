
(function(global) {

	const doc = global.document;



	const _DATASET = global._DATASET || {
		index:   {},
		entries: {}
	};
	const _TESTSET = global._TESTSET || {
		index:   {},
		entries: {}
	};
	const _PREVIEW = doc.querySelector('#preview');
	const _STATE   = {
		dataset: [],
		preview: null,
		testset: []
	};



	let data_search = new Search('#dataset', _DATASET.entries, _STATE.dataset);
	if (data_search !== null) {

		data_search.on('search', (value, entry, state) => {

			let filtered = [];
			let type     = null;

			if (value.startsWith('#')) {
				value = value.substr(1);
				type  = 'enums';
			} else if (value.startsWith('@')) {
				value = value.substr(1);
				type  = 'events';
			} else if (value.endsWith('()')) {
				value = value.substr(0, value.length - 2);
				type  = 'methods';
			}


			if (type !== null) {

				Object.entries(entry.result[type] || {}).filter(d => d[0].startsWith(value)).forEach(data => {

					let hash = data[1].hash || null;
					if (hash !== null) {

						let other = state.find(o => o.hash === hash) || null;
						if (other === null) {

							filtered.push({
								reference: entry,
								count:     1,
								hash:      hash,
								key:       data[0],
								value:     data[1]
							});

						} else {
							other.count++;
						}

					}

				});

			} else {

				for (let type in entry.result) {

					if (type === 'constructor') continue;

					Object.entries(entry.result[type] || {}).filter(d => d[0].startsWith(value)).forEach(data => {

						let hash = data[1].hash || null;
						if (hash !== null) {

							let other = state.find(o => o.hash === hash) || null;
							if (other === null) {

								filtered.push({
									reference: entry,
									count:     1,
									hash:      hash,
									key:       data[0],
									value:     data[1],
								});

							} else {
								other.count++;
							}

						}

					});

				}

			}

			return filtered;

		});

		data_search.on('sort', (a, b) => {

			if (a.count > b.count) return -1;
			if (b.count > a.count) return  1;

			if (a.key < b.key) return -1;
			if (b.key < a.key) return  1;

			return 0;

		});

		data_search.on('render', (entry) => {

			let chunk  = '';
			let name   = entry.key || '';
			let type   = entry.value.type;
			let params = entry.value.parameters || null;

			if (type === 'event') {

				if (params !== null) {
					name = '@' + name + '[' + params.map(p => p.name).join(', ') + ']';
				} else {
					name = '@' + name;
				}

			} else if (type === 'function') {

				if (params !== null) {
					name = name + '(' + params.map(p => p.name).join(', ') + ')';
				} else {
					name = name + '()';
				}

			}


			chunk += '<b>' + entry.count + '</b>';
			chunk += '<abbr title="' + entry.hash + '">' + name + '</abbr>';

			return chunk;

		});

		data_search.on('select', (entry) => {
			console.log('select', entry);
		});

		data_search.on('preview', (entry) => {

			if (entry !== null) {


				let code = '';
				let data = entry.reference;

				code += '/*\n';
				code += ' * file: ' + data.header.identifier + '\n';
				code += ' * type: ' + data.header.type       + '\n';
				code += ' * name: ' + entry.key              + '\n';
				code += ' * hash: ' + entry.hash             + '\n';
				code += ' */\n';
				code += '\n\n';


				let value = entry.value;
				if (value.type === 'event') {

					code += 'let instance = new Composite();\n\n';
					code += 'instance.bind(\'' + value.name + '\', ' + value.chunk + ');';

				} else if (value.type === 'function') {

					code += 'Composite.prototype.' + entry.key + ' = ';
					code += value.chunk.split('\n').map(line => {

						if (line.startsWith('\t\t')) {
							line = line.substr(2);
						}

						return line;

					}).join('\n').trim() + ';';

				}


				let element = _PREVIEW.querySelector('code');
				if (element !== null) {
					element.innerHTML = code;
					hljs.highlightBlock(element);
				}

				_PREVIEW.classList.add('active');

			} else {
				// XXX: Keep preview alive for code inspection
			}

		});

	}



	global._DATASET = _DATASET;
	global._TESTSET = _TESTSET;
	global._STATE   = _STATE;


	setTimeout(_ => {

		global.SEARCHES['#dataset'].search('setEntity');

		doc.querySelector('#dataset input').blur();

		setTimeout(_ => {
			doc.querySelector('#dataset ul.search').classList.add('active');
			doc.querySelector('#dataset ul.select').classList.remove('active');
		}, 550);

	}, 2000);

})(typeof window !== 'undefined' ? window : this);

