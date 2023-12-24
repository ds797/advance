<script>
	import { route, preferences } from '../js/stores';
	import { ampm, hour, minute } from '../timestamp/functions';
	import { remove } from '../supabase/remove';
  import Timestamp from '../timestamp/Timestamp';
	import Complete from './Complete.svelte';
	import Swatch from './element/Swatch.svelte';
	import Trash from '../svg/Trash.svelte';

	export let item;
	export let set = v => v;

	let completed;

	const complete = async v => {
		item.completed = v;
		set(item);
	}

	const format = item => {
		let string = '';
	
		if (item.start && item.finish) string = `from ${hour(item.start.hour)}:${minute(item.start.minute)} ${ampm(item.start.hour)} to ${hour(item.finish.hour)}:${minute(item.finish.minute)} ${ampm(item.finish.hour)}`;
		else if (item.start) string = `at ${item.finish.format($preferences.hour24)}`;
		else if (item.finish) string = `by ${item.finish.format($preferences.hour24)}`;
	
		return string;
	}

	$: time = format(item);
	$: $preferences.hour24, time = format(item);
	$: if (item.completed) completed = item.completed.format($preferences.hour24);
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
			{ #if item.completed }
				<p class='completed'>(completed at {completed})</p>
			{ /if }
		</div>
		<button type='icon' class='more'
			disabled={!item.id ? true : false}
			on:click|stopPropagation={async () => item.id && await remove(item.id)}
		>
			<Trash size='1.5rem' />
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

.completed {
	color: var(--contrast-low);
}
</style>
