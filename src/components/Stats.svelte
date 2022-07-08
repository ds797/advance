<script>
	import { items } from '../js/stores'; // TODO: .finish
	import { plural } from '../js/language';
</script>

<main>
	<p>{$items.length} {plural($items.length, 'item')} remaining</p>
</main>