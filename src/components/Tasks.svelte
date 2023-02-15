<script>
	import { supabase } from '../supabase/init';
	import { route, user, mouse, preferences, items, stack } from '../js/stores';
	import { save } from '../supabase/save';
	import { read, save as update } from '../supabase/users';
	import { compare } from '../timestamp/functions';
	import Bar from './Bar.svelte';
	import View from './View.svelte';
	import Modal from './Modal.svelte';
	import Menu from './Menu.svelte';
	import Add from '../icons/filled/Add.svelte';
	import Login from './Login.svelte';
	import Stack from './Stack.svelte';

	supabase.auth.onAuthStateChange(async (_, session) => {
		$user = session?.user;
		if ($user) $preferences = await read();
	});

	$: if ($user) update($user.id, $preferences);

	const down = (e) => {
		$mouse.buttons = e.buttons;
		$mouse.down = {
			x: e.clientX,
			y: e.clientY,
			target: e.target,
		};
	}

	const move = (e) => {
		$mouse.x = e.clientX;
		$mouse.y = e.clientY;
		$mouse.target = e.target;
	}

	const up = (e) => {
		$mouse.buttons = e.buttons;
		$mouse.down = {
			x: null,
			y: null,
			target: null,
		};
	}

	const error = item => {
		if (!item) return 'No item supplied!';

		if (item.start && item.finish && !compare(item.start, item.finish).less) {
			return 'Ending time must be after starting time!';
		}
		return '';
	}

	const audit = async () => {
		const err = error($route.save);

		if (err) return $stack = [...$stack, {
			type: 'error',
			message: err
		}];

		const item = $route.save;
		$route = {};
		await save(item);
	}

	$: menu = {
		name: 'New task',
		key: async e => {
			if (!e.ctrlKey || e.key !== 's' && e.key !== 'Enter') return;

			e.preventDefault();
			audit();
		},
		children: [{
			name: 'Title',
			type: 'input',
			value: $route.save?.title,
			set: v => $route.save.title = v
		}, {
			name: 'Description',
			type: 'textarea',
			css: 'resize: none',
			value: $route.save?.description,
			set: v => $route.save.description = v
		}, {
			name: 'Start',
			children: [{
				type: 'time',
				value: $route.save?.start,
				set: v => $route.save.start = v
			}]
		}, {
			name: 'Finish',
			children: [{
				type: 'time',
				value: $route.save?.finish,
				set: v => $route.save.finish = v
			}],
		}, {
			name: 'Edit color',
			children: [{
				name: 'My list',
				children: [{
					type: 'colors',
					value: $route.save?.color,
					set: v => {
						$route.save.color = v;
						return true;
					}
				}]
			}, {
				name: 'Custom',
				children: [{
					type: 'color',
					value: $route.save?.color ?? $preferences?.color ?? { h: 0, s: 0, v: 0 },
					set: v => $route.save.color = v
				}]
			}],
		}, {
			name: 'Save',
			type: 'action',
			click: audit
		}]
	};
</script>

<svelte:window on:mousedown={down} on:mousemove={move} on:mouseup={up} />

<main>
	<Stack />
	{ #if $user }
		<Bar items={$items} />
		<!-- svelte-ignore empty-block -->
		{ #await $items }
			<!-- <Loading /> -->
		{ :then items }
			<View {items} />
			{ #if $route.save }
				<Modal on:close={() => $route = {}}>
					<p slot='tip'><kbd>control</kbd> + <kbd>s</kbd> or <kbd>control</kbd> + <kbd>enter</kbd> to save</p>
					<Menu bind:menu on:close={() => $route = {}} />
				</Modal>
			{ /if }
			<button type='icon' class='new' on:click={() => {
				if ($route.save) $route = {};
				else $route = { save: {
					title: '',
					desc: '',
					start: undefined,
					end: undefined,
					color: { h: 0, s: 0, v: 100 }
				} };
			}}>
				<Add size='2.5rem' />
		</button>
		{ /await }
	{ :else }
		<Modal>
			<Login />
		</Modal>
	{ /if }
</main>

<style>
	main {
		width: 100vw;
		height: 100vh;
		display: flex;
		flex-flow: column;
		background: var(--neutral);
	}

	.new {
		position: fixed;
		right: 2rem;
		bottom: 2rem;
		box-shadow: var(--shadow);
		cursor: pointer;
	}
</style>
