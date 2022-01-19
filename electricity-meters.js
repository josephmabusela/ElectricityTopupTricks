// this is our
module.exports = function(pool) {

	// list all the streets the we have on records
	async function streets() {
		const streets = `select * from street`;
		const result = await pool.query(streets);
		return result.rows;

	}

	// for a given street show all the meters and their balances
	async function streetMeters(streetId) {
		const streetMeters = await pool.query(`select id, balance from electricity_meter where street_id = $1`, [streetId]);
		return streetMeters.rows;
	}

	// return all the appliances
	async function appliances() {
		const showAppliances = await pool.query(`select name, rate from appliance`);
		return showAppliances.rows;
	}

	// increase the meter balance for the meterId supplied
	async function topupElectricity(meterId, units) {
		const recharge = await pool.query(`update electricity_meter set balance = $1 where meter_number = $1`, [units], [meterId]);
		return recharge.rows

	}
	
	// return the data for a given balance
	async function meterData(meterId) {
		const meter = await pool.query(`select * from electricity_meter where id = $1`, [meterId]);
		return meter.rows;
	}

	// decrease the meter balance for the meterId supplied
	async function useElectricity(meterId, units) {
		const currentUnits = await pool.query(`select balance from electricity_meter`);
		const consumeUnits = currentUnits - units;
		const availableUnits = await pool.query(`update electricity_meter set balance = $1 where id = $1`,[consumeUnits], [meterId]);
		return availableUnits.rows;
	}

	return {
		streets,
		streetMeters,
		appliances,
		topupElectricity,
		meterData,
		useElectricity
	}

}