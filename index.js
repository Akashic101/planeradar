const radar = require('flightradar24-client/lib/radar') //https://www.npmjs.com/package/flightradar24-client
var cron = require('node-cron'); //https://www.npmjs.com/package/node-cron

cron.schedule('* * * * *', () => {
	radar(51.510, 51.730, 51.722, 51.730) //(north, west, south, east)
		.then((result) => {
			if (result.length == 0) {
				console.log("There is no plane above your house")
			}
		});
});