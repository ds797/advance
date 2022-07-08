<script>
	import { ampmify } from '../../timestamp/functions';
	import Timestamp from '../../timestamp/Timestamp';
	import Scroller from '../utils/Scroller.svelte';

	export let value = new Timestamp();
	export let set = v => v;
	export let ampm = true;

	$: console.log(value)
</script>

<!-- TODO: condition-set components not working without set -->
<main>
	<Scroller
		options={Array(24).fill(0).map((_, i) => i)}
		value={value.hour}
		display={v => ampm && ampmify(v)}
		set={v => set(value.clone().set({ hours: v }))}
	/>
	<Scroller
		options={Array(12).fill(0).map((_, i) => i * 5)}
		value={value.minute}
		display={v => ampm && ampmify(v)}
		set={v => set(value.clone().set({ minutes: v }))}
	/>
	<Scroller
		options={Array(12).fill(0).map((_, i) => i * 5)}
		value={value.minute}
		display={v => String(v).padStart(2, '0')}
		set={v => set(value.clone().set({ minutes: v }))}
	/>
	<!-- { #if ampm }
		<Scroller
			type={'text'}
			options={['AM', 'PM']}
			value={value.hour < 12 ? 'AM' : 'PM'}
			{set}
		/>
	{ /if } -->
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