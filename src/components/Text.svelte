<script>
	import { slide } from 'svelte/transition';
	export let options = [], selected;

	let index = options.indexOf(selected) ?? 0;

	let visible = [options[index]];

	const update = () => {
		const i = options.indexOf(selected) ?? index;

		if (i < index) {
			visible.unshift(selected);
			visible.pop();
		} else if (index < i) {
			visible.push(selected);
			visible.shift();
		}
		visible = visible;
	}

	$: selected, update();
</script>

<main on:wheel>
	{ #each visible as item (item) }
		<p transition:slide>{item}</p>
	{ /each }
</main>

<style>

</style>