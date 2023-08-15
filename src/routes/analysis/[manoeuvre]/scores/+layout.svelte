<script lang='ts'>
  import {page} from '$app/stores';
	import { flightdata } from '$lib/stores';
  import { Tabs, TabItem } from 'flowbite-svelte';
  import Templates from './templates.svelte';
  import Intra from './intra.svelte';
	
  $: man = flightdata.man($page.params['manoeuvre']);

</script>

<div id="parent">
  <Tabs>
    <TabItem open title="Summary">
      <slot id="contents"/>  
    </TabItem>
    <TabItem title="Templates"><Templates man={$man}/></TabItem>
    <TabItem title="Intra"><Intra 
      score={$man.score} 
      state={$man.al} 
      intended={$man.intended_template}
    /></TabItem>
    <TabItem title="Inter"><div>Inter</div></TabItem>
    <TabItem title="Positioning"><div>Positioning</div></TabItem>
  </Tabs>
  
</div>

<style>
  #parent {display: flex; flex-direction: column; align-items: stretch; width: 100%; height: 100%; }
  #contents {flex: 1 1 auto;}  
</style>
