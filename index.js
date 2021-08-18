const radar = require('flightradar24-client/lib/radar') //https://www.npmjs.com/package/flightradar24-client#radarnorth-west-south-east
const flight = require('flightradar24-client/lib/flight') //https://www.npmjs.com/package/flightradar24-client#flightid
var cron = require('node-cron'); //https://www.npmjs.com/package/node-cron

cron.schedule('* * * * *', () => { //(minute, hour, day of month, month, day of week)
	radar(52.270, 8.168, 51.591, 8.996) //(north(Latitude), west(Longitude), south(Latitude), east(Longitude))
		.then((radar) => {
			if (!radar.length) {
				console.log("There is no plane above your house")
			} else {
				console.log(`There are ${radar.length} planes above your house! \n`)
				radar.forEach(plane => {
					flight(`${plane.id}`)
						.then((planeInfo) => {
							console.log(`Plane info:
							Plane: ${planeInfo.airline} ${planeInfo.model}
							Callsign: ${plane.callsign}
							Flight: ${plane.flight}
							Speed: ${plane.speed} knots (${(plane.speed*1.852).toFixed(2)}kp/h)
							Altitude: ${plane.altitude} feet (${(plane.altitude*0.3048).toFixed(2)}m)
							Flight info:
							Origin: ${planeInfo.origin.name} (${planeInfo.origin.id})
							Destination: ${planeInfo.destination.name} (${planeInfo.destination.id}) \n`);
						})
				})
				console.log(``)
			}
		});
});