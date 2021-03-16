import Home from './routes/Home.svelte'
import Dashboard from './routes/Dashboard.svelte'
import NotFound from './routes/NotFound.svelte'

export default {
    '/': Home,

    '/dashboard': Dashboard,

    // Catch-all, must be last
    '*': NotFound,
}
