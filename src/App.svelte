<script lang="ts">
	let creatingItem = false;

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
		const res = await fetch("http://192.168.2.10:3000/items");
		const items = await res.json();
		if (!res.ok) {
			throw new Error(items);
		}

		return items;
	}

	$: itemsPromise = getItems();

	async function addItem(evt:any) {
		creatingItem = false;

		let name = evt.target.elements[0].value;
		let url = evt.target.elements[1].value;
		let category = evt.target.elements[2].value;
		let ean = Number(evt.target.elements[3].value);
		let price = Number(evt.target.elements[4].value);

		await fetch('http://192.168.3.10:3000/items', {
			method: 'post',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ name, url, category, ean, price })
		});

		console.log("Creation success");
	}

	async function deleteItem(id:number) {
		await fetch(`http://192.168.3.10:3000/items/${id}`, {
			method: 'delete'
		});
	}

	async function generateSnapshot() {
		const threads = 15;
		fetch(`http://192.168.3.10:3000/scrape`, {
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
			<input type="text" placeholder="Name" required />
			<input type="url" placeholder="url" required />
			
			<input placeholder="category" required />
			<input type="number" placeholder="ean" required />
			<input type="number" placeholder="price" required />

			<button on:click={() => creatingItem = false}>cancel</button>
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
