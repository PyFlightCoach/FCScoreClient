
<script lang='ts'>
    
	import { flightdata } from '$lib/stores';
    export let data;
    $: man = flightdata.mans[data.mname];

</script>

{#if !($man == null)}
    {#if ('al' in $man)}
        <slot />
    {/if}
{/if}



