<script>
	import Go from '../Go.svelte';
</script>

<main>
	<div>
		<h1>Tasks</h1>
		<Go />
	</div>
</main>

<style>
	main {
		height: 100%;
		display: flex;
		flex-flow: column;
		justify-content: center;
		align-items: center;
		overflow: hidden;
	}

	div {
		display: flex;
		gap: 2rem;
	}
</style>