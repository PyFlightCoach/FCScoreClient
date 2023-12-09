

<script lang='ts'>
    import {page} from '$app/stores';
	import { flightdata } from '$lib/stores';
    export let data;
    $: man = flightdata.mans[data.mname];

    import { goto } from '$app/navigation';
    import {Button} from 'flowbite-svelte';

</script>

{#if 'mdef' in $man}
    <Button href={$page.params.manoeuvre + '/alignment'}>Alignment</Button>
    <Button href={$page.params.manoeuvre + '/scores'}>Scores</Button>
{/if}