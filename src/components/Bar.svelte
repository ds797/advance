<script>
	import { preferences } from '../js/stores';
	import { signout, update } from '../supabase/functions';
	import Sync from './Sync.svelte';
	import Stats from './Stats.svelte';
	import Modal from './Modal.svelte';
	import Menu from './Menu.svelte';
	import Person from '../icons/filled/Person.svelte';
	// import { time } from '../js/phrases';
  // import Timestamp from '../timestamp/Timestamp';

	export let items = [];

	// time(new Timestamp().add({ date: -3 }));

	let show = false;

	let email, password;

	$: menu = {
		name: 'Account',
		children: [{
			name: 'Settings',
			children: [{
				name: '24-hour time',
				type: 'toggle',
				value: $preferences.hour24,
				set: v => {
					$preferences.hour24 = v;
				}
			}/*, {
				name: 'Change email',
				children: [{
					name: 'New email',
					type: 'input',
					value: email,
					set: v => email = v
				}, {
					name: 'Save',
					type: 'action',
					click: () => update({ email, password })
				}],
			}*/]
		}, {
			name: 'Sign out',
			type: 'action',
			click: async () => await signout()
		}]
	};
</script>

<main>
	<div class='left'>
		<Stats {items} />
	</div>
	<div class='right'>
		<Sync />
		<div on:click={() => show = true}>
			<Person fill='var(--contrast)' />
		</div>
	</div>
	{ #if show }
		<Modal on:close={() => show = false}>
			<p slot='tip'><kbd>control</kbd> + <kbd>s</kbd> or <kbd>control</kbd> + <kbd>enter</kbd> to save</p>
			<Menu bind:menu on:close={() => show = false} />
		</Modal>
	{ /if }
</main>

<style>
	main {
		padding: 0.5rem 1rem;
		display: flex;
		justify-content: space-between;
		align-items: center;
	}

	.left {
		display: flex;
		gap: 1.5rem;
	}

	.right {
		display: flex;
		gap: 1.5rem;
	}
</style>