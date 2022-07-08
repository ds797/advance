<script>
	import { onMount } from 'svelte';
	import { slide } from 'svelte/transition';
	import { clamp, digify } from '../../js/math';

	export let style = '';
	export let type = 'number';
	export let value = 0;
	export let options = [1, 2, 3];
	export let set = v => v;
	export let display = v => v;

	let position = 1;
	let visible = [{}, {}, {}];
	let string;

	onMount(() => options = Array(clamp(options.length, { min: 3 })).fill(0).map((_, i) => options[i] ?? null));

	const nearest = value => {
		let index = options.indexOf(value);
		if (index !== -1) return index;
		if (type !== 'number') return position;

		for (let i = 1; i < options.length; i++) {
			const difference = options[i] - options[i - 1];
			const index = options.indexOf(Math.round(value / difference) * difference);

			if (index !== -1) return index;
		}

		return options.indexOf(value);
	}

	const loop = value => {
		if (value < 0) value += options.length;
		if (options.length <= value) value %= options.length;

		return value;
	}

	const rotate = difference => {
		let distance = Math.abs(difference);
		let forward = 0 < difference;

		if (options.length / 2 <= distance) {
			distance = options.length - distance;
			forward = !forward;
		}

		distance = clamp(distance, { min: 0, max: visible.length });

		if (distance === 0) return;

		if (forward) {
			visible.push(...Array(distance).fill(0).map(() => { return {} }));
			visible = visible.slice(distance);
		} else {
			visible.unshift(...Array(distance).fill(0).map(() => { return {} }));
			visible = visible.slice(0, -distance);
		}

		return loop(position + difference);
	}

	const update = v => {
		if (type === 'number') value = digify(v);

		return nearest(value); // Return closest index
	}

	const wheel = ({ deltaY }) => {
		if (deltaY < 0) position = rotate(-1);
		else position = rotate(1);

		// Position will be set in sanitize() after value is set in the event handler
	}
	
	const keydown = ({ key }) => {
		if (key === 'Backspace') string = 0;
		if (key === 'ArrowUp') wheel({ deltaY: -1 });
		if (key === 'ArrowDown') wheel({ deltaY: 1 });
	}

	const sanitize = v => {
		let current = update(v);
	
		rotate(current - position);
		
		if (current !== position) position = current;
	}

	function select() { this.select(); }

	$: set(options[position]);

	$: sanitize(value);
</script>

<main {style}>
	<div>
		{ #each visible as v, i (v) }
			{ @const index = i - Math.floor(visible.length / 2) }
			{ @const current = options.at(loop(position + index)) ?? null }

			<p style="
				transform: rotateX({clamp(index, { min: -2, max: 2 }) * 45}deg);
				color: {index === 0 ? 'var(--white)' : 'var(--unfocused)'};
				color: {current === null && 'var(--clear'}"
				transition:slide>{display(index === 0 ? value : current)}</p>
		{ /each }
	</div>
	<div class="overlay" on:wheel={wheel}>
		<input type="text" bind:value={string} on:keydown={keydown} on:click={select} />
	</div>
</main>

<style>
	main {
		width: 100%;
		height: 100%;
		position: relative;
		display: flex;
		justify-content: center;
		align-items: center;
	}

	p {
		margin: 0;
		display: flex;
		justify-content: center;
		align-items: center;
		transition: all var(--transition);
	}

	.overlay {
		position: absolute;
		width: 100%;
		height: 100%;
	}

	input {
		width: 100%;
		height: 100%;
		padding: 0;
		position: absolute;
		flex: 1;
		opacity: 0;
	}
</style>