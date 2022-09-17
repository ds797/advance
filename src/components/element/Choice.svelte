<script>
	import { slide } from 'svelte/transition';
	import { clamp } from '../../js/math';

	export let set = v => v;

	export let options = ['A', 'B', 'C'];
	export let initial = options[0];

	let visible = [{}, ...options, {}]; // can't use null because animation doesn't work

	let index = visible.indexOf(initial);
	let string = '';
	let input;

	const value = i => visible[i];

	const wheel = ({ deltaY: y }) => {
		string = '';

		index = clamp(index + y / Math.abs(y), { min: 1, max: visible.length - 2 });
	}

	const assign = option => {
		for (let o of options) {
			if (o.includes(option)) {
				input.value = option;
				string = option;
				return index = options.indexOf(o);
			}
		}
	}

	const clear = () => {
		string = '';
		input.value = string;
		index = 0;
	}

	const purify = ({ data }) => {
		if (!data) return clear();

		let option = (string + data).replace(/\d/, '');

		if (!option) return input.value = '';

		if (!assign(option)) input.value = '';
	}

	$: index, set(value(index));
</script>

<main on:wheel={wheel}>
	{ #each visible.section(index - 1, index + 1) as option, i (option) }
		{ @const center = i - 1 }
		{ @const object = typeof value(index + center) === 'object' }
			<p style='transform: rotateX({center * 45}deg' class:hidden={object} transition:slide>{object ? 'None' : value(index + center)}</p>
	{ /each }
	<input on:input={purify} bind:this={input} />
</main>

<style>
	main {
		width: 100%;
		height: 100%;
		position: relative;
		display: flex;
		flex-flow: column;
		justify-content: center;
		align-items: center;
	}

	p {
		margin: 0;
		pointer-events: none;
		transition: all var(--transition);
	}

	input {
		padding: 0;
		width: 100%;
		height: 100%;
		position: absolute;
		display: flex;
		justify-content: center;
		align-items: center;
		text-align: center;
		opacity: 0%;
	}

	.hidden {
		visibility: hidden;
		max-width: 0;
	}
</style>