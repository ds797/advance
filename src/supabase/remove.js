import { get } from 'svelte/store';
import { supabase } from './init';
import { items, loading } from '../js/stores';

export const remove = async id => { // TODO: multiple undefined ids?
	items.set(get(items).grep(i => i.id === id ? false : i));

	loading.set(true);
	const { data, error } = await supabase
		.from('items')
		.delete()
		.match({ id });
	loading.set(false);

	if (error) console.error(error);

	return data[0];
}