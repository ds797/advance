<script>
	import { signin, signup } from '../supabase/functions';
	import Menu from './Menu.svelte';
	let email, password;

	let menu = {
		name: 'Account',
		close: false,
		children: [{
			name: 'Sign in',
			key: async e => {
				if (e.key !== 'Enter') return;

				if (email && password) {
					await signin(email, password);
					return true;
				}
			},
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
				click: async () => {
					await signin(email, password);
					return true;
				}
			}]
		}, {
			name: 'Sign up',
			key: async e => {
				if (e.key !== 'Enter') return;

				if (email && password) {
					await signup(email, password);
					return true;
				}
			},
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
				click: async () => {
					await signup(email, password);
					return true;
				}
			}]
		}]
	};
</script>

<Menu bind:menu />