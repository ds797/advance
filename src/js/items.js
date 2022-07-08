import { get } from 'svelte/store';
import { items } from './stores';
import { compare } from './timestamp/functions';

export const populate = timestamp => {
	const ret = [];
	get(items).forEach(event => {
		const s = compare(event.start, timestamp, { date: true });
		const e = compare(event.finish, timestamp, { date: true });
		if (s.greater || e.less) return;

		ret.push({
			event: event,
			when: s.equals ? event.start : (e.equals && event.finish.clone().set({ hours: 0, minutes: 0 })),
			until: s.equals ? event.start.clone().set({ hours: 24, minutes: 0 }) : (e.equals && event.finish),
		});
	});

	return ret;
}