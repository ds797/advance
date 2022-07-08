<script>
	export let value = undefined;
	export let size = '2rem';
</script>

<main style='
	width: {size};
	height: {size};
	background: hsl({value?.h ?? 0}, {value?.s ?? 0}%, {(value?.v - value?.s / 2) ?? 0}%);'
/>

<style>
	main {
		box-shadow: var(--shadow);
		border-radius: 50%;
	}
</style>