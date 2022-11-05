<script>
	import { onMount } from 'svelte';
	import { flip } from 'svelte/animate';
	import { cubicOut } from 'svelte/easing';
	import { fly, fade, crossfade } from 'svelte/transition';
	import { stack } from '../js/stores';
	import Notification from './Notification.svelte';

	let visible = [];
	let expand = false;
	let length = $stack.length;

	onMount(() => visible = [...$stack]);

	const [send, receive] = crossfade({
		duration: d => Math.sqrt(d * 200),

		fallback: node => {
			const style = getComputedStyle(node);
			const transform = style.transform === 'none' ? '' : style.transform;

			return {
				duration: 600,
				easing: quintOut,
				css: t => `
					transform: ${transform} scale(${t});
					opacity: ${t}
				`
			};
		}
	});

	const visplice = item => { // TODO: passing array doesn't work :(
		const index = visible.indexOf(item);

		if (index !== -1) visible.splice(index, 1);
		visible = visible;
		length = $stack.length;
	}

	const splack = item => { // TODO: passing array doesn't work :(
		const index = $stack.indexOf(item);

		if (index !== -1) $stack.splice(index, 1);
		$stack = $stack;
	}

	const timer = async item => setTimeout(() => visplice(item), 5000);

	const fresh = () => {
		visible = [...$stack.slice(length)];
	}

	$: $stack, fresh();
	$: if (expand) visible = [];
</script>

<main>
	{ #each visible as notification (notification) }
		<div on:click={() => visplice(notification)} on:introstart={timer(notification)} in:fly={{ y: 50 }} out:fade animate:flip>
			<Notification {notification} />
		</div>
	{ /each }
	{ #if !expand }
		<div class="expand" on:click={() => expand = !expand} transition:fly|local={{ x: -50 }}>
			<h3>{$stack.length}</h3>
		</div>
	{ /if }
</main>

{ #if expand }
	<div class="notifications" on:click|stopPropagation={() => expand = !expand} transition:fade={{ duration: 300, easing: cubicOut }}>
		<button class="clear" class:disabled={!$stack.length} on:click={() => $stack = []} transition:fly={{ x: -50 }}>Clear</button>
		<div class="wrapper">
			{ #each [...$stack].reverse() as notification, i (notification) }
				<div on:click|stopPropagation={() => splack(notification)} in:fly={{ x: -50, delay: (i + 1) * 50 }} out:fly={{ x: -50 }} animate:flip>
					<Notification {notification} />
				</div>
			{ /each }
		</div>
	</div>
{ /if }

<style>
	main {
		z-index: 1000;
		position: fixed;
		left: 1rem;
		bottom: 1rem;
		display: flex;
		flex-flow: column;
		gap: 1rem;
	}

	.expand {
		width: 2rem;
		height: 2rem;
		display: flex;
		justify-content: center;
		align-items: center;
		background: var(--neutral-high);
		border-radius: 50%;
		cursor: pointer;
	}

	.notifications {
		z-index: 1000;
		position: fixed;
		top: 0;
		right: 0;
		bottom: 0;
		left: 0;
		display: flex;
		flex-flow: column;
		align-items: flex-start;
		gap: 1rem;
		background: hsla(var(--neutral-low-h), var(--neutral-low-s), var(--neutral-low-l), 60%);
		backdrop-filter: blur(0.125rem);
	}

	.clear {
		margin: 2rem 0 1rem 2rem;
		width: 4rem;
	}

	.wrapper {
		padding: 0 2rem;
		flex: 1;
		display: flex;
		flex-flow: column;
		align-items: flex-start;
		gap: 1rem;
		overflow: auto;
	}
</style>