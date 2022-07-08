import { supabase } from './init';

export const signup = async (email, password, provider) => {
	let res;
	try {
		if (email && password) res = await supabase.auth.signUp({ email, password });
		else if (email) res = await supabase.auth.signUp({ email });
		else if (provider) res = await supabase.auth.signUp({ provider });
		else res = { error: 'Please provide a sign up method' };

		let error = res.error;
		if (error) console.error(error);

		console.log('success?', res);
	} catch (error) {
		console.error(error.error_description || error.message);
	}
}

export const signin = async (email, password, provider) => {
	let res;
	try {
		if (email && password) res = await supabase.auth.signIn({ email, password });
		else if (email) res = await supabase.auth.signIn({ email });
		else if (provider) res = await supabase.auth.signIn({ provider });
		else res = { error: 'Please provide a sign in method' };

		let error = res.error;
		if (error) console.error(error);

		console.log('success?', res);
	} catch (error) {
		console.error(error.error_description || error.message);
	}
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