import Timestamp from '../timestamp/Timestamp';
import { difference } from '../timestamp/functions';

// const YEAR = 365 * 

export const time = timestamp => {
	const now = new Timestamp();
	let s = '';

	let a = new Timestamp();
	let b = new Timestamp().add({ months: 11 });

	let d = difference(b, a);
	d.add({ months: 0 }) (12 + d.month) % 12;
	console.log(d);
	// let d = difference(timestamp, now);



	return s;
}