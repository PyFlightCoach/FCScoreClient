<script lang='ts'>

	import { flightdata } from '$lib/stores';
  export let data;
  $: man = flightdata.mans[data.mname];
  $: score = $man.score;
 

</script>



<p>{$man.mdef.info.name}</p>
<p>Score = {score.score.toFixed(2)}</p>
<p>Downgrades:</p>
<p>Intra = {score.intra.total.toFixed(2)}</p>
<p>Inter = {score.inter.total.toFixed(2)}</p>
{#each Object.values(score.positioning.data) as pos}
  <p>{pos.name} = {pos.total.toFixed(2)}</p>
{/each}
