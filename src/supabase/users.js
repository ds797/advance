import { supabase } from './init';

export const read = async () => {
	let { data, error, status } = await supabase
		.from('users')
		.select('preferences');

	if (error || status === 406) console.error(error ?? status);

	data = data[0].preferences;

	if (data) return JSON.parse(data);
	else return {
		colors: [],
		theme: { dark: true },
		hour24: false
	};
}

export const save = async (id, preferences) => {
	const { error } = await supabase
		.from('users')
		.upsert({
			user_id: id,
			preferences: JSON.stringify(preferences)
		});

	if (error) console.error(error);

	const { data } = await supabase.from('users').select('preferences');
	return JSON.parse(data[0].preferences)
}