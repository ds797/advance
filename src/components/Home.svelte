<script>
	import Go from '../Go.svelte';
</script>

<main>
	<div>
		<h1 class='gradient'>hero text.</h1>
		<Go />
	</div>
</main>

<style>
	main {
		display: flex;
		flex-flow: column;
		overflow: hidden;
	}

	div {
		margin-left: min(10rem, 15%);
		display: flex;
		flex-flow: column;
	}

	h1 {
		width: fit-content;
		font-size: min(6rem, 30vh);
		font-weight: 700;
	}
</style>