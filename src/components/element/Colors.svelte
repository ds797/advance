<script>
	import { preferences } from '../../js/stores';
	import { hexify } from '../../js/colors';
	import Swatch from './Swatch.svelte';
	import Close from '../svg/Close.svelte';

	export let value = undefined;
	export let set = v => v;
</script>

<main>
	{ #each $preferences.colors ?? [] as color, index }
		<div class='color' on:click={() => set(color)} >
			<div class='name' style='{index === value && 'background: var(--secondary); color: var(--primary);'}'>
				<Swatch value={color} size='1.5rem' />
				<p>{color.name ?? hexify(color)}</p>
			</div>
			<Close size='1.5rem' stroke='gray' />
		</div>
	{ /each }
</main>

<style>
	main {
		display: flex;
		flex-flow: column;
		gap: 1rem;
	}

	.color {
		padding: 0.5rem;
		display: flex;
		justify-content: space-between;
		align-items: center;
		background: var(--primary);
		border-radius: 1rem;
		box-shadow: var(--shadow);
		cursor: pointer;
	}

	.name {
		display: flex;
		justify-content: center;
		align-items: center;
		gap: 0.5rem;
	}
</style>