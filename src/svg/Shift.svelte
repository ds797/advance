<script>
	export let size = '2rem', fill = 'none', stroke = 'white', color = 'inherit';
	export let state = { plus: true };

	let degrees = {};

	const first = () => {
		if (state.plus) return 0;
		if (state.minus) return 0;
		if (state.confirm) return -45;
	}

	const second = () => {
		if (state.plus) return 0;
		if (state.minus) return -90;
		if (state.confirm) return -45;
	}

	$: state, degrees = { first: first(), second: second() };
</script>

<div style='width: {size}; height: {size}; fill: {fill}; stroke: {stroke}; color: {color};'>
	<svg style='transform: rotate({degrees.first}deg);' class='w-6 h-6' fill='none' stroke='currentColor' viewBox='0 0 24 24' xmlns='http://www.w3.org/2000/svg'><path stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M3 12h18'></path></svg>
	<svg style='transform: rotate({degrees.second}deg);' class='w-6 h-6' fill='none' stroke='currentColor' viewBox='0 0 24 24' xmlns='http://www.w3.org/2000/svg'><path stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M12 3v18'></path></svg>
</div>

<style>
	div {
		display: flex;
		justify-content: center;
		align-items: center;
		position: relative;
	}

	svg {
		position: absolute;
		top: 0;
		right: 0;
		bottom: 0;
		left: 0;
		transition: all var(--transition);
	}
</style>