(function() {
var findAndReplaceDOMText = function(){

	var PORTION_MODE_RETAIN = 'retain';
	var PORTION_MODE_FIRST = 'first';

	var doc = document;
	var toString = {}.toString;
	var hasOwn = {}.hasOwnProperty;

	function isArray(a) {
		return toString.call(a) == '[object Array]';
	}

	function escapeRegExp(s) {
		return String(s).replace(/([.*+?^=!:${}()|[\]\/\\])/g, '\\$1');
	}

	function exposed() {
		// Try deprecated arg signature first:
		return deprecated.apply(null, arguments) || findAndReplaceDOMText.apply(null, arguments);
	}

	function deprecated(regex, node, replacement, captureGroup, elFilter) {
		if ((node && !node.nodeType) && arguments.length <= 2) {
			return false;
		}
		var isReplacementFunction = typeof replacement == 'function';

		if (isReplacementFunction) {
			replacement = (function(original) {
				return function(portion, match) {
					return original(portion.text, match.startIndex);
				};
			}(replacement));
		}

		// Awkward support for deprecated argument signature (<0.4.0)
		var instance = findAndReplaceDOMText(node, {

			find: regex,

			wrap: isReplacementFunction ? null : replacement,
			replace: isReplacementFunction ? replacement : '$' + (captureGroup || '&'),

			prepMatch: function(m, mi) {

				// Support captureGroup (a deprecated feature)

				if (!m[0]) throw 'findAndReplaceDOMText cannot handle zero-length matches';

				if (captureGroup > 0) {
					var cg = m[captureGroup];
					m.index += m[0].indexOf(cg);
					m[0] = cg;
				}

				m.endIndex = m.index + m[0].length;
				m.startIndex = m.index;
				m.index = mi;

				return m;
			},
			filterElements: elFilter
		});

		exposed.revert = function() {
			return instance.revert();
		};

		return true;
	}

	/**
	 * findAndReplaceDOMText
	 *
	 * Locates matches and replaces with replacementNode
	 *
	 * @param {Node} node Element or Text node to search within
	 * @param {RegExp} options.find The regular expression to match
	 * @param {String|Element} [options.wrap] A NodeName, or a Node to clone
	 * @param {String|Function} [options.replace='$&'] What to replace each match with
	 * @param {Function} [options.filterElements] A Function to be called to check whether to
	 *	process an element. (returning true = process element,
	 *	returning false = avoid element)
	 */
	function findAndReplaceDOMText(node, options) {
		return new Finder(node, options);
	}

	exposed.NON_PROSE_ELEMENTS = {
		br:1, hr:1,
		// Media / Source elements:
		script:1, style:1, img:1, video:1, audio:1, canvas:1, svg:1, map:1, object:1,
		// Input elements
		input:1, textarea:1, select:1, option:1, optgroup: 1, button:1
	};

	exposed.NON_CONTIGUOUS_PROSE_ELEMENTS = {

		// Elements that will not contain prose or block elements where we don't
		// want prose to be matches across element borders:

		// Block Elements
		address:1, article:1, aside:1, blockquote:1, dd:1, div:1,
		dl:1, fieldset:1, figcaption:1, figure:1, footer:1, form:1, h1:1, h2:1, h3:1,
		h4:1, h5:1, h6:1, header:1, hgroup:1, hr:1, main:1, nav:1, noscript:1, ol:1,
		output:1, p:1, pre:1, section:1, ul:1,
		// Other misc. elements that are not part of continuous inline prose:
		br:1, li: 1, summary: 1, dt:1, details:1, rp:1, rt:1, rtc:1,
		// Media / Source elements:
		script:1, style:1, img:1, video:1, audio:1, canvas:1, svg:1, map:1, object:1,
		// Input elements
		input:1, textarea:1, select:1, option:1, optgroup: 1, button:1,
		// Table related elements:
		table:1, tbody:1, thead:1, th:1, tr:1, td:1, caption:1, col:1, tfoot:1, colgroup:1

	};

	exposed.NON_INLINE_PROSE = function(el) {
		return hasOwn.call(exposed.NON_CONTIGUOUS_PROSE_ELEMENTS, el.nodeName.toLowerCase());
	};

	// Presets accessed via `options.preset` when calling findAndReplaceDOMText():
	exposed.PRESETS = {
		prose: {
			forceContext: exposed.NON_INLINE_PROSE,
			filterElements: function(el) {
				return !hasOwn.call(exposed.NON_PROSE_ELEMENTS, el.nodeName.toLowerCase());
			}
		}
	};

	exposed.Finder = Finder;

	/**
	 * Finder -- encapsulates logic to find and replace.
	 */
	function Finder(node, options) {

		var preset = options.preset && exposed.PRESETS[options.preset];

		options.portionMode = options.portionMode || PORTION_MODE_RETAIN;

		if (preset) {
			for (var i in preset) {
				if (hasOwn.call(preset, i) && !hasOwn.call(options, i)) {
					options[i] = preset[i];
				}
			}
		}

		this.node = node;
		this.options = options;

		// ENable match-preparation method to be passed as option:
		this.prepMatch = options.prepMatch || this.prepMatch;

		this.reverts = [];

		this.matches = this.search();

		if (this.matches.length) {
			this.processMatches();
		}

	}

	Finder.prototype = {

		/**
		 * Searches for all matches that comply with the instance's 'match' option
		 */
		search: function() {

			var match;
			var matchIndex = 0;
			var offset = 0;
			var regex = this.options.find;
			var textAggregation = this.getAggregateText();
			var matches = [];
			var self = this;

			regex = typeof regex === 'string' ? RegExp(escapeRegExp(regex), 'g') : regex;

			matchAggregation(textAggregation);

			function matchAggregation(textAggregation) {
				for (var i = 0, l = textAggregation.length; i < l; ++i) {

					var text = textAggregation[i];

					if (typeof text !== 'string') {
						// Deal with nested contexts: (recursive)
						matchAggregation(text);
						continue;
					}

					if (regex.global) {
						while (match = regex.exec(text)) {
							matches.push(self.prepMatch(match, matchIndex++, offset));
						}
					} else {
						if (match = text.match(regex)) {
							matches.push(self.prepMatch(match, 0, offset));
						}
					}

					offset += text.length;
				}
			}

			return matches;

		},

		/**
		 * Prepares a single match with useful meta info:
		 */
		prepMatch: function(match, matchIndex, characterOffset) {

			if (!match[0]) {
				throw new Error('findAndReplaceDOMText cannot handle zero-length matches');
			}

			match.endIndex = characterOffset + match.index + match[0].length;
			match.startIndex = characterOffset + match.index;
			match.index = matchIndex;

			return match;
		},

		/**
		 * Gets aggregate text within subject node
		 */
		getAggregateText: function() {

			var elementFilter = this.options.filterElements;
			var forceContext = this.options.forceContext;

			return getText(this.node);

			/**
			 * Gets aggregate text of a node without resorting
			 * to broken innerText/textContent
			 */
			function getText(node, txt) {

				if (node.nodeType === 3) {
					return [node.data];
				}

				if (elementFilter && !elementFilter(node)) {
					return [];
				}

				var txt = [''];
				var i = 0;

				if (node = node.firstChild) do {

					if (node.nodeType === 3) {
						txt[i] += node.data;
						continue;
					}

					var innerText = getText(node);

					if (
						forceContext &&
						node.nodeType === 1 &&
						(forceContext === true || forceContext(node))
					) {
						txt[++i] = innerText;
						txt[++i] = '';
					} else {
						if (typeof innerText[0] === 'string') {
							// Bridge nested text-node data so that they're
							// not considered their own contexts:
							// I.e. ['some', ['thing']] -> ['something']
							txt[i] += innerText.shift();
						}
						if (innerText.length) {
							txt[++i] = innerText;
							txt[++i] = '';
						}
					}
				} while (node = node.nextSibling);

				return txt;

			}

		},

		/**
		 * Steps through the target node, looking for matches, and
		 * calling replaceFn when a match is found.
		 */
		processMatches: function() {

			var matches = this.matches;
			var node = this.node;
			var elementFilter = this.options.filterElements;

			var startPortion,
				endPortion,
				innerPortions = [],
				curNode = node,
				match = matches.shift(),
				atIndex = 0, // i.e. nodeAtIndex
				matchIndex = 0,
				portionIndex = 0,
				doAvoidNode,
				nodeStack = [node];

			out: while (true) {

				if (curNode.nodeType === 3) {

					if (!endPortion && curNode.length + atIndex >= match.endIndex) {

						// We've found the ending
						endPortion = {
							node: curNode,
							index: portionIndex++,
							text: curNode.data.substring(match.startIndex - atIndex, match.endIndex - atIndex),
							indexInMatch: atIndex - match.startIndex,
							indexInNode: match.startIndex - atIndex, // always zero for end-portions
							endIndexInNode: match.endIndex - atIndex,
							isEnd: true
						};

					} else if (startPortion) {
						// Intersecting node
						innerPortions.push({
							node: curNode,
							index: portionIndex++,
							text: curNode.data,
							indexInMatch: atIndex - match.startIndex,
							indexInNode: 0 // always zero for inner-portions
						});
					}

					if (!startPortion && curNode.length + atIndex > match.startIndex) {
						// We've found the match start
						startPortion = {
							node: curNode,
							index: portionIndex++,
							indexInMatch: 0,
							indexInNode: match.startIndex - atIndex,
							endIndexInNode: match.endIndex - atIndex,
							text: curNode.data.substring(match.startIndex - atIndex, match.endIndex - atIndex)
						};
					}

					atIndex += curNode.data.length;

				}

				doAvoidNode = curNode.nodeType === 1 && elementFilter && !elementFilter(curNode);

				if (startPortion && endPortion) {

					curNode = this.replaceMatch(match, startPortion, innerPortions, endPortion);

					// processMatches has to return the node that replaced the endNode
					// and then we step back so we can continue from the end of the
					// match:

					atIndex -= (endPortion.node.data.length - endPortion.endIndexInNode);

					startPortion = null;
					endPortion = null;
					innerPortions = [];
					match = matches.shift();
					portionIndex = 0;
					matchIndex++;

					if (!match) {
						break; // no more matches
					}

				} else if (
					!doAvoidNode &&
					(curNode.firstChild || curNode.nextSibling)
				) {
					// Move down or forward:
					if (curNode.firstChild) {
						nodeStack.push(curNode);
						curNode = curNode.firstChild;
					} else {
						curNode = curNode.nextSibling;
					}
					continue;
				}

				// Move forward or up:
				while (true) {
					if (curNode.nextSibling) {
						curNode = curNode.nextSibling;
						break;
					}
					curNode = nodeStack.pop();
					if (curNode === node) {
						break out;
					}
				}

			}

		},

		/**
		 * Reverts ... TODO
		 */
		revert: function() {
			// Reversion occurs backwards so as to avoid nodes subsequently
			// replaced during the matching phase (a forward process):
			for (var l = this.reverts.length; l--;) {
				this.reverts[l]();
			}
			this.reverts = [];
		},

		prepareReplacementString: function(string, portion, match, matchIndex) {
			var portionMode = this.options.portionMode;
			if (
				portionMode === PORTION_MODE_FIRST &&
				portion.indexInMatch > 0
			) {
				return '';
			}
			string = string.replace(/\$(\d+|&|`|')/g, function($0, t) {
				var replacement;
				switch(t) {
					case '&':
						replacement = match[0];
						break;
					case '`':
						replacement = match.input.substring(0, match.startIndex);
						break;
					case '\'':
						replacement = match.input.substring(match.endIndex);
						break;
					default:
						replacement = match[+t];
				}
				return replacement;
			});

			if (portionMode === PORTION_MODE_FIRST) {
				return string;
			}

			if (portion.isEnd) {
				return string.substring(portion.indexInMatch);
			}

			return string.substring(portion.indexInMatch, portion.indexInMatch + portion.text.length);
		},

		getPortionReplacementNode: function(portion, match, matchIndex) {

			var replacement = this.options.replace || '$&';
			var wrapper = this.options.wrap;

			if (wrapper && wrapper.nodeType) {
				// Wrapper has been provided as a stencil-node for us to clone:
				var clone = doc.createElement('div');
				clone.innerHTML = wrapper.outerHTML || new XMLSerializer().serializeToString(wrapper);
				wrapper = clone.firstChild;
			}

			if (typeof replacement == 'function') {
				replacement = replacement(portion, match, matchIndex);
				if (replacement && replacement.nodeType) {
					return replacement;
				}
				return doc.createTextNode(String(replacement));
			}

			var el = typeof wrapper == 'string' ? doc.createElement(wrapper) : wrapper;

			replacement = doc.createTextNode(
				this.prepareReplacementString(
					replacement, portion, match, matchIndex
				)
			);

			if (!replacement.data) {
				return replacement;
			}

			if (!el) {
				return replacement;
			}

			el.appendChild(replacement);

			return el;
		},

		replaceMatch: function(match, startPortion, innerPortions, endPortion) {

			var matchStartNode = startPortion.node;
			var matchEndNode = endPortion.node;

			var preceedingTextNode;
			var followingTextNode;

			if (matchStartNode === matchEndNode) {

				var node = matchStartNode;

				if (startPortion.indexInNode > 0) {
					// Add `before` text node (before the match)
					preceedingTextNode = doc.createTextNode(node.data.substring(0, startPortion.indexInNode));
					node.parentNode.insertBefore(preceedingTextNode, node);
				}

				// Create the replacement node:
				var newNode = this.getPortionReplacementNode(
					endPortion,
					match
				);

				node.parentNode.insertBefore(newNode, node);

				if (endPortion.endIndexInNode < node.length) { // ?????
					// Add `after` text node (after the match)
					followingTextNode = doc.createTextNode(node.data.substring(endPortion.endIndexInNode));
					node.parentNode.insertBefore(followingTextNode, node);
				}

				node.parentNode.removeChild(node);

				this.reverts.push(function() {
					if (preceedingTextNode === newNode.previousSibling) {
						preceedingTextNode.parentNode.removeChild(preceedingTextNode);
					}
					if (followingTextNode === newNode.nextSibling) {
						followingTextNode.parentNode.removeChild(followingTextNode);
					}
					newNode.parentNode.replaceChild(node, newNode);
				});

				return newNode;

			} else {
				// Replace matchStartNode -> [innerMatchNodes...] -> matchEndNode (in that order)


				preceedingTextNode = doc.createTextNode(
					matchStartNode.data.substring(0, startPortion.indexInNode)
				);

				followingTextNode = doc.createTextNode(
					matchEndNode.data.substring(endPortion.endIndexInNode)
				);

				var firstNode = this.getPortionReplacementNode(
					startPortion,
					match
				);

				var innerNodes = [];

				for (var i = 0, l = innerPortions.length; i < l; ++i) {
					var portion = innerPortions[i];
					var innerNode = this.getPortionReplacementNode(
						portion,
						match
					);
					portion.node.parentNode.replaceChild(innerNode, portion.node);
					this.reverts.push((function(portion, innerNode) {
						return function() {
							innerNode.parentNode.replaceChild(portion.node, innerNode);
						};
					}(portion, innerNode)));
					innerNodes.push(innerNode);
				}

				var lastNode = this.getPortionReplacementNode(
					endPortion,
					match
				);

				matchStartNode.parentNode.insertBefore(preceedingTextNode, matchStartNode);
				matchStartNode.parentNode.insertBefore(firstNode, matchStartNode);
				matchStartNode.parentNode.removeChild(matchStartNode);

				matchEndNode.parentNode.insertBefore(lastNode, matchEndNode);
				matchEndNode.parentNode.insertBefore(followingTextNode, matchEndNode);
				matchEndNode.parentNode.removeChild(matchEndNode);

				this.reverts.push(function() {
					preceedingTextNode.parentNode.removeChild(preceedingTextNode);
					firstNode.parentNode.replaceChild(matchStartNode, firstNode);
					followingTextNode.parentNode.removeChild(followingTextNode);
					lastNode.parentNode.replaceChild(matchEndNode, lastNode);
				});

				return lastNode;
			}
		}

	};

	return exposed;
}()



var domready = function(){

	var fns = [], listener
		, doc = document
		, hack = doc.documentElement.doScroll
		, domContentLoaded = 'DOMContentLoaded'
		, loaded = (hack ? /^loaded|^c/ : /^loaded|^i|^c/).test(doc.readyState)


	if (!loaded)
		doc.addEventListener(domContentLoaded, listener = function () {
			doc.removeEventListener(domContentLoaded, listener)
			loaded = 1
			while (listener = fns.shift()) listener()
		})

	return function (fn) {
		loaded ? setTimeout(fn, 0) : fns.push(fn)
	}

}();


domready(function () {

	var dictonary = [

		[
			'\\bhome\\b',
			['tuis']
		],
		[
			'\\bziekenhuis\\b',
			['takkedemies']
		],
		[
			'\\bcontact\\b',
			['ketak']
		],
		[
			'\\b(over)\\b',
			['ovâh']
		],
		[
			'\\b(koek|koeken)\\b',
			['scheerbak']
		],

		[
			'\\b(bericht)\\b',
			['berig']
		],
		[
			'\\b(expertise)\\b',
			['experties']
		],

		[
			'\\b(homo|homoseksueel|nicht|poot|relnicht|gay|homofiel)\\b',
			['gulpenruiker', 'klapbegonia', 'zadelsnuffelaar']
		],
		[
			'\\b(lijf|lichaam|romp)\\b',
			['lijer']
		],
		[
			'\\b(opschepper)\\b',
			['kanebraaier']
		],
		[
			'\\b(opscheppen)\\b',
			['kanebraaiú']
		],
		[
			'\\b(makkie|gemakkelijk|meevallertje|kinderwerk)\\b',
			['kasie']
		],
		[
			'\\b(kopje)\\b',
			['bakkie']
		],
		[
			'\\b(koffie)\\b',
			['pleur']
		],
		[
			'\\b(poepen|schijten|kakken)\\b',
			['kukke']
		],
		[
			'\\b(apart)\\b',
			['ampart']
		],
		[
			'\\b(adem)\\b',
			['asem']
		],
		[
			'\\b(hele handel|gehele handel)\\b',
			['avergasie']
		],
		[
			'\\b(advocaatje|advocaat)\\b',
			['avvekaatje']
		],
		[
			'\\b(met slagroom)\\b',
			['met een kuiffie']
		],
		[
			'\\b(politieagent|politie)\\b',
			['ballenjatter', 'pliesie', 'luis', 'kit']
		],
		[
			'\\b(meteen|gelijk|tegelijkertijd)\\b',
			['bedeen']
		],
		[
			'\\b(borsten|voetbal|kale kop|kaal hoofd|kale hoofd)\\b',
			['bledder']
		],
		[
			'\\b(bromfiets|scooter|brommer)\\b',
			['brommert']
		],
		[
			'\\b(servet|servetje)\\b',
			['broodluier']
		],
		[
			'\\b(dun)\\b',
			['deun']
		],
		[
			'\\b(drempel)\\b',
			['dorpel']
		],
		[
			'\\b(wollen trui)\\b',
			['drieoktobertrui']
		],
		[
			'\\b(driewieler)\\b',
			['driewielkarretje']
		],
		[
			'\\b(kont|anus|achterwerk)\\b',
			['fondement']
		],
		[
			'\\b(kameraad|maad)\\b',
			['gabber']
		],
		[
			'\\b(elke dag)\\b',
			['iederrestaag']
		],
		[
			'\\b(kapot|gebroken|versleten|stuk|gescheurd|kaduuk|defect|failliet)\\b',
			['gallemieze']
		],
		[
			'\\b(garenmarkt)\\b',
			['garemarkt']
		],
		[
			'\\b(gezicht)\\b',
			['gebbe']
		],
		[
			'\\b(geen eens|niet eens)\\b',
			['genees']
		],
		[
			'\\b(zakenman|accountmanager|manager)\\b',
			['gouwjas']
		],

		[
			'\\b(ondertussen)\\b',
			['dewèil']
		],

		[
			'nden\\b',
			['ndûh']
		],
		[
			'rden\\b',
			['rdûh']
		],
		[
			'den\\b',
			['jûh']
		],
		[
			'ken\\b',
			['kuh']
		],
		[
			'gen\\b',
			['guh']
		],
		[
			'ren\\b',
			['ru']
		],
		[
			'dse\\b',
			['se']
		],

		[
			'\\b(bijna)\\b',
			['bekant', 'temet']
		],

		[
			'\\b(enige)\\b',
			['enigste']
		],

		[
			'\\b(eten)\\b',
			['essen']
		],


		[
			'\\b(bril)\\b',
			['fok']
		],

		[
			'\\b(&euro;|uro|€)\\b',
			['uro']
		],

		[
			'\\b(familie)\\b',
			['famielje']
		],

		[
			'\\b(gek)\\b',
			['lèhperd|zottuhklos|halve zool']
		],
		[
			'\\b(gezicht)\\b',
			['porem', 'bekkie', 'raap']
		],
		[
			'\\b(gas)\\b',
			['gast']
		],
		[
			'\\b(geld)\\b',
			['groot']
		],
		[
			'\\b(gemerkt)\\b',
			['gemorreke']
		],
		[
			'\\b(goede)\\b',
			['goeie']
		],
		[
			'(gracht)\\b',
			['gurwacht']
		],
		[
			'\\b(grappig|geestig|geinig|komisch|lol|leuk)\\b',
			['lagguh juh']
		],
		[
			'\\b(gratis|kosten loos)\\b',
			['voor nop']
		],
		[
			'\\b(gynaecoloog)\\b',
			['kierekijker']
		],
		[
			'r\\b',
			['r', 'rr', 'rrr']
		],
		[
			'\\b(haarlemmerstraat)\\b',
			['haarmestraat']
		],
		[
			'\\b(hartinfarct)\\b',
			['hardvarkuh', 'hartinvaasie']
		],
		[
			'\\b(heeft)\\b',
			['heb']
		],
		[
			'\\b(haring)\\b',
			['katwijker']
		],
		[
			'\\b(heb je)\\b',
			['hebbie']
		],
		[
			'\\b(het)\\b',
			['ut']
		],
		[
			'\\b(dronken)\\b',
			['als een maleijer']
		],
		[
			'\\b(hoofd)\\b',
			['harsus', 'bledder', 'harsus']
		],

		[
			'\\b(hij zei)\\b',
			['hij zee']
		],

		[
			'\\b(je)\\b',
			['juh']
		],

		[
			'(moeder)\\b',
			['moer']
		],
		[
			'\\b(kan)\\b',
			['ken']
		],
		[
			'\\b(kun je)\\b',
			['kejje']
		],
		[
			'\\b(kan je)\\b',
			['kejje']
		],
		[
			'\\b(katwijker)\\b',
			['Kattuker']
		],
		[
			'\\b(katwijk)\\b',
			['Kattuk']
		],
		[
			'\\b(leids)\\b',
			['leis']
		],
		[
			'\\b(meer dan)\\b',
			['meer als']
		],
		[
			'\\b(groter dan)\\b',
			['groter als']
		],
		[
			'\\b(beter dan)\\b',
			['beter als']
		],

		[
			'\\b(vrouw|meid|meisje|dame)\\b',
			['meissie', 'meh', 'gleufdiertje']
		],

		[
			'\\b(mond)\\b',
			['meelkokûr']
		],

		[
			'\\b(komt dat)\\b',
			['komp ut']
		],
		[
			'\\b(nederlands)\\b',
			['nederlans']
		],

		[
			'\\b(omdat)\\b',
			['omda']
		],

		[
			'\\b(ongelofelijk)\\b',
			['niettefilleme']
		],


		[
			'\\b(slager)\\b',
			['knors']
		],

		[
			'\\b(spinazie)\\b',
			['glip']
		],
		[
			'\\b(de)\\b',
			['duh', 'de']
		],
		[
			'\\b(stelen)\\b',
			['rauzen', 'klauwen']
		],
		[
			'\\b(vallen)\\b',
			['pleuren', 'tiefen', 'teren']
		],
		[
			'\\b(vinder)\\b',
			['vindert']
		],
		[
			'(bureau)\\b',
			['buro']
		],
		[
			'\\b(kadeau)\\b',
			['kado']
		],
		['\\b(3 oktoberfeest|3 oktober)\\b', ['driektober']],
		['\\baan\\b', ['an']],
		['\\baanrecht\\b', ['rechtbank']],
		['\\baanstonds\\b', ['aas']],
		['\\bacht\\b', ['ach']],
		['\\bafvalbak\\b', ['kiepelton']],
		['\\bafvalcontainer\\b', ['vlikobak']],
		['\\bafvaljager\\b', ['sjappetouwer']],
		['\\bAkkefietje\\b', ['Attekfietje']],
		['\\bals je een rooie ziet zeggen we\\b', ['juh rooooie vreet je haare op dur komp een stierr an']],
		['\\bambulance\\b', ['stoffer en blik']],
		['\\bapart\\b', ['ampart']],
		['\\bbagagedrager\\b', ['lasdrager']],
		['\\bbangerik\\b', ['schrikkepuit', 'broekescheitert']],
		['\\bbehelpen\\b', ['beleie']],
		['\\bbiertje\\b', ['pijpie']],
		['\\bbieten\\b', ['kroten is niet specifiek Leids.']],
		['\\bbijna\\b', ['aanstenz', 'bekant', 'temet']],
		['\\bbinnenkort\\b', ['aas', 'termee']],
		['\\bBoisotkade\\b', ['Biesjotkade']],
		['\\bbosjes\\b', ['bossies']],
		['\\bbrancard\\b', ['brrandkar']],
		['\\bBril\\b', ['Fok']],
		['\\bBromfietscertificaat\\b', ['Bromfietsfertisikaat']],
		['\\bbrommer\\b', ['brommert']],
		['\\bbureaucratie\\b', ['bureaucreatie']],
		['\\bCaravan\\b', ['Kerneven']],
		['\\bcarpaccio\\b', ['carpatio']],
		['\\bClown\\b', ['Kloon']],
		['\\bcondom\\b', ['regen jasie']],
		['\\bcriminele\\b', ['crimmenele']],
		['\\bDashbordkastje\\b', ['Bordeskastje']],
		['\\bde Decima\\b', ['de Dees']],
		['\\bde groeten\\b', ['du groetuh']],
		['\\bDe markt\\b', ['De mart']],
		['\\bdementeert\\b', ['mediteert']],
		['\\bDie is overleden\\b', ['Die is een zandwinkel begonnuh']],
		['\\bdik persoon\\b', ['kadijer']],
		['\\bdik zijn\\b', ['as kannera']],
		['\\bdikke buik\\b', ['spierbuik']],
		['\\bdikke kin\\b', ['kanis']],
		['\\bdikke kop\\b', ['bledder']],
		['\\bdood\\b', ['met de pik omhoog liggen']],
		['\\bdood zijn\\b', ['met de pisser omhoog liggen']],
		['\\bdoods hoofd\\b', ['knijne kop']],
		['\\bdrinken\\b', ['zuipe']],
		['\\bdronken\\b', ['aan de lal zijn']],
		['\\bduif\\b', ['koekerroe', 'dakscheiter']],
		['\\bdwaas\\b', ['koekerroe']],
		['\\been jongen uit de wijk de kooi\\b', ['kooiboy']],
		['\\been klap\\b', ['een drijver']],
		['\\been klap\\b', ['bamzaaier']],
		['\\been naar persoon\\b', ['een etter', 'een etterbol', 'juh darruhm', 'klerenleijer']],
		['\\been raam ingooien\\b', ['ik teer je net in']],
		['\\beerlijk\\b', ['eeluk']],
		['\\beigenwijze veldworm\\b', ['darm']],
		['\\beikel\\b', ['darm']],
		['\\belke keer\\b', ['tellekes']],
		['\\benige\\b', ['enigste']],
		['\\bErker\\b', ['erkel']],
		['\\beten\\b', ['essen']],
		['\\beuro\\b', ['uro']],
		['\\bfabriek\\b', ['fambriek']],
		['\\bFamilie\\b', ['Famielje']],
		['\\bfeestneus\\b', ['bamboezuer']],
		['\\bGa weg!\\b', ['pleurttop juh! Teer op!']],
		['\\bgas\\b', ['gast']],
		['\\bgegooid\\b', ['gepleurd']],
		['\\bgehakt\\b', ['gehak']],
		['\\bgek\\b', ['lèhperd', 'zot', 'halve zool']],
		['\\bgek iemand\\b', ['zottuhklos']],
		['\\bgekke\\b', ['gare']],
		['\\bgekkigheid\\b', ['zottighèd']],
		['\\bgeld\\b', ['groot']],
		['\\bgemerkt\\b', ['gemorreke']],
		['\\bgezicht\\b', ['bekkie', 'porrum', 'porum', 'raap']],
		['\\bglas port\\b', ['glasie poort']],
		['\\bglibber\\b', ['glipper']],
		['\\bgluren\\b', ['neuzen']],
		['\\bgoede\\b', ['goeie']],
		['\\bgoedemorgen\\b', ['mogguh']],
		['\\bgozer\\b', ['gozert']],
		['\\bgroeten\\b', ['spreken']],
		['\\bgrof vuil\\b', ['de kraak']],
		['\\bgrote kin\\b', ['cente bak']],
		['\\bgutsen\\b', ['gonzen']],
		['\\bgutst\\b', ['gonst']],
		['\\bgynaecoloog\\b', ['kierekijker']],
		['\\bHaarlemmerstraat\\b', ['Haarmestraat']],
		['\\bHangsnor\\b', ['Lorresnor']],
		['\\bharing\\b', ['katwijker']],
		['\\bhartinfarct\\b', ['hardvarkuh']],
		['\\bhartinfarct\\b', ['hartinvaasie']],
		['\\bheb je\\b', ['hebbie']],
		['\\bheeft\\b', ['heb']],
		['\\bhet\\b', ['ut']],
		['\\bHet Lisser veerhuis\\b', ['Ut Lissa virhuiz']],
		['\\bhet stinkt\\b', ['\'t meurt']],
		['\\bhet ziekenfonds\\b', ['\'t fonkst', 'het ziekefondst']],
		['\\bhij is dood\\b', ['zijn gat is koud']],
		['\\bhij is dronken\\b', ['als een maleijer']],
		['\\bhij zei\\b', ['hij zee']],
		['\\bhoofd\\b', ['bledder', 'harsus', 'bakkus']],
		['\\bhou je mond dicht\\b', ['houtje kokurrrr']],
		['\\bhuilen\\b', ['janken']],
		['\\bik ga\\b', ['ik peert \'m']],
		['\\bIk heb met hem gezoend\\b', ['Ik ben met hem gegaan']],
		['\\bik hoop dat je\\b', ['mag lije dat je']],
		['\\bimperiaal\\b', ['imperium']],
		['\\bin coma zijn\\b', ['in croma leggen']],
		['\\bin de brand\\b', ['in de hens']],
		['\\bin het water\\b', ['in de maajem']],
		['\\bingeslikt\\b', ['ingeslokke']],
		['\\bintensive care\\b', ['intensieve karee']],
		['\\bje\\b', ['juh']],
		['\\bje moeder\\b', ['je ouwe moer']],
		['\\bje moet betale\\b', ['schuive ju']],
		['\\bjenever\\b', ['jainever']],
		['\\bjij\\b', ['juh']],
		['\\bjoh\\b', ['juh']],
		['\\bjuh\\b', ['jij']],
		['\\bkaal persoon\\b', ['Kaleneet']],
		['\\bkaal worden\\b', ['juh ! je binnenbal komt ur doorheen']],
		['\\bKale kop\\b', ['Bledder']],
		['\\bkale kop\\b', ['kane kop', 'schedel']],
		['\\bkan\\b', ['ken']],
		['\\bKan/ken of kun je\\b', ['Kejje']],
		['\\bkantine\\b', ['karremetiene']],
		['\\bkarper\\b', ['karreper']],
		['\\bkatholiek zijn\\b', ['Van \'t houtje zijn']],
		['\\bKatwijker\\b', ['Katteker']],
		['\\bkauwgom\\b', ['kàgun']],
		['\\bkermis\\b', ['kerremus']],
		['\\bkijk eens\\b', ['kijkteris']],
		['\\bkin\\b', ['klus']],
		['\\bkinderwagen\\b', ['larvenbak', 'larvenkar']],
		['\\bKlap in je gezicht\\b', ['n kuister op je kanis /op die dikke bledder van juh']],
		['\\bklap op je gezicht\\b', ['hijs op je treiter']],
		['\\bKlap voor je kop\\b', ['Slag vor juh aambeelts']],
		['\\bKledingkast\\b', ['Klerekast']],
		['\\bKleine visjes\\b', ['Speldaasies']],
		['\\bklootzak\\b', ['klerelijer']],
		['\\bknaapje van kleding\\b', ['klerehanger']],
		['\\bknikker/ vuistslag\\b', ['kuister']],
		['\\bkomt dat\\b', ['komp ut']],
		['\\bkoprol\\b', ['omduikeltje']],
		['\\bkorset\\b', ['korsjet']],
		['\\bKotsen\\b', ['over je zuiger']],
		['\\bkraslot\\b', ['krasloot']],
		['\\bKrij nu wat\\b', ['krijg het lazerus']],
		['\\bkrijg het heen en weer\\b', ['juh krijg een ballutjuh']],
		['\\bKroeg\\b', ['Keilewinkel']],
		['\\bkromme neus\\b', ['zinksnijer']],
		['\\bKun je dat wel missen\\b', ['Kejje dat lije dan']],
		['\\blangs\\b', ['langes']],
		['\\blastdrager\\b', ['lasdrager']],
		['\\blastpost\\b', ['parg']],
		['\\blederen bal\\b', ['Bledder']],
		['\\bLegitimatiebewijs\\b', ['Legemetatiebewijs']],
		['\\bleidenaar\\b', ['glibber']],
		['\\bLeids\\b', ['Leis']],
		['\\blelijk gezicht\\b', ['poffertjes porum']],
		['\\bleraren\\b', ['leraars']],
		['\\bleren voetbal\\b', ['bledder']],
		['\\bLeukerd\\b', ['Nar']],
		['\\blichaam\\b', ['lijer']],
		['\\bLije\\b', ['missen']],
		['\\bmaisonnette\\b', ['majorette']],
		['\\bMajorettemeisje\\b', ['Kooigirl']],
		['\\bmank lopen\\b', ['horrel']],
		['\\bMariahoeve\\b', ['Maria Ho Effe']],
		['\\bmarinade\\b', ['marmelade']],
		['\\bmasker\\b', ['mombakkus']],
		['\\bmeer dan\\b', ['meer als']],
		['\\bmeid\\b', ['mè, mèd', 'Mêh']],
		['\\bmeisje\\b', ['meissie']],
		['\\bmep\\b', ['zaaier']],
		['\\bmeteen\\b', ['bedeen']],
		['\\bmijn god\\b', ['jeezus kristus']],
		['\\bmoeilijk\\b', ['moeluk']],
		['\\bmoet\\b', ['mot']],
		['\\bmoeten\\b', ['motten']],
		['\\bmond\\b', ['meelkokûr']],
		['\\bnaar iemand\\b', ['tirringlijer']],
		['\\bnaar mijn idee wel\\b', ['voormeinpart welja']],
		['\\bnaar persoon\\b', ['longlijer']],
		['\\bNar\\b', ['Leukerd']],
		['\\bnederlandse\\b', ['nederlanse']],
		['\\bniet eens\\b', ['genees']],
		['\\bnuance\\b', ['nowenze']],
		['\\bochtendjas\\b', ['pingwaar']],
		['\\bomdat\\b', ['omda']],
		['\\bongelijk\\b', ['onkant']],
		['\\bongelofelijk\\b', ['niette filme']],
		['\\bop je gezicht gaan\\b', ['op je plaat gaan']],
		['\\bop rotten\\b', ['op teeruh']],
		['\\bopgeborgen\\b', ['opgeborrege']],
		['\\bopgemaakt meisje\\b', ['poppeka']],
		['\\boplichter\\b', ['laaienlichter']],
		['\\bopschepper\\b', ['begeur']],
		['\\bover een poosje\\b', ['metteraas']],
		['\\boverlijden\\b', ['De pijp uit gaan ( ook Amsterdam)']],
		['\\bparaplu\\b', ['plu', 'bledderdrooghouwer', 'bledderdrooghouer']],
		['\\bpardon\\b', ['hee juhh']],
		['\\bpassant\\b', ['pesant']],
		['\\bplaaggeest\\b', ['parg']],
		['\\bplastic\\b', ['plestikke']],
		['\\bpolitiebureau\\b', ['pliesiebro']],
		['\\bprofessor\\b', ['perfesser']],
		['\\bpsychiater\\b', ['spiegiater']],
		['\\bpsycholoog\\b', ['spycholoog']],
		['\\bpuistenkop\\b', ['tietuhbek']],
		['\\bput\\b', ['kolk']],
		['\\bput/putdeksel\\b', ['kolk']],
		['\\bputdeksel\\b', ['kolk']],
		['\\braam\\b', ['net']],
		['\\bramen\\b', ['nettuh']],
		['\\brare man/vrouw\\b', ['achteleke']],
		['\\brasechte Leidenaar\\b', ['Lèdse Glibber']],
		['\\bReanimatie\\b', ['Reamikasie']],
		['\\bregen\\b', ['bledder']],
		['\\brennen\\b', ['renne']],
		['\\breproductie\\b', ['reductie']],
		['\\brimpel hoofd\\b', ['krater kop']],
		['\\broodharige\\b', ['arebei']],
		['\\broofoverval\\b', ['rowowerwal', 'rowowerfwal', 'wroofowverwval']],
		['\\brot griet\\b', ['me vullus wijf']],
		['\\brot op\\b', ['tief op']],
		['\\brot op joh!\\b', ['teer op juh!']],
		['\\brotgriet\\b', ['me vulles leier']],
		['\\brotonde\\b', ['rontonde']],
		['\\brotzooi\\b', ['tinnefzooi']],
		['\\bschaamhaar\\b', ['spinnerag']],
		['\\bslager\\b', ['knors']],
		['\\bslechte jongen\\b', ['kruize duiker']],
		['\\bsloot\\b', ['maaium']],
		['\\bsloot\\b', ['plomp']],
		['\\bsnol\\b', ['stinkdeken']],
		['\\bspagettibandjes\\b', ['hemeseeltjes']],
		['\\bspinazie\\b', ['glip']],
		['\\bstaat\\b', ['stot']],
		['\\bstelen\\b', ['klauwen', 'rauzen']],
		['\\bstoel\\b', ['karpoo']],
		['\\bstrobreed\\b', ['strookbreed']],
		['\\bsuffert\\b', ['klootzak']],
		['\\btomos (bromfiets)\\b', ['tomas (brommert)']],
		['\\btongzoenen\\b', ['kopkluiven']],
		['\\btouwfabriek\\b', ['touwbaan']],
		['\\btumor\\b', ['timor']],
		['\\bTumor\\b', ['Tumor']],
		['\\btwee koffie twee koeken\\b', ['twee pluer twee scheerbakke']],
		['\\btwijfelen\\b', ['staan in de dreig']],
		['\\bUitdagen\\b', ['uitheilige']],
		['\\bvallen\\b', ['teren', 'pleuren', 'tiefen']],
		['\\bverader\\b', ['vuile keel']],
		['\\bverraden\\b', ['verraaie']],
		['\\bvervelend persoon\\b', ['darm', 'juh bloedpoepur !']],
		['\\bvicieuze cirkel\\b', ['visuele cirkel']],
		['\\bvideoband\\b', ['fidiofillum']],
		['\\bviezerik\\b', ['viezik', 'goorlap']],
		['\\bvinder\\b', ['vindert']],
		['\\bvoetbal\\b', ['bledder']],
		['\\bvoetballen\\b', ['voebelluh']],
		['\\bvogelkooi\\b', ['vogelekooi']],
		['\\bvuurpijlen\\b', ['fuupelle']],
		['\\bWat gaan we doen?/ Wat zijn de plannen?\\b', ['Wat is wat tân?!']],
		['\\bWat is dat/wat zijn dat\\b', ['Wah benne dattan']],
		['\\bwe kwamen er aan\\b', ['we kwamme dur an']],
		['\\bwe stonden\\b', ['we stinge']],
		['\\bwedstrijd\\b', ['metse']],
		['\\bWelja\\b', ['Beijaat']],
		['\\bwerk\\b', ['werrek']],
		['\\bwesp\\b', ['weps']],
		['\\bwestside story\\b', ['wedstrijdstorie']],
		['\\bzeuren\\b', ['zaikuh']],
		['\\bziekenfonds\\b', ['siekefonst']],
		['\\bziekte van Parkinson\\b', ['ziekte van Pakistan']],
		['\\bzijlpoort\\b', ['zellepaurt']],
		['\\bZo direct\\b', ['Aastons']],
		['\\bzo meteen\\b', ['aanst', 'zobedeen']],
		['\\bzweeg\\b', ['zwoog']],
		['\\bzwerver\\b', ['zwerrever']],

		['\\b(overzicht)\\b', ['overzig']],


		['\\bkoffie\\b', ['pleur']],
		['\\b3 oktoberfeest\\b', ['driektober']],
		['\\b3 oktober\\b', ['driektober']],
		['\\baan\\b', ['an']],
		['\\baanrecht\\b', ['rechtbank']],
		['\\baanstonds\\b', ['aas']],
		['\\bacht\\b', ['ach']],
		['\\bafvalbak\\b', ['kiepelton']],
		['\\bafvalcontainer\\b', ['vlikobak']],
		['\\bafvaljager\\b', ['sjappetouwer']],
		['\\bAkkefietje\\b', ['Attekfietje']],
		['\\bambulance\\b', ['stoffer en blik']],
		['\\bapart\\b', ['ampart']],
		['\\bbagagedrager\\b', ['lasdrager']],
		['\\bbangerik\\b', ['schrikkepuit', 'broekescheitert']],
		['\\bbehelpen\\b', ['beleie']],
		['\\bbiertje\\b', ['pijpie']],
		['\\bbieten\\b', ['kroten is niet specifiek Leids.']],
		['\\bbijna\\b', ['aanstenz', 'bekant', 'temet']],
		['\\bbinnenkort\\b', ['aas', 'termee']],
		['\\bBoisotkade\\b', ['Biesjotkade']],
		['\\bbosjes\\b', ['bossies']],
		['\\bbrancard\\b', ['brrandkar']],
		['\\bBril\\b', ['Fok']],
		['\\bBromfietscertificaat\\b', ['Bromfietsfertisikaat']],
		['\\bbrommer\\b', ['brommert']],
		['\\bbureaucratie\\b', ['bureaucreatie']],
		['\\bCaravan\\b', ['Kerneven']],
		['\\bcarpaccio\\b', ['carpatio']],
		['\\bClown\\b', ['Kloon']],
		['\\bcondom\\b', ['regen jasie']],
		['\\bcondoom\\b', ['regen jasie']],
		['\\bcriminele\\b', ['crimmenele']],
		['\\bDashbordkastje\\b', ['Bordeskastje']],
		['\\bde Decima\\b', ['de Dees']],
		['\\bde groeten\\b', ['du groetuh']],
		['\\bDe markt\\b', ['De mart']],
		['\\bdementeert\\b', ['mediteert']],
		['\\bDie is overleden\\b', ['Die is een zandwinkel begonnuh']],
		['\\bdik persoon\\b', ['kadijer']],
		['\\bdik zijn\\b', ['as kannera']],
		['\\bdikke buik\\b', ['spierbuik']],
		['\\bdikke kin\\b', ['kanis']],
		['\\bdikke kop\\b', ['bledder']],
		['\\bdood\\b', ['met de pik omhoog liggen']],
		['\\bdood zijn\\b', ['met de pisser omhoog liggen']],
		['\\bdoods hoofd\\b', ['knijne kop']],
		['\\bdrinken\\b', ['zuipe']],
		['\\bdronken\\b', ['aan de lal zijn']],
		['\\bduif\\b', ['koekerroe']],
		['\\bdwaas\\b', ['koekerroe']],
		['\\been jongen uit de wijk de kooi\\b', ['kooiboy']],
		['\\been klap\\b', ['een drijver']],
		['\\been klap\\b', ['bamzaaier']],
		['\\been naar persoon\\b', ['een etter', 'een etterbol', 'juh darruhm', 'klerenleijer']],
		['\\been raam ingooien\\b', ['ik teer je net in']],
		['\\beerlijk\\b', ['eeluk']],
		['\\beigenwijze veldworm\\b', ['darm']],
		['\\beikel\\b', ['darm']],
		['\\belke keer\\b', ['tellekes']],
		['\\benige\\b', ['enigste']],
		['\\bErker\\b', ['erkel']],
		['\\beten\\b', ['essen']],
		['\\beuro\\b', ['uro']],
		['\\bfabriek\\b', ['fambriek']],
		['\\bFamilie\\b', ['Famielje']],
		['\\bfeestneus\\b', ['bamboezuer']],
		['\\bGa weg!\\b', ['pleurttop juh! Teer op!']],
		['\\bgas\\b', ['gast']],
		['\\bgegooid\\b', ['gepleurd']],
		['\\bgehakt\\b', ['gehak']],
		['\\bgek\\b', ['lèhperd', 'zot', 'halve zool']],
		['\\bgek iemand\\b', ['zottuhklos']],
		['\\bgekke\\b', ['gare']],
		['\\bgekkigheid\\b', ['zottighèd']],
		['\\bgeld\\b', ['groot']],
		['\\bgemerkt\\b', ['gemorreke']],
		['\\bgezicht\\b', ['bekkie', 'porrum', 'porum', 'raap']],
		['\\bglas port\\b', ['glasie poort']],
		['\\bglibber\\b', ['glipper']],
		['\\bgluren\\b', ['neuzen']],
		['\\bgoede\\b', ['goeie']],
		['\\bgoedemorgen\\b', ['mogguh']],
		['\\bgozer\\b', ['gozert']],
		['\\bgracht\\b', ['gurwacht']],
		['\\bgrappig\\b', ['lagguh juh']],
		['\\bgratis, kostenloos\\b', ['voor nop']],
		['\\bgroeten\\b', ['spreken']],
		['\\bgrof vuil\\b', ['de kraak']],
		['\\bgrote kin\\b', ['cente bak']],
		['\\bgutsen\\b', ['gonzen']],
		['\\bgutst\\b', ['gonst']],
		['\\bgynaecoloog\\b', ['kierekijker']],
		['\\bHaarlemmerstraat\\b', ['Haarmestraat']],
		['\\bHangsnor\\b', ['Lorresnor']],
		['\\bharing\\b', ['katwijker']],
		['\\bhartinfarct\\b', ['hardvarkuh']],
		['\\bhartinfarct\\b', ['hartinvaasie']],
		['\\bheb je\\b', ['hebbie']],
		['\\bheeft\\b', ['heb']],
		['\\bhet\\b', ['ut']],
		['\\bHet Lisser veerhuis\\b', ['Ut Lissa virhuiz']],
		['\\bhet stinkt\\b', ['\'t meurt']],
		['\\bhet ziekenfonds\\b', ['\'t fonkst', 'het ziekefondst']],
		['\\bhij is dood\\b', ['zijn gat is koud']],
		['\\bhij is dronken\\b', ['als een maleijer']],
		['\\bhij zei\\b', ['hij zee']],
		['\\bhoofd\\b', ['bledder', 'harsus', 'bakkus']],
		['\\bhou je mond dicht\\b', ['houtje kokurrrr']],
		['\\bhuilen\\b', ['janken']],
		['\\bik ga\\b', ['ik peert \'m']],
		['\\bIk heb met hem gezoend\\b', ['Ik ben met hem gegaan']],
		['\\bik hoop dat je\\b', ['mag lije dat je']],
		['\\bimperiaal\\b', ['imperium']],
		['\\bin coma zijn\\b', ['in croma leggen']],
		['\\bin de brand\\b', ['in de hens']],
		['\\bin het water\\b', ['in de maajem']],
		['\\bingeslikt\\b', ['ingeslokke']],
		['\\bintensive care\\b', ['intensieve karee']],
		['\\bje\\b', ['juh']],
		['\\bje moeder\\b', ['je ouwe moer']],
		['\\bje moet betale\\b', ['schuive ju']],
		['\\bjenever\\b', ['jainever']],
		['\\bjij\\b', ['juh']],
		['\\bjoh\\b', ['juh']],
		['\\bjuh\\b', ['jij']],
		['\\bkaal persoon\\b', ['Kaleneet']],
		['\\bkaal worden\\b', ['juh ! je binnenbal komt ur doorheen']],
		['\\bKale kop\\b', ['Bledder']],
		['\\bkale kop\\b', ['kane kop', 'schedel']],
		['\\bkan\\b', ['ken']],
		['\\bKan/ken of kun je\\b', ['Kejje']],
		['\\bkantine\\b', ['karremetiene']],
		['\\bkarper\\b', ['karreper']],
		['\\bkatholiek zijn\\b', ['Van \'t houtje zijn']],
		['\\bKatwijker\\b', ['Katteker']],
		['\\bkauwgom\\b', ['kàgun']],
		['\\bkermis\\b', ['kerremus']],
		['\\bkijk eens\\b', ['kijkteris']],
		['\\bkin\\b', ['klus']],
		['\\bkinderwagen\\b', ['larvenbak', 'larvenkar']],
		['\\bKlap in je gezicht\\b', ['n kuister op je kanis /op die dikke bledder van juh']],
		['\\bklap op je gezicht\\b', ['hijs op je treiter']],
		['\\bKlap voor je kop\\b', ['Slag vor juh aambeelts']],
		['\\bKledingkast\\b', ['Klerekast']],
		['\\bKleine visjes\\b', ['Speldaasies']],
		['\\bklootzak\\b', ['klerelijer']],
		['\\bknaapje van kleding\\b', ['klerehanger']],
		['\\bknikker/ vuistslag\\b', ['kuister']],
		['\\bkomt dat\\b', ['komp ut']],
		['\\bkoprol\\b', ['omduikeltje']],
		['\\bkorset\\b', ['korsjet']],
		['\\bKotsen\\b', ['over je zuiger']],
		['\\bkraslot\\b', ['krasloot']],
		['\\bKrij nu wat\\b', ['krijg het lazerus']],
		['\\bkrijg het heen en weer\\b', ['juh krijg een ballutjuh']],
		['\\bKroeg\\b', ['Keilewinkel']],
		['\\bkromme neus\\b', ['zinksnijer']],
		['\\bKun je dat wel missen\\b', ['Kejje dat lije dan']],
		['\\blangs\\b', ['langes']],
		['\\blastdrager\\b', ['lasdrager']],
		['\\blastpost\\b', ['parg']],
		['\\blederen bal\\b', ['Bledder']],
		['\\bLegitimatiebewijs\\b', ['Legemetatiebewijs']],
		['\\bleidenaar\\b', ['glibber']],
		['\\bLeids\\b', ['Leis']],
		['\\blelijk gezicht\\b', ['poffertjes porum']],
		['\\bleraren\\b', ['leraars']],
		['\\bleren voetbal\\b', ['bledder']],
		['\\bLeukerd\\b', ['Nar']],
		['\\blichaam\\b', ['lijer']],
		['\\bLije\\b', ['missen']],
		['\\bmaisonnette\\b', ['majorette']],
		['\\bMajorettemeisje\\b', ['Kooigirl']],
		['\\bmank lopen\\b', ['horrel']],
		['\\bMariahoeve\\b', ['Maria Ho Effe']],
		['\\bmarinade\\b', ['marmelade']],
		['\\bmasker\\b', ['mombakkus']],
		['\\bmeer dan\\b', ['meer als']],
		['\\bmeid\\b', ['mè, mèd', 'Mêh']],
		['\\bmeisje\\b', ['meissie']],
		['\\bmep\\b', ['zaaier']],
		['\\bmeteen\\b', ['bedeen']],
		['\\bmijn god\\b', ['jeezus kristus']],
		['\\bmoeilijk\\b', ['moeluk']],
		['\\bmoet\\b', ['mot']],
		['\\bmoeten\\b', ['motten']],
		['\\bmond\\b', ['meelkokûr']],
		['\\bnaar iemand\\b', ['tirringlijer']],
		['\\bnaar mijn idee wel\\b', ['voormeinpart welja']],
		['\\bnaar persoon\\b', ['longlijer']],
		['\\bNar\\b', ['Leukerd']],
		['\\bnederlandse\\b', ['nederlanse']],
		['\\bniet eens\\b', ['genees']],
		['\\bnuance\\b', ['nowenze']],
		['\\bochtendjas\\b', ['pingwaar']],
		['\\bomdat\\b', ['omda']],
		['\\bongelijk\\b', ['onkant']],
		['\\bongelofelijk\\b', ['niette filme']],
		['\\bop je gezicht gaan\\b', ['op je plaat gaan']],
		['\\bop rotten\\b', ['op teeruh']],
		['\\bopgeborgen\\b', ['opgeborrege']],
		['\\bopgemaakt meisje\\b', ['poppeka']],
		['\\boplichter\\b', ['laaienlichter']],
		['\\bopschepper\\b', ['begeur']],
		['\\bover een poosje\\b', ['metteraas']],
		['\\boverlijden\\b', ['De pijp uit gaan ( ook Amsterdam)']],
		['\\bparaplu\\b', ['plu', 'bledderdrooghouwer', 'bledderdrooghouer']],
		['\\bpardon\\b', ['hee juhh']],
		['\\bpassant\\b', ['pesant']],
		['\\bplaaggeest\\b', ['parg']],
		['\\bplastic\\b', ['plestikke']],
		['\\bpolitie\\b', ['pliesie', 'Popo']],
		['\\bpolitieagent\\b', ['klabak', 'een luis']],
		['\\bpolitieagenten\\b', ['de kit']],
		['\\bpolitiebureau\\b', ['pliesiebro']],
		['\\bPostduif\\b', ['Dakscheiter']],
		['\\bprofessor\\b', ['perfesser']],
		['\\bpsychiater\\b', ['spiegiater']],
		['\\bpsycholoog\\b', ['spycholoog']],
		['\\bpuistenkop\\b', ['tietuhbek']],
		['\\bput\\b', ['kolk']],
		['\\bput/putdeksel\\b', ['kolk']],
		['\\bputdeksel\\b', ['kolk']],
		['\\braam\\b', ['net']],
		['\\bramen\\b', ['nettuh']],
		['\\brare man/vrouw\\b', ['achteleke']],
		['\\brasechte Leidenaar\\b', ['Lèdse Glibber']],
		['\\bReanimatie\\b', ['Reamikasie']],
		['\\bregen\\b', ['bledder']],
		['\\brennen\\b', ['renne']],
		['\\breproductie\\b', ['reductie']],
		['\\brimpel hoofd\\b', ['krater kop']],
		['\\broodharige\\b', ['arebei']],
		['\\broofoverval\\b', ['rowowerwal', 'rowowerfwal', 'wroofowverwval']],
		['\\brot griet\\b', ['me vullus wijf']],
		['\\brot op\\b', ['tief op']],
		['\\brot op joh!\\b', ['teer op juh!']],
		['\\brotgriet\\b', ['me vulles leier']],
		['\\brotonde\\b', ['rontonde']],
		['\\brotzooi\\b', ['tinnefzooi']],
		['\\bschaamhaar\\b', ['spinnerag']],
		['\\bslager\\b', ['knors']],
		['\\bslechte jongen\\b', ['kruize duiker']],
		['\\bsloot\\b', ['maaium']],
		['\\bsloot\\b', ['plomp']],
		['\\bsnol\\b', ['stinkdeken']],
		['\\bspagettibandjes\\b', ['hemeseeltjes']],
		['\\bspinazie\\b', ['glip']],
		['\\bstaat\\b', ['stot']],
		['\\bstelen\\b', ['klauwen', 'rauzen']],
		['\\bstoel\\b', ['karpoo']],
		['\\bstrobreed\\b', ['strookbreed']],
		['\\bsuffert\\b', ['klootzak']],
		['\\btomos (bromfiets)\\b', ['tomas (brommert)']],
		['\\btongzoenen\\b', ['kopkluiven']],
		['\\btouwfabriek\\b', ['touwbaan']],
		['\\btumor\\b', ['timor']],
		['\\bTumor\\b', ['Tumor']],
		['\\btwee koffie twee koeken\\b', ['twee pluer twee scheerbakke']],
		['\\btwijfelen\\b', ['staan in de dreig']],
		['\\bUitdagen\\b', ['uitheilige']],
		['\\bvallen\\b', ['teren', 'pleuren', 'tiefen']],
		['\\bverader\\b', ['vuile keel']],
		['\\bverraden\\b', ['verraaie']],
		['\\bvervelend persoon\\b', ['darm', 'juh bloedpoepur !']],
		['\\bvicieuze cirkel\\b', ['visuele cirkel']],
		['\\bvideoband\\b', ['fidiofillum']],
		['\\bviezerik\\b', ['viezik', 'goorlap']],
		['\\bvinder\\b', ['vindert']],
		['\\bvoetbal\\b', ['bledder']],
		['\\bvoetballen\\b', ['voebelluh']],
		['\\bvogelkooi\\b', ['vogelekooi']],
		['\\bvuurpijlen\\b', ['fuupelle']],
		['\\bWat gaan we doen?/ Wat zijn de plannen?\\b', ['Wat is wat tân?!']],
		['\\bWat is dat/wat zijn dat\\b', ['Wah benne dattan']],
		['\\bwe kwamen er aan\\b', ['we kwamme dur an']],
		['\\bwe stonden\\b', ['we stinge']],
		['\\bwedstrijd\\b', ['metse']],
		['\\bWelja\\b', ['Beijaat']],
		['\\bwerk\\b', ['werrek']],
		['\\bwesp\\b', ['weps']],
		['\\bwestside story\\b', ['wedstrijdstorie']],
		['\\bzeuren\\b', ['zaikuh']],
		['\\bziekenfonds\\b', ['siekefonst']],
		['\\bziekte van Parkinson\\b', ['ziekte van Pakistan']],
		['\\bzijlpoort\\b', ['zellepaurt']],
		['\\bZo direct\\b', ['Aastons']],
		['\\bzo meteen\\b', ['aanst', 'zobedeen']],
		['\\bzweeg\\b', ['zwoog']],
		['\\bzwerver\\b', ['zwerrever']],


		[
			'\\. ',
			['. ', '. ', '. ', ', jûh. ', ', jûh darm. ', ', jûh kadijer. ', ', jûh koekerroe. ']
		]


	];


	var findIn = document.getElementsByTagName('body')[0];
	dictonary.forEach(function (item) {

		var reg = new RegExp(item[0], 'ig');

		findAndReplaceDOMText(findIn, {
			find: reg,
			replace: function (node) {
				if (!node.text.replace(/\W/, '')) return node.text;
				var replaceWith = item[1].length === 1 ? item[1][0] : item[1][Math.floor(Math.random() * item[1].length)];

				var first = node.text.substr(0, 1);
				if (first === first.toUpperCase()) {
					replaceWith = replaceWith.charAt(0).toUpperCase() + replaceWith.slice(1);
				}

				return replaceWith;
			}
		});

	});

	var link = document.createElement('a');
	link.setAttribute('href', 'http://www.leiduhfy.nl');
	link.setAttribute('style', 'position: fixed; right: 0; bottom: 0; z-index: 99999; cursor:pointer;');

	var badge = document.createElement('img');
	badge.src = '//s3-eu-west-1.amazonaws.com/leiduhfy.swis.nl/leiduhfy-badge.png';
	badge.setAttribute('style', 'position: relative;');

	link.appendChild(badge);
	document.getElementsByTagName('body')[0].appendChild(link);

});
})();