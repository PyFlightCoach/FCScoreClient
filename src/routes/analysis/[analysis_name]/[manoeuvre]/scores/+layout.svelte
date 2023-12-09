<script lang='ts'>
  
	import { flightdata } from '$lib/stores';
  import { Tabs, TabItem } from 'flowbite-svelte';
  import Templates from './templates.svelte';
  import Intra from './intra.svelte';
  import Inter from './inter.svelte';
  import Positioning from './positioning.svelte';
  import { goto } from '$app/navigation';
  export let data;

  $: man = flightdata.mans[data.mname];

</script>

  <Tabs>
    <TabItem open title="Summary">
      <slot />  
    </TabItem>
    <TabItem title="Templates"><Templates man={$man}/></TabItem>
    <TabItem title="Intra"><Intra 
      intra={$man.score.intra} 
      state={$man.al} 
      intended={$man.intended_template}
      manoeuvre={$man.intended}
    /></TabItem>
    <TabItem title="Inter"><Inter
      inter={$man.score.inter} 
      state={$man.al} 
      mdef={$man.mdef}
      /></TabItem>
    <TabItem title="Positioning"><Positioning
      results={$man.score.positioning}
      state={$man.al}
      info={$man.mdef.info}
      /></TabItem>
    <TabItem title="Back" on:click={()=>{goto('/analysis/'+data.analysis_name)}}/>
  </Tabs>

