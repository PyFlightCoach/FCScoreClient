<script lang="ts">
	import BinReader from '$lib/BinReader.svelte';
	import Plot from 'svelte-plotly.js';
	import { bind } from 'underscore';
	let binFile: File;
	let binData: Record<string, any>;
</script>
<div>
	<BinReader bind:data={binData} bind:bin={binFile}/>
	{#if binData && binData['XKF1[0]']}
	<Plot
				data={[{
					x: binData['XKF1[0]'].PN,
					y: binData['XKF1[0]'].PE,
					z: binData['XKF1[0]'].PD,
					
					type: 'scatter3d',
					mode: 'lines',
				}]}
				fillParent={true}
			/>

	{/if}
</div>