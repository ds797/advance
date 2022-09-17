<script>
	import { items } from '../js/stores'; // TODO: .finish
	import { plural } from '../js/language';
</script>

<main>
	{ #if $items.length }
		<p>{$items.length} {plural($items.length, 'item')} remaining</p>
	{ :else }
		<p>You've completed everything on your list!</p>
	{ /if }
</main>