<script lang='ts'>
  import {page} from '$app/stores';
	import { flightdata } from '$lib/stores';

  $: man = flightdata.man($page.params['manoeuvre']);
  $: score = $man.score;
 

</script>



<p>{$man.mdef.info.name}</p>
<p>Score = {score.score.toFixed(2)}</p>
<p>Downgrades:</p>
<p>Intra = {score.intra.value.toFixed(2)}</p>
<p>Inter = {score.inter.value.toFixed(2)}</p>
{#if $man.mdef.info.position=="CENTRE"}
  <p>Centre = {score.centre.value.toFixed(2)} </p>
{:else}
  <p>Side Box = {score.side_box.value.toFixed(2)} </p>
{/if}
<p>Distance = {score.distance.value.toFixed(2)}</p>