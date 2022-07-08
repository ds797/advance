import { writable, get } from 'svelte/store';
import { read } from '../supabase/read';
import Timestamp from '../timestamp/Timestamp';

export const pointer = writable(new Timestamp());
export const width = writable(1);

export const mouse = writable({
	x: null,
	y: null,
	down: {
		x: null,
		y: null,
		target:null
	},
	buttons: 0,
	target: null
});

export const loading = writable(false);

export const route = writable({});

const populate = async () => {
	loading.set(true);
	const data = await read();
	loading.set(false);

	items.set(data);
}

export const items = writable([]);

populate();

export const user = writable();

export const preferences = writable({
	colors: [],
	theme: { light: true },
	view: {
		scrollAmount: 1
	},
	hour24: false
});