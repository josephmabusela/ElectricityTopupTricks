const express = require('express');
const exphbs  = require('express-handlebars');
//const pg = require('pg');
const { Pool } = require('pg');

const app = express();
const PORT =  process.env.PORT || 3017;

const ElectricityMeters = require('./electricity-meters');

const connectionString = process.env.DATABASE_URL ||'postgres://yrbehdwdftvrmt:f05ed3cb1d2f7ff3d8471970a855852053caabac9d44c774ba52b2df5126741a@ec2-54-80-137-25.compute-1.amazonaws.com:5432/d8adp8a02hknnk';

const pool = new Pool({
    connectionString ,
	ssl: { rejectUnauthorized: false}
});

pool.connect();

//const { Client } = require('pg');

// const client = new Client({
//   connectionString: process.env.DATABASE_URL,
//   ssl: {
//     rejectUnauthorized: false
//   }
// });

// client.connect();

// enable the req.body object - to allow us to use HTML forms
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// enable the static folder...
app.use(express.static('public'));

// add more middleware to allow for templating support

app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars');

const electricityMeters = ElectricityMeters(pool);

app.get('/', async function(req, res) {

	const showStreets = await electricityMeters.streets();
	const appliances = await electricityMeters.appliances();

	res.render('index', {
		showStreets,
		appliances
	});
});

app.get('/streets', async function(req, res) {
	
	res.render('streets', {
		streets
	});
});

app.get('/appliances', async function(req, res) {
	const appliances = await electricityMeters.appliances();
	res.render('appliances', {
		appliances
	});
});

app.get('/meter/:street_id', async function(req, res) {

	// use the streetMeters method in the factory function...
	// send the street id in as sent in by the URL parameter street_id - req.params.street_id

	// create  template called street_meters.handlebars
	// in there loop over all the meters and show them on the screen.
	// show the street number and name and the meter balance

	const meters = await electricityMeters.streetMeters()

	res.render('street_meters', {
		meters
	});
});

app.get('/meter/use/:meter_id', async function(req, res) {

	// show the current meter balance and select the appliance you are using electricity for
	res.render('use_electicity', {
		meters
	});
});

app.post('/meter/use/:meter_id', async function(req, res) {

	// update the meter balance with the usage of the appliance selected.
	res.render(`/meter/user/${req.params.meter_id}`);

});

// start  the server and start listening for HTTP request on the PORT number specified...
app.listen(PORT, function() {
	console.log(`App started on port ${PORT}`)
});