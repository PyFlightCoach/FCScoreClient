

<script lang='ts'>
    import {page} from '$app/stores';
	import { flightdata } from '$lib/stores';
    $: man = flightdata.man($page.params['manoeuvre']);

    import { goto } from '$app/navigation';
    import {Button} from 'flowbite-svelte';
	import type { Writable } from 'svelte/store';

</script>

{#if 'mdef' in $man}
    <Button on:click={()=>goto('/analysis/' + $man.mdef.info.short_name + '_example/alignment')}>Alignment</Button>
    <Button on:click={()=>goto('/analysis/' + $man.mdef.info.short_name + '_example/scores')}>Scores</Button>
{/if}