<script>
	import { signin, signup } from '../supabase/functions';
	import { user } from '../js/stores';
	import Menu from './Menu.svelte';
	let email, password;

	let menu = {
		name: 'Account',
		close: false,
		children: [{
			name: 'Sign in',
			children: [{
				name: 'Email',
				type: 'input',
				value: email,
				set: v => email = v
			}, {
				name: 'Password',
				type: 'password',
				placeholder: '',
				value: password,
				set: v => password = v
			}, {
				name: 'Continue',
				type: 'action',
				click: () => signin(email, password)
			}]
		}, {
			name: 'Sign up',
			children: [{
				name: 'Email',
				type: 'email',
				value: email,
				set: v => email = v
			}, {
				name: 'Password',
				type: 'password',
				placeholder: '',
				value: password,
				set: v => password = v
			}, {
				name: 'Continue',
				type: 'action',
				click: () => $user = signup(email, password)
			}]
		}]
	}
</script>

<Menu bind:menu />