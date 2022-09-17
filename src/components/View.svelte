<script>
	import { cubicOut } from 'svelte/easing';
	import Item from './Item.svelte';

	export let items;
	// $: internal = items.slice(0, 100);
	let completed = [], uncompleted = [];
	let pointer = completed.length;


	// $: completed = internal.grep((_, index, array) => array[array.length - 1 - index].completed && array[array.length - 1 - index]);
	// $: uncompleted = internal.filter(item => !item.completed);

	const wheel = e => {
		if (e.deltaY < 0 && -completed.length < pointer) pointer--;
		if (0 < e.deltaY && pointer < uncompleted.length) pointer++;
	}

	const slide = (node, { duration }) => {
		const style = getComputedStyle(node);
		const height = parseFloat(style.height);
		const padding = { top: parseFloat(style.paddingTop), bottom: parseFloat(style.paddingBottom) };
		const margin = { top: parseFloat(style.marginTop), bottom: parseFloat(style.marginBottom) };

		return {
			delay: 0,
			duration,
			easing: cubicOut,
			css: t => `
				overflow: hidden;
				height: ${t * height}px;
				padding-top: ${t * padding.top}px;
				padding-bottom: ${t * padding.bottom}px;
				margin-top: ${t * margin.top}px;
				margin-bottom: ${t * margin.bottom}px;
			`
		};
	}

	$: console.log(items)
</script>

<main>
	{ #each items as item (item) }
		<div>
			<Item {item} />
		</div>
	{ /each }
</main>

<!-- <main on:wheel={wheel}>
	{ #each completed.slice(pointer + completed.length, completed.length) as item, index (item) }
		<div transition:slide={{ duration: 3000 }}>
			<Item {item} set={v => internal[internal.indexOf(item)] = v} />
		</div>
	{ /each }
	{ #if uncompleted.length }
		{ #each uncompleted.slice(clamp(pointer, { min: 0 }), 100 + pointer) as item, index (item) }
			<div transition:slide={{ duration: 3000 }}>
				<Item {item} set={v => item = v} />
			</div>
		{ /each }
		{ #each internal as item, index (item) }
			<div transition:slide>
				<Item {item} />
			</div>
		{ /each }
	{ :else }
		<h1>
			Click the plus to add your first item!
		</h1>
	{ /if }
</main> -->

<style>
	main {
		padding: 0 1rem;
		flex: 1;
		display: flex;
		flex-flow: column;
	}

	h1 {
		height: 100%;
		display: flex;
		justify-content: center;
		align-items: center;
		text-align: center;
		font-size: 4rem;
	}

	div {
		padding: 0 10rem;
	}
</style>