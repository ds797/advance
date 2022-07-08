<script>
	import { createEventDispatcher } from 'svelte';
	import { mouse, preferences } from '../../js/stores';
	import { clamp } from '../../js/math';

	let gradient, band, pointer = { gradient: null, band: null };

	let color = { h: 0, s: 0, v: 100 };

	const dispatch = createEventDispatcher();

	let position = { gradient: { x: 0, y: 0 }, band: 0 };

	const move = () => {
		if ($mouse.buttons < 1) return;

		if ($mouse.down.target === gradient) {
			const rect = gradient.getBoundingClientRect();


			position.gradient = {
				x: clamp($mouse.x - rect.x - pointer.gradient.offsetWidth / 2, { min: 0, max: rect.width - pointer.gradient.offsetWidth }),
				y: clamp($mouse.y - rect.y - pointer.gradient.offsetHeight / 2, { min: 0, max: rect.height - pointer.gradient.offsetHeight })
			};

			color.s = (position.gradient.x + position.gradient.x / (rect.width - pointer.gradient.offsetWidth) * pointer.gradient.offsetWidth) / rect.width * 100;
			color.v = (1 - (position.gradient.y + position.gradient.y / (rect.height - pointer.gradient.offsetHeight) * pointer.gradient.offsetHeight) / rect.height) * 100;
		} else if ($mouse.down.target === band) {
			const rect = { band: band.getBoundingClientRect(), pointer: pointer.band.getBoundingClientRect() };


			position.band = clamp($mouse.x - rect.band.x - rect.pointer.width / 2, { min: 0, max: rect.band.width - rect.pointer.width });
			color.h = (position.band + (position.band / (rect.band.width - rect.pointer.width)) * rect.pointer.width) / rect.band.width * 360;
		}

		dispatch('change', color);
	}
	
	const append = (key, value) => {
		if (/\D/.exec(key)) return value;

		return parseInt(value.toString() + key);
	}

	const backspace = value => Math.floor(value / 10);

	const find = (h, s, v) => $preferences.colors.findIndex(value => Math.floor(value.h) === Math.floor(h) && Math.floor(value.s) === Math.floor(s) && Math.floor(value.v) === Math.floor(v));

	const add = () => {
		$preferences.colors = [...$preferences.colors, color];
	}

	let listed;

	$: listed = find(color.h, color.s, color.v, $preferences.colors); // Pass colors for reactivity

	$: $mouse.x, move();
	$: $mouse.y, move();
</script>

<main>
	<div class='color'>
		<div class='gradient' style={`
			background-image:
				linear-gradient(to bottom, rgba(0, 0, 0, 0%) 0%, rgb(0, 0, 0) 100%),
				linear-gradient(to right, rgb(255, 255, 255) 5%, hsl(${color.h}, 100%, 50%) 100%);
		`} bind:this={gradient}>
			<div class='pointer' style={`
				left: ${position.gradient.x}px;
				top: ${position.gradient.y}px;
				background: hsl(${color.h}, ${color.s}%, ${color.v - color.s / 2}%);
			`} bind:this={pointer.gradient} />
		</div>
		<div class='band' bind:this={band}>
			<div class='pointer' style={`left: ${position.band}px;`} bind:this={pointer.band} />
		</div>
	</div>
	<div class='type'>
		<p>hsv(</p>
		<input type='text' value='{Math.floor(color.h)}' on:keydown|preventDefault={({ key }) => key === 'Backspace' ? color.h = backspace(color.h) : color.h = clamp(append(key, color.h), { min: 0, max: 360 })} />
		<input type='text' value='{Math.floor(color.s)}%' on:keydown|preventDefault={({ key }) => key === 'Backspace' ? color.s = backspace(color.s) : color.s = clamp(append(key, color.s), { min: 0, max: 100 })} />
		<input type='text' value='{Math.floor(color.v)}%' on:keydown|preventDefault={({ key }) => key === 'Backspace' ? color.v = backspace(color.v) : color.v = clamp(append(key, color.v), { min: 0, max: 100 })} />
		<p>)</p>
	</div>
	<button class:disabled={listed !== -1} on:click={add}>Add to my list</button>
</main>

<style>
	main {
		width: 12rem;
		padding: 1rem;
		border-radius: 1rem;
		display: flex;
		flex-flow: column;
		gap: 1rem;
		overflow: hidden;
		transition: all var(--transition);
	}

	.color {
		height: 8rem;
		display: flex;
		flex-flow: column;
		gap: 1rem;
	}

	.gradient {
		width: 100%;
		height: 100%;
		position: relative;
		border-radius: 0.625rem;
		box-shadow: var(--shadow);
	}

	.band {
		position: relative;
		height: 1.75rem;
		border-radius: 1rem;
		background: linear-gradient(to right, red 0%, #ff0 17%, lime 33%, cyan 50%, blue 66%, #f0f 83%, red 100%);
		box-shadow: var(--shadow);
	}

	.pointer {
		width: 0.75rem;
		height: 0.75rem;
		position: absolute;
		border: 0.25rem solid white;
		border-radius: 50%;
		box-shadow: 0.125rem 0.125rem 0.5rem hsla(0, 0%, 0%, 20%);
		pointer-events: none;

		transition: all var(--transition);
	}

	.type {
		display: flex;
		justify-content: center;
		align-items: center;
		gap: 0.25rem;
	}

	.type > p {
		margin: 0;
	}

	.type > input {
		width: 3rem;
		height: 1.5rem;
		padding: 0.25rem;
		caret-color: transparent;
	}

	.disabled {
		background: lightgray;
		color: gray;
		cursor: not-allowed;
	}
</style>