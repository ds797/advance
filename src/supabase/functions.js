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
	else stack.set([...get(stack), { type: 'success', message: 'Check your email to confirm your account creation!' }]);

	return user;
}

export const signin = async (email, password) => {
	const { user, error: e } = await supabase.auth.signIn({ email, password });

	console.log(user, e)

	if (!user && !e) stack.set([...get(stack), { type: 'success', message: 'Check your email to log in!' }]);

	if (e) error(e.message);

	return user;
}

export const signout = async () => {
	localStorage.clear();
	supabase.auth.signOut();
	// try {
	// 	let { error } = await supabase.auth.signOut();
	// 	if (error) throw error;
	// } catch (error) {
	// 	console.error(error.error_description || error.message);
	// }
}