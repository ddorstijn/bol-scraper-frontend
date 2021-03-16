<script>
import Router from 'svelte-spa-router'
import routes from './routes'
</script>

<nav>
	<div>
		<a href="#/">Logo</a>
		<ul>
			<li><a href="#/">Home</a></li>
			<li><a href="#/dashboard">dashboard</a></li>
		</ul>
	</div>
</nav>


<!-- Show the router -->
<Router {routes} />