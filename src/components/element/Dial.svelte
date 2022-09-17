<script>
	import { slide } from 'svelte/transition';
	import { clamp } from '../../js/math';

	export let length = 3, spread = 1, offset = 0;
	export let initial = 0;
	export let set = v => v;
	export let display = v => v;

	let options = [];

	let string = '';
	let input;

	const value = i => loop(i) * spread + offset;

	const nearest = value => {
		return (value - value % spread // Lower to nearest option
			+ Math.round(value % spread / spread) * spread // Round to nearest option
			- offset) / spread // Calculate index
	}

	let index = nearest(initial);

	const loop = value => {
		if (value < 0) value += length;
		if (length <= value) value %= length;

		return value;
	}

	const wheel = ({ deltaY: y }) => {
		string = '';

		if (y < 0) index = loop(index - 1);
		if (0 < y) index = loop(index + 1);
	}

	const assign = number => {
		string = String(number);
		input.value = string;

		index = nearest(number); // TODO?: Checks even if number matches an entry, but whatever
	}

	const clear = () => {
		string = '';
		input.value = string;
		index = 0;
	}

	const purify = ({ data }) => {
		const first = value(0);
		const last = value(-1) + spread;

		if (!data) return clear();

		let number = parseFloat((string + data).replace(/\D/, ''));

		if (number !== 0 && !number) return input.value = '';

		assign(clamp(number, { min: first, max: last }) % last);
	}

	$: index, set(value(index));
	$: index, options = [value(index - 1), value(index), value(index + 1)];
</script>

<main on:wheel={wheel}>
	{ #each options as option, i (option) }
		{ @const center = i - 1 }
		<p style='transform: rotateX({center * 45}deg' transition:slide>{(center === 0 ? string : null) || display(option)}</p>
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
</style>