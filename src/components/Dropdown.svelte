<script>
	import { slide } from 'svelte/transition';

	export let options, value;

	let open = false;

	if (options === Infinity) options = [value - 1, value, value + 1];

	const update = () => {
		const index = options.indexOf(value);
		index = index === -1 ? 0 : index;
	}

	$: value, update();
</script>

<main on:click={() => open = !open}>
	<p>{value}</p>
</main>

<style>

</style>