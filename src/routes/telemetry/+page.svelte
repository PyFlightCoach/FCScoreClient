<script lang="ts">
	import Plot from 'svelte-plotly.js';
	export let data;
</script>

{#if data}

		<div class='map'>
			<Plot
				data={[
					{
						lat: data.lat,
						lon: data.lng,
						type: 'densitymap',
						radius: 5,
						colorbar: { y: 1, yanchor: 'top', len: 0.45 }
					}
				]}
				layout={{
					margin: { l: 0, r: 0, t: 0, b: 0 }
				}}
				fillParent={true}
			/>
		</div>

		<div class='histogram'>
			<Plot
				data={[
					{
						x: data.date.map((d) => new Date(Date.parse(d))),
						type: 'histogram'
					}
				]}
				fillParent={true}
			/>
		</div>

{/if}
