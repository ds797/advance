<script>
	import { loading } from '../js/stores';
	import Refresh from './svg/Refresh.svelte';
</script>

{ #if $loading }
	<main>
		<div>
			<Refresh color='var(--secondary)' />
		</div>
	</main>
{ /if }

<style>
	@keyframes rotate {
		from {
			transform: rotate(0deg);
		}
		to {
			transform: rotate(360deg);
		}
	}

	main {
		display: flex;
		justify-content: center;
		align-items: center;
		gap: 0.5rem;
	}

	div {
		animation: rotate 2s linear infinite;
	}
</style>