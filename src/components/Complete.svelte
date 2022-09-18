<script>
	import Timestamp from '../timestamp/Timestamp';
	import Check from '../svg/Check.svelte';

	export let value;
	export let set = v => v;
</script>

<button type='icon' class:inverse={value} on:click={() => value ? set(null) : set(new Timestamp())}>
	<Check />
</button>