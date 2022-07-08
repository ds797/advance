<script>
	import { signout } from '../supabase/functions';
	import Sync from './Sync.svelte';
	import Stats from './Stats.svelte';
	import Account from './svg/Account.svelte';

	export let items = [];
</script>

<main>
	<div class='left'>
		<Stats {items} />
	</div>
	<div class='right'>
		<Sync />
		<div on:click={signout}>
			<Account color='var(--secondary)' />
		</div>
	</div>
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