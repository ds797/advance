<script>
	import { createEventDispatcher } from 'svelte';
	import { cubicOut } from 'svelte/easing';
	import { fade } from 'svelte/transition';
	import { slide } from '../js/transition';

	let overlay;
	let dispatch = createEventDispatcher();

	const click = e => e.target === overlay && dispatch('close')
</script>

<main transition:fade={{ duration: 300, easing: cubicOut }} on:click={click} bind:this={overlay}>
	<div class='focus'>
		<slot />
	</div>
</main>
<div class='tip' transition:slide={{ duration: 300, fade: true }}>
	<slot name='tip' />
</div>

<style>
	main {
		position: fixed;
		top: 0;
		right: 0;
		bottom: 0;
		left: 0;
		display: flex;
		justify-content: center;
		align-items: center;
		background: hsla(var(--neutral-low-h), var(--neutral-low-s), var(--neutral-low-l), 60%);
		backdrop-filter: blur(1rem);
	}

	.focus {
		display: flex;
		align-items: center;
		padding: 1rem;
		background: var(--neutral);
		border-radius: 1.5rem;
		box-shadow: var(--shadow);
		overflow: hidden;
	}

	.tip {
		height: 8rem;
		position: fixed;
		left: 0;
		right: 0;
		bottom: 0;
		display: flex;
		justify-content: center;
		align-items: center;
		opacity: 75%;
	}
</style>