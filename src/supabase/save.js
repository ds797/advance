import { supabase } from "./init";
import { get } from 'svelte/store';
import { items, loading, user } from '../js/stores';
import { compare } from '../timestamp/functions';

const add = (store, item) => {
	let array = get(store);

	const time = item.start ?? item.end;
	if (!time) {
		store.set([item, ...array]);
	}

	let index = 0;

	for (; index < array.length; index++) {
		if (!array[index].start) continue;
		if (compare(time, array[index].start).less) continue;

		store.set(array.insert(index, item));
		return;
	}
}

export const save = async item => {
	item.title ||= 'Untitled item';

	item.id || add(items, item);

	loading.set(true);
	const { data, error } = await supabase.from('items').upsert({
		title: item.title,
		description: item.description,
		start: item.start ? new Date(item.start.year, item.start.month, item.start.date, item.start.hour, item.start.minute) : undefined,
		end: item.finish ? new Date(item.finish.year, item.finish.month, item.finish.date, item.finish.hour, item.finish.minute) : undefined,
		h: item.color.h,
		s: item.color.s,
		v: item.color.v,
		id: item.id,
		user_id: get(user) && get(user).id // TODO: enable login
	});
	loading.set(false);

	item.id = data[0].id; // Update object by reference
	items.set(get(items)); // Trigger Svelte reactivity

	if (error) console.error(error);
}