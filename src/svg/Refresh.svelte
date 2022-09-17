<script>
	export let size = '2rem', fill = 'none', stroke = 'white', color = 'inherit';
</script>

<div style='width: {size}; height: {size}; fill: {fill}; stroke: {stroke}; color: {color};'>
	<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path></svg>
</div>

<style>
	div {
		display: flex;
		justify-content: center;
		align-items: center;
		transform: scale(-1, 1);
	}
</style>