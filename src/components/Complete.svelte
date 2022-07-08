<script>
	import Check from './svg/Check.svelte';

	export let checked = false;
	export let set = v => checked = v;
</script>

<button type='icon' class:inverse={checked} on:click={() => set(!checked)}>
	<Check />
</button>