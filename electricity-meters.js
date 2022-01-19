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
		const getMeterById = `select * from electricity_meter where id = $1`;
		const result = await pool.query(getMeterById, [streetId])
		if (result.rows.length > 0) {
			return result.rows[0];
		}
	}

	// return all the appliances
	async function appliances() {
		const showAppliances = `select * from appliance`;
		const result = await pool.query(showAppliances)
		return result.rows;
	}

	// increase the meter balance for the meterId supplied
	function topupElectricity(meterId, units) {
		const recharge = `update electricity_meter set balance = balance + 50 where meter_number = $4`;
		const result = await pool.query(recharge, [units][meterId]);
		return 
	}
	
	// return the data for a given balance
	function meterData(meterId) {
	
	}

	// decrease the meter balance for the meterId supplied
	function useElectricity(meterId, units) {
	
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