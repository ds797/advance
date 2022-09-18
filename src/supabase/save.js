import { supabase } from "./init";
import { get } from 'svelte/store';
import { items, loading, user } from '../js/stores';
import { compare, date } from '../timestamp/functions';

const add = (store, item) => {
	console.log(item)
	let array = get(store);

	const time = item.start ?? item.end;
	if (!time) {
		store.set([item, ...array]);
	} else {
		let index = 0;

		for (; index < array.length; index++) {
			if (!array[index].start && !array[index].end) continue;
			if (compare(time, array[index].start ?? array[index].end).less) continue;
	
			store.set(array.insert(index, item));
			console.log(get(store))
			return;
		}
	}

	store.set([item, ...array]); // TODO?: Fallback
}

export const save = async item => {
	item.title ||= 'Untitled item';

	// if (item.id) {
	// 	items.set(get(items)); // Trigger Svelte reactivity
	// 	console.log(get(items))
	// 	// const index = get(items).findIndex(v => v.id === item.id);
	// 	// console.log(index, get(items)[index], item)
	// }

	item.id || add(items, item);

	console.log(get(items))

	loading.set(true);
	const { data, error: e } = await supabase.from('items').upsert({
		title: item.title,
		description: item.description,
		start: item.start ? date(item.start) : undefined,
		finish: item.finish ? date(item.finish) : undefined,
		completed: item.completed ? date(item.completed) : undefined,
		h: item.color.h,
		s: item.color.s,
		v: item.color.v,
		cal: item.cal,
		id: item.id,
		user_id: get(user) && get(user).id // TODO: unsafe???
	});
	loading.set(false);

	if (e) error(e);

	item.id = data[0].id; // Update object by reference
	items.set(get(items)); // Trigger Svelte reactivity
}