import { get } from 'svelte/store';
import { supabase } from './init';
import { user } from '../stores';

export const add = async username => {
	const { data } = await supabase.from('friends').select('*');

	for (let friend of data) {
		if (friend === username) return;
	}

	console.log(supabase.auth)

	data.push(email);

	const res = await supabase.from('friends').insert({ user: get(user).id, friends: data });

	console.log(res)
}