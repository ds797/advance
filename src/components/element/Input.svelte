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
	{ #if type === 'text' }
		<h4>{name}</h4>
		<input type='text' {placeholder} bind:value={internal} {style} />
	{ :else if type === 'textarea' }
		<h4>{name}</h4>
		<textarea type='text' {placeholder} bind:value={internal} {style} />
	{ :else if type === 'toggle' }
		<label>
			{name}
			<input type='checkbox' bind:checked={internal} />
		</label>
	{ :else if type === 'email' }
		<h4>{name}</h4>
		<input type='email' {placeholder} bind:value={internal} {style} />
	{ :else if type === 'password' }
		<h4>{name}</h4>
		<input type='password' {placeholder} bind:value={internal} {style} />
	{ /if }
</main>

<style>
	main {
		display: flex;
		flex-flow: column;
		gap: 0.25rem;
	}

	h4 {
		font-weight: 500;
	}

	label {
		padding: 0.75rem;
		display: flex;
		justify-content: space-between;
		background: var(--neutral-high);
		color: var(--contrast-high);
		border-radius: 1rem;
	}
</style>