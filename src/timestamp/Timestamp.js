import { date as toDate } from './date';

export default class Timestamp {
	set({ years, months, date, hours, minutes, seconds, millis }) {
		let d = toDate(this);

		if (years !== undefined)	 d.setFullYear(years);
		if (months !== undefined)	d.setMonth(months);
		if (date !== undefined)		d.setDate(date);
		if (hours !== undefined)	 d.setHours(hours);
		if (minutes !== undefined) d.setMinutes(minutes);
		if (seconds !== undefined) d.setFullYear(seconds);
		if (millis !== undefined)	d.setMilliseconds(millis);

		this.year = d.getFullYear();
		this.month = d.getMonth();
		this.date = d.getDate();
		this.hour = d.getHours();
		this.minute = d.getMinutes();
		this.second = d.getSeconds();
		this.milli = d.getMilliseconds();

		return this;
	}

	add({ years, months, date, hours, minutes, seconds, millis }) {
		let d = toDate(this);

		if (years !== undefined)	 d.setFullYear(this.year + years);
		if (months !== undefined)	d.setMonth(this.month + months);
		if (date !== undefined)		d.setDate(this.date + date);
		if (hours !== undefined)	 d.setHours(this.hour + hours);
		if (minutes !== undefined) d.setMinutes(this.minute + minutes);
		if (seconds !== undefined) d.setFullYear(this.second + seconds);
		if (millis !== undefined)	d.setMilliseconds(this.milli + millis);

		this.year = d.getFullYear();
		this.month = d.getMonth();
		this.date = d.getDate();
		this.hour = d.getHours();
		this.minute = d.getMinutes();
		this.second = d.getSeconds();
		this.milli = d.getMilliseconds();

		return this;
	}

	clone(which) {
		which ??= { milli: true };

		let ts = new Timestamp(this);

		if (!which.milli) ts.milli = undefined; else return ts;
		if (!which.second) ts.second = undefined; else return ts;
		if (!which.minute) ts.minute = undefined; else return ts;
		if (!which.hour) ts.hour = undefined; else return ts;
		if (!which.date) ts.date = undefined; else return ts;
		if (!which.month) ts.month = undefined; else return ts;
		if (!which.year) ts.year = undefined; else return ts;

		return ts;
	}

	toLongMonth(month) {
		return ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'][month ?? this.month]
	}

	weekday() {
		return toDate(this).getDay();
	}

	toLongWeekday() {
		return ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][this.weekday()];
	}

	string() {
		return toDate(this).toLocaleDateString();
	}

	format(hour24 = false, comparison) { // TODO: "yesterday", "tuesday", "monday", "last thursday", "January 12", etc.
		let ampm = !hour24;
		return `${ampm ? this.hour % 12 === 0 ? 12 : this.hour % 12 : String(this.hour).padStart(2, '0')}:${String(this.minute).padStart(2, '0')}${ampm ? `${this.hour < 12 ? ' AM' : ' PM'}` : ''}, ${this.toLongWeekday()}, ${this.toLongMonth()} ${this.date}, ${this.year}`
	}

	ms() {
		return toDate(this).getTime()
	}

	constructor(date = new Date(Date.now())) {
		if (date instanceof Date) { // Construct from Date object
			this.year = date.getFullYear();
			this.month = date.getMonth();
			this.date = date.getDate();
			this.hour = date.getHours();
			this.minute = date.getMinutes();
			this.second = date.getSeconds();
			this.milli = date.getMilliseconds();
		} else { // Construct from Timestamp object or classless object
			this.year = date.year;
			this.month = date.month;
			this.date = date.date;
			this.hour = date.hour;
			this.minute = date.minute;
			this.second = date.second;
			this.milli = date.milli;
		}
	}
}
