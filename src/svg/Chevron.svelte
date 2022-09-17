<script>
	export let direction;
	export let size = '2rem', fill = 'none', stroke = 'white', color = 'inherit';
</script>

{ #if direction === 'left' }
	<div style='width: {size}; height: {size}; fill: {fill}; stroke: {stroke}; color: {color};'>
		<svg class='w-6 h-6' fill='none' stroke='currentColor' viewBox='0 0 24 24' xmlns='http://www.w3.org/2000/svg'><path stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M15 19l-7-7 7-7'></path></svg>
	</div>
{ :else if direction === 'right' }
	<div style='width: {size}; height: {size}; fill: {fill}; stroke: {stroke}; color: {color};'>
		<svg class='w-6 h-6' fill='none' stroke='currentColor' viewBox='0 0 24 24' xmlns='http://www.w3.org/2000/svg'><path stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M9 5l7 7-7 7'></path></svg>
	</div>
{ :else if direction === 'down' }
	<div style='width: {size}; height: {size}; fill: {fill}; stroke: {stroke}; color: {color};'>
		<svg class='w-6 h-6' fill='none' stroke='currentColor' viewBox='0 0 24 24' xmlns='http://www.w3.org/2000/svg'><path stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'></path></svg>
	</div>
{ :else }
	<div style='width: {size}; height: {size}; fill: {fill}; stroke: {stroke}; color: {color};'>
		<svg class='w-6 h-6' fill='none' stroke='currentColor' viewBox='0 0 24 24' xmlns='http://www.w3.org/2000/svg'><path stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M5 15l7-7 7 7'></path></svg>
	</div>
{ /if }

<style>
	div {
		display: flex;
		justify-content: center;
		align-items: center;
	}
</style>