<script>
	import CloseCircle from '../icons/filled/CloseCircle.svelte';
	import AlertCircle from '../icons/filled/AlertCircle.svelte';
	import CheckmarkCircle from '../icons/filled/CheckmarkCircle.svelte';

	export let notification;
</script>

<main>
	{ #if notification.type === 'error' }
		<div class='icon'>
			<CloseCircle size={'2rem'} fill={'var(--red)'} />
		</div>
	{ :else if notification.type === 'important' }
		<div class='icon'>
			<AlertCircle size={'2rem'} fill={'var(--blue)'} />
		</div>
	{ :else if notification.type === 'success' }
		<div class='icon'>
			<CheckmarkCircle size={'2rem'} fill={'var(--green)'} />
		</div>
	{ /if }
	<div class="text">
		<h3>{notification.type}!</h3>
		<p>{notification.message}</p>
	</div>
</main>

<style>
	main {
		width: 20rem;
		padding: 1rem;
		display: flex;
		justify-content: center;
		align-items: center;
		gap: 1rem;
		background: var(--neutral-high);
		border-radius: 1rem;
	}

	h3 {
		text-transform: capitalize;
	}

	p {
		width: 17rem;
		color: white;
	}

	.icon {
		flex-shrink: 0;
		display: flex;
		justify-content: center;
		align-items: center;
		border-radius: 50%;
	}

	.text {
		display: flex;
		flex-flow: column;
		justify-content: center;
	}
</style>