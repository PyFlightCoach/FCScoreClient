<script lang="ts">
	import BinToState from '$lib/splitter/BinToState.svelte';
	import type { States } from '$lib/geometry';
	import Splitter from '$lib/splitter/Splitter.svelte';
	import { FCJson, Origin } from '$lib/api_objects/fcjson';


	let binFile: File;
	let binData: Record<string, any>;
	let binOrigin: Origin;
	let fcj: FCJson;
	let states: States;

	let mans: Record<string, any>[];

</script>
{#if !states}
	<BinToState
		bind:binFile
		bind:binData
		bind:binOrigin
		bind:fcj
		bind:states
	/>
{:else}
	<Splitter {states} bind:mans bind:fcj />
{/if}


