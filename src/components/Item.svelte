<script>
	import { route } from '../js/stores';
  import { save } from '../supabase/save';
	import { ampm, hour, minute } from '../timestamp/functions';
	import { remove } from '../supabase/remove';
	import Complete from './Complete.svelte';
	import Swatch from './element/Swatch.svelte';
	import Trash from '../svg/Trash.svelte';

	export let item;
	export let set = v => v;

	const complete = async v => {
		item.completed = v;
		set(item);
	}

	const format = item => {
		let string = '';
	
		if (item.start && item.finish) string = `from ${hour(item.start.hour)}:${minute(item.start.minute)} ${ampm(item.start.hour)} to ${hour(item.finish.hour)}:${minute(item.finish.minute)} ${ampm(item.finish.hour)}`;
		else if (item.start) string = `at ${hour(item.start.hour)}:${minute(item.start.minute)} ${ampm(item.start.hour)}`;
		else if (item.finish) string = `by ${hour(item.finish.hour)}:${minute(item.finish.minute)} ${ampm(item.finish.hour)}`;
	
		return string;
	}

	$: time = format(item);
</script>

<main>
	<Complete value={item.completed} set={complete} />
	<div class='item' on:click={() => $route = { save: item }}>
		<div>
			<Swatch value={item.color} size='1.5rem' />
			<h3>{item.title}</h3>
			{ #if item.start || item.finish }
				<p>{time}</p>
			{ /if }
		</div>
		<button type='icon' class='more'
			disabled={!item.id ? true : false}
			on:click|stopPropagation={async () => item.id && await remove(item.id)}
		>
			<Trash size='1.5rem' color='red' />
		</button>
	</div>
</main>

<style>
	main {
		display: flex;
		align-items: center;
		gap: 1rem;
	}

	.item {
		margin: 0.5rem 0;
		padding: 1rem;
		flex: 1;
		display: flex;
		justify-content: space-between;
		align-items: center;
		background: var(--neutral-high);
		border-radius: 0.5rem;
		box-shadow: var(--shadow);
		cursor: pointer;
	}

	div {
		display: flex;
		justify-content: center;
		align-items: center;
		gap: 0.5rem;
	}
</style>