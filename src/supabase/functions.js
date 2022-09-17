import { get } from 'svelte/store';
import { error } from './error';
import { supabase } from './init';
import { stack } from '../js/stores';

// const signun = async (email, password) => {
// 	if (password)
// }

export const signup = async (email, password) => {
	const { user, error: e } = await supabase.auth.signUp({ email, password });

	if (e) error(e.message);

	return user;
}

export const signin = async (email, password) => {
	const { user, error } = await supabase.auth.signIn({ email, password });

	if (error) stack.set([...get(stack), error]);

	return user;
}

export const signout = async () => {
	supabase.auth.signOut();
	// try {
	// 	let { error } = await supabase.auth.signOut();
	// 	if (error) throw error;
	// } catch (error) {
	// 	console.error(error.error_description || error.message);
	// }
}