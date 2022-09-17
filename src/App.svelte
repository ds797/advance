<script>
	import { Router, Route } from 'svelte-routing';
	import Home from './components/Home.svelte';
	import Tasks from './components/Tasks.svelte';

	let url = '';
</script>

<Router {url}>
	<Route path='/'>
		<Home />
	</Route>
	<Route path='/tasks/*'>
		<Tasks />
	</Route>
	<!-- <Route path='*'>
		<FourOhFour />
	</Route> -->
</Router>