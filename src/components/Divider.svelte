<script>
	import { fade } from 'svelte/transition';
</script>

<main transition:fade />

<style>
	main {
		width: 100%;
		height: 0.25rem;
		background: var(--neutral-low);
	}
</style>