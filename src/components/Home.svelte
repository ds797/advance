<script>
	import Go from '../Go.svelte';
</script>

<main>
	<div>
		<h1>Tasks</h1>
		<Go />
	</div>
	<!-- <p>Just clicked the magic link? There's currently a bug where once you click "Go", you'll be back at the login page. To fix this, just click "Go" and then reload the page. A solution is being implemented!</p> -->
</main>

<style>
	main {
		height: 100%;
		display: flex;
		flex-flow: column;
		justify-content: center;
		align-items: center;
		gap: 2rem;
		overflow: hidden;
	}

	div {
		display: flex;
		gap: 2rem;
	}

	/* p {
		text-align: center;
		max-width: min(35rem, 90vw);
	} */
</style>