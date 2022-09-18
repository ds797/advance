<script>
	import { cubicOut } from 'svelte/easing';
  import { save } from '../supabase/save';
    import { compare } from '../timestamp/functions';
	import Item from './Item.svelte';

	export let items;
	// $: internal = items.slice(0, 100);
	let completed = [], uncompleted = [];
	let pointer = completed.length;

	$: completed = items.grep((_, index, array) => array[array.length - 1 - index].completed && array[array.length - 1 - index]); // Filter and reverse
	$: uncompleted = items.filter(item => !item.completed);

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

	const set = async item => {
		items[items.findIndex(v => v.id === item.id)] = item;

		await save(item);
		console.log(items)
	}

	const binary = (array, value, compare) => {
		let start = 0, end = array.length - 1;

		while (start <= end) {
			const middle = (start + end) >> 1; // Math.floor((start + end) / 2)
			const comparison = compare(array[middle]);
			if (start === end) return middle;

			if (comparison < 0) end = middle - 1;
			else if (0 < comparison) start = middle + 1;
			else return middle;
		}
	}

	const sort = array => {
		let uncompleted = [];
		let completed = [];

		for (let i = 0; i < array.length; i++) {
			if (array[i].completed) completed.push(array[i]);
			else {
				uncompleted.splice(binary(uncompleted, array[i], middle => {
					if (!array[i].start || !middle.start) return 0;
					const comparison = compare(array[i].start, middle.start);
					if (comparison.less) return -1;
					if (comparison.equals) return 0;
					if (comparison.greater) return 1;
				}), 0, array[i]);
			}
		}

		return completed.concat(uncompleted);
	}

	$: items = sort(items);
</script>

<main>
	{ #if items.length }
		{ #each items as item (item) }
			<div transition:slide>
				<Item {item} set={set} />
			</div>
		{ /each }
	{ :else }
		<h1>
			Click the plus to add your first item!
		</h1>
	{ /if }
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