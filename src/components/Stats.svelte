<script>
	import { items } from '../js/stores'; // TODO: Instant update
	import { plural } from '../js/language';

	let uncompleted = [];

	$: uncompleted = $items.filter(item => !item.completed);
</script>

<main>
	{ #if uncompleted.length }
		<p>{uncompleted.length} {plural(uncompleted.length, 'item')} remaining</p>
	{ :else }
		<p>You've completed everything on your list!</p>
	{ /if }
</main>