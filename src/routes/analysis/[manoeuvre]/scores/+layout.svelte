<script lang='ts'>

  import { Tabs, TabItem } from 'flowbite-svelte';
  import {page} from '$app/stores';
  import { flightdata } from '$lib/stores.js';
  import Templates from './templates.svelte';
  import Intra from './intra.svelte';

  $: manname = $page.params['manoeuvre'];
  $: man = flightdata.man(manname);



</script>

<div id="parent">
  <Tabs>
    <TabItem open title="Summary">
      <slot id="contents"/>  
    </TabItem>
    <TabItem title="Templates"><Templates man={$man}/></TabItem>
    <TabItem title="Intra"><Intra score={$man.score}/></TabItem>
    <TabItem title="Inter"><div>Inter</div></TabItem>
    <TabItem title="Positioning"><div>Positioning</div></TabItem>
  </Tabs>
  
</div>




<style>
  #parent {display: flex; flex-direction: column; align-items: stretch; width: 100%; height: 100%; }

  #contents {flex: 1 1 auto;}
  
</style>
