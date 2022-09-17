import { get } from 'svelte/store';
import { preferences } from '../js/stores';
import Timestamp from './Timestamp';
import { date as __date } from './date';

export const compare = (ts1, ts2, depth = { milli: true }) => {
	if (!(ts1 instanceof Timestamp) || !(ts2 instanceof Timestamp)) return {};

	if (depth.milli) depth.second = true;
	if (depth.second) depth.minute = true;
	if (depth.minute) depth.hour = true;
	if (depth.hour) depth.date = true;
	if (depth.date) depth.month = true;
	if (depth.month) depth.year = true;

	if (depth.year) {
		if (ts1.year < ts2.year && depth.year) {
			return { less: true };
		} else if (ts1.year > ts2.year && depth.year) {
			return { greater: true };
		}
	}

	if (depth.month) {
		if (ts1.month < ts2.month && depth.month) {
			return { less: true };
		} else if (ts1.month > ts2.month && depth.month) {
			return { greater: true };
		}
	}

	if (depth.date) {
		if (ts1.date < ts2.date && depth.date) {
			return { less: true };
		} else if (ts1.date > ts2.date && depth.date) {
			return { greater: true };
		}
	}

	if (depth.hour) {
		if (ts1.hour < ts2.hour) {
			return { less: true };
		} else if (ts1.hour > ts2.hour) {
			return { greater: true };
		}
	}

	if (depth.minute) {
		if (ts1.minute < ts2.minute) {
			return { less: true };
		} else if (ts1.minute > ts2.minute) {
			return { greater: true };
		}
	}

	if (depth.second) {
		if (ts1.second < ts2.second) {
			return { less: true };
		} else if (ts1.second > ts2.second) {
			return { greater: true };
		}
	}

	if (depth.milli) {
		if (ts1.milli < ts2.milli) {
			return { less: true };
		} else if (ts1.milli > ts2.milli) {
			return { greater: true };
		}
	}

	return { equals: true };
}

export const weekbound = (ts, week) => {
	let week2 = week.clone().addWeek(1);

	if (compare(ts, week).greater && compare(ts, week2).less) return true;
	return false;
}

export const ending = date => {
	if (!date) return;
	if (10 < date && date < 20) return `${date}th`;

	let last = date % 10;

	if (last === 1) return `${date}st`;
	if (last === 2) return `${date}nd`;
	if (last === 3) return `${date}rd`;
	return `${date}th`;
}

export const length = (ts1, ts2) => {
	return new Timestamp({
		year: ts2.year - ts1.year,
		month: ts2.month - ts1.month,
		date: ts2.date - ts1.date,
		hours: ts2.hours - ts1.hours,
		minutes: ts2.minutes - ts1.minutes
	});
}

export const difference = (ts1, ts2) => { // TODO: Optimize!!!
	ts1 = Date.UTC(ts1.year, ts1.month, ts1.date);
	ts2 = Date.UTC(ts2.year, ts2.month, ts2.date);


	return new Timestamp(new Date(Math.floor(ts2 - ts1)));
}

export const ampmify = value => (value - 1) % 12 + 1;

export const stringify = ts => {
	if (ts === undefined) return undefined;

	if (get(preferences).hour24) return `${String(ts.hour).padStart(2, '0')}:${String(ts.minute).padStart(2, '0')}`;

	if (ts <= 12) return `${String(ts.hour)}:${String(ts.minute).padStart(2, '0')} AM`;
	else return `${String(ts.hour % 12)}:${String(ts.minute).padStart(2, '0')} PM`;
}

export const hour = v => {
	if (get(preferences).hour24) return String(v).padStart(2, '0');
	else return v % 12 === 0 ? 12 : v % 12;
}

export const minute = v => {
	return String(v).padStart(2, '0');
}

export const ampm = v => {
	if (get(preferences).hour24) return '';
	else return v < 12 ? 'AM' : 'PM';
}

export let date = __date;