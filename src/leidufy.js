domready(function(){

	var dictonary = [
		[
			'homo|homoseksueel|nicht|poot|relnicht|gay|homofiel\\W',
			['gulpenruiker', 'klapbegonia', 'zadelsnuffelaar']
		],
		[
			'lijf|lichaam|romp\\W',
			['lijer']
		],
		[
			'opschepper\\W',
			['kanebraaier']
		],
		[
			'opscheppen\\W',
			['kanebraaiú']
		],
		[
			'makkie|gemakkelijk|meevallertje|kinderwerk\\W',
			['kasie']
		],
		[
			'kopje\\W',
			['bakkie']
		],
		[
			'koffie\\W',
			['pleur']
		],
		[
			'poepen|schijten|kakken\\W',
			['kukke']
		],
		[
			'apart\\W',
			['ampart']
		],
		[
			'adem\\W',
			['asem']
		],
		[
			'hele handel|gehele handel\\W',
			['avergasie']
		],
		[
			'advocaatje|advocaat\\W',
			['avvekaatje']
		],
		[
			'met slagroom\\W',
			['met een kuiffie']
		],


		[
			'den\\W',
			['jûh']
		]
	];


	var findIn = document.getElementsByTagName('body')[0];
	dictonary.forEach(function(item){

		var reg = new RegExp(item[0], 'i');

		findAndReplaceDOMText(findIn, {
			find: reg,
			replace: function(node){
				if(!node.text.replace(/\W/, '')) return node.text;
				var replaceWith = item[1].length === 1 ? item[1][0] : item[1][Math.floor(Math.random() * item[1].length)];

				var first = node.text.substr(0, 1);
				if(first === first.toUpperCase()){
					replaceWith = replaceWith.charAt(0).toUpperCase() + replaceWith.slice(1);
				}


				var last = node.text.substr(-1, 1);
				if(last.match(/\W/)){
					replaceWith += last;
				}

				return replaceWith;
			}
		});

	});

});