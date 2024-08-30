<script lang="ts">
	import BinReader from '$lib/BinReader.svelte';
	let bindata: Record<string, any>;
</script>

<BinReader bind:data={bindata}/>
