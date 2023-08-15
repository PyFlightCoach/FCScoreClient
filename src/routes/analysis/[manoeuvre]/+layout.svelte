
<script lang='ts'>
    import {page} from '$app/stores';
	import { flightdata } from '$lib/stores';
    $: man = flightdata.man($page.params['manoeuvre']);

</script>


{#if ('al' in $man)}
    <slot />
{/if}