<script>
	import { mouse } from '../../js/stores';
	import { compare } from '../../timestamp/functions';
	import Timestamp from '../../timestamp/Timestamp';
	import Text from '../Text.svelte';

	export let calendars = 3;
	export let direction = undefined; // Avoid expected prop warning
	export let value = new Timestamp();
	export let set = v => v;

	let month = value.clone({ month: true }).add({ months: Math.ceil(-calendars / 2) });

	const down = date => {
		date.set({ hours: value.hour });

		internal = date;
	}

	const up = () => month = internal.clone({ month: true }).add({ months: Math.ceil(-calendars / 2) });

	$: internal = value;
	$: internal, value !== internal && set(internal);
</script>

<main style='flex-flow: {direction}; cursor: default;'>
	{ #each Array(calendars) as _, index }
		{ @const month = month.clone().add({ months: index }) }

		<div class='container'>
			<div class='text'>
				{ #key internal.month }
					<h2>{month.toLongMonth()}</h2>
				{ /key }
				<h2 class='year'>{month.year}</h2>
			</div>
			<div class='month'>
				<div class='days'>
					{ #each Array(42) as _, index }
						{ @const date = month.clone().add({ date: -month.weekday() + index }) }

						<p class='day'
							class:selected={compare(internal, date, { date: true }).equals}
							class:disabled={!compare(date, month, { month: true }).equals}
							on:mousedown={() => down(date)} on:mouseup={up}>
							{date.date}
						</p>
					{ /each }
				</div>
			</div>
		</div>
	{ /each }
</main>

<style>
	main {
		margin: 1rem;
		display: flex;
		justify-content: center;
		align-items: center;
		gap: 2rem !important;
	}

	h2 {
		margin: 0;
	}

	p {
		margin: 0;
		display: flex;
		justify-content: center;
		align-items: center;
		font-weight: 500;
		color: var(--accent);
		user-select: none;
	}

	.container {
		display: flex;
		flex-flow: column;
		gap: 1rem;
	}

	.month {
		display: flex;
		flex-flow: column;
		align-items: center;
	}

	.text {
		display: flex;
		justify-content: space-between;
		gap: 0.25rem;
	}

	.year {
		color: var(--contrast-low);
	}

	.days {
		display: grid;
		grid-template-columns: repeat(7, 1fr);
		grid-template-rows: repeat(6, 1fr);
		gap: 0.25rem;
	}

	.day {
		width: 2rem;
		height: 2rem;
		background: var(--neutral-high);
		border-radius: 50%;
		box-shadow: var(--shadow);
		cursor: default;
		transition: all var(--transition);
	}

	.selected {
		background: var(--plink);
		color: var(--neutral-high);
	}

	.disabled {
		opacity: 75%;
	}
</style>