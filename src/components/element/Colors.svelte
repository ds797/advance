<script>
	import { preferences } from '../../js/stores';
	import { slide } from '../../js/transition';
	import { hexify } from '../../js/colors';
	import Swatch from './Swatch.svelte';
	import Close from '../../icons/filled/Close.svelte';

	export let value = undefined;
	export let set = v => v;

	const check = (one, two) => {
		if (one.h === two.h && one.s === two.s && one.v === two.v) return true;
	}
</script>

<main>
	{ #each $preferences.colors ?? [] as color, index (color) }
		<div class='color' on:click={() => set(color)} transition:slide|local>
			<div class='name' style='{index === value && 'background: var(--secondary); color: var(--primary);'}'>
				<Swatch value={color} size='1.5rem' />
				<p>{color.name ?? hexify(color.h, color.s, color.v)}</p>
			</div>
			<div on:click|stopPropagation={() => $preferences.colors = $preferences.colors.filter(c => !check(color, c))}>
				<button type='icon'>
					<Close size='1.5rem' fill='var(--neutral-high)' />
				</button>
			</div>
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