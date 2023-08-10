<script lang='ts'>

  import {page} from '$app/stores';
  import { flightdata } from '$lib/stores.js';

  $: manname = $page.params['manoeuvre'];
  $: man = flightdata.man(manname);

 

</script>



<p>{manname}</p>
<p>Score = {$man.score.score.toFixed(2)}</p>
<p>Downgrades:</p>
<p>Intra = {$man.score.intra.value.toFixed(2)}</p>
<p>Inter = {$man.score.inter.value.toFixed(2)}</p>
{#if $man.mdef.info.position=="CENTRE"}
  <p>Centre = {$man.score.centre.value.toFixed(2)} </p>
{:else}
  <p>Side Box = {$man.score.side_box.value.toFixed(2)} </p>
{/if}
<p>Distance = {$man.score.distance.value.toFixed(2)}</p>