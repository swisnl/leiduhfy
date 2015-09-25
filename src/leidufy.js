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
		]
	];


	dictonary.forEach(function(item){

		var reg = new RegExp(item[0], 'i');

		findAndReplaceDOMText(document.getElementsByTagName('body')[0], {
			find: reg,
			replace: function(node){
				var replaceWith = item[1].length === 1 ? item[1] : item[1][Math.floor(Math.random() * item[1].length)];

				var last = node.text.substr(-1, 1);
				if(last.match(/\W/)){
					replaceWith = replaceWith + last;
				}

				return replaceWith;
			}
		});

	});

});