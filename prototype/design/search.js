
(function(global) {

	const doc      = global.document;
	const SEARCHES = {};



	/*
	 * HELPERS
	 */

	const _on_search = function(value) {

		let dataset = this.__dataset;
		if (dataset instanceof Array) {

			// XXX: lol, hackathon code yo.

		} else if (dataset instanceof Object) {

			let state = this.__state;
			if (state instanceof Array) {

				state.splice(0, state.length);

			} else if (state instanceof Object) {

				for (let s in state) {
					delete state[s];
				}

			}


			let search = this.__on['search'] || null;
			if (search !== null) {

				if (dataset instanceof Array) {

					for (let d = 0, dl = dataset.length; d < dl; d++) {

						let result = search(value, dataset[d], state);
						if (result instanceof Array) {

							for (let r = 0, rl = result.length; r < rl; r++) {
								state.push(result[r]);
							}

						} else if (result instanceof Object) {

							for (let r in result) {
								state[r] = result[r];
							}

						}

					}

				} else if (dataset instanceof Object) {

					for (let d in dataset) {

						let result = search(value, dataset[d], state);
						if (result instanceof Array) {

							for (let r = 0, rl = result.length; r < rl; r++) {
								state.push(result[r]);
							}

						} else if (result instanceof Object) {

							for (let r in result) {
								state[r] = result[r];
							}

						}

					}

				}

			}


			let sort = this.__on['sort'] || null;
			if (sort !== null) {

				if (state instanceof Array) {

					let tmp = state.splice(0, state.length);
					tmp.sort(sort);
					state.push.apply(state, tmp);

				}

			}


			let chunks = [];
			let render = this.__on['render'] || null;
			if (render !== null) {

				if (state instanceof Array) {

					for (let s = 0, sl = state.length; s < sl; s++) {

						let chunk = render(state[s]);
						if (chunk !== null) {
							chunks.push({
								chunk: chunk,
								s:     s
							});
						}

					}

				} else if (state instanceof Object) {

					for (let s in state) {

						let chunk = render(state[s]);
						if (chunk !== null) {
							chunks.push({
								chunk: chunk,
								s:     s
							});
						}

					}

				}

			}


			let preview = this.__on['preview'] || null;
			if (preview !== null) {

				this._search.innerHTML = chunks.map(entry => {

					let code = '<li';

					code += ' onclick="SEARCHES[\'' + this.__id + '\'].select(' + entry.s + ');"';
					code += ' onmouseenter="SEARCHES[\'' + this.__id + '\'].preview(' + entry.s + ');"';
					code += ' onmouseleave="SEARCHES[\'' + this.__id + '\'].preview(null);"';
					code += '>';
					code += entry.chunk;
					code += '</li>';

					return code;

				}).join('\n');

			} else {

				this._search.innerHTML = chunks.map(entry => {
					return '<li onclick="SEARCHES[\'' + this.__id + '\'].select(' + entry.s + ');">' + entry.chunk + '</li>';
				}).join('\n');

			}

		}

	};


	/*
	 * IMPLEMENTATION
	 */

	const Search = function(query, dataset, state) {

		let element = doc.querySelector(query);
		if (element !== null) {

			this._input  = element.querySelector('input');
			this._search = element.querySelector('ul.search');
			this._select = element.querySelector('ul.select');

			this.__id      = query;
			this.__on      = {};
			this.__dataset = dataset || {};
			this.__state   = state   || [];


			this._input.addEventListener('focus', _ => {
				this._select.classList.remove('active');
				this._search.classList.add('active');
			});

			this._input.addEventListener('blur', _ => {

				setTimeout(_ => {
					this._select.classList.add('active');
					this._search.classList.remove('active');
				}, 500);

			});

			this._input.addEventListener('keyup', e => {
				_on_search.call(this, this._input.value);
			}, true);


			SEARCHES[this.__id] = this;


			return this;

		} else {

			return null;

		}

	};


	Search.prototype = {

		on: function(event, callback) {
			this.__on[event] = callback;
		},

		search: function(value) {

			this._input.value = value;
			this._input.focus();

			_on_search.call(this, this._input.value);

		},

		preview: function(s) {

			s = typeof s === 'number' ? s : null;

			let entry   = this.__state[s] || null;
			let preview = this.__on['preview'] || null;
			if (preview !== null) {
				preview(entry);
			}

		},

		select: function(s) {

			s = typeof s === 'number' ? s : null;

			let entry  = this.__state[s] || null;
			let select = this.__on['select'] || null;
			if (select !== null) {
				select(entry);
			}


			let render = this.__on['render'] || null;
			if (render !== null) {

				let chunk = render(entry);
				if (chunk !== null) {

					let div = this._select.querySelector('li > div');
					if (div !== null) {
						div.parentNode.parentNode.removeChild(div.parentNode);
					}

					let item = doc.createElement('li');
					item.innerHTML = chunk;
					this._select.appendChild(item);

				}

			}

		}

	};



	/*
	 * EXPORTS
	 */

	global.Search   = Search;
	global.SEARCHES = SEARCHES;

})(typeof window !== 'undefined' ? window : this);

