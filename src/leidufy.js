domready(function(){

	var dictonary = [
		[
			'homo|homoseksueel|nicht|poot|relnicht|gay|homofiel\\W',
			['gulpenruiker', 'klapbegonia', 'zadelsnuffelaar']
		]
	];


	dictonary.forEach(function(item){

		var reg = new RegExp(item[0], 'i');

		findAndReplaceDOMText(document.getElementsByTagName('body')[0], {
			find: reg,
			replace: function(){
				return item[1][Math.floor(Math.random() * item[1].length)];
			}
		});

	});

});