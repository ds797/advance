<script>
	import { Link } from 'svelte-routing';
</script>

<main>
	<h1 class='gradient'>404</h1>
	<div>
		<button>
			<Link to='/'>Home</Link>
		</button>
	</div>
</main>

<style>
	main {
		height: 100%;
		display: flex;
		justify-content: center;
		align-items: center;
	}

	h1 {
		width: fit-content;
		font-size: 24rem;
	}

	div {
		position: fixed;
		bottom: 4rem;
		display: flex;
		justify-content: center;
		align-items: center;
	}
</style>