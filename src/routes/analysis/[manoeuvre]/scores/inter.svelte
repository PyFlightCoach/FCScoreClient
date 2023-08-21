<script lang='ts'>
	import type { ManDef, Results } from "$lib/api_objects";
    import type {State} from '$lib/geometry';
    import {P} from 'flowbite-svelte';

    export let inter: Results;
    export let state: State;
    export let mdef: ManDef;


</script>



{#each Object.values(mdef.mps) as mp}
    <P>{mp.name}</P>
{/each}