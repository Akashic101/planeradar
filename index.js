const radar = require('flightradar24-client/lib/radar') //https://www.npmjs.com/package/flightradar24-client#radarnorth-west-south-east
const flight = require('flightradar24-client/lib/flight') //https://www.npmjs.com/package/flightradar24-client#flightid
var cron = require('node-cron'); //https://www.npmjs.com/package/node-cron
const fs = require('fs');


cron.schedule('* * * * *', () => { //(minute, hour, day of month, month, day of week)
	radar(52.270, 8.168, 51.591, 8.996) //(north(Latitude), west(Longitude), south(Latitude), east(Longitude))
		.then((radar) => {
			if (!radar.length) {
				console.log("There is no plane above your house")
			} else {
				console.log(`There are ${radar.length} planes above your house!`)

				//With the help of: https://stackoverflow.com/questions/36856232/write-add-data-in-json-file-using-node-js

				//Create a JavaScript object with the table array in it
				var flightsList = { 
					flights: []
				};

				radar.forEach(plane => {
					flight(`${plane.id}`)
						.then((planeInfo) => {
							flightsList.flights.push({ //Add some data to it
								id: plane.id,
								callsign: plane.callsign,
								flight: plane.flight,
								Altitude: plane.altitude,
								speed: plane.speed,
								origin: {
									id: planeInfo.origin.id,
									name: planeInfo.origin.name,
									country: planeInfo.origin.country
								},
								destination: {
									id: planeInfo.destination.id,
									name: planeInfo.destination.name,
									country: planeInfo.destination.country
								}
							});

							try {
								var data = JSON.stringify(flightsList, null, "\t"); //Convert it from an object to a string with JSON.stringify

								fs.writeFileSync('./planeflight.json', data, 'utf8'); //Use fs to write the file to disk (filename, data, fileformat)
							} catch (err) {
								console.log(`Error writing file: ${err}`);
							}
						})
				})
			}
		});
});