<script>
	import { mouse, preferences } from '../../js/stores';
	import { clamp } from '../../js/math';
  import { hexify } from '../../js/colors';

	export let value;
	export let set = v => v;

	let gradient, band, pointer = { gradient: null, band: null };

	$: position = {
		gradient: {
			x: value.s / 100 * (gradient?.offsetWidth - pointer.gradient?.offsetWidth) ?? 0,
			y: (1 - value.v / 100) * (gradient?.offsetHeight - pointer.gradient?.offsetHeight) ?? 0
		},
		band: value.h / 360 * (band?.offsetWidth - pointer.band?.offsetWidth) ?? 0
	};

	const move = () => {
		if ($mouse.buttons < 1) return;

		if ($mouse.down.target === gradient) {
			const rect = gradient.getBoundingClientRect();

			set({
				h: value.h,
				s: (clamp($mouse.x, { min: rect.x, max: rect.width + rect.x }) - rect.x) / rect.width * 100,
				v: (1 - (clamp($mouse.y, { min: rect.y, max: rect.height + rect.y }) - rect.y) / rect.height) * 100
			});
		} else if ($mouse.down.target === band) {
			const rect = band.getBoundingClientRect();

			set({ h: (clamp($mouse.x, { min: rect.x, max: rect.width + rect.x }) - rect.x) / rect.width * 360,
				s: value.s,
				v: value.v
			});
		}
	}
	
	const append = (key, value) => {
		if (/\D/.exec(key)) return value;

		return parseInt(value.toString() + key);
	}

	const backspace = value => Math.floor(value / 10);

	const find = (h, s, v) => $preferences.colors.findIndex(hsv => hexify(h, s, v) === hexify(hsv.h, hsv.s, hsv.v));

	const add = () => {
		if (listed !== -1) return;

		$preferences.colors = [...$preferences.colors, value];
	}

	let listed;

	$: $preferences.colors, listed = find(value.h, value.s, value.v);

	$: $mouse.x, move();
	$: $mouse.y, move();
</script>

<main>
	<div class='color'>
		<div class='gradient' style={`
			background:
				linear-gradient(to bottom, rgba(0, 0, 0, 0%) 0%, rgb(0, 0, 0) 100%),
				linear-gradient(to right, rgb(255, 255, 255) 5%, hsl(${value.h}, 100%, 50%) 100%);
		`} bind:this={gradient}>
			<div class='pointer' style={`
				left: ${position.gradient.x}px;
				top: ${position.gradient.y}px;
				background: hsl(${value.h}, ${value.s}%, ${(2 - value.s / 100) * value.v / 2}%);
			`} bind:this={pointer.gradient} />
		</div>
		<div class='band' bind:this={band}>
			<div class='pointer' style={`left: ${position.band}px;`} bind:this={pointer.band} />
		</div>
	</div>
	<div class='type'>
		<p>hsv(</p>
		<input type='text' value='{Math.floor(value.h)}' on:keydown|preventDefault={({ key }) => key === 'Backspace' ? value.h = backspace(value.h) : value.h = clamp(append(key, value.h), { min: 0, max: 360 })} />
		<input type='text' value='{Math.floor(value.s)}%' on:keydown|preventDefault={({ key }) => key === 'Backspace' ? value.s = backspace(value.s) : value.s = clamp(append(key, value.s), { min: 0, max: 100 })} />
		<input type='text' value='{Math.floor(value.v)}%' on:keydown|preventDefault={({ key }) => key === 'Backspace' ? value.v = backspace(value.v) : value.v = clamp(append(key, value.v), { min: 0, max: 100 })} />
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

	p {
		user-select: none;
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
</style>