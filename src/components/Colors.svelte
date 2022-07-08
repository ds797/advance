<script>
	import { preferences } from '../../js/stores';
	import { hexify } from '../../js/colors';
	import Color from '../utils/Color.svelte';
	import Close from '../svg/Close.svelte';
	import Swatch from '../utils/Swatch.svelte';

	export let value;
	export let set = v => v;

	let custom = false;

	let color = {
		h: 0,
		s: 100,
		l: 50
	};

	$: color = value;
</script>

<main>
	<div class='title'>
		<p style='color: {custom ? 'white' : 'var(--plink)'};' on:click={() => custom = false}>My list</p>
		<p style='color: {custom ? 'var(--plink)' : 'white'};' on:click={() => custom = true}>Custom</p>
	</div>
	{ #if custom }
		<Color on:change={e => set(e.detail)} />
	{ :else }
		<div class='list'>
			{ #each $preferences.colors ?? [] as color }
				<div class='color'>
					<Swatch hsl={color} width='1.5rem' height='1.5rem' />
					<p>{color.name ?? hexify(color)}</p>
					<Close width='1.5rem' height='1.5rem' stroke='gray' />
				</div>
			{ :else }
				<p>Add some colors to your list and they'll appear here!</p>
			{ /each }
		</div>
	{ /if }
</main>

<style>
	main {
		height: unset;
		display: flex;
		flex-flow: column;
	}

	p {
		margin: 0;
	}

	.title {
		display: flex;
		justify-content: center;
		align-items: center;
		gap: 1rem;
	}

	main > .title > p {
		border-bottom: 0.125rem solid var(--plink);
	}

	.list {
		margin-top: 1rem;
		display: flex;
		flex-flow: column;
		justify-content: stretch;
		align-items: center;
		gap: 0.5rem;
	}

	.color {
		width: 100%;
		padding: 0.25rem;
		display: flex;
		justify-content: space-between;
		align-items: center;
		background: lightgray;
		border: 0.125rem solid gray;
		border-radius: 0.5rem;
		overflow: hidden;
	}
</style>