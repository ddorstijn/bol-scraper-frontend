<script lang="ts">
	let creatingItem = false;
	// const api = "http://api.fortuous.ml";
    const api = "http://localhost:3000";

	type Item = {
		id: number;
		name: string;
		url: string;
		category: string,
		ean: string,
		price: number,
		snapshots: any[]
	};

	async function getItems(): Promise<Item[]> {
		const res = await fetch(`${api}/items`);
		const items = await res.json();
		if (!res.ok) {
			throw new Error(items);
		}

		return items;
	}

	$: itemsPromise = getItems();

	async function addItem(evt:any) {
		creatingItem = false;
		let url = new URL(evt.target.elements[0].value);

		await fetch(`${api}/items`, {
			method: 'post',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ url })
		});

		console.log("Creation success");
	}

	async function deleteItem(id:number) {
		await fetch(`${api}/items/${id}`, {
			method: 'delete'
		});
	}

	async function generateSnapshot() {
		const threads = 15;
		fetch(`${api}//scrape`, {
			method: 'post',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ threads })
		})		
	}
</script>

<main>
	<button on:click={() => creatingItem = true}>Add item</button>
	<button on:click={generateSnapshot}>Generate snapshot</button>
	{#if creatingItem}
		<form on:submit|preventDefault={addItem}>
			<input type="url" placeholder="url" required />

			<button type="button" on:click={() => creatingItem = false}>cancel</button>
			<input type="submit" value="Add item" />
		</form>
	{/if}
  {#await itemsPromise then items}
	<table>
		<thead>
			<tr>
				<th>Name</th>
				<th>Url</th>
				<th>Average sales</th>
				<th></th>
			</tr>
		</thead>
		<tbody>
			{#each items as item}
			<tr>
				<td><a href="/item/{item.id}">{item.name}</a></td>
				<td><a href={item.url}>{item.url}</a></td>
				<td>{item.snapshots}</td>
				<td><button on:click={deleteItem(item.id)}>Delete</button></td>
			</tr>
			{/each}
		</tbody>
	</table>	
  {/await}
</main>

<style>
	main {
		text-align: center;
		padding: 1em;
		max-width: 240px;
		margin: 0 auto;
	}
</style>
