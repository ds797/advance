<script>
	import { signout } from '../supabase/functions';
	import Sync from './Sync.svelte';
	import Stats from './Stats.svelte';
	import Modal from './Modal.svelte';
	import Menu from './Menu.svelte';
	import Person from '../icons/filled/Person.svelte';

	export let items = [];

	let show = false;
	let menu = {
		name: 'Account',
		children: [{
			name: 'Settings',
			children: [{
				name: 'Test setting'
			}]
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