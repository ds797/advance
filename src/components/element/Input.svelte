<script>
	export let type = 'text';
	export let value = '';
	export let name = '';
	export let placeholder = '';
	export let set = v => v;
	export let style = '';

	$: internal = value;
	$: internal, value !== internal && set(internal);
</script>

<main>
	<p>{name}</p>
	{ #if type === 'text' }
		<input type='text' {placeholder} bind:value={internal} {style} />
	{ :else if type === 'textarea' }
		<textarea type='text' {placeholder} bind:value={internal} {style} />
	{ :else if type === 'email' }
		<input type='email' {placeholder} bind:value={internal} {style} />
	{ :else if type === 'password' }
		<input type='password' {placeholder} bind:value={internal} {style} />
	{ /if }
</main>

<style>
	main {
		display: flex;
		flex-flow: column;
		gap: 0.25rem;
	}

	p {
		font-weight: bold;
	}
</style>