<script>
	import Timestamp from '../../timestamp/Timestamp';
	import { minute } from '../../timestamp/functions';
	import Dial from './Dial.svelte';
	import Choice from './Choice.svelte';

	export let value = new Timestamp();
	export let set = v => v;

	let hour24 = false;

	const ampm = v => {
		v === 'AM' ? set(value.clone().set({ hours: value.hour % 12 })) : set(value.clone().set({ hours: value.hour % 12 + 12 }))
	};

	ampm(value.hour < 12 ? 'AM' : 'PM'); // Initial set
</script>

<main>
	<Dial length={!hour24 ? 12 : 24} spread={1} offset={1} set={v => set(value.clone().set({ hours: v }))} initial={!hour24 ? value.hour % 12 : value.hour} />
	<Dial length={12} spread={5} set={v => set(value.clone().set({ minutes: v }))} display={v => minute(v)} initial={value.minute} />
	{ #if !hour24 }
		<Choice options={['AM', 'PM']} set={ampm} initial={value.hour < 12 ? 'AM' : 'PM'} />
	{ /if }
</main>

<style>
	main {
		width: 5rem;
		height: 4rem;
		border-radius: 0.5rem;
		position: relative;
		display: flex;
		justify-content: center;
		align-items: center;
		background: var(--plink);
		color: var(--neutral-high);
		overflow: hidden;
		user-select: none;
	}
</style>