const assert = require("assert");
const pg = require('pg');
const Pool = pg.Pool;
const ElectricityMeters = require('../electricity-meters');

const connectionString = process.env.DATABASE_URL || 'postgresql://coder:pg123@localhost:5432/topups_db';

const pool = new Pool({
    connectionString  
});

describe("The Electricity meter", function() {

	this.beforeAll(function() {
		pool.query(`update electricity_meter set balance = 50`);
	});

	it("should see all the streets", async function() {
		const electricityMeters = ElectricityMeters(pool);
		const streets = await electricityMeters.streets();

		const streetList = [
			 {
			   "id": 1,
			   "name": "Miller Street"
			 },
			 {
			   "id": 2,
			   "name": "Mathaba Crescent"
			 },
			 {
			   "id": 3,
			   "name": "Vilakazi Road"
			 }]
			

		assert.deepStrictEqual(streetList, streets);

	});

	it("should see all the appliances", async function() {

		const electricityMeters = ElectricityMeters(pool);
		const appliances = await electricityMeters.appliances();
		
		const appliancesAndRates = [
			{
				"name": "Stove",
				"rate": "4.50"
			},
			{
				"name": "TV",
				"rate": "1.80"
			},
			{
				"name": "Heater",
				"rate": "3.50"
			},
			{
				"name": "Fridge",
				"rate": "4.00"
			},
			{
				"name": "Kettle",
				"rate": "2.70"
			},
		]
		assert.deepStrictEqual(appliancesAndRates, appliances);

	});

	it("should see all the appliances", async function() {

		const electricityMeters = ElectricityMeters(pool);
		const appliances = await electricityMeters.appliances();
		
		const appliancesAndRates = [
			{
				"name": "Stove",
				"rate": "4.50"
			},
			{
				"name": "TV",
				"rate": "1.80"
			},
			{
				"name": "Heater",
				"rate": "3.50"
			},
			{
				"name": "Fridge",
				"rate": "4.00"
			},
			{
				"name": "Kettle",
				"rate": "2.70"
			},
		]
		assert.deepStrictEqual(appliancesAndRates, appliances);

	});

	it("should be able to topup electricity", async function() {

		const electricityMeters = ElectricityMeters(pool);
		const updateMeter = [
			{
				"balance": "50.00",
				"id": 3,
				"meter_number": null,
				"street_id": 1,
				"street_number": "8"
			}
		]
		const meterData = await electricityMeters.meterData(3);
		assert.deepStrictEqual(updateMeter, meterData);

	});

	it("should be able to use electricity", async function() {

		const electricityMeters = ElectricityMeters(pool);
		const appliances = await electricityMeters.useElectricity(2, 20);
		const meterData = await electricityMeters.meterData(2);
		assert.deepStrictEqual(undefined, meterData.balance);

	});

	this.afterAll(function() {
		pool.end();
	});

});